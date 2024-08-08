'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const UserRecipeWrite = () => {
    const [author, setAuthor] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState<string | ArrayBuffer | null>(null); // 이미지 상태 추가
    const router = useRouter();

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newPost = {
            id: Date.now(),
            title,
            author: author || '익명',
            date: new Date().toISOString().split('T')[0],
            comments: [],
            views: 0,
            content,
            password,
            image, // 이미지 데이터 추가
        };

        const existingPosts = JSON.parse(localStorage.getItem('posts')) || [];
        const updatedPosts = [newPost, ...existingPosts];

        localStorage.setItem('posts', JSON.stringify(updatedPosts));

        alert('글이 작성되었습니다!');
        router.push('/userRecipe');
    };

    const handleGoBack = () => {
        router.push('/userRecipe');
    };

    return (
        <main style={{ padding: '20px' }}>
            <h1 style={{ textAlign: 'center', fontSize: '36px' }}>
                유저 레시피 작성하기
            </h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                    <label
                        htmlFor='title'
                        style={{
                            display: 'block',
                            marginBottom: '10px',
                            textAlign: 'left',
                            marginLeft: '20%',
                        }}
                    >
                        제목
                    </label>
                    <input
                        id='title'
                        type='text'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{
                            width: '60%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            display: 'block',
                            margin: '0 auto',
                        }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label
                        htmlFor='content'
                        style={{
                            display: 'block',
                            marginBottom: '10px',
                            textAlign: 'left',
                            marginLeft: '20%',
                        }}
                    >
                        내용
                    </label>
                    <textarea
                        id='content'
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        style={{
                            width: '60%',
                            padding: '10px',
                            height: '200px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            display: 'block',
                            margin: '0 auto',
                        }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label
                        htmlFor='image'
                        style={{
                            display: 'block',
                            marginBottom: '10px',
                            textAlign: 'left',
                            marginLeft: '20%',
                        }}
                    >
                        이미지 첨부
                    </label>
                    <input
                        id='image'
                        type='file'
                        accept='image/*'
                        onChange={handleImageChange}
                        style={{ display: 'block', margin: '0 auto' }}
                    />
                    {image && (
                        <img
                            src={typeof image === 'string' ? image : ''}
                            alt='미리보기'
                            style={{
                                display: 'block',
                                marginTop: '10px',
                                maxWidth: '100px',
                                maxHeight: '100px',
                                margin: '0 auto',
                            }}
                        />
                    )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                        type='button'
                        onClick={handleGoBack}
                        className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'
                        style={{ marginRight: '10px' }}
                    >
                        뒤로가기
                    </button>
                    <button
                        type='submit'
                        className='bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600'
                    >
                        작성하기
                    </button>
                </div>
            </form>
        </main>
    );
};

export default UserRecipeWrite;
