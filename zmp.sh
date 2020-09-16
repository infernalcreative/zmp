#!/bin/bash
wget https://github.com/infernalcreative/zmp/raw/master/zmp-linux-amd64
mkdir /zmp
cp zmp-linux-amd64 /zmp
chmod +x zmp-linux-amd64
chmod -R 744 /zmp
wget https://raw.githubusercontent.com/infernalcreative/zmp/master/zmp.service
cp zmp.service /etc/systemd/system
echo "modify /etc/systemd/system/zmp.service and run systemctl start zmp"
