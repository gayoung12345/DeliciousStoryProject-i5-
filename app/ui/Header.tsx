'use client';

import { useState } from 'react';
import Image from 'next/image';

const logoSrc = '/svg/logo.svg';

const Header: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className='bg-white text-black px-6 sm:px-24 flex items-center justify-between max-w-screen-xl mx-auto'>
            <div className='flex-shrink-0'>
                <a href='/'>
                    <Image
                        src={logoSrc}
                        alt='logo'
                        width={317}
                        height={138}
                    />
                </a>
            </div>
            <div className='relative flex-grow max-w-lg mx-6 sm:mx-12'>
                <input
                    type='text'
                    className='bg-white-700 text-black p-4 text-lg rounded-lg focus:outline-none w-full'
                    placeholder='Search...'
                />
                <button className='absolute right-0 top-0 mt-2 mr-2 p-2'>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        className='w-8 h-8'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M21 21l-4.35-4.35m2.1-5.35a7 7 0 11-14 0 7 7 0 0114 0z'
                        />
                    </svg>
                </button>
            </div>
            <div className='flex items-center space-x-4 hidden xl:flex'>
                <a
                    href='/'
                    className='hover:text-gray-400'
                >
                    Home
                </a>
                <a
                    href='/siteRecipe'
                    className='hover:text-gray-400'
                >
                    siteRecipe
                </a>
                <a
                    href='/userRecipe'
                    className='hover:text-gray-400'
                >
                    userRecipe
                </a>
                <a
                    href='/freeBoard'
                    className='hover:text-gray-400'
                >
                    freeBoard
                </a>
                <a
                    href='/myPage'
                    className='hover:text-gray-400'
                >
                    myPage
                </a>
                <a
                    href='/login'
                    className='hover:text-gray-400'
                >
                    login
                </a>
            </div>
            <div className='xl:hidden'>
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className='focus:outline-none'
                >
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        className='w-6 h-6'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M4 6h16M4 12h16m-7 6h7'
                        />
                    </svg>
                </button>
            </div>
            {menuOpen && (
                <div className='absolute top-16 right-0 bg-white shadow-md rounded-lg p-4 lg:hidden'>
                    <a
                        href='/'
                        className='block hover:text-gray-400'
                    >
                        Home
                    </a>
                    <a
                        href='/siteRecipe'
                        className='block hover:text-gray-400'
                    >
                        siteRecipe
                    </a>
                    <a
                        href='/userRecipe'
                        className='block hover:text-gray-400'
                    >
                        userRecipe
                    </a>
                    <a
                        href='/freeBoard'
                        className='block hover:text-gray-400'
                    >
                        freeBoard
                    </a>
                    <a
                        href='/myPage'
                        className='block hover:text-gray-400'
                    >
                        myPage
                    </a>
                    <a
                        href='/login'
                        className='block hover:text-gray-400'
                    >
                        login
                    </a>
                </div>
            )}
        </nav>
    );
};

export default Header;
