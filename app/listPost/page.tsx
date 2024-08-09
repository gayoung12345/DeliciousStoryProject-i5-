// app/ListPost.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../../lib/firebaseConfig';
import { useAuth } from '../context/AuthContext';

const ListPost = () => {
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const { user } = useAuth();
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

    // 댓글 작성 핸들러
    const handleCommentSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (user) {
            try {
                await addDoc(collection(db, 'comments'), {
                    postId: postId,
                    content: comment,
                    author: user.email,
                    date: new Date().toISOString(),
                });

                alert('댓글이 작성되었습니다!');
                setComment(''); // 댓글 작성 후 초기화
                // 댓글 갱신 로직 추가 가능
            } catch (error) {
                console.error('댓글 작성 오류:', error);
            }
        } else {
            alert('로그인이 필요합니다.');
            router.push('/login');
        }
    };

    // 뒤로가기 버튼 핸들러
    const handleGoBack = () => {
        router.push('/freeBoard');
    };

    return (
        <main>
            <div
                style={{
                    padding: '20px',
                    width: '60%',
                    margin: '0 auto',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
            >
                <h1
                    style={{
                        textAlign: 'center',
                        fontSize: '36px',
                        marginBottom: '30px',
                    }}
                >
                    게시글 상세보기
                </h1>
                <table
                    style={{
                        width: '100%',
                        marginBottom: '30px',
                        borderCollapse: 'collapse',
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        overflow: 'hidden',
                    }}
                >
                    <tbody>
                        <tr>
                            <th
                                style={{
                                    padding: '10px',
                                    backgroundColor: '#f0f0f0',
                                    fontWeight: 'bold',
                                    width: '20%',
                                    borderBottom: '1px solid #ddd',
                                    textAlign: 'center',
                                }}
                            >
                                제목
                            </th>
                            <td
                                style={{
                                    padding: '10px',
                                    borderBottom: '1px solid #ddd',
                                }}
                            >
                                {post.title}
                            </td>
                        </tr>
                        <tr>
                            <th
                                style={{
                                    padding: '10px',
                                    backgroundColor: '#f0f0f0',
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    width: '20%',
                                    borderBottom: '1px solid #ddd',
                                }}
                            >
                                작성자
                            </th>
                            <td
                                style={{
                                    padding: '10px',
                                    borderBottom: '1px solid #ddd',
                                }}
                            >
                                {post.author}
                            </td>
                        </tr>
                        <tr>
                            <th
                                style={{
                                    padding: '10px',
                                    backgroundColor: '#f0f0f0',
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    width: '20%',
                                    borderBottom: '1px solid #ddd',
                                }}
                            >
                                작성일
                            </th>
                            <td
                                style={{
                                    padding: '10px',
                                    borderBottom: '1px solid #ddd',
                                }}
                            >
                                {post.date}
                            </td>
                        </tr>
                        <tr>
                            <th
                                style={{
                                    padding: '10px',
                                    backgroundColor: '#f0f0f0',
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    width: '20%',
                                    borderBottom: '1px solid #ddd',
                                    height: '350px', // 높이 설정
                                }}
                            >
                                내용
                            </th>

                            <td
                                style={{
                                    padding: '20px',
                                    borderBottom: '1px solid #ddd',
                                    lineHeight: '1.6',
                                }}
                            >
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: post.content,
                                    }}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                {/* 댓글 작성 섹션 */}
                <div
                    style={{
                        marginTop: '50px',
                        padding: '20px',
                        backgroundColor: '#f9f9f9',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                    }}
                >
                    <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>
                        댓글 작성하기
                    </h2>
                    <form onSubmit={handleCommentSubmit}>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                resize: 'none',
                                height: '100px',
                                marginBottom: '20px',
                            }}
                            placeholder='댓글을 작성하세요...'
                            required
                        />
                        <button
                            type='submit'
                            className='bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600'
                        >
                            댓글 작성
                        </button>
                    </form>
                </div>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <p style={{ fontSize: '16px', color: '#888' }}>
                        댓글 수 {post.comments} | 조회 수 {post.views}
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
