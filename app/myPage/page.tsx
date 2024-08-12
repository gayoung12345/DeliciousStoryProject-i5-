'use client';

import React, { useState, useEffect } from 'react';
import { auth } from '../../lib/firebaseConfig'; // Firebase 설정 파일 경로에 맞게 수정하세요
import { onAuthStateChanged, updatePassword } from 'firebase/auth';
import Link from 'next/link'; // 페이지 이동을 위한 Link 임포트

function MyPage() {
    const [formData, setFormData] = useState({
        username: '', // 이메일이 들어갈 부분
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setFormData((prevData) => ({
                    ...prevData,
                    username: user.email || '',
                }));
                setLoading(false);
            } else {
                setError('사용자가 로그인되어 있지 않습니다.');
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const user = auth.currentUser;
            if (user) {
                await updatePassword(user, formData.password);
                alert('비밀번호가 성공적으로 변경되었습니다.');
                window.location.reload();
            } else {
                setError('사용자가 로그인되어 있지 않습니다.');
            }
        } catch (error) {
            setError('비밀번호 변경 중 오류가 발생했습니다: ' + error.message);
        }
    };

    if (loading) {
        return <div>로딩 중...</div>;
    }

    return (
        <main className='flex flex-col items-center justify-center h-screen p-4'>
            <div className='w-full max-w-2xl flex flex-col space-y-4'>
                {/* 상단 버튼들 추가 */}
                <div className='flex justify-center space-x-4 mb-6'>
                    <Link href='/myPosts'>
                        <span className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer'>
                            내가 작성한 글
                        </span>
                    </Link>
                    <Link href='/myComments'>
                        <span className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer'>
                            내가 작성한 댓글
                        </span>
                    </Link>
                    <Link href='/myLikes'>
                        <span className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer'>
                            내가 좋아요 누른 게시물
                        </span>
                    </Link>
                </div>
                <form
                    onSubmit={handleSubmit}
                    className='w-full flex flex-col space-y-4'
                >
                    <p className='text-2xl font-semibold mb-32 text-center'>
                        회원정보 확인/수정하기
                    </p>
                    {error && (
                        <p className='text-red-500 text-center'>{error}</p>
                    )}
                    <div className='flex items-center space-x-4'>
                        <label
                            htmlFor='username'
                            className='w-1/3 text-gray-700 text-center'
                        >
                            이메일
                        </label>
                        <input
                            type='text'
                            id='username'
                            name='username'
                            value={formData.username}
                            readOnly
                            className='border border-gray-300 p-2 rounded w-2/3 bg-gray-100 cursor-not-allowed'
                        />
                    </div>
                    <hr />
                    <div className='flex items-center space-x-4'>
                        <label
                            htmlFor='password'
                            className='w-1/3 text-gray-700 text-center'
                        >
                            새 비밀번호
                        </label>
                        <input
                            type='password'
                            id='password'
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
                            className='border border-gray-300 p-2 rounded w-2/3'
                        />
                    </div>
                    <hr />
                    <div className='flex items-center space-x-4'>
                        <label
                            htmlFor='confirmPassword'
                            className='w-1/3 text-gray-700 text-center'
                        >
                            비밀번호 확인
                        </label>
                        <input
                            type='password'
                            id='confirmPassword'
                            name='confirmPassword'
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className='border border-gray-300 p-2 rounded w-2/3'
                        />
                    </div>
                    <hr />
                    <button
                        type='submit'
                        className='bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-500 w-1/3 mx-auto'
                    >
                        수정하기
                    </button>
                </form>
            </div>
        </main>
    );
}

export default MyPage;
