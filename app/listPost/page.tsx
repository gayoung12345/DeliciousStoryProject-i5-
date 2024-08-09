// app/ListPost.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebaseConfig';

const ListPost = () => {
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const searchParams = useSearchParams();
    const postId = searchParams.get('id');

    useEffect(() => {
        const fetchPost = async () => {
            if (postId) {
                try {
                    const postDoc = doc(db, 'posts', postId);
                    const postSnapshot = await getDoc(postDoc);

                    if (postSnapshot.exists()) {
                        setPost(postSnapshot.data());
                    } else {
                        console.error('문서를 찾을 수 없습니다!');
                    }
                } catch (error) {
                    console.error('문서 가져오기 오류:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchPost();
    }, [postId]);

    if (loading) {
        return <p>로딩 중...</p>;
    }

    if (!post) {
        return <p>게시글을 찾을 수 없습니다.</p>;
    }

    // 뒤로가기 버튼 핸들러
    const handleGoBack = () => {
        router.push('/freeBoard');
    };

    return (
        <main>
            <div style={{ padding: '20px' }}>
                <h1
                    style={{
                        textAlign: 'center',
                        fontSize: '36px',
                        marginBottom: '30px',
                    }}
                >
                    게시글 상세보기
                </h1>
                <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                    <h2
                        style={{
                            fontSize: '28px',
                            marginBottom: '10px',
                            textAlign: 'center',
                        }}
                    >
                        {post.title}
                    </h2>
                    <p
                        style={{
                            fontSize: '16px',
                            textAlign: 'center',
                            color: '#555',
                        }}
                    >
                        작성자: {post.author} | 작성일: {post.date}
                    </p>
                </div>
                <div
                    style={{
                        padding: '20px',
                        backgroundColor: '#f9f9f9',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        marginBottom: '20px',
                    }}
                >
                    <h3 style={{ fontSize: '22px', marginBottom: '15px' }}>
                        내용
                    </h3>
                    <p style={{ fontSize: '18px', lineHeight: '1.6' }}>
                        {post.content}
                    </p>
                </div>
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <p style={{ fontSize: '16px', color: '#888' }}>
                        댓글 수: {post.comments} | 조회 수: {post.views}
                    </p>
                </div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '30px',
                    }}
                >
                    <button
                        type='button'
                        onClick={handleGoBack}
                        className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'
                    >
                        뒤로가기
                    </button>
                </div>
            </div>
        </main>
    );
};

export default ListPost;
