'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    doc,
    getDoc,
    addDoc,
    collection,
    query,
    where,
    getDocs,
    updateDoc,
} from 'firebase/firestore';
import { db } from '../../lib/firebaseConfig';
import { useAuth } from '../context/AuthContext';

const ListPost = () => {
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState<any[]>([]);
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
                        const postData = postSnapshot.data();
                        setPost(postData);

                        // 조회 수 업데이트
                        await updateDoc(postDoc, {
                            views: (postData.views || 0) + 1,
                        });
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

    useEffect(() => {
        const fetchComments = async () => {
            if (postId) {
                try {
                    const commentsRef = collection(db, 'comments');
                    const q = query(commentsRef, where('postId', '==', postId));
                    const querySnapshot = await getDocs(q);

                    const fetchedComments = querySnapshot.docs.map((doc) =>
                        doc.data()
                    );
                    setComments(fetchedComments);
                } catch (error) {
                    console.error('댓글 가져오기 오류:', error);
                }
            }
        };

        fetchComments();
    }, [postId]);

    const handleCommentSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (user) {
            try {
                // 댓글 추가
                await addDoc(collection(db, 'comments'), {
                    postId: postId,
                    content: comment,
                    author: user.email,
                    date: new Date().toISOString(),
                });

                // 댓글 수 업데이트
                const postDoc = doc(db, 'posts', postId);
                const postSnapshot = await getDoc(postDoc);
                const postData = postSnapshot.data();
                const newCommentCount = (postData.comments || 0) + 1;
                await updateDoc(postDoc, {
                    comments: newCommentCount,
                });

                // 댓글 목록 갱신
                const commentsRef = collection(db, 'comments');
                const q = query(commentsRef, where('postId', '==', postId));
                const querySnapshot = await getDocs(q);
                const updatedComments = querySnapshot.docs.map((doc) =>
                    doc.data()
                );
                setComments(updatedComments);

                // 상태 업데이트
                setPost((prevPost) => ({
                    ...prevPost,
                    comments: newCommentCount,
                }));

                alert('댓글이 작성되었습니다!');
                setComment(''); // 댓글 작성 후 초기화
            } catch (error) {
                console.error('댓글 작성 오류:', error);
            }
        } else {
            alert('로그인이 필요합니다.');
            router.push('/login');
        }
    };

    const handleGoBack = () => {
        router.push('/freeBoard');
    };

    if (loading) {
        return <p>로딩 중...</p>;
    }

    if (!post) {
        return <p>게시글을 찾을 수 없습니다.</p>;
    }

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
                        fontSize: '24px',
                        marginBottom: '30px',
                    }}
                >
                    {post.title}
                </h1>
                <div
                    style={{
                        marginBottom: '20px',
                        fontSize: '14px',
                        color: '#555',
                        textAlign: 'right',
                    }}
                >
                    <p>작성자: {post.author}</p>
                    <p>작성일: {post.date}</p>
                    <p>
                        댓글 수 {post.comments || 0} | 조회 수 {post.views || 0}
                    </p>
                </div>

                <div
                    style={{
                        padding: '20px',
                        backgroundColor: '#f9f9f9',
                        borderRadius: '8px',
                        marginBottom: '30px',
                        lineHeight: '1.6',
                        fontSize: '16px',
                        width: '100%',
                        boxSizing: 'border-box',
                    }}
                >
                    <div
                        dangerouslySetInnerHTML={{
                            __html: post.content,
                        }}
                    />
                </div>

                <div
                    style={{
                        padding: '20px',
                        backgroundColor: '#f9f9f9',
                        borderRadius: '8px',
                        marginBottom: '30px',
                        boxSizing: 'border-box',
                        width: '100%',
                    }}
                >
                    <h2 style={{ fontSize: '16px', marginBottom: '20px' }}>
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
                                marginBottom: '10px',
                                boxSizing: 'border-box',
                            }}
                            placeholder='좋은 말로 할 때 댓글을 작성하시겠어요?^^'
                            required
                        />
                        <button
                            type='submit'
                            className='bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600'
                        >
                            등록
                        </button>
                    </form>
                </div>

                <div
                    style={{
                        padding: '20px',
                        backgroundColor: '#f9f9f9',
                        borderRadius: '8px',
                        marginBottom: '30px',
                        boxSizing: 'border-box',
                        width: '100%',
                    }}
                >
                    <h2 style={{ fontSize: '16px', marginBottom: '20px' }}>
                        댓글 목록
                    </h2>
                    {comments.length === 0 ? (
                        <p>댓글이 없습니다.</p>
                    ) : (
                        <ul style={{ listStyleType: 'none', padding: '0' }}>
                            {comments.map((comment, index) => (
                                <li
                                    key={index}
                                    style={{
                                        border: '1px solid #ddd',
                                        padding: '10px',
                                        borderRadius: '4px',
                                        marginBottom: '10px',
                                    }}
                                >
                                    <p>
                                        <strong>{comment.author}</strong> (
                                        {new Date(
                                            comment.date
                                        ).toLocaleDateString()}
                                        )
                                    </p>
                                    <p>{comment.content}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '30px',
                        marginBottom: '10px',
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
