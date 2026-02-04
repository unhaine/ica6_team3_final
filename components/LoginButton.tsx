import { useSession, signIn, signOut } from 'next-auth/react';

export default function LoginButton() {
    const { data: session } = useSession();
    const user = session?.user;

    const handleLogin = () => {
        signIn();
    };

    const handleLogout = async () => {
        signOut();
    };

    if (user) {
        return (
            <div className="flex items-center gap-3">
                {user.image && (
                    <img
                        src={user.image}
                        alt="Profile"
                        className="w-8 h-8 rounded-full border border-slate-600"
                    />
                )}
                <div className="flex flex-col text-right hidden sm:block">
                    <span className="text-xs text-slate-400">환영합니다</span>
                    <span className="text-sm font-medium text-emerald-400">
                        {user.name || user.email?.split('@')[0]}
                    </span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => window.location.href = '/inventory'}
                        className="px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-colors"
                    >
                        나의 냉장고
                    </button>
                    <button
                        onClick={handleLogout}
                        className="px-3 py-1.5 text-xs font-medium text-slate-400 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 hover:text-white transition-colors"
                    >
                        로그아웃
                    </button>
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={handleLogin}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95"
        >
            <span className="text-sm">로그인</span>
        </button>
    );
}
