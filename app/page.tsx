'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import xml2js from 'xml2js';
import { useRouter } from 'next/navigation';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

const slides = [
    { id: 1, image: '/png/img3.png' },
    { id: 2, image: '/png/img2.png' },
    { id: 3, image: '/png/img1.png' },
];

interface SiteRecipe {
    id: string;
    name: string;
    image: string;
    ingredients: string;
    manual: string;
    calories: string;
}

interface UserRecipe {
    id: string;
    title: string;
    images?: {
        'main-image'?: string;
    };
    'main-image'?: string;
}

interface BoxProps extends React.HTMLProps<HTMLDivElement> {
    style?: React.CSSProperties;
    onClick?: () => void;
    onMouseEnter?: () => void; // Mouse enter event handler
}

interface TextProps extends React.HTMLProps<HTMLParagraphElement> {
    style?: React.CSSProperties;
    onMouseEnter?: () => void; // Mouse enter event handler
}

const Box: React.FC<BoxProps> = ({
    style,
    onClick,
    onMouseEnter,
    children,
}) => (
    <div
        style={style}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
    >
        {children}
    </div>
);

const Text: React.FC<TextProps> = ({ style, onMouseEnter, children }) => (
    <p
        style={style}
        onMouseEnter={onMouseEnter}
    >
        {' '}
        {children}
    </p>
);

