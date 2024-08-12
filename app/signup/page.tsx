'use client';

import TextEditor from '@/components/text-editor/text-editor';
import React, { useState } from 'react';

const Signup = () => {
    const [form, setForm] = useState({
        id: '',
        password: '',
        confirmPassword: '',
        name: '',
        email: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // form validation and submission logic here
    };

    return (
        <div className='flex items-center justify-center min-h-screen'>
            <div className='bg-white p-8 w-full max-w-screen-md'>
                <h1 className='text-2xl font-bold mb-6'>회원가입</h1>
                <hr className='h-px my-4 bg-gray-200 border-0 dark:bg-gray-700'></hr>
                <form onSubmit={handleSubmit}>
                    <div className='mb-4 flex items-center'>
                        <label
                            htmlFor='id'
                            className='block text-sm font-medium text-gray-700 w-1/5 text-right pr-4'
                        >
                            아이디
                        </label>
                        <div className='flex w-4/5'>
                            <input
                                type='text'
                                name='id'
                                id='id'
                                value={form.id}
                                onChange={handleChange}
                                className='mt-1 block flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm'
                            />
                            <button
                                type='button'
                                className='ml-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 flex w-48 justify-center'
                            >
                                아이디 중복체크
                            </button>
                        </div>
                    </div>

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
