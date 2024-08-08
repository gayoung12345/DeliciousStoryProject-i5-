'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import xml2js from 'xml2js';
import { FaArrowLeft } from 'react-icons/fa';

// 임시 Box, Text 컴포넌트
const Box = ({ children, style, ...props }) => (
    <div
        style={style}
        {...props}
    >
        {children}
    </div>
);

const Text = ({ children, style, ...props }) => (
    <p
        style={style}
        {...props}
    >
        {children}
    </p>
);

const galleryPost = () => {
    const router = useRouter();
    const [recipe, setRecipe] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [speechRate, setSpeechRate] = useState(1);
    const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(
        null
    );
    const [isSpeaking, setIsSpeaking] = useState(false);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const url = new URL(window.location.href);
                const recipeId = url.searchParams.get('id');

                const response = await fetch('/data/siterecipe.xml');
                const xmlData = await response.text();
                const parser = new xml2js.Parser();
                const result = await parser.parseStringPromise(xmlData);

                const recipes = result.COOKRCP01.row;
                const foundRecipe = recipes.find(
                    (rec: any) => rec.RCP_SEQ[0] === recipeId
                );

                if (foundRecipe) {
                    const recipeData = {
                        id: foundRecipe.RCP_SEQ[0],
                        name: foundRecipe.RCP_NM[0],
                        image:
                            foundRecipe.ATT_FILE_NO_MAIN[0] || '/svg/logo.svg',
                        ingredients: foundRecipe.RCP_PARTS_DTLS[0],
                        manual: [
                            {
                                image: foundRecipe.MANUAL_IMG01[0],
                                text: foundRecipe.MANUAL01[0],
                            },
                            {
                                image: foundRecipe.MANUAL_IMG02[0],
                                text: foundRecipe.MANUAL02[0],
                            },
                            {
                                image: foundRecipe.MANUAL_IMG03[0],
                                text: foundRecipe.MANUAL03[0],
                            },
                        ].filter((item) => item.image && item.text),
                        calories: foundRecipe.INFO_ENG[0],
                        protein: foundRecipe.INFO_PRO[0],
                        fat: foundRecipe.INFO_FAT[0],
                        sodium: foundRecipe.INFO_NA[0],
                    };
                    setRecipe(recipeData);
                }
            } catch (error) {
                console.error('Error parsing XML:', error);
            } finally {
                setLoading(false); // 데이터 로딩이 끝난 후 상태 업데이트
            }
        };

        fetchRecipe();
    }, []);

    const speakText = (text: string) => {
        if ('speechSynthesis' in window) {
            const newUtterance = new SpeechSynthesisUtterance(text);
            newUtterance.rate = speechRate; // Set speech rate
            setUtterance(newUtterance);
            speechSynthesis.speak(newUtterance);
            setIsSpeaking(true);
        } else {
            console.warn('Speech synthesis not supported in this browser.');
        }
    };

    const handleTtsClick = () => {
        if (recipe) {
            // 레시피 이름 읽어주기
            speakText(recipe.name);

            // 메뉴얼 읽어주기
            recipe.manual.forEach((item: any) => {
                speakText(item.text);
            });
        }
    };

    const handleRateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSpeechRate(parseFloat(event.target.value));
    };

    const handlePauseClick = () => {
        if ('speechSynthesis' in window && isSpeaking) {
            speechSynthesis.pause();
        }
    };

    const handleResumeClick = () => {
        if ('speechSynthesis' in window && isSpeaking) {
            speechSynthesis.resume();
        }
    };

    const handleStopClick = () => {
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    const handleBackClick = () => {
        router.back();
    };

    return (
        <main>
            <Box style={{ padding: '16px' }}>
                <button
                    onClick={handleBackClick}
                    style={{
                        color: '#ffffff',
                        backgroundColor: '#000000',
                        position: 'fixed',
                        top: 50,
                        left: 50,
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
                    <FaArrowLeft
                        size={24}
                        color='#ffffff'
                    />
                </button>

                {loading ? (
                    <p style={{ textAlign: 'center', fontSize: '18px' }}>
                        레시피를 불러오는 중입니다...
                    </p>
                ) : recipe ? (
                    <div style={{ maxWidth: '800px', margin: 'auto' }}>
                        <Image
                            src={recipe.image}
                            alt={recipe.name}
                            width={800}
                            height={400}
                            style={{
                                borderRadius: '8px',
                                marginBottom: '16px',
                            }}
                        />
                        <h1 style={{ fontSize: '36px', textAlign: 'center' }}>
                            {recipe.name}
                        </h1>
                        <p style={{ fontSize: '18px', marginBottom: '16px' }}>
                            칼로리: {recipe.calories} kcal
                        </p>
                        <p style={{ fontSize: '18px', marginBottom: '16px' }}>
                            단백질: {recipe.protein} g
                        </p>
                        <p style={{ fontSize: '18px', marginBottom: '16px' }}>
                            지방: {recipe.fat} g
                        </p>
                        <p style={{ fontSize: '18px', marginBottom: '16px' }}>
                            나트륨: {recipe.sodium} mg
                        </p>
                        <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>
                            재료
                        </h2>
                        <Text
                            style={{ fontSize: '18px', marginBottom: '16px' }}
                        >
                            {recipe.ingredients}
                        </Text>
                        <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>
                            조리법
                        </h2>
                        {recipe.manual.map((item, index) => (
                            <div
                                key={index}
                                style={{ marginBottom: '24px' }}
                            >
                                {item.image && (
                                    <Image
                                        src={item.image}
                                        alt={`메뉴얼 이미지 ${index + 1}`}
                                        width={800}
                                        height={400}
                                        style={{
                                            borderRadius: '8px',
                                            marginBottom: '8px',
                                        }}
                                    />
                                )}
                                <Text style={{ fontSize: '18px' }}>
                                    {item.text}
                                </Text>
                            </div>
                        ))}

                        {/* Controls container */}
                        <div
                            style={{
                                position: 'fixed',
                                bottom: 50,
                                right: 50,
                                display: 'flex',
                                flexDirection: 'row',
                                gap: '10px',
                                alignItems: 'center',
                            }}
                        >
                            {/* TTS Reproduction Button */}
                            <button
                                onClick={handleTtsClick}
                                style={{
                                    color: '#ffffff',
                                    backgroundColor: '#000000',
                                    width: 100,
                                    height: 50,
                                    borderRadius: 25,
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    fontSize: '18px',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                }}
                            >
                                TTS 재생
                            </button>
                            {/* Speech Rate Selector */}
                            <select
                                value={speechRate}
                                onChange={handleRateChange}
                                style={{
                                    width: 120,
                                    height: 30,
                                    borderRadius: 15,
                                    border: '1px solid #ddd',
                                    padding: '0 10px',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                }}
                            >
                                <option value={0.5}>0.5배속</option>
                                <option value={1}>1배속</option>
                                <option value={2}>2배속</option>
                            </select>
                            {/* Controls */}
                            <button
                                onClick={handlePauseClick}
                                style={{
                                    color: '#ffffff',
                                    backgroundColor: '#ffcc00',
                                    width: 80,
                                    height: 50,
                                    borderRadius: 25,
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    fontSize: '18px',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                }}
                            >
                                일시정지
                            </button>
                            <button
                                onClick={handleResumeClick}
                                style={{
                                    color: '#ffffff',
                                    backgroundColor: '#00cc00',
                                    width: 80,
                                    height: 50,
                                    borderRadius: 25,
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    fontSize: '18px',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                }}
                            >
                                재개
                            </button>
                            <button
                                onClick={handleStopClick}
                                style={{
                                    color: '#ffffff',
                                    backgroundColor: '#cc0000',
                                    width: 80,
                                    height: 50,
                                    borderRadius: 25,
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    fontSize: '18px',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                }}
                            >
                                중지
                            </button>
                        </div>
                    </div>
                ) : (
                    <p style={{ textAlign: 'center', fontSize: '18px' }}>
                        레시피를 찾을 수 없습니다.
                    </p>
                )}
            </Box>
        </main>
    );
};

export default galleryPost;
