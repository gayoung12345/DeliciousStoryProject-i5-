'use client'; // 이 줄을 추가하여 이 파일이 클라이언트 컴포넌트임을 명시합니다.

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import xml2js from 'xml2js';
import { FaArrowLeft, FaPause, FaPlay, FaStop } from 'react-icons/fa';

// 임시 Box, Text 컴포넌트
const Box = ({ children, style, ...props }) => (
    <div style={style} {...props}>
        {children}
    </div>
);

const Text = ({ children, style, ...props }) => (
    <p style={style} {...props}>
        {children}
    </p>
);

const GalleryPost = () => {
    const router = useRouter();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [speechRate, setSpeechRate] = useState(1);
    const [utterance, setUtterance] = useState(null);
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
                    (rec) => rec.RCP_SEQ[0] === recipeId
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

    const speakText = (text) => {
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
            recipe.manual.forEach((item) => {
                speakText(item.text);
            });
        }
    };

    const handleRateChange = (event) => {
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
        <main style={{ marginTop: '80px' }}>
            <Box style={{ padding: '16px' }}>
                <button
                    onClick={handleBackClick}
                    style={{
                        color: '#ffffff',
                        backgroundColor: '#383838', // 기본 주황색
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
                    <FaArrowLeft size={24} color='#ffffff' />
                </button>

                {loading ? (
                    <p style={{ textAlign: 'center', fontSize: '18px' }}>
                        레시피를 불러오는 중입니다...
                    </p>
                ) : recipe ? (
                    <div style={{ maxWidth: '800px', margin: 'auto' }}>
                        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                            <h1 style={{ width: '60%', fontSize: '24px' }}>글 제목</h1>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <p>좋아요 NN</p>
                                <p>조회수 NN</p>
                            </div>
                        </header>
                        <p style={{ textAlign: 'left', marginBottom: '36px' }}>작성자 : 000</p>
                        <Image
                            src={recipe.image}
                            alt={recipe.name}
                            width={800}
                            height={800}
                            style={{
                                borderRadius: '8px',
                                marginBottom: '16px',
                            }}
                        />
                        <Box style={{ backgroundColor: '#f0f0f0', padding: '36px', borderRadius: '8px' }}>
                            <h1 style={{ fontSize: '36px', textAlign: 'center', marginTop: '10px', marginBottom: '26px', fontWeight: '600' }}>
                                {recipe.name}
                            </h1>
                            <p style={{ fontSize: '16px' }}>
                                칼로리: {recipe.calories} kcal
                            </p>
                            <p style={{ fontSize: '16px' }}>
                                단백질: {recipe.protein} g
                            </p>
                            <p style={{ fontSize: '16px' }}>
                                지방: {recipe.fat} g
                            </p>
                            <p style={{ fontSize: '16px' }}>
                                나트륨: {recipe.sodium} mg
                            </p>
                            <h2 style={{ fontSize: '24px', marginTop: '26px', marginBottom: '8px' }}>
                                재료
                            </h2>
                            <Text style={{ fontSize: '16px', marginBottom: '16px' }}>
                                {recipe.ingredients}
                            </Text>
                            <h2 style={{ fontSize: '24px', marginTop: '26px', marginBottom: '8px' }}>
                                조리법
                            </h2>
                            {recipe.manual.map((item, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                                    {item.image && (
                                        <Image
                                            src={item.image}
                                            alt={`메뉴얼 이미지 ${index + 1}`}
                                            width={200}
                                            height={200}
                                            style={{
                                                borderRadius: '8px',
                                                marginRight: '16px',
                                            }}
                                        />
                                    )}
                                    <Text style={{ fontSize: '16px' }}>{item.text}</Text>
                                </div>
                            ))}
                            {/* TTS Reproduction Button */}
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '16px', marginTop: '56px', marginBottom: '16px' }}>
                                <button
                                    onClick={handleTtsClick}
                                    style={{
                                        color: '#ffffff',
                                        backgroundColor: '#FF8C00', // 기본 주황색
                                        width: 100,
                                        height: 40,
                                        borderRadius: 20,
                                        border: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                        transition: 'background-color 0.3s, box-shadow 0.3s, color 0.3s',
                                    }}
                                    onMouseDown={(e) => {
                                        e.currentTarget.style.backgroundColor = '#FF7F00'; // 클릭 시 색상
                                        e.currentTarget.style.color = '#ffffff'; // 클릭 시 글씨 색상
                                    }}
                                    onMouseUp={(e) => {
                                        e.currentTarget.style.backgroundColor = '#FF8C00'; // 기본 색상으로 복구
                                        e.currentTarget.style.color = '#ffffff'; // 기본 글씨 색상
                                    }}
                                >
                                    TTS 재생
                                </button>
                                <select
                                    value={speechRate}
                                    onChange={handleRateChange}
                                    style={{
                                        width: 100,
                                        height: 40,
                                        borderRadius: 20,
                                        border: '1px solid #ddd',
                                        padding: '0 10px',
                                        fontSize: '16px',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        boxSizing: 'border-box',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                    }}
                                >
                                    <option value={0.5}>0.5배속</option>
                                    <option value={1}>1배속</option>
                                    <option value={2}>2배속</option>
                                </select>
                                <button
                                    onClick={handlePauseClick}
                                    style={{
                                        color: '#ffffff',
                                        backgroundColor: '#FF8C00', // 기본 주황색
                                        width: 80,
                                        height: 40,
                                        borderRadius: 20,
                                        border: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                        transition: 'background-color 0.3s, box-shadow 0.3s, color 0.3s',
                                    }}
                                    onMouseDown={(e) => {
                                        e.currentTarget.style.backgroundColor = '#FF7F00'; // 클릭 시 색상
                                        e.currentTarget.style.color = '#ffffff'; // 클릭 시 글씨 색상
                                    }}
                                    onMouseUp={(e) => {
                                        e.currentTarget.style.backgroundColor = '#FF8C00'; // 기본 색상으로 복구
                                        e.currentTarget.style.color = '#ffffff'; // 기본 글씨 색상
                                    }}
                                >
                                    <FaPause size={15} />
                                </button>
                                <button
                                    onClick={handleResumeClick}
                                    style={{
                                        color: '#ffffff',
                                        backgroundColor: '#FF8C00', // 기본 주황색
                                        width: 80,
                                        height: 40,
                                        borderRadius: 20,
                                        border: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                        transition: 'background-color 0.3s, box-shadow 0.3s, color 0.3s',
                                    }}
                                    onMouseDown={(e) => {
                                        e.currentTarget.style.backgroundColor = '#FF7F00'; // 클릭 시 색상
                                        e.currentTarget.style.color = '#ffffff'; // 클릭 시 글씨 색상
                                    }}
                                    onMouseUp={(e) => {
                                        e.currentTarget.style.backgroundColor = '#FF8C00'; // 기본 색상으로 복구
                                        e.currentTarget.style.color = '#ffffff'; // 기본 글씨 색상
                                    }}
                                >
                                    <FaPlay size={15} />
                                </button>
                                <button
                                    onClick={handleStopClick}
                                    style={{
                                        color: '#ffffff',
                                        backgroundColor: '#FF8C00', // 기본 주황색
                                        width: 80,
                                        height: 40,
                                        borderRadius: 20,
                                        border: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                        transition: 'background-color 0.3s, box-shadow 0.3s, color 0.3s',
                                    }}
                                    onMouseDown={(e) => {
                                        e.currentTarget.style.backgroundColor = '#FF7F00'; // 클릭 시 색상
                                        e.currentTarget.style.color = '#ffffff'; // 클릭 시 글씨 색상
                                    }}
                                    onMouseUp={(e) => {
                                        e.currentTarget.style.backgroundColor = '#FF8C00'; // 기본 색상으로 복구
                                        e.currentTarget.style.color = '#ffffff'; // 기본 글씨 색상
                                    }}
                                >
                                    <FaStop size={15} />
                                </button>
                            </div>
                        </Box>
                        <div style={{ marginTop: '16px' }}>
                            {/* <h3>댓글</h3> */}
                            <div style={{ border: '1px solid #ddd', padding: '8px', marginBottom: '8px', borderRadius: '4px' }}>
                                <p>댓글 작성자</p>
                                <p>댓글 내용</p>
                            </div>
                            <div style={{ border: '1px solid #ddd', padding: '8px', marginBottom: '8px', borderRadius: '4px' }}>
                                <p>댓글 작성자</p>
                                <p>댓글 내용</p>
                            </div>
                            <div style={{ border: '1px solid #ddd', padding: '8px', marginBottom: '8px', borderRadius: '4px' }}>
                                <p>댓글 작성자</p>
                                <p>댓글 내용</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginTop: '16px' }}>
                            <button
                                style={{
                                    color: '#ffffff',
                                    backgroundColor: '#383838',
                                    width: 70,
                                    height: 50,
                                    borderRadius: 5,
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                }}
                            >
                                목록
                            </button>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <button
                                    style={{
                                        color: '#ffffff',
                                        backgroundColor: '#383838', // 기본 주황색
                                        width: 70,
                                        height: 50,
                                        borderRadius: 5,
                                        border: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                    }}
                                >
                                    수정
                                </button>
                                <button
                                    style={{
                                        color: '#ffffff',
                                        backgroundColor: '#383838', // 기본 주황색
                                        width: 70,
                                        height: 50,
                                        borderRadius: 5,
                                        border: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                    }}
                                >
                                    삭제
                                </button>
                            </div>
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

export default GalleryPost;
