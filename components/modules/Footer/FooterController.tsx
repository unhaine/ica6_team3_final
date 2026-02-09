'use client';

import { usePathname } from 'next/navigation';
import { useFooter } from '@/components/modules/Footer';
import * as LucideIcons from 'lucide-react';
import { useMemo } from 'react';

const ROOT_NAV_ITEMS = [
    { label: '홈', icon: 'Home', href: '/home' },
    { label: '나의 냉장고', icon: 'Refrigerator', href: '/fridge' },
    { label: '커뮤니티', icon: 'PawPrint', href: '/community' },
    { label: '프로필', icon: 'CircleUser', href: '/profile' },
];

const HIDE_FOOTER_PATHS = ['/login', '/signup', '/onboarding', '/test', '/camera', '/test/camera'];

export const FooterController = () => {
    const pathname = usePathname();
    
    // Check if current path should hide the root footer
    // We hide it on specific auth pages, and on anything under /test (since /test has its own footer)
    // We also hide it on the root '/' landing page if desired
    const isHidden = HIDE_FOOTER_PATHS.some(path => 
        pathname === path || (path !== '/' && pathname?.startsWith(path))
    ) || pathname === '/';

    const items = useMemo(() => ROOT_NAV_ITEMS.map(item => ({
        ...item,
        icon: (LucideIcons as any)[item.icon] || LucideIcons.HelpCircle
    })), []);

    useFooter({
        isVisible: !isHidden,
        items
    });

    return null;
};
