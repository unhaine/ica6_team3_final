# Database Schema Documentation

## Overview
PostgreSQL (via Supabase) used with Prisma ORM.

## Models

### User
- 사용자 기본 정보 (NextAuth 연동)
- `groceryItems`: 보유 식료품 리스트
- `receiptScans`: 영수증 스캔 기록
- `fridgeAnalyses`: 냉장고 사진 분석 기록
- `favoriteRecipes`: 즐겨찾기한 레시피

### GroceryItem (보유 식료품)
- `name`: 식료품 이름
- `quantity`: 수량
- `category`: 카테고리
- `expiryDate`: 소비기한
- `source`: 출처 (manual, receipt, fridge-photo)

### ReceiptScan (영수증 기록)
- OCR 분석된 영수증 정보
- 원본 이미지 URL

### FridgePhotoAnalysis (냉장고 분석)
- Vision AI 분석된 냉장고 사진 정보
- JSON 형태의 분석 원본 데이터 저장

### Recipe (레시피 데이터)
- `rcp_sno`: 고유 번호
- `ckg_nm`: 요리명
- `ckg_mtrl_cn`: 재료 목록 (텍스트)
- `rcp_img_url`: 이미지 URL
- (공공데이터 스키마 준수)
