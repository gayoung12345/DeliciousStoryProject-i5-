// listPost 자유게시판 상세보기
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
import { FaArrowUp } from 'react-icons/fa';

// 스크롤을 페이지 상단으로 이동시키는 함수
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth', // 부드러운 스크롤 효과
    });
};

// 타입 정의
interface Post {
    author: string;
    comments: number; // 댓글 수
    content: string;
    date: string; // ISO 8601 형식의 날짜 문자열
    postId: string;
    title: string;
    views: number;
}
interface Comment {
    author: string;
    content: string;
    date: string; // ISO 8601 형식의 날짜 문자열
    postId: string;
}

const ListPost = () => {
    // 상태 변수 정의
    const [post, setPost] = useState<Post | null>(null); // 게시글 데이터 상태
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [comment, setComment] = useState(''); // 댓글 입력 상태
    const [comments, setComments] = useState<Comment[]>([]); // 댓글 목록 상태
    const { user } = useAuth(); // 인증된 사용자 정보
    const router = useRouter(); // 라우터 객체
    const searchParams = useSearchParams(); // URL 쿼리 파라미터
    const postId = searchParams.get('id'); // URL에서 게시글 ID 추출

    // 게시글 데이터를 가져오는 함수
    useEffect(() => {
        const fetchPost = async () => {
            if (postId) {
                try {
                    // Firebase에서 게시글 문서 참조 생성
                    const postDoc = doc(db, 'posts', postId);
                    const postSnapshot = await getDoc(postDoc);

                    if (postSnapshot.exists()) {
                        // 데이터 가져오기 및 타입 단언
                        const postData = postSnapshot.data() as Post; // 타입 단언 사용
                        setPost(postData); // 게시글 데이터 상태 업데이트

                        // 게시글 조회 수 업데이트
                        await updateDoc(postDoc, {
                            views: (postData.views || 0) + 1,
                        });
                    } else {
                        console.error('문서를 찾을 수 없습니다!'); // 문서가 존재하지 않을 때 에러 로그
                    }
                } catch (error) {
                    console.error('문서 가져오기 오류:', error); // 문서 가져오기 오류 로그
                } finally {
                    setLoading(false); // 로딩 상태 해제
                }
            }
        };

        fetchPost(); // 게시글 데이터 가져오기
    }, [postId]); // postId가 변경될 때마다 실행

    // 댓글 데이터를 가져오는 함수
    useEffect(() => {
        const fetchComments = async () => {
            if (postId) {
                try {
                    const commentsRef = collection(db, 'comments');
                    const q = query(commentsRef, where('postId', '==', postId));
                    const querySnapshot = await getDocs(q);

                    const fetchedComments: Comment[] = querySnapshot.docs.map(
                        (doc) => ({
                            author: doc.data().author as string,
                            content: doc.data().content as string,
                            date: doc.data().date as string,
                            postId: doc.data().postId as string,
                        })
                    );
                    setComments(fetchedComments);
                } catch (error) {
                    console.error('댓글 가져오기 오류:', error);
                }
            }
        };

        fetchComments();
    }, [postId]);

    // 댓글 제출 처리 함수
    const handleCommentSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // 폼 제출 기본 동작 방지

        if (user && postId) {
            // postId가 null이 아닌지 확인
            try {
                // 댓글 추가
                await addDoc(collection(db, 'comments'), {
                    postId: postId,
                    content: comment,
                    author: user.email,
                    date: new Date().toISOString(),
                });

                // 게시글 문서 참조 생성 및 댓글 수 업데이트
                const postDocRef = doc(db, 'posts', postId);
                const postSnapshot = await getDoc(postDocRef);

                if (!postSnapshot.exists()) {
                    console.error('게시글이 존재하지 않습니다.');
                    return;
                }

                const postData = postSnapshot.data() as Post;
                const newCommentCount = (postData.comments || 0) + 1;
                await updateDoc(postDocRef, {
                    comments: newCommentCount,
                });

                // 댓글 목록 갱신
                const commentsRef = collection(db, 'comments');
                const q = query(commentsRef, where('postId', '==', postId));
                const querySnapshot = await getDocs(q);
                const updatedComments = querySnapshot.docs.map(
                    (doc) => doc.data() as Comment // DocumentData를 Comment 타입으로 단언
                );
                setComments(updatedComments);

                // 상태 업데이트
                setPost((prevPost) =>
                    prevPost
                        ? {
                              ...prevPost,
                              comments: newCommentCount,
                          }
                        : null
                );

                alert('댓글이 작성되었습니다!'); // 댓글 작성 성공 메시지
                setComment(''); // 댓글 입력 초기화
            } catch (error) {
                console.error('댓글 작성 오류:', error); // 댓글 작성 오류 로그
            }
        } else {
            alert('로그인이 필요합니다.'); // 로그인 필요 경고
            router.push('/login'); // 로그인 페이지로 이동
        }
    };

    // 뒤로가기 버튼 클릭 시 처리 함수
    const handleGoBack = () => {
        router.push('/freeBoard'); // 게시글 목록 페이지로 이동
    };

    // 로딩 중일 때 표시
    if (loading) {
        return <p>로딩 중...</p>;
    }

    // 게시글이 없는 경우 표시
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
                {/* // 글 제목 */}
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
                {/* // 게시물 내용 */}
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
                        textAlign: 'left',
                        height: '300px',
                    }}
                >
                    {/* 게시글 내용 표시 (HTML을 직접 렌더링) */}
                    <div
                        dangerouslySetInnerHTML={{
                            __html: post.content,
                        }}
                        style={{ textAlign: 'left' }}
                    />
                </div>
                {/* // 댓글 폼 */}
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
                            placeholder='댓글을 작성하세요'
                            required
                        />
                        <button
                            type='submit'
                            className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800'
                        >
                            등록
                        </button>
                    </form>
                </div>
                {/* // 댓글 리스트 */}
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
                    {/* 댓글이 없는 경우 메시지 표시 */}
                    {comments.length === 0 ? (
                        <p>댓글이 없습니다.</p>
                    ) : (
                        // 댓글 목록 표시
                        <ul style={{ listStyleType: 'none', padding: '0' }}>
                            {comments
                                .slice() // 배열을 복사하여 원본 배열을 변경하지 않도록 합니다.
                                .sort(
                                    (a, b) =>
                                        new Date(a.date).getTime() -
                                        new Date(b.date).getTime()
                                ) // 날짜를 기준으로 정렬합니다.
                                .map((comment, index) => (
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
                {/* // 뒤로가기 */}
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
            {/* 페이지 상단으로 이동하는 버튼 */}
            <button
                onClick={scrollToTop}
                style={{
                    color: '#ffffff',
                    backgroundColor: '#000000',
                    position: 'fixed',
                    bottom: 50,
                    right: 50,
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    zIndex: 10,
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                }}
            >
                <FaArrowUp
                    size={24}
                    color='#ffffff'
                />
            </button>
        </main>
    );
};

export default ListPost;
