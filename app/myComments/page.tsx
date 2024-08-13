'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebaseConfig';

interface Comment {
    id: string;
    author: string;
    content: string;
    date: string;
    postId?: string; // Optional, depending on the type of comment
    recipeId?: string; // Optional, depending on the type of comment
}

const MyComments = () => {
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComments = async () => {
            if (!user) return;

            try {
                const q = query(
                    collection(db, 'comments'),
                    where('author', '==', user.email) // Use user.email or user.uid based on your schema
                );
                const querySnapshot = await getDocs(q);
                const fetchedComments: Comment[] = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...(doc.data() as Omit<Comment, 'id'>)
                }));

                setComments(fetchedComments);
                setSearchResults(fetchedComments); // Initialize search results with all comments
            } catch (error) {
                console.error('Error fetching comments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [user]);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        if (term) {
            const filteredComments = comments.filter(
                (comment) =>
                    comment.content.toLowerCase().includes(term.toLowerCase())
            );
            setSearchResults(filteredComments);
        } else {
            setSearchResults(comments);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='p-4'>
            <h1 className='text-2xl font-bold mb-4'>My Comments</h1>
            <input
                type='text'
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder='Search in my comments...'
                className='bg-gray-200 p-2 rounded-lg mb-4 w-full'
            />
            {searchResults.length > 0 ? (
                <ul>
                    {searchResults.map(comment => (
                        <li key={comment.id} className='border-b border-gray-300 p-4 mb-4'>
                            <p className='text-gray-500 mb-2'>by {comment.author}</p>
                            <div className='mb-2'>{comment.content}</div>
                            <div className='text-sm text-gray-400'>
                                Date: {new Date(comment.date).toLocaleDateString()}
                            </div>
                            {comment.postId && (
                                <div className='text-sm text-gray-600'>
                                    Post ID: {comment.postId}
                                </div>
                            )}
                            {comment.recipeId && (
                                <div className='text-sm text-gray-600'>
                                    Recipe ID: {comment.recipeId}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No comments found.</p>
            )}
        </div>
    );
};

export default MyComments;
