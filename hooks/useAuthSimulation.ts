import { useState, useCallback } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export const useAuthSimulation = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (provider: 'google' | 'kakao') => {
    setLoading(true);
    // 로그인 시뮬레이션 지연
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockUser: User = {
      id: 'user-123',
      name: provider === 'google' ? '홍길동 (Google)' : '김철수 (Kakao)',
      email: provider === 'google' ? 'gildong@google.com' : 'chulsoo@kakao.com',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
    };

    setUser(mockUser);
    setLoading(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return { user, loading, login, logout, isAuthenticated: !!user };
};
