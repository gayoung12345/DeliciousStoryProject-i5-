'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

interface Recipe {
    title: string;
    description: string;
    category: {
        method: string;
        ingredient: string;
    };
    info: {
        servings: string;
        time: string;
        difficulty: string;
    };
    images: {
        'main-image': string;
    };
    steps: {
        description: string;
        image: string | null;
    }[];
    ingredients: {
        name: string;
        quantity: string;
        unit: string;
    }[];
}

const RecipeDetail = ({ params }: { params: { id: string } }) => {
    const router = useRouter();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const { id } = params;

    useEffect(() => {
        const fetchRecipe = async () => {
            if (id) {
                const docRef = doc(db, 'userRecipe', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setRecipe(docSnap.data() as Recipe);
                } else {
                    console.error('No such document!');
                    router.push('/404');
                }
            }
        };

        fetchRecipe();
    }, [id]);

    if (!recipe) {
        return <div>Loading...</div>;
    }

    return (
        <main className='max-w-4xl mx-auto p-4'>
            <h1 className='text-3xl font-bold mb-4'>{recipe.title}</h1>
            <img
                src={recipe.images['main-image']}
                alt={recipe.title}
                className='w-full object-cover mb-4'
            />
            <p className='mb-4'>{recipe.description}</p>
            <div className='mb-4'>
                <h2 className='text-2xl font-bold mb-2'>요리 정보</h2>
                <ul>
                    <li>인원: {recipe.info.servings}</li>
                    <li>시간: {recipe.info.time}</li>
                    <li>난이도: {recipe.info.difficulty}</li>
                    <li>방법: {recipe.category.method}</li>
                    <li>재료: {recipe.category.ingredient}</li>
                </ul>
            </div>
            <div className='mb-4'>
                <h2 className='text-2xl font-bold mb-2'>재료</h2>
                <ul>
                    {recipe.ingredients.map((ingredient, index) => (
                        <li key={index}>
                            {ingredient.name} - {ingredient.quantity} {ingredient.unit}
                        </li>
                    ))}
                </ul>
            </div>
            <div className='mb-4'>
                <h2 className='text-2xl font-bold mb-2'>조리 단계</h2>
                {recipe.steps.map((step, index) => (
                    <div key={index} className='mb-4'>
                        <p>{step.description}</p>
                        {step.image && (
                            <img
                                src={step.image}
                                alt={`Step ${index + 1}`}
                                className='w-full h-64 object-cover mt-2'
                            />
                        )}
                    </div>
                ))}
            </div>
        </main>
    );
};

export default RecipeDetail;