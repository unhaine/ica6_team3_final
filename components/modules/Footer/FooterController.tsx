'use client';

import { usePathname } from 'next/navigation';
import { useFooter } from '@/components/modules/Footer';
import * as LucideIcons from 'lucide-react';
import { useMemo } from 'react';

const ROOT_NAV_ITEMS = [
    { label: '홈', iconDefault: '/gnbicon/home.png', iconSelected: '/gnbicon/selecthome.png', href: '/home' },
    { label: '나의 냉장고', iconDefault: '/gnbicon/ref.png', iconSelected: '/gnbicon/selectref.png', href: '/fridge' },
    { label: '커뮤니티', iconDefault: '/gnbicon/commu.png', iconSelected: '/gnbicon/selectcommu.png', href: '/community' },
    { label: '프로필', iconDefault: '/gnbicon/my.png', iconSelected: '/gnbicon/selectmy.png', href: '/profile' },
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

    const items = useMemo(() => ROOT_NAV_ITEMS, []);

    useFooter({
        isVisible: !isHidden,
        items
    });

    return null;
};
