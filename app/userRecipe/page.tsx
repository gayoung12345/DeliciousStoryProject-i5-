'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { useRouter } from 'next/navigation';
import { EditIcon, Icon } from '@/components/ui/icon';

interface Recipe {
    id: string;
    title: string;
    images: {
        'main-image': string;
    };
}

const GalleryPage = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchRecipes = async () => {
            const querySnapshot = await getDocs(collection(db, 'userRecipe'));
            const fetchedRecipes: Recipe[] = [];
            querySnapshot.forEach((doc) => {
                fetchedRecipes.push({ id: doc.id, ...doc.data() } as Recipe);
            });
            setRecipes(fetchedRecipes);
        };

        fetchRecipes();
    }, []);

    const handleRecipeClick = (id: string) => {
        router.push(`/userRecipe/${id}`);
    };

    const handleWriteRecipeClick = () => {
        router.push('/recipeWrite');
    };

    return (
        <main className='relative max-w-6xl mx-auto p-4'>
            <h1
            className='text-2xl font-bold mb-6'
             style={{
                    textAlign: 'center',
                    marginBottom: '16px',}}>레시피 갤러리</h1>
            <hr className='h-px my-4 bg-gray-300 border-0 dark:bg-gray-700'></hr>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
                {recipes.map((recipe) => (
                    <div
                        key={recipe.id}
                        className='cursor-pointer hover:shadow-lg transition-shadow duration-300'
                        onClick={() => handleRecipeClick(recipe.id)}
                    >
                        <div className='w-full h-40 sm:h-48 md:h-56 lg:h-64 bg-gray-200 overflow-hidden rounded-lg'>
                            <img
                                src={recipe.images['main-image']}
                                alt={recipe.title}
                                className='w-full h-full object-cover'
                            />
                        </div>
                        <h2 className='mt-2 text-lg font-semibold text-center'>
                            {recipe.title}
                        </h2>
                    </div>
                ))}
            </div>

            {/* 플로팅 액션 버튼 */}
            <div className='fixed right-8 bottom-80 md:right-12 md:bottom-80 z-10'>
                <button
                    onClick={handleWriteRecipeClick}
                    className='w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center'
                    aria-label='레시피 작성'
                >
                    <span className='text-sm font-semibold text-center'><Icon as={EditIcon} size='xl' /></span>
                </button>
            </div>
        </main>
    );
};

export default GalleryPage;
