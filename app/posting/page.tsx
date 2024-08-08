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

                router.push('/freeBoard'); // 리다이렉트 경로가 올바른지 확인하세요
            } catch (error) {
                console.error('Error adding document: ', error);
            }
        } else {
            alert('로그인이 필요합니다.');
            router.push('/login'); // 로그인 페이지로 이동
        }
    };

    return (
        <div>
            <h1>글 작성하기</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>제목</label>
                    <input
                        type='text'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>내용</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>
                <button type='submit'>작성하기</button>
            </form>
        </div>
    );
};

export default Posting;
