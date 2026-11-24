#!/usr/bin/env python3
"""渲染锁：同一台机器上同一时间只跑一个重渲染（Motion Canvas 或 Manim），几个代理并行做不同单元时排队，不抢内存。

用法：
  python render_lock.py run <名字> [--timeout 分钟] -- <命令…>   # 拿锁 → 跑命令 → 不管成败都放锁；退出码 = 命令的退出码
  python render_lock.py status [--json]                         # 锁在谁手里、持锁多久、进程还在不在
  python render_lock.py break                                   # 只在持锁进程全都不在时删锁（平时不用：等锁时会自动清）

例：
  python <skill>/scripts/render_lock.py run u3 -- manim -qm manim/u3.py QueueScene
  python <skill>/scripts/render_lock.py run u3 -- bash assemble-u3.sh      # 几步要连着做、中间不让别人插进来时
Motion Canvas 的 render.mjs（以及调用它的 qa_chapter.py）自己会拿锁，不用再包；包了也没关系：
子进程从环境变量 RENDER_LOCK_TOKEN 认出锁是上层替它拿的，直接渲染，不会自己等自己。

规则：
  - 没有单独的 acquire / release：拿锁和放锁绑在同一个进程里，命令崩了、被 Ctrl+C 也会放锁；
    忘了放锁、放锁时路径写错、拿锁的 shell 先退出这类事故不会再有。
  - 持锁的是这个包装进程和它启动的命令，pid 写在锁里；两者都不在了就是死锁，下一个等锁的人自动清掉，不用等。
  - --timeout 分钟内（默认 90）拿不到锁：不跑命令，退出码 3。调用方要停下来汇报，不要绕过锁去渲染。
  - 不要手动删锁目录，也不要自己写 shell 拿锁/放锁。
锁位置：环境变量 RENDER_LOCK_PATH，默认 /tmp/textbook-to-animation.render-lock（Windows 为系统临时目录下同名目录）。
整台机器一把，和章节、书无关。协议与 assets/motion-canvas/render/render-lock.mjs 相同，两边互相认。
"""
import argparse
import json
import os
import secrets
import shutil
import signal
import socket
import subprocess
import sys
import tempfile
import time
from pathlib import Path

LOCK = Path(os.environ.get("RENDER_LOCK_PATH") or (
    Path(tempfile.gettempdir()) / "textbook-to-animation.render-lock" if os.name == "nt"
    else "/tmp/textbook-to-animation.render-lock"))
OWNER = "owner.json"
CREATING_GRACE = 60
TIMEOUT_EXIT = 3


