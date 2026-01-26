#!/bin/bash
set -e

# ============================================
# RefrigerAI - EC2 자동 배포 스크립트
# ============================================

echo "🚀 RefrigerAI EC2 자동 배포를 시작합니다..."

# ====== 설정 (여기만 수정하세요!) ======
EC2_HOST="${EC2_HOST:-}"  # EC2 Public IP 또는 도메인
SSH_KEY="${SSH_KEY:-}"     # SSH 키 파일 경로 (예: ~/.ssh/my-key.pem)
EC2_USER="${EC2_USER:-ubuntu}"  # EC2 사용자명

# ====== 환경 변수 체크 ======
if [ -z "$EC2_HOST" ]; then
    echo "❌ EC2_HOST 환경 변수를 설정해주세요."
    echo "예: export EC2_HOST=12.34.56.78"
    exit 1
fi

if [ -z "$SSH_KEY" ]; then
    echo "❌ SSH_KEY 환경 변수를 설정해주세요."
    echo "예: export SSH_KEY=~/.ssh/my-key.pem"
    exit 1
fi

if [ ! -f "$SSH_KEY" ]; then
    echo "❌ SSH 키 파일을 찾을 수 없습니다: $SSH_KEY"
    exit 1
fi

# SSH 키 권한 확인
chmod 400 "$SSH_KEY"

echo "✅ 배포 대상: $EC2_USER@$EC2_HOST"
echo ""

# ====== Step 1: EC2 연결 테스트 ======
echo "📡 Step 1/6: EC2 연결 테스트 중..."
if ! ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no -o ConnectTimeout=10 "$EC2_USER@$EC2_HOST" "echo 'Connection OK'" > /dev/null 2>&1; then
    echo "❌ EC2 연결 실패. SSH 키와 보안 그룹을 확인해주세요."
    exit 1
fi
echo "✅ EC2 연결 성공!"
echo ""

# ====== Step 2: 원격 설치 스크립트 생성 ======
echo "📝 Step 2/6: 설치 스크립트 생성 중..."
cat > /tmp/ec2-setup.sh << 'EOF'
#!/bin/bash
set -e

echo "🔧 시스템 업데이트 중..."
# Amazon Linux or Ubuntu 자동 감지
if command -v yum &> /dev/null; then
    PKG_MGR="yum"
    DOCKER_PKG="docker"
elif command -v dnf &> /dev/null; then
    PKG_MGR="dnf"
    DOCKER_PKG="docker"
elif command -v apt &> /dev/null; then
    PKG_MGR="apt"
    DOCKER_PKG="docker.io"
    sudo apt update -qq
else
    echo "❌ 지원하지 않는 OS입니다."
    exit 1
fi

echo "🐳 Docker 설치 확인 중..."
if ! command -v docker &> /dev/null; then
    echo "📦 Docker 설치 중..."
    if [ "$PKG_MGR" = "apt" ]; then
        sudo apt install -y $DOCKER_PKG
    else
        sudo $PKG_MGR install -y $DOCKER_PKG
    fi
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -aG docker $USER
else
    echo "✅ Docker가 이미 설치되어 있습니다."
fi

echo "🐳 Docker Compose 설치 확인 중..."
if ! command -v docker-compose &> /dev/null; then
    echo "📦 Docker Compose 설치 중..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
else
    echo "✅ Docker Compose가 이미 설치되어 있습니다."
fi

echo "📦 Git 설치 확인 중..."
if ! command -v git &> /dev/null; then
    if [ "$PKG_MGR" = "apt" ]; then
        sudo apt install -y git
    else
        sudo $PKG_MGR install -y git
    fi
else
    echo "✅ Git이 이미 설치되어 있습니다."
fi

echo "✅ 모든 필수 도구 설치 완료!"
EOF

scp -i "$SSH_KEY" /tmp/ec2-setup.sh "$EC2_USER@$EC2_HOST:/tmp/"
echo "✅ 설치 스크립트 전송 완료!"
echo ""

# ====== Step 3: Docker & Git 설치 ======
echo "🔧 Step 3/6: Docker & Git 설치 중..."
ssh -i "$SSH_KEY" "$EC2_USER@$EC2_HOST" "bash /tmp/ec2-setup.sh"
echo "✅ Docker & Git 설치 완료!"
echo ""

# ====== Step 4: 저장소 클론 또는 업데이트 ======
echo "📦 Step 4/6: 코드 배포 중..."
ssh -i "$SSH_KEY" "$EC2_USER@$EC2_HOST" << 'EOF'
if [ -d "refri" ]; then
    echo "🔄 기존 코드 업데이트 중..."
    cd refri
    git fetch origin
    git reset --hard origin/main
    git pull origin main
else
    echo "📥 저장소 클론 중..."
    git clone https://github.com/unhaine/refri.git
    cd refri
fi
EOF
echo "✅ 코드 배포 완료!"
echo ""

# ====== Step 5: 환경 변수 설정 ======
echo "⚙️  Step 5/6: 환경 변수 설정 중..."

if [ -f ".env.production" ]; then
    echo "📤 로컬 .env.production 파일을 EC2로 전송 중..."
    scp -i "$SSH_KEY" .env.production "$EC2_USER@$EC2_HOST:~/refri/.env.production"
    echo "✅ 환경 변수 파일 전송 완료!"
else
    echo "⚠️  .env.production 파일이 없습니다."
    echo "📝 템플릿 파일을 생성합니다..."
    ssh -i "$SSH_KEY" "$EC2_USER@$EC2_HOST" << 'EOF'
cd refri
if [ ! -f ".env.production" ]; then
    cp env.production.template .env.production
    echo "⚠️  .env.production 파일을 수정해주세요:"
    echo "   nano ~/refri/.env.production"
    echo ""
    echo "필수 입력 항목:"
    echo "  - POSTGRES_PASSWORD"
    echo "  - GEMINI_API_KEY"
    echo "  - GOOGLE_VISION_API_KEY"
    echo "  - OPENAI_API_KEY"
fi
EOF
fi
echo ""

# ====== Step 6: Docker 빌드 & 실행 ======
echo "🐳 Step 6/6: Docker 컨테이너 빌드 & 실행 중..."
echo "   (첫 빌드는 5-10분 소요될 수 있습니다)"
ssh -i "$SSH_KEY" "$EC2_USER@$EC2_HOST" << 'EOF'
cd refri

# 기존 컨테이너 중지 및 제거
if [ "$(docker-compose ps -q)" ]; then
    echo "🛑 기존 컨테이너 중지 중..."
    docker-compose down
fi

# 빌드 & 실행
echo "🔨 Docker 이미지 빌드 중..."
docker-compose build --no-cache

echo "🚀 컨테이너 시작 중..."
docker-compose up -d

echo ""
echo "⏳ 컨테이너가 준비될 때까지 대기 중... (30초)"
sleep 30

echo ""
echo "📊 컨테이너 상태:"
docker-compose ps

echo ""
echo "🏥 헬스 체크:"
curl -s http://localhost:3000/api/health || echo "⚠️  앱이 아직 시작 중입니다..."
EOF

echo ""
echo "✅ 배포 완료!"
echo ""
echo "🌐 접속 URL: http://$EC2_HOST:3000"
echo ""
echo "📊 유용한 명령어:"
echo "   ssh -i $SSH_KEY $EC2_USER@$EC2_HOST"
echo "   cd refri && docker-compose logs -f"
echo ""
