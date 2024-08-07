'use client';

import React, { useEffect, useState } from 'react';
import { Button, ButtonText } from '@/components/ui/button';
import { Icon, EditIcon } from '@/components/ui/icon';
import Image from 'next/image';
import xml2js from 'xml2js';
import { useRouter } from 'next/navigation';

// 임시 Box, Text, Grid 컴포넌트
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

const Grid = ({ children, style, ...props }) => (
    <div style={style} {...props}>
        {children}
    </div>
);

const SiteRecipe = () => {
    const [isHovered, setIsHovered] = useState(false);


    const [recipes, setRecipes] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 30; // 한 페이지에 표시할 레시피 수
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
    const indexOfLastRecipe = currentPage * itemsPerPage;
    const indexOfFirstRecipe = indexOfLastRecipe - itemsPerPage;
    const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

    // 페이지 변경 핸들러
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // 총 페이지 수 계산
    const totalPages = Math.ceil(recipes.length / itemsPerPage);

    // 페이지네이션 버튼 계산
    const getPaginationButtons = () => {
        const paginationButtons = [];
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            paginationButtons.push(
                <Button
                    key={i}
                    onClick={() => handlePageChange(i)} // 페이지 변경 함수 호출
                    style={{
                        margin: '0 4px',
                        backgroundColor: currentPage === i ? '#000' : '#ccc',
                        color: currentPage === i ? '#fff' : '#000',
                    }}
                >
                    {i}
                </Button>
            );
        }
        return paginationButtons;
    };

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

            <Box style={{ padding: '16px', display: 'flex', justifyContent: 'center' }}>
                <Grid
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '16px',
                        marginBottom: '24px',
                        maxWidth: '1200px',
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
                                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                            color: 'white',
                                            opacity: 0,
                                            transition: 'opacity 0.3s',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => handleImageClick(recipe.id)}
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

            {/* 페이지네이션 버튼 */}
            <Box style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', gap:'10px' }}>
                {getPaginationButtons()}
            </Box>

        </div>
    );
};

export default SiteRecipe;



{/*
    작성 버튼)
    
    <Button
            size='md'
            variant='solid'
            action='primary'
            style={{
                color: '#ffffff',
                backgroundColor: isHovered ? '#070707' : '#737373',
                position: 'fixed',
                bottom: 50,
                right: 50,
                width: 70,
                height: 70,
                borderRadius: 35,
                transition: 'background-color 0.1s ease',
            }}
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)}
        >
            <ButtonText>
                <Icon as={EditIcon} size='xl' />
            </ButtonText>
            
</Button> */}