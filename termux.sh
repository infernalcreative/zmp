#!/data/data/com.termux/files/usr/bin/bash
mkdir ~/.termux
mkdir ~./termux/boot
cd ~/.termux/boot
wget https://github.com/infernalcreative/zmp/raw/master/zmp-android-arm64
wget https://raw.githubusercontent.com/infernalcreative/zmp/master/termuxzmp
chmod +x zmp-android-arm64
chmod +x termuxzmp
