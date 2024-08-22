// components/LoadingScreen.tsx
import React from 'react';

const LoadingScreen: React.FC = () => {
    return (
        <div className='fixed inset-0 bg-white flex items-center justify-center z-50'>
            <div className='flex items-center'>
                <svg
                    className='w-8 h-8 mr-3 text-gray-600 animate-spin'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M4 6h16M4 12h16m-7 6h7'
                    />
                </svg>
                <span className='text-gray-600'>Loading...</span>
            </div>
        </div>
    );
};

export default LoadingScreen;
