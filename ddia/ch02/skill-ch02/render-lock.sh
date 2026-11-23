#!/usr/bin/env bash
# render-lock.sh — 第 2 章渲染锁的唯一规范实现（2026-11-23，U3 r1 锁事故后立）
#
# 背景：此前各单元各自用 shell 现写拿锁/放锁，踩过三个坑——
#   1. owner.txt 里写的是拿锁的 wait-loop shell 的 PID，拿锁后该 shell 即退出，
#      按“owner PID 是否活着”判死锁会误判，导致 U4 错拿 U3 的锁；
#   2. wait-loop 超时后未拿到锁也直接跑了渲染，导致两路并发渲染；
#   3. 放锁检查用 grep " $$ "（前后空格）匹配，owner.txt 行首就是 PID 时
#      匹配失败；且曾出现不核对 owner 就 rm -rf，误删了 U1 正在用的锁。
# 从此所有单元只准用本脚本拿锁/放锁，不准再各自现写。
#
# 用法：
#   render-lock.sh acquire <单元名> [超时分钟，默认 90]   # 拿到锁才退出 0；超时退出 1，绝不无锁开工
#   render-lock.sh release <单元名>                       # 只放自己的锁，别人的锁拒绝并退出 1
#   render-lock.sh status                                 # 看锁主、锁龄、存活的渲染进程
#
# 规则：
# - owner.txt 只写 unit=<单元名> 与 acquired=<epoch>，不写 PID（PID 不可用于判活）。
# - 死锁判定只看两点同时成立：锁龄 > 120 分钟，且没有任何 render.mjs / manim 进程存活。
#   vite / Chrome 单独存活不算渲染进行中（它们是常驻服务/浏览器，可能滞留）。
# - 放锁只按 unit 字段比对，与调用者不符就拒绝，绝不删除别人的锁。
# - acquire 超时只报错退出，调用方必须停手汇报，不准继续渲染。
#
# 锁目录默认 ~/workspace/ddia-animation-demo/ch02/.render-lock，
# 测试时可用 RENDER_LOCK_DIR 环境变量指向别处。

set -u
LOCK_DIR="${RENDER_LOCK_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/.render-lock}"
OWNER_FILE="$LOCK_DIR/owner.txt"
STALE_AGE_SEC=7200   # 120 分钟

live_render() {
  pgrep -f "render\.mjs" >/dev/null 2>&1 || pgrep -f "[m]anim" >/dev/null 2>&1
}

lock_age() {
  local now started
  now=$(date +%s)
  started=$(sed -n 's/^acquired=//p' "$OWNER_FILE" 2>/dev/null | head -1)
  if [ -z "$started" ]; then echo 999999; return; fi
  echo $((now - started))
}

lock_unit() {
  sed -n 's/^unit=//p' "$OWNER_FILE" 2>/dev/null | head -1
}

cmd_status() {
  if [ -d "$LOCK_DIR" ]; then
    echo "locked unit=$(lock_unit) age=$(lock_age)s owner_file:"
    cat "$OWNER_FILE" 2>/dev/null
  else
    echo "free"
  fi
  echo "live render procs:"
  pgrep -af "render\.mjs" 2>/dev/null || true
  pgrep -af "[m]anim" 2>/dev/null || true
}

cmd_acquire() {
  local unit="$1" timeout_min="${2:-90}" deadline waited
  deadline=$(( $(date +%s) + timeout_min * 60 ))
  waited=0
  while true; do
    if mkdir "$LOCK_DIR" 2>/dev/null; then
      { echo "unit=$unit"; echo "acquired=$(date +%s)"; } > "$OWNER_FILE"
      echo "ACQUIRED unit=$unit"
      return 0
    fi
    # 拿锁失败：只在“锁龄 > 120 分钟且无存活渲染进程”时判死锁并清理
    if [ -d "$LOCK_DIR" ] && [ "$(lock_age)" -gt "$STALE_AGE_SEC" ] && ! live_render; then
      echo "STALE lock (unit=$(lock_unit), age=$(lock_age)s, no live render) — removing" >&2
      rm -rf "$LOCK_DIR"
      continue
    fi
    if [ "$(date +%s)" -ge "$deadline" ]; then
      echo "TIMEOUT: no lock after ${timeout_min} min (held by unit=$(lock_unit)) — STOP, do not render without the lock" >&2
      return 1
    fi
    sleep 20
    waited=$((waited + 20))
  done
}

cmd_release() {
  local unit="$1" owner
  if [ ! -d "$LOCK_DIR" ]; then
    echo "RELEASED (no lock held)"
    return 0
  fi
  owner=$(lock_unit)
  if [ "$owner" = "$unit" ]; then
    rm -rf "$LOCK_DIR"
    echo "RELEASED unit=$unit"
    return 0
  fi
  echo "REFUSED: lock held by unit=${owner:-unknown}, not $unit — not deleting" >&2
  return 1
}

case "${1:-}" in
  acquire) [ $# -ge 2 ] || { echo "usage: $0 acquire <unit> [timeout_min]" >&2; exit 2; }; cmd_acquire "$2" "${3:-90}" ;;
  release) [ $# -ge 2 ] || { echo "usage: $0 release <unit>" >&2; exit 2; }; cmd_release "$2" ;;
  status)  cmd_status ;;
  *) echo "usage: $0 {acquire <unit> [timeout_min]|release <unit>|status}" >&2; exit 2 ;;
esac
