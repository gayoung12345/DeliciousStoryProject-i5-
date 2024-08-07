'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const ListPost = () => {
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const router = useRouter();
    const searchParams = useSearchParams();
    const postId = searchParams.get('id');

    useEffect(() => {
        if (postId) {
            const savedPosts = JSON.parse(localStorage.getItem('posts')) || [];
            const foundPost = savedPosts.find((p) => p.id === parseInt(postId));
            if (foundPost) {
                setPost(foundPost);
                // Ensure comments is an array
                setComments(
                    Array.isArray(foundPost.comments) ? foundPost.comments : []
                );
            }
        }
    }, [postId]);

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        const newComment = {
            id: Date.now(),
            text: comment,
        };

        const updatedComments = [...comments, newComment];
        setComments(updatedComments);
        setComment('');

        // Update the post's comments in localStorage
        const savedPosts = JSON.parse(localStorage.getItem('posts')) || [];
        const updatedPosts = savedPosts.map((p) =>
            p.id === parseInt(postId) ? { ...p, comments: updatedComments } : p
        );

        localStorage.setItem('posts', JSON.stringify(updatedPosts));
    };

    if (!post) {
        return <p>Loading...</p>;
    }

    return (
        <main>
            <div style={{ padding: '20px' }}>
                <h1>{post.title}</h1>
                <p>작성자: {post.author}</p>
                <p>작성일: {post.date}</p>
                <div
                    style={{
                        marginTop: '20px',
                        padding: '10px',
                        border: '1px solid #ddd',
                    }}
                >
                    {post.content}
                </div>

                <section style={{ marginTop: '40px' }}>
                    <h2>댓글</h2>
                    {comments.length > 0 ? (
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {comments.map((comment) => (
                                <li
                                    key={comment.id}
                                    style={{
                                        padding: '10px',
                                        borderBottom: '1px solid #ddd',
                                    }}
                                >
                                    {comment.text}{' '}
                                    {/* Ensure only text is rendered */}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>댓글이 없습니다.</p>
                    )}
                    <form
                        onSubmit={handleCommentSubmit}
                        style={{ marginTop: '20px' }}
                    >
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                height: '100px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                            }}
                            required
                        />
                        <button
                            type='submit'
                            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                            style={{ marginTop: '10px' }}
                        >
                            댓글 작성
                        </button>
                    </form>
                </section>
            </div>
        </main>
    );
};

export default ListPost;
