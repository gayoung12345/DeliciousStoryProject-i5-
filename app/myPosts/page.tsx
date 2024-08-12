'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebaseConfig';

interface Post {
    id: string;
    title: string;
    author: string;
    content: string;
    comments: number;
    views: number;
    date: string;
}

const MyPosts = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            if (!user) return;

            try {
                const q = query(
                    collection(db, 'posts'),
                    where('author', '==', user.email)
                );
                const querySnapshot = await getDocs(q);
                const fetchedPosts: Post[] = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...(doc.data() as Omit<Post, 'id'>)
                }));

                setPosts(fetchedPosts);
                setSearchResults(fetchedPosts); // 초기 검색 결과는 전체 게시글로 설정
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [user]);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        if (term) {
            const filteredPosts = posts.filter(
                (post) =>
                    post.title.toLowerCase().includes(term.toLowerCase()) ||
                    post.content.toLowerCase().includes(term.toLowerCase())
            );
            setSearchResults(filteredPosts);
        } else {
            setSearchResults(posts);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='p-4'>
            <h1 className='text-2xl font-bold mb-4'>My Posts</h1>
            <input
                type='text'
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder='Search in my posts...'
                className='bg-gray-200 p-2 rounded-lg mb-4 w-full'
            />
            {searchResults.length > 0 ? (
                <ul>
                    {searchResults.map(post => (
                        <li key={post.id} className='border-b border-gray-300 p-4 mb-4'>
                            <h2 className='text-xl font-bold'>{post.title}</h2>
                            <p className='text-gray-500 mb-2'>by {post.author}</p>
                            <div className='mb-2' dangerouslySetInnerHTML={{ __html: post.content }} />
                            <div className='text-sm text-gray-600'>
                                Comments: {post.comments} | Views: {post.views}
                            </div>
                            <div className='text-sm text-gray-400'>
                                Date: {new Date(post.date).toLocaleDateString()}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No posts found.</p>
            )}
        </div>
    );
};

export default MyPosts;
