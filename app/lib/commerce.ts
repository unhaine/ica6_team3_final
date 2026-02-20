export type CommerceProvider = 'coupang' | 'naver' | 'ssg' | 'kurly';

export const COMMERCE_PROVIDERS: { id: CommerceProvider; name: string; url: string }[] = [
  { id: 'coupang', name: '쿠팡', url: 'https://www.coupang.com' },
  { id: 'naver', name: '네이버쇼핑', url: 'https://shopping.naver.com' },
  { id: 'ssg', name: 'SSG닷컴', url: 'https://www.ssg.com' },
  { id: 'kurly', name: '마켓컬리', url: 'https://www.kurly.com' },
];

export function getCommerceLink(query: string, provider: CommerceProvider): string {
  const encodedQuery = encodeURIComponent(query);
  
  switch (provider) {
    case 'coupang':
      return `https://www.coupang.com/np/search?component=&q=${encodedQuery}&channel=user`;
    case 'naver':
      return `https://search.shopping.naver.com/search/all?query=${encodedQuery}`;
    case 'ssg':
      return `https://www.ssg.com/search.ssg?target=all&query=${encodedQuery}`;
    case 'kurly':
      return `https://www.kurly.com/search?keyword=${encodedQuery}`;
    default:
      return `https://search.shopping.naver.com/search/all?query=${encodedQuery}`;
  }
}
