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
                        console.error('No such document!');
                    }
                } catch (error) {
                    console.error('Error fetching document:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchPost();
    }, [postId]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!post) {
        return <p>Post not found</p>;
    }

    return (
        <div>
            <h1>{post.title}</h1>
            <p>작성자: {post.author}</p>
            <p>작성일: {post.date}</p>
            <div>
                <h2>내용</h2>
                <p>{post.content}</p>
            </div>
            <p>댓글 수: {post.comments}</p>
            <p>조회 수: {post.views}</p>
        </div>
    );
};

export default ListPost;
