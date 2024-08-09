// app/Posting.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext'; // 인증 컨텍스트 가져오기
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../lib/firebaseConfig';

const Posting = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const router = useRouter();
    const { user } = useAuth(); // 현재 사용자 가져오기

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (user) {
            try {
                await addDoc(collection(db, 'posts'), {
                    title,
                    content,
                    author: user.email,
                    date: new Date().toISOString(),
                    comments: 0,
                    views: 0,
                });

                alert('글이 작성되었습니다!'); // 알림 표시
                router.push('/freeBoard'); // 리다이렉트 경로가 올바른지 확인하세요
            } catch (error) {
                console.error('Error adding document: ', error);
            }
        } else {
            alert('로그인이 필요합니다.');
            router.push('/login'); // 로그인 페이지로 이동
        }
    };

    // 뒤로가기 버튼 핸들러
    const handleGoBack = () => {
        router.push('/freeBoard');
    };

    return (
        <main>
            <div style={{ padding: '20px' }}>
                <h1 style={{ textAlign: 'center', fontSize: '36px' }}>
                    글 작성하기
                </h1>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                        <label
                            htmlFor='title'
                            style={{
                                display: 'block',
                                marginBottom: '10px',
                                textAlign: 'left',
                                marginLeft: '20%',
                            }}
                        >
                            제목
                        </label>
                        <input
                            id='title'
                            type='text'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{
                                width: '60%',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                display: 'block',
                                margin: '0 auto',
                                verticalAlign: 'top', // 상단 정렬
                            }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                        <label
                            htmlFor='content'
                            style={{
                                display: 'block',
                                marginBottom: '10px',
                                textAlign: 'left',
                                marginLeft: '20%',
                            }}
                        >
                            내용
                        </label>
                        <textarea
                            id='content'
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            style={{
                                width: '60%',
                                padding: '10px',
                                height: '200px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                display: 'block',
                                margin: '0 auto',
                                verticalAlign: 'top', // 상단 정렬
                            }}
                            required
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button
                            type='button'
                            onClick={handleGoBack}
                            className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'
                            style={{ marginRight: '10px' }} // 버튼 사이 간격
                        >
                            뒤로가기
                        </button>
                        <button
                            type='submit'
                            className='bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600'
                        >
                            작성하기
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default Posting;