export default function Home() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [siteRecipes, setSiteRecipes] = useState<SiteRecipe[]>([]);
    const [userRecipes, setUserRecipes] = useState<UserRecipe[]>([]);
    const [randomSiteRecipes, setRandomSiteRecipes] = useState<SiteRecipe[]>(
        []
    );
    const [randomUserRecipes, setRandomUserRecipes] = useState<UserRecipe[]>(
        []
    );
    const itemsPerPage = 4;
    const router = useRouter();

    const synth = useRef<SpeechSynthesis>(window.speechSynthesis); // Reference to SpeechSynthesis API

    const nextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prevSlide) =>
            prevSlide === 0 ? slides.length - 1 : prevSlide - 1
        );
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    const getRandomItems = <T,>(items: T[], count: number): T[] => {
        const shuffled = [...items].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    const speakText = (text: string) => {
        if (synth.current) {
            const utterance = new SpeechSynthesisUtterance(text);
            synth.current.speak(utterance);
        }
    };

    useEffect(() => {
        const fetchSiteRecipes = async () => {
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

                setSiteRecipes(recipeData);
                setRandomSiteRecipes(getRandomItems(recipeData, itemsPerPage));
            } catch (error) {
                console.error('XML 파싱 에러:', error);
            }
        };

        fetchSiteRecipes();
    }, []);

    useEffect(() => {
        const fetchUserRecipes = async () => {
            try {
                const userRecipeSnapshot = await getDocs(
                    collection(db, 'userRecipe')
                );
                const fetchedRecipes: UserRecipe[] = [];
                userRecipeSnapshot.forEach((doc) => {
                    fetchedRecipes.push({
                        id: doc.id,
                        ...doc.data(),
                    } as UserRecipe);
                });

                // 테스트 레시피의 경우
                const testRecipeSnapshot = await getDocs(
                    collection(db, 'testRecipe')
                );
                testRecipeSnapshot.forEach((doc) => {
                    const data = doc.data();
                    fetchedRecipes.push({
                        id: doc.id,
                        title: data.title,
                        'main-image': data['main-image'],
                    } as UserRecipe);
                });

                // 랜덤으로 섞어서 설정
                const shuffledRecipes = getRandomItems(
                    fetchedRecipes,
                    itemsPerPage
                );

                setUserRecipes(fetchedRecipes);
                setRandomUserRecipes(shuffledRecipes);
            } catch (error) {
                console.error('Firebase 레시피 가져오기 에러:', error);
            }
        };

        fetchUserRecipes();
    }, []);

    const handleImageClick = (id: string) => {
        router.push(`/galleryPost?id=${id}`);
    };

    const handleMoreClick = () => {
        router.push('/siteRecipe');
    };

    const handlejoinClick = () => {
        router.push('/signup');
    };

    const handlefreeClick = () => {
        router.push('/freeboard');
    };

    return (
        <main>
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100vh',
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        transition: 'transform 0.5s ease',
                        transform: `translateX(-${currentSlide * 100}%)`,
                        height: '100%',
                    }}
                >
                    {slides.map((slide) => (
                        <div
                            key={slide.id}
                            style={{
                                minWidth: '100%',
                                height: '100%',
                                position: 'relative',
                            }}
                        >
                            <Image
                                src={slide.image}
                                alt={`슬라이드 ${slide.id}`}
                                layout='fill'
                                objectFit='cover'
                            />
                        </div>
                    ))}
                </div>

                <button
                    onClick={prevSlide}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '10px',
                        transform: 'translateY(-50%)',
                        zIndex: 1,
                        width: '80px',
                        height: '80px',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        border: 'none',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '36px',
                    }}
                >
                    &#10094; {/* 왼쪽 화살표 */}
                </button>

                <button
                    onClick={nextSlide}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        right: '10px',
                        transform: 'translateY(-50%)',
                        zIndex: 1,
                        width: '80px',
                        height: '80px',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        border: 'none',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '36px',
                    }}
                >
                    &#10095; {/* 오른쪽 화살표 */}
                </button>

                <div
                    style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        justifyContent: 'center',
                        zIndex: 1,
                    }}
                >
                    {slides.map((_, index) => (
                        <div
                            key={index}
                            onClick={() => goToSlide(index)}
                            style={{
                                width: '15px',
                                height: '15px',
                                margin: '0 5px',
                                borderRadius: '50%',
                                backgroundColor:
                                    currentSlide === index
                                        ? 'black'
                                        : 'lightgray',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s',
                            }}
                        />
                    ))}
                </div>
            </div>

            <div
                style={{
                    width: '100%',
                    backgroundColor: 'white',
                    padding: '40px 0',
                }}
            >
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <h1
                        className='butt'
                        style={{
                            textAlign: 'center',
                            margin: '30px auto',
                            fontSize: '22px',
                            cursor: 'pointer',
                            width: 'max-content',
                        }}
                        onClick={handleMoreClick}
                    >
                        공식 레시피
                    </h1>
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                        }}
                    >
                        {randomSiteRecipes.map((recipe) => (
                            <Box
                                key={recipe.id}
                                style={{
                                    position: 'relative',
                                    padding: 16,
                                    backgroundColor: 'white',
                                    margin: '10px',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                                    cursor: 'pointer',
                                    width: '250px',
                                }}
                                onClick={() => handleImageClick(recipe.id)}
                                onMouseEnter={() => speakText(recipe.name)} // TTS on mouse enter
                            >
                                <Box style={{ position: 'relative' }}>
                                    <Image
                                        src={recipe.image}
                                        alt={recipe.name}
                                        width={250}
                                        height={250}
                                        style={{ borderRadius: '4px' }}
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
                                        }}
                                        onMouseEnter={(e:any) => {
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
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        marginTop: '2px',
                                    }}
                                >
                                    {recipe.name}
                                </Text>
                            </Box>
                        ))}
                    </div>
                </div>
            </div>

            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                }}
            >
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <h1
                        className='butt'
                        style={{
                            textAlign: 'center',
                            margin: '30px auto',
                            fontSize: '22px',
                            cursor: 'pointer',
                            width: 'max-content',
                        }}
                        onClick={handlejoinClick}
                    >
                        사용자 레시피
                    </h1>
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                        }}
                    >
                        {randomUserRecipes.map((recipe) => (
                            <Box
                                key={recipe.id}
                                style={{
                                    width: '200px',
                                    margin: '10px',
                                    cursor: 'pointer',
                                }}
                                onClick={() => handleImageClick(recipe.id)}
                                onMouseEnter={() => speakText(recipe.title)} // TTS on mouse enter
                            >
                                <Image
                                    src={
                                        recipe['main-image'] || '/svg/logo.svg'
                                    }
                                    alt={recipe.title}
                                    width={200}
                                    height={200}
                                    objectFit='cover'
                                />
                                <Text
                                    onMouseEnter={() => speakText(recipe.title)} // TTS on mouse enter
                                >
                                    {recipe.title}
                                </Text>
                            </Box>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
