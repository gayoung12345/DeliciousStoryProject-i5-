'use client';

import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebaseConfig';  // Firebase 설정 파일 경로에 맞게 수정하세요
import { useRouter } from 'next/navigation';  // useRouter 임포트

const Signup = () => {
    const [form, setForm] = useState({
        password: '',
        confirmPassword: '',
        name: '',
        email: '',
    });

    const [error, setError] = useState('');
    const router = useRouter();  // useRouter 훅 사용

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // 비밀번호 길이 확인
        if (form.password.length < 6) {
            setError("비밀번호는 최소 6자리 이상이어야 합니다.");
            return;
        }

        // 비밀번호 일치 확인
        if (form.password !== form.confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
            console.log("회원가입 성공:", userCredential);

            // 회원가입 성공 메시지 표시 후 리다이렉트
            alert("회원가입에 성공했습니다.");
            router.push('/');  // 메인페이지로 리다이렉트
        } catch (error) {
            console.error("회원가입 오류:", error);
            setError("회원가입에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen'>
            <div className='bg-white p-8 w-full max-w-screen-md'>
                <h1 className='text-2xl font-bold mb-6'>회원가입</h1>
                <hr className='h-px my-4 bg-gray-200 border-0 dark:bg-gray-700'></hr>
                {error && <p className='text-red-500 text-center'>{error}</p>}
                <form onSubmit={handleSubmit}>
                    {/* 이메일 입력 필드 */}
                    <div className='mb-4 flex items-center'>
                        <label
                            htmlFor='email'
                            className='block text-sm font-medium text-gray-700 w-1/5 text-right pr-4'
                        >
                            이메일
                        </label>
                        <input
                            type='email'
                            name='email'
                            id='email'
                            value={form.email}
                            onChange={handleChange}
                            className='mt-1 block flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm'
                        />
                    </div>
                    
                    {/* 비밀번호 입력 필드 */}
                    <div className='mb-4 flex items-center'>
                        <label
                            htmlFor='password'
                            className='block text-sm font-medium text-gray-700 w-1/5 text-right pr-4'
                        >
                            비밀번호
                        </label>
                        <input
                            type='password'
                            name='password'
                            id='password'
                            value={form.password}
                            onChange={handleChange}
                            className='mt-1 block flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm'
                        />
                    </div>

                    {/* 비밀번호 확인 입력 필드 */}
                    <div className='mb-4 flex items-center'>
                        <label
                            htmlFor='confirmPassword'
                            className='block text-sm font-medium text-gray-700 w-1/5 text-right pr-4'
                        >
                            비밀번호 확인
                        </label>
                        <input
                            type='password'
                            name='confirmPassword'
                            id='confirmPassword'
                            value={form.confirmPassword}
                            onChange={handleChange}
                            className='mt-1 block flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm'
                        />
                    </div>

                    {/* 이름 입력 필드 */}
                    <div className='mb-4 flex items-center'>
                        <label
                            htmlFor='name'
                            className='block text-sm font-medium text-gray-700 w-1/5 text-right pr-4'
                        >
                            이름
                        </label>
                        <input
                            type='text'
                            name='name'
                            id='name'
                            value={form.name}
                            onChange={handleChange}
                            className='mt-1 block flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm'
                        />
                    </div>

                    <hr className='h-px m-4 bg-gray-200 border-0 dark:bg-gray-700'></hr>

                    <div className='flex justify-center'>
                        <button
                            type='button'
                            className='px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
                        >
                            뒤로가기
                        </button>
                        <button
                            type='submit'
                            className='ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
                        >
                            회원가입
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
