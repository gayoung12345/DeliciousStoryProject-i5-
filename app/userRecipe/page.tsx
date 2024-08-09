'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const UserRecipe = () => {
    const [posts, setPosts] = useState<any[]>([]); // 수정: any[] 타입으로 변경
    const router = useRouter();

    useEffect(() => {
        const storedPosts = JSON.parse(localStorage.getItem('posts')) || [];
        setPosts(storedPosts);
    }, []);

    const handleWriteClick = () => {
        router.push('/userRecipeWrite');
    };

    return (
        <main
            style={{
                padding: '20px',
                textAlign: 'center',
                width: '60%', // 화면의 60% 너비 사용
                margin: '0 auto', // 중앙 정렬
            }}
        >
            <div
                style={{
                    marginBottom: '20px',
                }}
            >
                <h1
                    style={{
                        fontSize: '24px',
                        margin: '0',
                        textDecoration: 'underline',
                        textUnderlineOffset: '10px',
                    }}
                >
                    유저 레시피
                </h1>
            </div>
            <div
                style={{
                    marginBottom: '20px', // 한 줄 띄우기
                }}
            ></div>
            <button
                className='bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600'
                style={{
                    marginBottom: '20px', // 한 줄 띄우기
                }}
                onClick={handleWriteClick}
            >
                레시피 공유하기
            </button>
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '20px',
                    justifyContent: 'center',
                }}
            >
                {posts.map((post) => (
                    <div
                        key={post.id}
                        style={{
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            padding: '10px',
                            width: '18%', // 카드의 너비를 설정
                            minHeight: '350px', // 높이를 고정
                            textAlign: 'left',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            display: 'flex',
                            flexDirection: 'column', // 세로 방향으로 레이아웃
                        }}
                    >
                        {post.image && (
                            <img
                                src={post.image}
                                alt='게시글 이미지'
                                style={{
                                    width: '100%',
                                    height: '150px',
                                    objectFit: 'cover', // 이미지 비율 유지
                                    borderRadius: '4px',
                                    marginBottom: '10px',
                                }}
                            />
                        )}
                        {!post.image && (
                            <div
                                style={{
                                    width: '100%',
                                    height: '150px',
                                    borderRadius: '4px',
                                    backgroundColor: '#f4f4f4', // 이미지가 없을 때의 배경색
                                    marginBottom: '10px',
                                }}
                            />
                        )}
                        <h2 style={{ fontSize: '18px', margin: '0 0 10px' }}>
                            {post.title}
                        </h2>
                        <p
                            style={{
                                fontSize: '12px',
                                color: '#666',
                                marginBottom: '8px',
                                flexGrow: 1, // 내용이 없더라도 카드 크기를 유지
                            }}
                        >
                            {post.content.length > 100
                                ? post.content.substring(0, 100) + '...'
                                : post.content}
                        </p>
                        <p style={{ fontSize: '12px', color: '#aaa' }}>
                            작성자: {post.author}
                        </p>
                        <p style={{ fontSize: '12px', color: '#aaa' }}>
                            날짜: {post.date}
                        </p>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default UserRecipe;
