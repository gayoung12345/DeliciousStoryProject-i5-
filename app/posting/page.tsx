'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Posting = () => {
    // 상태를 선언하여 작성자, 제목, 내용, 비밀번호를 관리합니다.
    const [author, setAuthor] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [password, setPassword] = useState(''); // 비밀번호 상태
    const router = useRouter();

    // 폼 제출 핸들러
    const handleSubmit = (e) => {
        e.preventDefault();

        // 새로운 게시글 데이터 생성
        const newPost = {
            id: Date.now(), // 현재 시간을 ID로 사용
            title,
            author: author || '익명', // 작성자 필드 (입력되지 않으면 '익명'으로 설정)
            date: new Date().toISOString().split('T')[0], // 현재 날짜
            comments: [], // 댓글 빈 배열
            views: 0, // 조회수 초기값 0
            content, // 글 내용
            password, // 비밀번호 추가
        };

        // 기존 게시글 목록 가져오기
        const existingPosts = JSON.parse(localStorage.getItem('posts')) || [];
        const updatedPosts = [newPost, ...existingPosts]; // 새로운 글 추가

        // 업데이트된 게시글 목록을 localStorage에 저장
        localStorage.setItem('posts', JSON.stringify(updatedPosts));

        alert('글이 작성되었습니다!'); // 알림 표시
        router.push('/freeBoard'); // 글 작성 후 게시판으로 이동
    };

    return (
        <main>
            <div style={{ padding: '20px' }}>
                <h1 style={{ textAlign: 'center', fontSize: '36px' }}>
                    글 작성하기
                </h1>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label
                            htmlFor='title'
                            style={{ display: 'block', marginBottom: '10px' }}
                        >
                            제목
                        </label>
                        <input
                            id='title'
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
                            htmlFor='content'
                            style={{ display: 'block', marginBottom: '10px' }}
                        >
                            내용
                        </label>
                        <textarea
                            id='content'
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                height: '200px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                            }}
                        />
                    </div>

                    <button
                        type='submit'
                        className='bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600'
                        style={{ display: 'block', margin: '0 auto' }} // 버튼을 중앙으로 정렬
                    >
                        작성하기
                    </button>
                </form>
            </div>
        </main>
    );
};

export default Posting;
