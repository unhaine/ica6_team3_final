# RefrigerAI - EC2 Docker 배포 가이드

## 📋 사전 준비

### 1. EC2 인스턴스 요구사항
- **최소 스펙**: t3.small (2GB RAM)
- **권장 스펙**: t3.medium (4GB RAM)
- **OS**: Ubuntu 22.04 LTS
- **스토리지**: 최소 20GB

### 2. 보안 그룹 (Security Group) 설정
```
인바운드 규칙:
- SSH: 22 (본인 IP만)
- HTTP: 80 (0.0.0.0/0)
- HTTPS: 443 (0.0.0.0/0)
- Custom TCP: 3000 (0.0.0.0/0) - 개발용, 나중에 제거
```

---

## 🚀 EC2 배포 단계

### Step 1: EC2 접속
```bash
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

### Step 2: Docker & Docker Compose 설치
```bash
# 시스템 업데이트
sudo apt update && sudo apt upgrade -y

# Docker 설치
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Docker Compose 설치
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 현재 사용자를 docker 그룹에 추가
sudo usermod -aG docker $USER

# 로그아웃 후 다시 로그인 (또는 새 세션)
exit
```

### Step 3: 코드 배포
```bash
# 다시 SSH 접속
ssh -i your-key.pem ubuntu@your-ec2-public-ip

# Git 설치
sudo apt install -y git

# 저장소 클론
git clone https://github.com/unhaine/refri.git
cd refri

# 환경 변수 설정
cp env.production.template .env.production
nano .env.production
```

**`.env.production` 파일 내용:**
```env
# Database
POSTGRES_USER=refrigerai
POSTGRES_PASSWORD=your_secure_password_123!
POSTGRES_DB=refrigerai

# AI API Keys
GEMINI_API_KEY=your_actual_gemini_key
GOOGLE_VISION_API_KEY=your_actual_google_vision_key
OPENAI_API_KEY=your_actual_openai_key

# Next.js
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### Step 4: Docker 빌드 & 실행
```bash
# Docker 이미지 빌드 및 컨테이너 실행
docker-compose up -d --build

# 로그 확인
docker-compose logs -f

# 컨테이너 상태 확인
docker-compose ps
```

### Step 5: 헬스 체크
```bash
# 앱 헬스 체크
curl http://localhost:3000/api/health

# 예상 결과:
# {"status":"ok","timestamp":"2026-01-26T...","database":"connected"}
```

### Step 6: 브라우저에서 접속
```
http://your-ec2-public-ip:3000
```

---

## 🔧 유용한 Docker 명령어

### 컨테이너 관리
```bash
# 컨테이너 시작
docker-compose start

# 컨테이너 중지
docker-compose stop

# 컨테이너 재시작
docker-compose restart

# 컨테이너 삭제 (볼륨 유지)
docker-compose down

# 컨테이너 + 볼륨 삭제
docker-compose down -v
```

### 로그 확인
```bash
# 전체 로그
docker-compose logs

# 실시간 로그
docker-compose logs -f

# 특정 서비스 로그
docker-compose logs -f app
docker-compose logs -f db
```

### 데이터베이스 접속
```bash
# PostgreSQL 컨테이너 접속
docker-compose exec db psql -U refrigerai -d refrigerai

# 테이블 확인
\dt

# 종료
\q
```

### 업데이트 배포
```bash
# 최신 코드 가져오기
git pull origin main

# 재빌드 & 재시작
docker-compose up -d --build

# 로그 확인
docker-compose logs -f
```

---

## 🔒 (선택) Nginx + SSL 설정

### Nginx 설치
```bash
sudo apt install -y nginx
```

### Nginx 설정
```bash
sudo nano /etc/nginx/sites-available/refrigerai
```

**내용:**
```nginx
server {
    listen 80;
    server_name your-domain.com;  # 또는 EC2 IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# 심볼릭 링크 생성
sudo ln -s /etc/nginx/sites-available/refrigerai /etc/nginx/sites-enabled/

# 기본 설정 제거
sudo rm /etc/nginx/sites-enabled/default

# Nginx 재시작
sudo nginx -t
sudo systemctl restart nginx
```

### Let's Encrypt SSL (도메인 있을 경우)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 🐛 트러블슈팅

### 포트 충돌
```bash
# 3000번 포트 사용 중인 프로세스 확인
sudo lsof -i :3000

# 프로세스 종료
sudo kill -9 <PID>
```

### DB 연결 실패
```bash
# DB 컨테이너 상태 확인
docker-compose ps db

# DB 로그 확인
docker-compose logs db

# DB 재시작
docker-compose restart db
```

### 디스크 공간 부족
```bash
# 사용하지 않는 Docker 이미지/컨테이너 정리
docker system prune -a

# 디스크 사용량 확인
df -h
```

---

## 📊 모니터링

### 리소스 사용량 확인
```bash
# 컨테이너별 리소스 사용량
docker stats

# 시스템 리소스
htop  # 설치: sudo apt install htop
```

---

## 🔄 자동 재시작 설정

Docker Compose에 이미 `restart: always`가 설정되어 있어서,  
EC2 재부팅 시에도 컨테이너가 자동으로 시작됩니다.

---

## 📞 문제 발생 시

1. **로그 확인**: `docker-compose logs -f`
2. **헬스 체크**: `curl http://localhost:3000/api/health`
3. **컨테이너 상태**: `docker-compose ps`
4. **재시작**: `docker-compose restart`
