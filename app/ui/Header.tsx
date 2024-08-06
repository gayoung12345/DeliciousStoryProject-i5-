import Image from 'next/image';
import React from 'react';

const logoSrc = '/svg/logo.svg';

const Header: React.FC = () => {
    return (
        <nav className="bg-white text-black px-24 flex items-center justify-between">
            <div>
                <Image src={logoSrc} alt="logo" width={317} height={138} />
            </div>
            <div className="relative">
                <input
                    type="text"
                    className="bg-white-700 text-black p-2 rounded-lg focus:outline-none"
                    placeholder="Search..."
                />
                <button className="absolute right-0 top-0 mt-2 mr-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-4 h-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-4.35-4.35m2.1-5.35a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </button>
            </div>
            <div className="flex items-center space-x-4">
                <div className="space-x-4 hidden md:block">
                    <a href="/" className="hover:text-gray-400">
                        Home
                    </a>
                    <a href="/login" className="hover:text-gray-400">
                        login
                    </a>
                    <a href="/myPage" className="hover:text-gray-400">
                        myPage
                    </a>
                    <a href="/event" className="hover:text-gray-400">
                        event
                    </a>
                    <a href="/siteRecipe" className="hover:text-gray-400">
                        siteRecipe
                    </a>
                    <a href="/userRecipe" className="hover:text-gray-400">
                        userRecipe
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Header;
