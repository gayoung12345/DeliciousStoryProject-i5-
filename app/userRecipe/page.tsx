'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { useRouter } from 'next/navigation';
import { EditIcon, Icon } from '@/components/ui/icon';
import { useAuth } from '../context/AuthContext';

interface Recipe {
    id: string;
    title: string;
    images?: {
        'main-image'?: string;
    };
    'main-image'?: string; // testRecipe의 필드
}

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

    return (
        <main className='relative max-w-6xl mx-auto p-4'>
            <h1
                className='text-2xl font-bold mb-6'
                style={{
                    textAlign: 'center',
                    marginBottom: '16px',
                }}
            >
                레시피 갤러리
            </h1>
            <hr className='h-px my-4 bg-gray-300 border-0 dark:bg-gray-700'></hr>
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
                            e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        <div style={{ position: 'relative' }}>
                            <img
                                src={
                                    recipe.images?.['main-image'] ||
                                    recipe['main-image']
                                } // userRecipe와 testRecipe의 구조에 맞게 처리
                                alt={recipe.title}
                                style={{
                                    width: '100%',
                                    height: '200px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                }}
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
                                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                    color: 'white',
                                    opacity: 0,
                                    transition: 'opacity 0.3s',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                }}
                                onClick={() => handleRecipeClick(recipe.id)}
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

            {/* 플로팅 액션 버튼 */}
            <div className='fixed right-8 bottom-80 md:right-12 md:bottom-80 z-10'>
                <button
                    onClick={handleWriteRecipeClick}
                    className='w-16 h-16 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center'
                    aria-label='레시피 작성'
                >
                    <span className='text-sm font-semibold text-center'>
                        <Icon
                            as={EditIcon}
                            size='xl'
                        />
                    </span>
                </button>
            </div>
        </main>
    );
};

export default UserRecipe;
