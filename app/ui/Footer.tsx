import Image from 'next/image';
import React from 'react';

const logoSrc = '/svg/logo.svg';

const Footer: React.FC = () => {
    return (
        <footer className='bg-white text-gray-600 px-6 sm:px-24 flex items-center justify-between w-full'>
            <hr />
            <div className='container mx-auto px-4 flex justify-between items-start'>
            <div className='relative flex-grow flex justify-center'>
                <div className='flex flex-col items-start'>
                    <div className='text-center flex justify-center items-center space-x-2'>
                        <Image
                            src={logoSrc}
                            alt='logo'
                            width={317}
                            height={138}
                        />
                    </div>
                    <div className='text-left text-sm'>
                            <p> Team i5 | 김가영 | 김유미 | 전보람 | 추호연 | 이다은 </p>
                    </div>
                    <div className='text-left text-sm'>
                        <p>
                            대구 윤성 컴퓨터 디자인 DX아카데미 : 빅데이터 활용 SW개발 전문가 양성 과정
                        </p>
                        <p>
                            전화 : 053-252-8889 | 팩스 : 053-252-8889
                        </p>
                        <p>COPYRIGHT © 맛있는이야기 ALL RIGHT RESERVED.</p>
                    </div>
                </div>
                </div>


                <div className='flex-grow flex items-center justify-center space-x-6 hidden xl:flex'>
                    <div style={{width:'450px'}}></div>
                </div>


                <div className='relative flex-grow flex justify-center'>
                <div>
                    <div className='flex justify-center mt-4 pt-11'>
                        <div className='space-x-4'>
                            <a href='#' className='inline-block'>
                                <Image
                                    src='/svg/icons8-facebook.svg'
                                    alt='Facebook'
                                    width={24}
                                    height={24}
                                />
                            </a>
                            <a href='#' className='inline-block'>
                                <Image
                                    src='/svg/icons8-instagram.svg'
                                    alt='Instagram'
                                    width={24}
                                    height={24}
                                />
                            </a>
                            <a href='#' className='inline-block'>
                                <Image
                                    src='/svg/icons8-twitter.svg'
                                    alt='Twitter'
                                    width={24}
                                    height={24}
                                />
                            </a>
                        </div>
                    </div>
                    <div className='text-center mt-4'>
                        <p>~ Delicious Story ~</p>
                        <div className='flex justify-center mt-2'>
                            <Image
                                src='/png/cs.png'
                                alt='commingsoon'
                                width={104}
                                height={104}
                            />
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;