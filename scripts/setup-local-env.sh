#!/bin/bash
set -e

# ============================================
# RefrigerAI - 로컬 환경 설정 도우미
# ============================================

echo "🔧 RefrigerAI 로컬 환경 설정"
echo ""

# .env.production 파일 생성
if [ -f ".env.production" ]; then
    echo "⚠️  .env.production 파일이 이미 존재합니다."
    read -p "덮어쓰시겠습니까? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ 취소되었습니다."
        exit 0
    fi
fi

echo "📝 환경 변수를 입력해주세요:"
echo ""

# Database
echo "=== 데이터베이스 설정 ==="
read -p "POSTGRES_PASSWORD (기본값: refrigerai123!): " POSTGRES_PASSWORD
POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-refrigerai123!}

# API Keys
echo ""
echo "=== API 키 설정 ==="
echo "(API 키가 없다면 Enter를 눌러 건너뛰세요)"
echo ""

read -p "GEMINI_API_KEY: " GEMINI_API_KEY
read -p "GOOGLE_VISION_API_KEY: " GOOGLE_VISION_API_KEY
read -p "OPENAI_API_KEY: " OPENAI_API_KEY

# .env.production 파일 생성
cat > .env.production << EOF
# RefrigerAI - Production Environment Variables
# Generated at: $(date)

# ===== Database =====
POSTGRES_USER=refrigerai
POSTGRES_PASSWORD=$POSTGRES_PASSWORD
POSTGRES_DB=refrigerai

# ===== AI API Keys =====
GEMINI_API_KEY=$GEMINI_API_KEY
GOOGLE_VISION_API_KEY=$GOOGLE_VISION_API_KEY
OPENAI_API_KEY=$OPENAI_API_KEY

# ===== Next.js =====
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
EOF

echo ""
echo "✅ .env.production 파일이 생성되었습니다!"
echo ""
echo "📄 파일 내용:"
cat .env.production
echo ""
echo "⚠️  이 파일은 Git에 커밋하지 마세요!"
