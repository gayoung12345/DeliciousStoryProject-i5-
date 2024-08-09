'use client';
import React, { useState } from 'react';

import IngredientInput from '@/components/recipe/IngredientInput';
import RecipeStepInput from '@/components/recipe/RecipeStepInput';
import { Button, ButtonText } from '@/components/ui/button';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import ImageUpload from '@/components/recipe/ImageUpload';

const RecipeWrite: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categoryMethod, setCategoryMethod] = useState('');
    const [categoryIngredient, setCategoryIngredient] = useState('');
    const [servings, setServings] = useState('');
    const [time, setTime] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [images, setImages] = useState<{ [key: string]: string }>({});
    const [steps, setSteps] = useState<RecipeStep[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);

    const handleImageUploaded = (id: string, url: string) => {
        setImages((prev) => ({ ...prev, [id]: url }));
    };

    const handleStepChange = (updatedSteps: RecipeStep[]) => {
        setSteps(updatedSteps);
    };

    const handleIngredientsChange = (updatedIngredients: Ingredient[]) => {
        setIngredients(updatedIngredients);
    };

    const handleSubmit = async () => {
        try {
            await addDoc(collection(db, 'userRecipe'), {
                title,
                description,
                category: {
                    method: categoryMethod,
                    ingredient: categoryIngredient,
                },
                info: {
                    servings,
                    time,
                    difficulty,
                },
                images, // 업로드된 이미지 URL
                steps, // 단계별 설명과 이미지 URL
                ingredients, // 재료 목록
                createdAt: new Date(),
            });

            alert('레시피가 성공적으로 저장되었습니다!');
        } catch (error) {
            console.error('Error saving recipe:', error);
        }
    };

    return (
        <main className='flex flex-col items-center'>
            <div className='w-full max-w-6xl p-4 border border-gray-300'>
                <div className='text-xl font-bold mb-4'>레시피 등록</div>
                <div className='flex flex-col space-y-4 px-8'>
                    <div>
                        <div className='font-semibold mb-2'>레시피 제목</div>
                        <input
                            type='text'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className='w-full bg-gray-200 p-2 mb-2'
                            placeholder='예) 소고기 미역국 끓이기'
                        />
                    </div>
                    <div>
                        <div className='font-semibold mb-2'>요리 소개</div>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className='w-full bg-gray-200 p-2 mb-2'
                            placeholder='요리에 대한 설명을 적어주세요.'
                            rows={4}
                        ></textarea>
                    </div>

                    <div className='font-semibold mb-2'>카테고리</div>
                    <div className='flex space-x-2 mb-2'>
                        <select
                            value={categoryMethod}
                            onChange={(e) => setCategoryMethod(e.target.value)}
                            className='w-full bg-gray-200 p-2'
                        >
                            <option value=''>방법별</option>
                            <option>볶기</option>
                            <option>끓이기</option>
                            <option>굽기</option>
                        </select>
                    </div>
                    <div className='flex space-x-2 mb-2'>
                        <select
                            value={categoryIngredient}
                            onChange={(e) =>
                                setCategoryIngredient(e.target.value)
                            }
                            className='w-full bg-gray-200 p-2'
                        >
                            <option value=''>재료별</option>
                            <option>채소</option>
                            <option>고기</option>
                            <option>해산물</option>
                        </select>
                    </div>
                    <div className='font-semibold mb-2'>요리 정보</div>
                    <div className='flex space-x-2 mb-2'>
                        <select
                            value={servings}
                            onChange={(e) => setServings(e.target.value)}
                            className='w-full bg-gray-200 p-2'
                        >
                            <option value=''>인원</option>
                            <option>1인분</option>
                            <option>2인분</option>
                            <option>3인분</option>
                        </select>
                        <select
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className='w-full bg-gray-200 p-2'
                        >
                            <option value=''>시간</option>
                            <option>10분</option>
                            <option>20분</option>
                            <option>30분</option>
                        </select>
                        <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            className='w-full bg-gray-200 p-2'
                        >
                            <option value=''>난이도</option>
                            <option>쉬움</option>
                            <option>보통</option>
                            <option>어려움</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className='w-full max-w-6xl p-4 border border-gray-300 mt-4'>
                <div className='font-semibold'>재료 정보</div>
                <div>
                    <IngredientInput
                        onIngredientsChange={handleIngredientsChange}
                    />
                </div>
            </div>

            <div className='w-full max-w-6xl p-4 border border-gray-300 mt-4'>
                <RecipeStepInput onStepChange={handleStepChange} />
            </div>

            <div className='w-full max-w-6xl p-4 border border-gray-300 mt-4'>
                <div>요리 완성사진</div>
                <div>
                    <ImageUpload
                        id='main-image'
                        onImageUploaded={(url) =>
                            handleImageUploaded('main-image', url)
                        }
                    />
                </div>
            </div>

            <div className='w-full max-w-6xl p-4 border border-gray-300 mt-4'>
                <div>태그</div>
                <div>
                    <input
                        type='text'
                        className='w-full bg-gray-200 p-2 mb-2'
                        placeholder='예)감자, 감자샐러드, 맛있음'
                    />
                </div>
            </div>

            <div className='w-full max-w-6xl mt-8 flex justify-center items-center'>
                <Button
                    className='w-1/2 h-14'
                    size='lg'
                    variant='outline'
                    action='primary'
                    onClick={handleSubmit}
                >
                    <ButtonText>저장</ButtonText>
                </Button>
            </div>
        </main>
    );
};

export default RecipeWrite;
