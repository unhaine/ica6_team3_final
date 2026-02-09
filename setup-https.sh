#!/bin/bash

# RefrigerAI - EC2 HTTPS 자동 설정 스크립트 (Nginx + Certbot)
# 이 스크립트는 Ubuntu 22.04 LTS 환경에서 동작하도록 작성되었습니다.

DOMAIN="ica6t3f.duckdns.org"
EMAIL="torch.nograd@gmail.com"

echo "===================================================="
echo "1. 시스템 업데이트 및 Nginx 설치..."
echo "===================================================="
sudo apt update
sudo apt install -y nginx

echo "===================================================="
echo "2. Nginx 설정 파일 작성..."
echo "===================================================="
cat <<EOF | sudo tee /etc/nginx/sites-available/refrigerai
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

echo "===================================================="
echo "3. Nginx 설정 활성화..."
echo "===================================================="
sudo ln -sf /etc/nginx/sites-available/refrigerai /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Nginx 설정 테스트
sudo nginx -t
if [ $? -eq 0 ]; then
    sudo systemctl restart nginx
    echo "Nginx 설정이 완료되었습니다."
else
    echo "Nginx 설정에 오류가 있습니다. 직접 확인이 필요합니다."
    exit 1
fi

echo "===================================================="
echo "4. SSL 인증서 발급 및 HTTPS 적용 (Certbot)..."
echo "===================================================="
sudo apt install -y certbot python3-certbot-nginx

# 비대화형 모드로 인증서 발급 시도
# --redirect 옵션은 http로 접속해도 https로 자동 전환해줍니다.
sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos -m $EMAIL --redirect

if [ $? -eq 0 ]; then
    echo "===================================================="
    echo "HTTPS 설정이 성공적으로 완료되었습니다!"
    echo "이제 아래 주소로 접속하세요:"
    echo "URL: https://$DOMAIN"
    echo "===================================================="
    echo "추가 작업 필수:"
    echo "1. .env 파일의 AUTH_URL을 https://$DOMAIN 으로 수정하세요."
    echo "2. Google 클라우드 콘솔에서 리디렉션 URI를 https로 업데이트하세요."
    echo "===================================================="
else
    echo "인증서 발급 중 오류가 발생했습니다."
    echo "DuckDNS에 등록된 IP가 현재 EC2의 Public IP와 일치하는지 확인하세요."
fi
