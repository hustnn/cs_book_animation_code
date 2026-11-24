#!/bin/bash
# 环境全探针（SETUP.md 环境稳定性：渲染前连续两次通过才开工）。
# 组成：写文件 + ffmpeg testsrc + Puppeteer Chrome 启动（render.mjs 内含）+ 小场景渲染。
# 渲染用非 QA 模式：只写 output/<场景>.mp4，不碰 .qa.json（不破坏 qa_chapter 的指纹），
# 也不写轮次快照。探针场景固定用 u2-mc1（最小的开场场景）。
# 用法：bash env-probe.sh；成功打印 PROBE-PASS，失败非 0 退出。
set -e
cd ~/workspace/ddia-animation-demo/ch03/motion-canvas
echo probe-test > output/.env-probe.tmp
grep -q probe-test output/.env-probe.tmp
ffmpeg -nostdin -v error -f lavfi -i testsrc=duration=1:size=1280x720:rate=30 \
  -c:v libx264 -pix_fmt yuv420p -y /tmp/env-probe-testsrc.mp4
test -s /tmp/env-probe-testsrc.mp4
node scripts/render.mjs u2-mc1 --port 9024 --timeout 600
ffprobe -v error -show_entries format=duration -of csv=p=0 output/u2-mc1.mp4
rm -f output/.env-probe.tmp /tmp/env-probe-testsrc.mp4
echo PROBE-PASS
