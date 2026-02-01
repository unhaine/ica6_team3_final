# 프로필 사진 선택 기능

## 📋 개요

사용자가 프로필 사진을 변경할 수 있는 기능을 구현했습니다. 프로필 페이지에서 프로필 사진에 마우스를 올리면 Edit 버튼이 나타나고, 클릭하면 프로필 사진 선택 페이지로 이동합니다.

## ✨ 주요 기능

### 1. 프로필 페이지 호버 효과

- **위치**: `/app/test/profile/page.tsx`
- **기능**: 프로필 사진에 마우스를 올리면 반투명 검은색 오버레이와 함께 흰색 Edit 아이콘이 표시됩니다
- **동작**: 클릭 시 `/test/profile/select` 페이지로 이동

### 2. 프로필 선택 페이지

- **위치**: `/app/test/profile/select/page.tsx`
- **기능**:
  - `public/profile` 폴더의 모든 프로필 이미지를 그리드 형태로 표시
  - 각 이미지에는 이름이 표시됨
  - 이미지 클릭 시 해당 프로필로 변경 (현재는 알림으로 시뮬레이션)

### 3. AI 프로필 생성 기능

- **버튼**: "AI로 생성하기" (✨ Sparkles 아이콘)
- **동작**:
  1. 랜덤으로 동물 선택 (penguin, polar bear, seal, fox, rabbit, squirrel, panda, koala)
  2. 서버 액션을 통해 AI 이미지 생성 요청
  3. 생성된 이미지를 프로필로 사용 가능

## 📁 파일 구조

```
app/
├── test/
│   └── profile/
│       ├── page.tsx                    # 프로필 페이지 (호버 효과 포함)
│       └── select/
│           └── page.tsx                # 프로필 선택 페이지
├── actions/
│   └── profile.ts                      # AI 이미지 생성 서버 액션
└── api/
    └── profile/
        └── generate/
            └── route.ts                # AI 이미지 생성 API (대체 방법)

public/
└── profile/
    ├── fridgeCat.png                   # 냉장고 고양이
    ├── fridgeElk.png                   # 냉장고 사슴
    ├── fridgeGoblin.png                # 냉장고 고블린
    ├── fridgeGodzilla.png              # 냉장고 고질라
    └── fridgeGorilla.png               # 냉장고 고릴라
```

## 🎨 디자인 특징

### 프로필 페이지 호버 효과

- 반투명 검은색 오버레이 (`bg-black/50`)
- 흰색 원형 배경의 Edit 아이콘
- 부드러운 전환 효과 (`transition-all`)
- 커서가 포인터로 변경되어 클릭 가능함을 표시

### 프로필 선택 페이지

- **그리드 레이아웃**: 2열 그리드로 이미지 표시
- **이미지 카드**:
  - 정사각형 비율 (`aspect-square`)
  - 호버 시 확대 효과 (`hover:scale-[1.02]`)
  - 선택 시 링 효과 (`ring-4 ring-primary`)
  - 하단에 그라데이션 오버레이와 이름 표시

- **AI 생성 버튼**:
  - 점선 테두리 (`border-dashed`)
  - 그라데이션 배경 (`bg-linear-to-br`)
  - Sparkles 아이콘
  - 생성 중 애니메이션 (`animate-pulse`, `animate-spin`)

## 🔧 기술 구현

### 1. 호버 상태 관리

```tsx
const [isHovering, setIsHovering] = useState(false);

<div
  onMouseEnter={() => setIsHovering(true)}
  onMouseLeave={() => setIsHovering(false)}
>
  {isHovering && <EditButton />}
</div>;
```

### 2. 이미지 선택

```tsx
const handleSelectImage = (imageId: string) => {
  setSelectedImage(imageId);
  // TODO: 실제 프로필 업데이트 API 호출
  router.back();
};
```

### 3. AI 이미지 생성

```tsx
const handleGenerateRandom = async () => {
    const animals = ["penguin", "polar bear", ...];
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];

    const result = await generateProfileImage(randomAnimal);
    // 생성된 이미지 처리
};
```

## 🚀 향후 개선 사항

### 1. 실제 AI 이미지 생성 연동

현재는 프로토타입으로 구현되어 있으며, 실제 서비스에서는 다음과 같은 AI 이미지 생성 서비스와 연동할 수 있습니다:

- **OpenAI DALL-E 3**: 고품질 이미지 생성
- **Stability AI**: Stable Diffusion 모델
- **Midjourney API**: 예술적 스타일
- **Replicate**: 다양한 오픈소스 모델

### 2. 이미지 저장 및 관리

- 생성된 이미지를 클라우드 스토리지에 업로드 (AWS S3, Google Cloud Storage)
- 데이터베이스에 프로필 이미지 URL 저장
- 사용자별 프로필 이미지 히스토리 관리

### 3. 프로필 업데이트 API

```typescript
// 예시
async function updateUserProfile(userId: string, imageUrl: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { image: imageUrl },
  });
}
```

### 4. 이미지 최적화

- Next.js Image 컴포넌트 활용
- WebP 포맷 변환
- 다양한 크기의 썸네일 생성

### 5. UX 개선

- 이미지 업로드 기능 추가
- 이미지 크롭 및 편집 기능
- 프로필 사진 미리보기
- 로딩 스켈레톤 추가

## 📝 사용 방법

1. **프로필 페이지 접속**: `/test/profile`
2. **프로필 사진에 마우스 올리기**: Edit 버튼 표시
3. **프로필 사진 클릭**: 선택 페이지로 이동
4. **원하는 이미지 선택** 또는 **AI로 생성하기 클릭**
5. **자동으로 프로필 페이지로 돌아감**

## 🎯 AI 이미지 생성 프롬프트

냉장고 안의 동물 컨셉으로 다음과 같은 프롬프트를 사용합니다:

```
A cute cartoon {animal} character peeking out from inside an open refrigerator,
surrounded by colorful food items like fruits, vegetables, and milk cartons.
The {animal} has big friendly eyes and looks curious.
Playful digital art style with vibrant colors.
The background shows the inside of a modern refrigerator with shelves.
Perfect for a profile picture, clean and appealing design.
```

## 🐛 알려진 이슈

- 현재 프로필 이미지 변경은 시뮬레이션으로만 동작 (실제 저장 안 됨)
- AI 이미지 생성은 프로토타입 단계 (실제 이미지 생성 안 됨)
- 세션 관리와 연동 필요

## 📚 참고 자료

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [OpenAI DALL-E API](https://platform.openai.com/docs/guides/images)
- [Stability AI](https://stability.ai/)
