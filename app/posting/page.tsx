'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Posting = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();

        const newPost = {
            id: Date.now(),
            title,
            author: '익명', // 작성자 필드 추가 (필요에 따라 수정 가능)
            date: new Date().toISOString().split('T')[0], // 작성일을 현재 날짜로 설정
            comments: 0,
            views: 0,
            content, // 글 내용을 추가
        };

        // 기존에 저장된 게시글 리스트 가져오기
        const existingPosts = JSON.parse(localStorage.getItem('posts')) || [];
        const updatedPosts = [newPost, ...existingPosts]; // 새로운 글을 리스트에 추가

        // localStorage에 업데이트된 리스트 저장
        localStorage.setItem('posts', JSON.stringify(updatedPosts));

        alert('글이 작성되었습니다!');
        router.push('/freeBoard'); // 글 작성 후 게시판으로 이동
    };

    return (
        <main>
            <div style={{ padding: '20px' }}>
                <h1 style={{ textAlign: 'center', fontSize: '36px' }}>
                    글쓰기
                </h1>
                <form
                    onSubmit={handleSubmit}
                    style={{ marginTop: '20px' }}
                >
                    <div style={{ marginBottom: '10px' }}>
                        <label
                            style={{ display: 'block', marginBottom: '5px' }}
                        >
                            제목:
                        </label>
                        <input
                            type='text'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                            }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label
                            style={{ display: 'block', marginBottom: '5px' }}
                        >
                            내용:
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                height: '200px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                            }}
                            required
                        />
                    </div>
                    <button
                        type='submit'
                        className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                        style={{ float: 'right' }}
                    >
                        작성 완료
                    </button>
                </form>
            </div>
        </main>
    );
};

export default Posting;
