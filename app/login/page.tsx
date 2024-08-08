// app/login/page.tsx
'use client'; // 클라이언트 사이드에서 실행됨

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebaseConfig'; // Firebase 설정 파일 경로

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // useRouter 훅을 사용하여 라우터 인스턴스 생성
    const router = useRouter();

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log('로그인 성공');
            // 로그인 성공 후 메인 페이지로 리다이렉트
            router.push('/'); // 메인 페이지로 리다이렉트
        } catch (error) {
            if (error instanceof Error) {
                console.error('로그인 오류:', error.message);
                setError('로그인 실패: ' + error.message); // 사용자에게 보다 구체적인 오류 메시지 제공
            } else {
                console.error('로그인 오류:', error);
                setError('로그인 실패: 알 수 없는 오류');
            }
        }
    };

    return (
        <div>
            <h1>로그인</h1>
            <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='이메일'
            />
            <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='비밀번호'
            />
            <button onClick={handleLogin}>로그인</button>
            {error && <p>{error}</p>}
        </div>
    );
}
