'use client';

import React, { CSSProperties, HTMLProps, useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { useRouter } from 'next/navigation';
import { EditIcon, Icon } from '@/components/ui/icon';
import { useAuth } from '../context/AuthContext';
import Image from 'next/image'; // 'react-native'의 Image 대신 'next/image'를 사용
import { Box } from '@/components/ui/box/index.web';
import { FaArrowUp } from 'react-icons/fa';

interface Recipe {
    id: string;
    title: string;
    images?: {
        'main-image'?: string;
    };
    'main-image'?: string; // testRecipe의 필드
}

// 임시 Grid 컴포넌트 - 그리드 레이아웃을 제공
interface GridProps extends React.HTMLProps<HTMLDivElement> {
    children: React.ReactNode; // children의 타입을 React.ReactNode로 명시
}

const Grid: React.FC<GridProps> = ({ children, style, ...props }) => (
    <div
        style={style}
        {...props}
    >
        {children}
    </div>
);

const UserRecipe = () => {
    const { user } = useAuth(); // 현재 로그인된 사용자의 정보를 가져옴
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchRecipes = async () => {
            const userRecipeSnapshot = await getDocs(
                collection(db, 'userRecipe')
            );
            const testRecipeSnapshot = await getDocs(
                collection(db, 'testRecipe')
            );
            const fetchedRecipes: Recipe[] = [];

            // userRecipe 컬렉션의 데이터 처리
            userRecipeSnapshot.forEach((doc) => {
                fetchedRecipes.push({ id: doc.id, ...doc.data() } as Recipe);
            });

            // testRecipe 컬렉션의 데이터 처리
            testRecipeSnapshot.forEach((doc) => {
                const data = doc.data();
                fetchedRecipes.push({
                    id: doc.id,
                    title: data.title,
                    'main-image': data['main-image'],
                } as Recipe);
            });

            setRecipes(fetchedRecipes);
        };

        fetchRecipes();
    }, []);

    const handleRecipeClick = (id: string) => {
        router.push(`/userRecipe/${id}`);
    };

    const handleWriteRecipeClick = () => {
        if (user) {
            router.push('/recipeWrite');
        } else {
            alert('로그인 해주세요.');
            router.push('/login');
        }
    };
    // 스크롤을 페이지 상단으로 이동시키는 함수
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // 부드러운 스크롤 효과
        });
    };

    // '글 작성하기' 버튼을 클릭하면 레시피 작성 페이지로 이동
    const handleWriteClick = () => {
        router.push('/recipeWrite');
    };

    return (
        <main>
            {/* 페이지 상단 제목 시작 */}
            <Box
                style={{
                    position: 'relative',
                    width: '100%', // 가로를 화면에 꽉 차게 변경
                    height: '30vh', // 화면의 30% 높이
                    overflow: 'hidden',
                    marginBottom: '30px',
                }}
            >
                <Image
                    src='/png/userRecipe.png' // 이미지 파일 경로
                    layout='fill' // 부모 요소에 맞게 이미지 크기 조절
                    objectFit='cover' // 이미지 비율 유지 및 컨테이너에 맞게 자르기
                    alt={'자유게시판'}
                    style={{}}
                />
                <Box
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'white',
                        fontSize: '42px',
                        fontWeight: '600',
                        textShadow: '3px 3px 6px rgba(0, 0, 0, 0.8)', // 강한 명암 효과 추가
                        zIndex: 1,
                        textAlign: 'center', // 텍스트 중앙 정렬
                    }}
                >
                    레시피 갤러리
                </Box>
            </Box>{' '}
            {/* 페이지 상단 제목 끝 */}
            <Grid>
                {/* 글 작성하기 버튼 시작 */}
                {
                    <button
                        type='button'
                        className='bg-orange-400 text-white hover:bg-orange-600 transition-colors flex items-center justify-center border-2 border-black'
                        onClick={handleWriteClick}
                        style={{
                            padding: '0.5rem',
                            borderRadius: '4px',
                            border: '1px solid #ddd',
                            width: '150px', // 고정된 너비
                            marginLeft: '1330px',
                        }}
                    >
                        레시피 등록하기
                    </button>
                }
                {/* 글 작성하기 버튼 끝 */}
                <div className='relative max-w-6xl mx-auto p-4'>
                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
                        {recipes.map((recipe) => (
                            <div
                                key={recipe.id}
                                style={{
                                    position: 'relative',
                                    padding: '16px',
                                    backgroundColor: 'white',
                                    cursor: 'pointer',
                                    transition: 'transform 0.3s',
                                    borderRadius: '8px',
                                }}
                                onClick={() => handleRecipeClick(recipe.id)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform =
                                        'scale(1.05)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform =
                                        'scale(1)';
                                }}
                            >
                                <div style={{ position: 'relative' }}>
                                    <Image
                                        src={
                                            (recipe.images?.[
                                                'main-image'
                                            ] as string) ||
                                            (recipe['main-image'] as string)
                                        } // userRecipe와 testRecipe의 구조에 맞게 처리
                                        alt={recipe.title}
                                        style={{
                                            width: '100%',
                                            height: '200px',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                        }}
                                        width={400}
                                        height={200}
                                    />
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor:
                                                'rgba(0, 0, 0, 0.6)',
                                            color: 'white',
                                            opacity: 0,
                                            transition: 'opacity 0.3s',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() =>
                                            handleRecipeClick(recipe.id)
                                        }
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.opacity = '1';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.opacity = '0';
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: '18px',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            상세 보기
                                        </span>
                                    </div>
                                </div>
                                <h2
                                    style={{
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        marginTop: '8px',
                                        textAlign: 'center',
                                    }}
                                >
                                    {recipe.title}
                                </h2>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='fixed right-8 bottom-80 md:right-12 md:bottom-80 z-10'>
                    {/* 페이지 상단으로 이동하는 버튼 */}
                    <button
                        onClick={scrollToTop}
                        style={{
                            color: '#ffffff',
                            backgroundColor: '#000000',
                            position: 'fixed',
                            bottom: 50,
                            right: 50,
                            width: 80,
                            height: 80,
                            borderRadius: 40,
                            zIndex: 10,
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                        }}
                    >
                        <FaArrowUp
                            size={24}
                            color='#ffffff'
                        />
                    </button>
                </div>
            </Grid>
        </main>
    );
};

export default UserRecipe;
