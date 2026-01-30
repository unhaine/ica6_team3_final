export const FILTERS = [
  { id: "all", label: "전체" },
  { id: "cold", label: "❄️ 냉장" },
  { id: "frozen", label: "🧊 냉동" },
  { id: "room", label: "🥫 실온" },
  { id: "seasoning", label: "🧂 조미료" },
];

export const MOCK_ITEMS = [
  { id: 1, name: "유기농 우유", quantity: "1개", remaining: "2일 남음", type: "cold", image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=100&q=80" },
  { id: 2, name: "신선한 달걀", quantity: "12구", remaining: "7일 남음", type: "cold", image: "https://images.unsplash.com/photo-1598965402089-a938629cb17e?auto=format&fit=crop&w=100&q=80" },
  { id: 3, name: "냉동 피자", quantity: "2박스", remaining: "30일 남음", type: "frozen", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=100&q=80" },
  { id: 4, name: "파스타 면", quantity: "500g", remaining: "1년 남음", type: "room", image: "https://images.unsplash.com/photo-1551462147-37885acc36f1?auto=format&fit=crop&w=100&q=80" },
  { id: 5, name: "양배추", quantity: "반통", remaining: "3일 남음", type: "cold", image: "https://images.unsplash.com/photo-1628157588553-53970aa6acf7?auto=format&fit=crop&w=100&q=80" },
];
