'use client'; // 클라이언트 컴포넌트임을 명시

import ImageUploader from '@/components/recipe/ImageUploader';
import IngredientInput from '@/components/recipe/IngredientInput';
import RecipeStepInput from '@/components/recipe/RecipeStepInput';
import { Button, ButtonText } from '@/components/ui/button';
import Image from 'next/image';
import React, { useState, useRef } from 'react';

const RecipeWrite: React.FC = () => {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <main className='flex flex-col items-center'>
            <div className='w-full max-w-6xl p-4 border border-gray-300'>
                <div className='text-xl font-bold mb-4'>레시피 등록</div>
                <div className='flex space-x-4 px-8'>
                    <div className='mb-4 pr-8'>
                        <input
                            type='file'
                            accept='image/*'
                            onChange={handleImageUpload}
                            ref={fileInputRef}
                            className='hidden'
                        />
                        <Image
                            width={200}
                            height={200}
                            onClick={handleImageClick}
                            alt='main_image'
                            src={preview || '/png/cs.png'}
                            className='mt-2 w-64 h-64 object-cover cursor-pointer border border-gray-300'
                        />
                    </div>
                    <div className='mb-4 flex-grow flex flex-col'>
                        <div className='font-semibold mb-2'>레시피 제목</div>
                        <input
                            type='text'
                            className='w-full bg-gray-200 p-2 mb-2'
                            placeholder='예) 소고기 미역국 끓이기'
                        />
                        <div className='font-semibold mb-2'>요리 소개</div>
                        <textarea
                            className='w-full bg-gray-200 p-2 mb-2'
                            placeholder='이 레시피의 탄생배경을 적어주세요. 예) 남편의 생일을 맞아 소고기 미역국을 끓여봤어요. 어머니로부터 배운 미역국 레시피를 남편의 입맛에 맞게 고안했습니다.'
                            rows={4}
                        ></textarea>

                        <div className='font-semibold mb-2'>카테고리</div>
                        <div className='flex space-x-2 mb-2'>
                            <select className='w-full bg-gray-200 p-2'>
                                <option>방법별</option>
                                <option>볶기</option>
                                <option>끓이기</option>
                                <option>굽기</option>
                            </select>
                        </div>
                        <div className='flex space-x-2 mb-2'>
                            <select className='w-full bg-gray-200 p-2'>
                                <option>재료별</option>
                                <option>채소</option>
                                <option>고기</option>
                                <option>해산물</option>
                            </select>
                        </div>
                        <div className='font-semibold mb-2'>요리 정보</div>
                        <div className='flex space-x-2 mb-2'>
                            <select className='w-full bg-gray-200 p-2'>
                                <option>인원</option>
                                <option>1인분</option>
                                <option>2인분</option>
                                <option>3인분</option>
                            </select>
                            <select className='w-full bg-gray-200 p-2'>
                                <option>시간</option>
                                <option>10분</option>
                                <option>20분</option>
                                <option>30분</option>
                            </select>
                            <select className='w-full bg-gray-200 p-2'>
                                <option>난이도</option>
                                <option>쉬움</option>
                                <option>보통</option>
                                <option>어려움</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full max-w-6xl p-4 border border-gray-300 mt-4'>
                <div className='font-semibold'>재료 정보</div>
                <div>
                    <IngredientInput />
                </div>
            </div>
            <div className='w-full max-w-6xl p-4 border border-gray-300 mt-4'>
                <RecipeStepInput />
            </div>
            <div className='w-full max-w-6xl p-4 border border-gray-300 mt-4'>
                <div>요리 완성사진</div>
                <div>
                    <ImageUploader />
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
                >
                    <ButtonText>저장</ButtonText>
                </Button>
            </div>
        </main>
    );
};

export default RecipeWrite;
