# 데이터베이스 구조 (Database Schema)

## ER Diagram (Conceptual)
`Users` -< `UserIngredients` >- `Ingredients (Master)`
`Users` -< `Posts`
`Recipes` (External/Cached)

## Tables

### 1. `users` (사용자)
Supabase Auth와 연동되는 사용자 기본 정보.
- `id` (UUID, PK): Supabase Auth ID
- `email` (String): 이메일
- `nickname` (String): 닉네임
- `avatar_url` (String): 프로필 이미지
- `created_at` (Timestamp): 가입일

### 2. `ingredients` (식재료 마스터 DB)
표준화된 식재료 정보 및 권장 소비기한 데이터. (초기 데이터는 식약처 API 등에서 구축)
- `id` (Int, PK): 식재료 ID
- `name` (String): 식재료명 (e.g., '계란', '우유')
- `category` (String): 분류 (e.g., '유제품', '채소')
- `default_expiration_days` (Int): 권장 소비기한 (일 단위)
- `icon_url` (String): 아이콘 이미지 URL

### 3. `user_ingredients` (사용자 냉장고 인벤토리)
사용자가 실제로 보유 중인 식재료.
- `id` (UUID, PK)
- `user_id` (UUID, FK -> users.id)
- `ingredient_id` (Int, FK -> ingredients.id, Nullable): 마스터 DB에 없는 경우 null일 수 있음(또는 기타로 처리)
- `name` (String): 사용자가 입력/수정한 표시 이름
- `quantity` (String): 수량 (e.g., '2개', '300g')
- `expiry_date` (Date): 소비기한
- `status` (Enum): 'AVAILABLE', 'CONSUMED', 'DISCARDED' (상태 관리)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### 4. `recipes` (레시피 데이터)
만개의 레시피 CSV 데이터를 임포트하거나 필요한 만큼 캐싱하여 사용.
- `id` (Int, PK)
- `title` (String): 레시피명
- `ingredients_list` (JSONB): 필요 재료 및 수량 목록
- `instructions` (Text): 조리법
- `original_image_url` (String): 원본 이미지
- `difficulty` (String): 난이도
- `cooking_time` (String): 조리 시간

### 5. `posts` (커뮤니티 글)
- `id` (UUID, PK)
- `user_id` (UUID, FK)
- `recipe_id` (Int, FK, Nullable): 따라한 레시피가 있다면 연결
- `image_url` (String): 인증샷
- `content` (Text): 내용
- `ai_score` (Int): AI 싱크로율 점수
- `created_at` (Timestamp)

## 데이터 전략
- **Master Data**: 초기에는 자주 쓰이는 식재료 위주로 마스터 데이터를 구축하고, 사용자가 입력하는 데이터 중 마스터에 없는 것은 추후 배치작업으로 마스터로 승격 검토.
- **Search**: PostgreSQL의 Full Text Search 기능을 활용하여 재료 검색 최적화.
