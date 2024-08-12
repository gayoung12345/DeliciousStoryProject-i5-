'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { Icon } from '@/components/ui/icon';
import { BiCamera } from 'react-icons/bi';
import Link from 'next/link';
import xml2js from 'xml2js'; // XML 데이터를 파싱하기 위한 라이브러리

const logoSrc = '/svg/logo.svg';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [recipes, setRecipes] = useState([]); // 전체 레시피 데이터를 저장할 상태 변수
    const [loading, setLoading] = useState(true); // 데이터 로딩 상태를 관리하는 변수

    // 레시피 데이터를 가져오는 useEffect
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await fetch('/data/siterecipe.xml'); // XML 데이터를 가져옴
                const xmlData = await response.text(); // 텍스트 형태로 XML 데이터를 파싱
                const parser = new xml2js.Parser(); // XML 파서를 생성
                const result = await parser.parseStringPromise(xmlData); // XML 데이터를 파싱하여 JavaScript 객체로 변환

                const recipes = result.COOKRCP01.row.map((rec) => ({
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

                setRecipes(recipes); // 전체 레시피 데이터를 상태 변수에 저장
            } catch (error) {
                console.error('Error parsing XML:', error); // 에러 발생 시 콘솔에 출력
            } finally {
                setLoading(false); // 데이터 로딩이 끝난 후 상태 업데이트
            }
        };

        fetchRecipes(); // 레시피 데이터를 가져오는 함수 호출
    }, []); // 빈 배열을 의존성으로 하여 컴포넌트 마운트 시 한 번만 실행

    const handleSearch = (term) => {
        setSearchTerm(term);
        if (term) {
            const filteredRecipes = Array.isArray(recipes)
                ? recipes.filter(
                      (recipe) =>
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

    const handleMenuClick = (href) => {
        setMenuOpen(false); // 메뉴 클릭 시 드롭다운 메뉴 닫기
        window.location.href = href; // 페이지 이동 및 새로고침
    };

    return (
        <nav className='bg-white text-black px-6 sm:px-24 flex items-center justify-between w-full'>
            <div className='flex-shrink-0'>
                <Link href='/'>
                    <Image
                        src={logoSrc}
                        alt='logo'
                        width={317}
                        height={138}
                    />
                </Link>
            </div>
            <div className='relative flex-grow max-w-lg mx-6 sm:mx-12'>
                <input
                    type='text'
                    className='bg-gray-200 text-black p-4 text-lg rounded-lg focus:outline-none w-full'
                    placeholder='오늘의메뉴'
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                />
                <button
                    className='absolute right-0 top-0 mt-2 mr-2 p-2'
                    onClick={() => handleSearch(searchTerm)}
                >
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
                {searchResults.length > 0 && (
                    <div className='dropdown-menu absolute bg-white shadow-lg rounded-lg p-4 mt-4 w-full max-w-lg max-h-60 overflow-y-auto'>
                        <ul>
                            {searchResults.map((recipe) => (
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
            <div className='flex items-center space-x-4 hidden xl:flex'>
                <button
                    onClick={() => handleMenuClick('/')}
                    className='hover:text-gray-400'
                >
                    Home
                </button>
                <button
                    onClick={() => handleMenuClick('/siteRecipe')}
                    className='hover:text-gray-400'
                >
                    siteRecipe
                </button>
                <button
                    onClick={() => handleMenuClick('/userRecipe')}
                    className='hover:text-gray-400'
                >
                    userRecipe
                </button>
                <button
                    onClick={() => handleMenuClick('/freeBoard')}
                    className='hover:text-gray-400'
                >
                    freeBoard
                </button>
                {user ? (
                    <>
                        <button
                            onClick={() => handleMenuClick('/myPage')}
                            className='hover:text-gray-400'
                        >
                            myPage
                        </button>
                        <button
                            onClick={() => handleMenuClick('/logout')}
                            className='hover:text-gray-400'
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => handleMenuClick('/login')}
                            className='hover:text-gray-400'
                        >
                            Login
                        </button>
                        <button
                            onClick={() => handleMenuClick('/signup')}
                            className='hover:text-gray-400'
                        >
                            Sign Up
                        </button>
                    </>
                )}
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
                <div className='dropdown-menu absolute top-16 right-0 bg-white shadow-md rounded-lg p-4 lg:hidden z-50'>
                    <button
                        onClick={() => handleMenuClick('/')}
                        className='block hover:text-gray-400'
                    >
                        Home
                    </button>
                    <button
                        onClick={() => handleMenuClick('/siteRecipe')}
                        className='block hover:text-gray-400'
                    >
                        siteRecipe
                    </button>
                    <button
                        onClick={() => handleMenuClick('/userRecipe')}
                        className='block hover:text-gray-400'
                    >
                        userRecipe
                    </button>
                    <button
                        onClick={() => handleMenuClick('/freeBoard')}
                        className='block hover:text-gray-400'
                    >
                        freeBoard
                    </button>
                    {user ? (
                        <>
                            <button
                                onClick={() => handleMenuClick('/myPage')}
                                className='block hover:text-gray-400'
                            >
                                myPage
                            </button>
                            <button
                                onClick={() => handleMenuClick('/logout')}
                                className='block hover:text-gray-400'
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => handleMenuClick('/signup')}
                            className='block hover:text-gray-400'
                        >
                            Sign Up
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Header;
