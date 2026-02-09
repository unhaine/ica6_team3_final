#!/bin/bash

# RefrigerAI - Amazon Linux 2023용 HTTPS 자동 설정 스크립트
# 이 스크립트는 Amazon Linux 2023 환경에 최적화되었습니다.

DOMAIN="ica6t3f.duckdns.org"
EMAIL="torch.nograd@gmail.com"

echo "===================================================="
echo "1. Nginx 설치 및 기본 디렉토리 생성 (AL2023)..."
echo "===================================================="
sudo dnf update -y
sudo dnf install -y nginx

# Ubuntu와 유사한 관리 구조를 위해 디렉토리 명시적 생성
sudo mkdir -p /etc/nginx/sites-available
sudo mkdir -p /etc/nginx/sites-enabled

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
echo "3. Nginx 설정 활성화 및 메인 설정 연결..."
echo "===================================================="
# 심볼릭 링크 연결
sudo ln -sf /etc/nginx/sites-available/refrigerai /etc/nginx/sites-enabled/

# ⚠️ Amazon Linux 2023의 nginx.conf는 보통 sites-enabled를 자동으로 로드하지 않음
# 그래서 nginx.conf 파일의 http 블록 안에 include 문구를 삽입함
if ! grep -q "include /etc/nginx/sites-enabled/*;" /etc/nginx/nginx.conf; then
    # conf.d 불러오는 줄 다음에 sites-enabled도 불러오도록 추가
    sudo sed -i '/include \/etc\/nginx\/conf.d\/\*\.conf;/a \    include /etc/nginx/sites-enabled/*;' /etc/nginx/nginx.conf
fi

# 서비스 시작 및 활성화
sudo systemctl enable nginx
sudo systemctl restart nginx

# 설정 테스트
sudo nginx -t
if [ $? -eq 0 ]; then
    echo "Nginx 설정이 완료되었습니다."
else
    echo "Nginx 설정에 오류가 있습니다. nginx.conf를 확인해 주세요."
    exit 1
fi

echo "===================================================="
echo "4. SSL 인증서 발급 (Certbot)..."
echo "===================================================="
# AL2023은 certbot 패키지 관리에 pip나 전용 패키지를 권장함
sudo dnf install -y certbot python3-certbot-nginx

# 비대화형 모드로 인증서 발급 시도
sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos -m $EMAIL --redirect

if [ $? -eq 0 ]; then
    echo "===================================================="
    echo "HTTPS 설정이 성공적으로 완료되었습니다!"
    echo "URL: https://$DOMAIN"
    echo "===================================================="
else
    echo "----------------------------------------------------"
    echo "인증서 발급 중 오류가 발생했습니다."
    echo "1. DuckDNS IP가 현재 EC2 IP($ (curl -s ifconfig.me))와 일치하는지 확인"
    echo "2. AWS 보안그룹에서 80번, 443번 포트가 오픈되어 있는지 확인"
    echo "----------------------------------------------------"
fi
