#!/bin/sh
ssh root@120.27.227.32 <<EOF
rm -rf /usr/share/nginx/fe-frontOfBinwang/
EOF
echo "done for delete original floder"

scp  -r /d/Biye/fe-frontOfBinwang/dist/ root@120.27.227.32:/usr/share/nginx/fe-frontOfBinwang/
#scp  -r /c/workspace/fe-frontOfBinwang/dist/ root@120.27.227.32:/usr/share/nginx/fe-frontOfBinwang/
# rsync -av /c/workspace/fe-frontOfBinwang/ --exclude=.git/ root@120.27.227.32:/usr/share/nginx/fe-frontOfBinwang/
echo "done for send"

ssh root@120.27.227.32 <<EOF
systemctl restart nginx.service
EOF
echo "done for reload nginx"