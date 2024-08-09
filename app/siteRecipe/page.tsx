'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import xml2js from 'xml2js';
import { useRouter } from 'next/navigation';
import { FaArrowUp } from 'react-icons/fa';

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth', // 부드러운 스크롤 효과
    });
};

// 임시 Box, Text, Grid 컴포넌트
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

const Grid = ({ children, style, ...props }) => (
    <div
        style={style}
        {...props}
    >
        {children}
    </div>
);

const SiteRecipe = () => {
    const [recipes, setRecipes] = useState<any[]>([]);
    const [itemsPerPage, setItemsPerPage] = useState(24); // 기본 30개 로드
    const router = useRouter();

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await fetch('/data/siterecipe.xml');
                const xmlData = await response.text();
                const parser = new xml2js.Parser();
                const result = await parser.parseStringPromise(xmlData);

                const recipeData = result.COOKRCP01.row.map((recipe: any) => ({
                    id: recipe.RCP_SEQ[0],
                    name: recipe.RCP_NM[0],
                    image: recipe.ATT_FILE_NO_MAIN[0] || '/svg/logo.svg',
                    ingredients: recipe.RCP_PARTS_DTLS[0],
                    manual: recipe.MANUAL01[0],
                    calories: recipe.INFO_ENG[0],
                }));

                setRecipes(recipeData);
            } catch (error) {
                console.error('Error parsing XML:', error);
            }
        };

        fetchRecipes();
    }, []);

    const handleImageClick = (id: string) => {
        router.push(`/galleryPost?id=${id}`);
    };

    // 현재 페이지의 레시피 계산
    const currentRecipes = recipes.slice(0, itemsPerPage); // 현재 페이지에 대한 레시피

    // 스크롤 이벤트 핸들러
    const handleScroll = () => {
        const scrollTop = window.scrollY; // 현재 스크롤 위치
        const windowHeight = window.innerHeight; // 현재 뷰포트 높이
        const documentHeight = document.documentElement.offsetHeight; // 전체 문서 높이

        // 스크롤이 맨 아래에 도달했을 때 로드
        if (scrollTop + windowHeight >= documentHeight - 200) {
            // 200px 남았을 때 로드
            if (itemsPerPage < recipes.length) {
                setItemsPerPage((prev) => prev + 1); // 1개씩 추가
            }
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll); // 스크롤 이벤트 리스너 추가
        return () => {
            window.removeEventListener('scroll', handleScroll); // 컴포넌트 언마운트 시 리스너 제거
        };
    }, [itemsPerPage, recipes]); // itemsPerPage나 recipes가 변할 때마다 리스너 재설정

    return (
        <div>
            <Text
                style={{
                    fontSize: '24px',
                    textAlign: 'center',
                    marginBottom: '16px',
                    textDecoration: 'underline',
                    textUnderlineOffset: '10px',
                }}
            >
                공식 레시피
            </Text>

            <Box
                style={{
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <Grid
                    style={{
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '16px',
                        marginBottom: '24px',
                        maxWidth: '1400px',
                        width: '100%',
                    }}
                >
                    {currentRecipes.length > 0 ? (
                        currentRecipes.map((recipe) => (
                            <Box
                                key={recipe.id}
                                style={{
                                    position: 'relative',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    padding: '16px',
                                    backgroundColor: 'white',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                    cursor: 'pointer',
                                }}
                                onClick={() => handleImageClick(recipe.id)}
                            >
                                <Box style={{ position: 'relative' }}>
                                    <Image
                                        src={recipe.image}
                                        alt={recipe.name}
                                        width={250}
                                        height={250}
                                        style={{ borderRadius: '8px' }}
                                    />
                                    <Box
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
                                            handleImageClick(recipe.id)
                                        }
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.opacity = '1';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.opacity = '0';
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: '18px',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            상세 보기
                                        </Text>
                                    </Box>
                                </Box>
                                <Text
                                    style={{
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        marginTop: '8px',
                                        textAlign: 'center',
                                    }}
                                >
                                    {recipe.name}
                                </Text>
                            </Box>
                        ))
                    ) : (
                        <Text
                            style={{
                                fontSize: '14px',
                                textAlign: 'center',
                            }}
                        >
                            레시피가 없습니다.
                        </Text>
                    )}
                </Grid>
            </Box>
            <button
                onClick={scrollToTop} // onClick 핸들러 수정
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
    );
};

export default SiteRecipe;
