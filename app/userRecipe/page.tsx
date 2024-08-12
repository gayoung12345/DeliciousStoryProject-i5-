'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';

interface Recipe {
    id: string;
    title: string;
    images: {
        'main-image': string;
    };
}

const UserRecipe = () => {
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
        <main
            style={{
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                maxWidth: '1400px',
                margin: '0 auto',
            }}
        >
            <h1
                style={{
                    fontSize: '24px',
                    textAlign: 'center',
                    marginBottom: '16px',
                    textDecoration: 'underline',
                    textUnderlineOffset: '10px',
                }}
            >
                레시피 갤러리
            </h1>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns:
                        'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '16px',
                    marginBottom: '24px',
                    width: '100%',
                }}
            >
                {recipes.map((recipe) => (
                    <div
                        key={recipe.id}
                        style={{
                            position: 'relative',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            padding: '16px',
                            backgroundColor: 'white',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            cursor: 'pointer',
                            transition: 'transform 0.3s, box-shadow 0.3s',
                        }}
                        onClick={() => handleRecipeClick(recipe.id)}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow =
                                '0 8px 16px rgba(0,0,0,0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow =
                                '0 4px 8px rgba(0,0,0,0.1)';
                        }}
                    >
                        <div style={{ position: 'relative' }}>
                            <img
                                src={recipe.images['main-image']}
                                alt={recipe.title}
                                style={{
                                    width: '100%',
                                    height: '200px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                }}
                            />
                        </div>
                        <h2
                            style={{
                                fontSize: '18px',
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
            <button
                onClick={handleWriteRecipeClick}
                style={{
                    position: 'fixed',
                    bottom: 50,
                    right: 50,
                    width: 80,
                    height: 80,
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    borderRadius: '40px',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 10,
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#333333';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#000000';
                }}
            >
                <span
                    style={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                    }}
                >
                    레시피
                    <br />
                    작성
                </span>
            </button>
        </main>
    );
};

export default UserRecipe;
