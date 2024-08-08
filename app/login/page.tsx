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
            // 커밋 오류 테스트
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
        <div
            style={{
                // 전체 화면을 중앙에 정렬
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <div
                style={{
                    /* 로그인 창 크기 조절 */
                    display: 'flex',
                    flexDirection: 'column', // 세로 방향으로 요소 배치
                    alignItems: 'center', // 중앙 정렬
                    width: '400px', // 로그인 박스의 너비 설정
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'white',
                }}
            >
                <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>
                    로그인
                </h1>
                <div style={{ width: '100%', marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        아이디
                    </label>
                    <input
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='아이디를 입력하세요'
                        style={{
                            width: '100%',
                            padding: '10px',
                            boxSizing: 'border-box',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                        }}
                    />
                </div>
                <div style={{ width: '100%', marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        비밀번호
                    </label>
                    <input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='비밀번호를 입력하세요'
                        style={{
                            width: '100%',
                            padding: '10px',
                            boxSizing: 'border-box',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                        }}
                    />
                </div>
                <button
                    onClick={handleLogin}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#FF6B00',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    로그인
                </button>
                {error && (
                    <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>
                )}
                <div style={{ marginTop: '10px', fontSize: '14px' }}>
                    <span
                        style={{
                            cursor: 'pointer',
                            color: '#0070f3',
                        }}
                    >
                        회원가입
                    </span>
                </div>
            </div>
        </div>
    );
}
