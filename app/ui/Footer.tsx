import Image from 'next/image';
import React from 'react';
const logoSrc = '/svg/logo.svg';
const Footer: React.FC = () => {
    return (
        <footer className='bg-white-100 text-gray-600 py-6'>
            <hr></hr>
            <div className='container mx-auto px-4 flex justify-between items-start'>
                <div>
                    <div className='text-center mb-4 flex flex-wrap justify-center items-center space-x-2'>
                        <Image
                            src={logoSrc}
                            alt='logo'
                            width={317}
                            height={138}
                        />
                        <a
                            href='#'
                            className='hover:underline'
                        >
                            회사소개
                        </a>
                        <span>&middot;</span>
                        <a
                            href='#'
                            className='hover:underline'
                        >
                            광고 및 마케팅 제휴 문의
                        </a>
                        <span>&middot;</span>
                        <a
                            href='#'
                            className='hover:underline'
                        >
                            이용약관
                        </a>
                        <span>&middot;</span>
                        <a
                            href='#'
                            className='hover:underline'
                        >
                            개인정보취급방침
                        </a>
                        <span>&middot;</span>
                        <a
                            href='#'
                            className='hover:underline'
                        >
                            고객센터
                        </a>
                    </div>

                    <div className='text-left text-sm'>
                        <p>
                            회사명 : 주식회사 맛있는이야기 (대구 중구 국채보상로
                            582) 대표자 : 대표자
                        </p>
                        <p>
                            사업자번호 : 000-00-00000 [사업자정보확인]
                            통신판매업신고 : 제2024-국채보상로-0000 전화 :
                            053-252-8889 팩스 : 053-252-8889
                        </p>
                        <p>COPYRIGHT © 맛있는이야기 ALL RIGHT RESERVED.</p>
                    </div>
                </div>
                <div>
                    <div className='flex justify-center mt-4 pt-11'>
                        <div className='space-x-4'>
                            <a
                                href='#'
                                className='inline-block'
                            >
                                <Image
                                    src='/svg/icons8-facebook.svg'
                                    alt='Facebook'
                                    width={24}
                                    height={24}
                                />
                            </a>
                            <a
                                href='#'
                                className='inline-block'
                            >
                                <Image
                                    src='/svg/icons8-instagram.svg'
                                    alt='Instagram'
                                    width={24}
                                    height={24}
                                />
                            </a>
                            <a
                                href='#'
                                className='inline-block'
                            >
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
                        <p>
                            모바일 사이트에서도 곧 이밥차를 만나보실 수
                            있습니다.
                        </p>
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
        </footer>
    );
};

export default Footer;