def read_owner(d: Path = None):
    try:
        return json.loads(((d or LOCK) / OWNER).read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return None


def alive(pid: int) -> bool:
    if os.name == "nt":
        import ctypes
        k = ctypes.windll.kernel32
        h = k.OpenProcess(0x1000, False, pid)  # PROCESS_QUERY_LIMITED_INFORMATION
        if not h:
            return False
        code = ctypes.c_ulong()
        ok = k.GetExitCodeProcess(h, ctypes.byref(code))
        k.CloseHandle(h)
        return bool(ok) and code.value == 259  # STILL_ACTIVE
    try:
        os.kill(pid, 0)
        return True
    except ProcessLookupError:
        return False
    except PermissionError:
        return True  # 进程在，只是不属于当前用户


def describe(o) -> str:
    if not o:
        return "持锁信息还没写好"
    age = max(0, int(time.time() - (o.get("started") or 0)))
    pids = ",".join(str(p) for p in o.get("pids") or [])
    return f"{o.get('owner')}（pid {pids}，{o.get('host')}，已持锁 {age // 60} 分 {age % 60} 秒）"


def inspect():
    """返回 (state, owner)，state 为 free / held / stale / creating。"""
    try:
        mtime = LOCK.stat().st_mtime
    except FileNotFoundError:
        return "free", None
    o = read_owner()
    if not o:
        return ("creating" if time.time() - mtime < CREATING_GRACE else "stale"), None
    if o.get("host") != socket.gethostname():
        return "held", o  # 别的机器（共享盘）：判不了活，当作还在用
    return ("held" if any(alive(p) for p in o.get("pids") or []) else "stale"), o


def break_stale(seen_token):
    """先挪到旁边、确认挪走的就是判死的那把再删；挪走的若是别人刚拿的新锁，挪回去。"""
    aside = LOCK.with_name(f"{LOCK.name}.stale-{os.getpid()}-{secrets.token_hex(4)}")
    try:
        os.rename(LOCK, aside)
    except OSError:
        return  # 别人先清了
    if ((read_owner(aside) or {}).get("token")) == seen_token:
        shutil.rmtree(aside, ignore_errors=True)
        return
    try:
        os.rename(aside, LOCK)
    except OSError:
        print(f"[lock] 挪走了一把刚建的新锁且没能挪回：{aside}", file=sys.stderr)


def write_owner(info: dict):
    tmp = LOCK / f"{OWNER}.{os.getpid()}.tmp"
    tmp.write_text(json.dumps(info, ensure_ascii=False, indent=1), encoding="utf-8")
    os.replace(tmp, LOCK / OWNER)


def acquire(owner: str, timeout_min: float, cmd: str):
    """拿到锁返回 token 和持锁信息；超时返回 None。"""
    token = secrets.token_hex(8)
    deadline = time.time() + timeout_min * 60
    said = 0.0
    while True:
        try:
            LOCK.mkdir()  # 已存在就抛 FileExistsError
            info = {"owner": owner, "token": token, "host": socket.gethostname(), "pids": [os.getpid()],
                    "started": time.time(), "cmd": cmd, "cwd": os.getcwd()}
            write_owner(info)
            print(f"[lock] 拿到渲染锁 {LOCK}", file=sys.stderr, flush=True)
            return info
        except FileExistsError:
            pass
        state, o = inspect()
        if state == "stale":
            print(f"[lock] 清理死锁：{describe(o)}，持锁进程已不在", file=sys.stderr, flush=True)
            break_stale((o or {}).get("token"))
            continue
        if state == "free":
            continue
        if time.time() >= deadline:
            print(f"[lock] 等锁超时（{timeout_min:g} 分钟）：{describe(o)} 还在渲染。没有运行命令。", file=sys.stderr)
            return None
        if time.time() - said >= 60:
            print(f"[lock] 排队等渲染锁：{describe(o)}", file=sys.stderr, flush=True)
            said = time.time()
        time.sleep(2)


def release(token: str):
    o = read_owner()
    if o and o.get("token") == token:
        shutil.rmtree(LOCK, ignore_errors=True)
        print("[lock] 已放锁", file=sys.stderr, flush=True)
    else:
        print("[lock] 锁已经不是这个进程的了，不动它", file=sys.stderr)


def cmd_run(name: str, timeout_min: float, cmd: list) -> int:
    inherited = os.environ.get("RENDER_LOCK_TOKEN")
    o = read_owner()
    if inherited and o and o.get("token") == inherited:
        print(f"[lock] 渲染锁由上层进程持有（{o.get('owner')}），直接运行", file=sys.stderr, flush=True)
        return subprocess.call(cmd)
    info = acquire(name, timeout_min, " ".join(cmd))
    if info is None:
        return TIMEOUT_EXIT
    child = None

    def forward(sig, _frame):
        if child and child.poll() is None:
            child.send_signal(sig)

    old = {s: signal.signal(s, forward) for s in (signal.SIGINT, signal.SIGTERM) + ((signal.SIGHUP,) if hasattr(signal, "SIGHUP") else ())}
    try:
        try:
            child = subprocess.Popen(cmd, env={**os.environ, "RENDER_LOCK_TOKEN": info["token"]})
        except OSError as e:
            print(f"[lock] 命令启动失败：{e}", file=sys.stderr)
            return 127
        info["pids"].append(child.pid)  # 包装进程被强杀、命令还在跑时，锁也不会被当成死锁
        write_owner(info)
        code = child.wait()
        return 128 - code if code < 0 else code
    finally:
        if child and child.poll() is None:  # 包装进程出意外时不留下没人管的渲染
            child.terminate()
        release(info["token"])
        for s, h in old.items():
            signal.signal(s, h)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="action", required=True)
    r = sub.add_parser("run", help="拿锁 → 跑命令 → 放锁")
    r.add_argument("name", help="谁在渲染（单元名、场景名），等锁的人能看到")
    r.add_argument("--timeout", type=float, default=90, help="等锁最多多少分钟（默认 90），超时退出码 3")
    s = sub.add_parser("status", help="看锁的状态")
    s.add_argument("--json", action="store_true")
    sub.add_parser("break", help="只在持锁进程全都不在时删锁")
    # 自己在第一个 -- 处切开：argparse 的 REMAINDER 会把写在名字后面的 --timeout 也吞进命令里
    argv, cmd = sys.argv[1:], []
    if "--" in argv:
        i = argv.index("--")
        argv, cmd = argv[:i], argv[i + 1:]
    a = ap.parse_args(argv)

    if a.action == "run":
        if not cmd:
            ap.error("run 需要在 -- 之后给出要运行的命令：render_lock.py run <名字> [--timeout 分钟] -- <命令…>")
        sys.exit(cmd_run(a.name, a.timeout, cmd))
    if cmd:
        ap.error(f"{a.action} 不接受 -- 之后的命令")
    state, o = inspect()
    if a.action == "status":
        if a.json:
            print(json.dumps({"path": str(LOCK), "state": state, "owner": o,
                              "alive": {p: alive(p) for p in (o or {}).get("pids") or []}}, ensure_ascii=False))
        else:
            print(f"{LOCK}：" + {"free": "空闲", "held": "占用中", "stale": "死锁（持锁进程已不在，下一个等锁的会自动清）",
                                  "creating": "正在被拿"}[state])
            if o:
                print(f"  {describe(o)}\n  命令：{o.get('cmd')}\n  目录：{o.get('cwd')}")
        return
    if state == "stale":
        break_stale((o or {}).get("token"))
        print(f"已删除死锁：{describe(o)}")
    elif state == "free":
        print("没有锁")
    else:
        print(f"拒绝：{describe(o)} 还在，不删别人正在用的锁", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
