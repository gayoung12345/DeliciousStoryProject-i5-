// app/logout/page.tsx
'use client'; // 클라이언트 사이드에서 실행됨

import { useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebaseConfig';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        const logout = async () => {
            try {
                await signOut(auth);
                router.push('/'); // 로그아웃 후 메인 페이지로 이동
            } catch (error: any) {
                console.error('로그아웃 실패:', error.message);
            }
        };

        logout();
    }, [router]);

    return <div>로그아웃 중...</div>;
}
