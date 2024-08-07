'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const FreeBoard = () => {
    const [posts, setPosts] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const savedPosts = JSON.parse(localStorage.getItem('posts')) || [];
        setPosts(savedPosts);
    }, []);

    const handleWriteClick = () => {
        router.push('/posting');
    };

    const handlePostClick = (id) => {
        router.push(`/listPost?id=${id}`); // 글 상세보기 페이지로 이동
    };

    return (
        <main>
            <div style={{ padding: '20px' }}>
                <h1 style={{ textAlign: 'center', fontSize: '36px' }}>
                    자유게시판
                </h1>
                <button
                    type='button'
                    className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                    style={{ float: 'right', marginBottom: '20px' }}
                    onClick={handleWriteClick}
                >
                    글 작성하기
                </button>

                <div style={{ marginTop: '20px' }}>
                    {posts.length > 0 ? (
                        <table
                            style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                            }}
                        >
                            <thead>
                                <tr>
                                    <th
                                        style={{
                                            border: '1px solid #ddd',
                                            padding: '8px',
                                        }}
                                    >
                                        번호
                                    </th>
                                    <th
                                        style={{
                                            border: '1px solid #ddd',
                                            padding: '8px',
                                        }}
                                    >
                                        글 제목
                                    </th>
                                    <th
                                        style={{
                                            border: '1px solid #ddd',
                                            padding: '8px',
                                        }}
                                    >
                                        작성자
                                    </th>
                                    <th
                                        style={{
                                            border: '1px solid #ddd',
                                            padding: '8px',
                                        }}
                                    >
                                        작성일
                                    </th>
                                    <th
                                        style={{
                                            border: '1px solid #ddd',
                                            padding: '8px',
                                        }}
                                    >
                                        댓글수
                                    </th>
                                    <th
                                        style={{
                                            border: '1px solid #ddd',
                                            padding: '8px',
                                        }}
                                    >
                                        조회수
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.map((post, index) => (
                                    <tr key={post.id}>
                                        <td
                                            style={{
                                                border: '1px solid #ddd',
                                                padding: '8px',
                                                textAlign: 'center',
                                            }}
                                        >
                                            {index + 1}
                                        </td>
                                        <td
                                            style={{
                                                border: '1px solid #ddd',
                                                padding: '8px',
                                                cursor: 'pointer',
                                                color: 'blue',
                                                textDecoration: 'underline',
                                            }}
                                            onClick={() =>
                                                handlePostClick(post.id)
                                            }
                                        >
                                            {post.title}
                                        </td>
                                        <td
                                            style={{
                                                border: '1px solid #ddd',
                                                padding: '8px',
                                                textAlign: 'center',
                                            }}
                                        >
                                            {post.author}
                                        </td>
                                        <td
                                            style={{
                                                border: '1px solid #ddd',
                                                padding: '8px',
                                                textAlign: 'center',
                                            }}
                                        >
                                            {post.date}
                                        </td>
                                        <td
                                            style={{
                                                border: '1px solid #ddd',
                                                padding: '8px',
                                                textAlign: 'center',
                                            }}
                                        >
                                            {post.comments}
                                        </td>
                                        <td
                                            style={{
                                                border: '1px solid #ddd',
                                                padding: '8px',
                                                textAlign: 'center',
                                            }}
                                        >
                                            {post.views}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>게시물이 없습니다.</p>
                    )}
                </div>
            </div>
        </main>
    );
};

export default FreeBoard;
