'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import xml2js from 'xml2js';
import Link from 'next/link';

const logoSrc = '/svg/logo.svg';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await fetch('/data/siterecipe.xml');
                const xmlData = await response.text();
                const parser = new xml2js.Parser();
                const result = await parser.parseStringPromise(xmlData);

                const recipes = result.COOKRCP01.row.map((rec: any) => ({
                    id: rec.RCP_SEQ[0],
                    name: rec.RCP_NM[0],
                    image: rec.ATT_FILE_NO_MAIN[0] || '/svg/logo.svg',
                    ingredients: rec.RCP_PARTS_DTLS[0],
                    manual: [
                        {
                            image: rec.MANUAL_IMG01[0],
                            text: rec.MANUAL01[0],
                        },
                        {
                            image: rec.MANUAL_IMG02[0],
                            text: rec.MANUAL02[0],
                        },
                        {
                            image: rec.MANUAL_IMG03[0],
                            text: rec.MANUAL03[0],
                        },
                    ].filter((item) => item.image && item.text),
                    calories: rec.INFO_ENG[0],
                    protein: rec.INFO_PRO[0],
                    fat: rec.INFO_FAT[0],
                    sodium: rec.INFO_NA[0],
                }));

                setRecipes(recipes);
            } catch (error) {
                console.error('Error parsing XML:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        if (term) {
            const filteredRecipes = Array.isArray(recipes)
                ? recipes.filter(
                      (recipe: any) =>
                          recipe.name
                              ?.toLowerCase()
                              .includes(term.toLowerCase()) ||
                          recipe.ingredients
                              ?.toLowerCase()
                              .includes(term.toLowerCase())
                  )
                : [];
            setSearchResults(filteredRecipes);
        } else {
            setSearchResults([]);
        }
    };

    const handleMenuClick = (href: string) => {
        setMenuOpen(false);
        window.location.href = href;
    };

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    const speakText = (text: string) => {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ko';
        window.speechSynthesis.speak(utterance);
    };

    return (
        <nav className='bg-white text-black px-6 sm:px-24 flex items-center justify-between w-full'>
            <div className='flex-shrink-0'>
                <Link href='/'>
                    <Image
                        src={logoSrc}
                        alt='logo'
                        width={220}
                        height={140}
                    />
                </Link>
            </div>
            <div style={{ width: '180px' }}></div>
            <div className='flex-grow flex items-center justify-center space-x-6 ml-12 hidden xl:flex'>
                <button
                    onClick={() => handleMenuClick('/')}
                    onMouseEnter={() => speakText('홈')}
                    className='button hover:text-orange-400'
                    style={{ fontSize: '18px' }}
                >
                    홈
                </button>
                <button
                    onClick={() => handleMenuClick('/siteRecipe')}
                    onMouseEnter={() => speakText('공식레시피')}
                    className='button hover:text-orange-400'
                    style={{ fontSize: '18px' }}
                >
                    공식레시피
                </button>
                <button
                    onClick={() => handleMenuClick('/userRecipe')}
                    onMouseEnter={() => speakText('모두의레시피')}
                    className='button hover:text-orange-400'
                    style={{ fontSize: '18px' }}
                >
                    모두의레시피
                </button>
                <button
                    onClick={() => handleMenuClick('/freeBoard')}
                    onMouseEnter={() => speakText('자유게시판')}
                    className='button hover:text-orange-400'
                    style={{ fontSize: '18px' }}
                >
                    자유게시판
                </button>
                {user ? (
                    <>
                        <button
                            onClick={() => handleMenuClick('/myPage')}
                            onMouseEnter={() => speakText('마이페이지')}
                            className='button hover:text-orange-400'
                            style={{ fontSize: '18px' }}
                        >
                            마이페이지
                        </button>
                        <button
                            onClick={() => handleMenuClick('/logout')}
                            onMouseEnter={() => speakText('로그아웃')}
                            className='button hover:text-orange-400'
                            style={{ fontSize: '18px' }}
                        >
                            로그아웃
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => handleMenuClick('/login')}
                            onMouseEnter={() => speakText('로그인')}
                            className='button hover:text-orange-400'
                            style={{ fontSize: '18px' }}
                        >
                            로그인
                        </button>
                        <button
                            onClick={() => handleMenuClick('/signup')}
                            onMouseEnter={() => speakText('회원가입')}
                            className='button hover:text-orange-400'
                            style={{ fontSize: '18px' }}
                        >
                            회원가입
                        </button>
                    </>
                )}
            </div>
            <div className='relative flex-grow flex justify-center'>
                <div className='relative'>
                    <input
                        type='text'
                        className='bg-transparent border border-gray-300 text-black p-2 text-lg focus:outline-none focus:border-gray-300 rounded-3xl pr-10'
                        placeholder=' 오늘의 메뉴'
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        style={{
                            borderRadius: '32px',
                            borderWidth: '1px',
                            borderColor: '#D1D5DB',
                            fontSize: '16px',
                            width: '100%',
                            maxWidth: '400px',
                        }}
                    />
                    <button
                        className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                        onClick={() => handleSearch(searchTerm)}
                        style={{ cursor: 'pointer' }}
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
                                d='M21 21l-4.35-4.35m2.1-5.35a7 7 0 11-14 0 7 7 0 0114 0z'
                            />
                        </svg>
                    </button>
                </div>
                {searchResults.length > 0 && (
                    <div className='dropdown-menu absolute bg-white shadow-lg rounded-lg p-4 mt-4 w-full max-w-lg max-h-60 overflow-y-auto'>
                        <ul>
                            {searchResults.map((recipe: any) => (
                                <li
                                    key={recipe.id}
                                    className='p-2 border-b last:border-b-0'
                                >
                                    <button
                                        onClick={() =>
                                            handleMenuClick(
                                                `/galleryPost?id=${recipe.id}`
                                            )
                                        }
                                        className='hover:text-blue-500 w-full text-left'
                                    >
                                        {recipe.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <div className='xl:hidden'>
                <button
                    onClick={toggleMenu}
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
                <div className='dropdown-menu absolute top-16 right-0 bg-white shadow-md rounded-lg p-4 lg:hidden z-100'>
                    <button
                        onClick={() => handleMenuClick('/')}
                        className='block hover:text-orange-400'
                    >
                        홈
                    </button>
                    <button
                        onClick={() => handleMenuClick('/siteRecipe')}
                        className='block hover:text-orange-400'
                    >
                        공식레시피
                    </button>
                    <button
                        onClick={() => handleMenuClick('/userRecipe')}
                        className='block hover:text-orange-400'
                    >
                        모두의레시피
                    </button>
                    <button
                        onClick={() => handleMenuClick('/freeBoard')}
                        className='block hover:text-orange-400'
                    >
                        자유게시판
                    </button>
                    {user ? (
                        <>
                            <button
                                onClick={() => handleMenuClick('/myPage')}
                                className='block hover:text-orange-400'
                            >
                                마이페이지
                            </button>
                            <button
                                onClick={() => handleMenuClick('/logout')}
                                className='block hover:text-orange-400'
                            >
                                로그아웃
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => handleMenuClick('/login')}
                                className='block hover:text-orange-400'
                            >
                                로그인
                            </button>
                            <button
                                onClick={() => handleMenuClick('/signup')}
                                className='block hover:text-orange-400'
                            >
                                회원가입
                            </button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Header;
