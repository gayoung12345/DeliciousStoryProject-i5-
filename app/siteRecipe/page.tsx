'use client';

import React, { useEffect, useState } from 'react';
import { Button, ButtonText } from '@/components/ui/button';
import { Icon, EditIcon } from '@/components/ui/icon';
import Image from 'next/image';
import xml2js from 'xml2js';
import { useRouter } from 'next/navigation';

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

    return (
        <Box style={{ padding: '16px' }}>
            <Text
                style={{
                    fontSize: '24px',
                    textAlign: 'center',
                    marginBottom: '16px',
                }}
            >
                공식 레시피
            </Text>

            <Grid
                style={{
                    display: 'grid',
                    gridTemplateColumns:
                        'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '16px',
                    marginBottom: '24px',
                }}
            >
                {recipes.length > 0 ? (
                    recipes.map((recipe) => (
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
                            <Box
                                style={{
                                    position: 'relative',
                                }}
                            >
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

            <Button
                size='md'
                variant='solid'
                action='primary'
                style={{
                    color: '#ffffff',
                    backgroundColor: '#000000',
                    position: 'fixed',
                    bottom: 50,
                    right: 50,
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                }}
            >
                <ButtonText>
                    <Icon
                        as={EditIcon}
                        size='md'
                    />
                </ButtonText>
            </Button>
        </Box>
    );
};

export default SiteRecipe;
