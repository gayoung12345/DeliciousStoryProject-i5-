'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import xml2js from 'xml2js';
import { useRouter } from 'next/navigation';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

// 이미지 예시 데이터
const slides = [
    { id: 1, image: '/png/img3.png' },
    { id: 2, image: '/png/img2.png' },
    { id: 3, image: '/png/img1.png' },
];

// 레시피 데이터 타입
interface Recipe {
    id: string;
    name: string;
    image: string;
    ingredients: string;
    manual: string;
    calories: string;
}

interface BoxProps extends React.HTMLProps<HTMLDivElement> {
    style?: React.CSSProperties;
    onClick?: () => void;
}

interface TextProps extends React.HTMLProps<HTMLParagraphElement> {
    style?: React.CSSProperties;
}

// Box 컴포넌트 정의
const Box: React.FC<BoxProps> = ({ style, onClick, children }) => (
    <div
        style={style}
        onClick={onClick}
    >
        {children}
    </div>
);

// Text 컴포넌트 정의
const Text: React.FC<TextProps> = ({ style, children }) => (
    <p style={style}>{children}</p>
);

export default function Home() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [firebaseRecipes, setFirebaseRecipes] = useState<Recipe[]>([]);
    const itemsPerPage = 4;
    const router = useRouter();

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

    useEffect(() => {
        const fetchFirebaseRecipes = async () => {
            try {
                const userRecipeSnapshot = await getDocs(collection(db, 'userRecipe'));
                const testRecipeSnapshot = await getDocs(collection(db, 'testRecipe'));
                const fetchedRecipes: Recipe[] = [];

                userRecipeSnapshot.forEach((doc) => {
                    fetchedRecipes.push({ id: doc.id, ...doc.data() } as Recipe);
                });
                testRecipeSnapshot.forEach((doc) => {
                    const data = doc.data();
                    fetchedRecipes.push({
                        id: doc.id,
                        name: data.title,
                        image: data['main-image'],
                        ingredients: '', // 데이터가 없으므로 빈 문자열
                        manual: '', // 데이터가 없으므로 빈 문자열
                        calories: '', // 데이터가 없으므로 빈 문자열
                    } as Recipe);
                });

                setFirebaseRecipes(fetchedRecipes);
            } catch (error) {
                console.error('Error fetching recipes from Firebase:', error);
            }
        };

        fetchFirebaseRecipes();
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
                                alt={`Slide ${slide.id}`}
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
                    &#10094; {/* Left arrow */}
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
                    &#10095; {/* Right arrow */}
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
                            width: 'max-content'
                        }}
                        onClick={handleMoreClick}
                    >
                        공식레시피
                    </h1>
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                        }}
                    >
                        {recipes.slice(0, itemsPerPage).map((recipe) => (
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
                                        fontSize: '12px',
                                        marginTop: '8px',
                                        color: '#8C8C8C',
                                    }}
                                >
                                    {recipe.calories} kcal
                                </Text>
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
                    position: 'relative',
                    zIndex: 1,
                    padding: '20px 0',
                    textAlign: 'center',
                    color: 'black',
                    marginTop: '50px',
                    marginBottom: '50px',
                }}
            >
                <h1 style={{ fontSize: '40px', fontWeight: 'bold' }}>
                    눈으로 보고 귀로 듣는 요리
                </h1>
                <p style={{ fontSize: '18px' }}>
                    <i style={{ fontSize: '14px' }}>TTS로 들으면서 편하게</i>
                    <br />
                    <br />
                    다른 사람들과 함께 맛있는 이야기를 나눠요
                </p>
                <br />
                <br />
                <button
                    style={{
                        border: '1px solid gray',
                        borderRadius: '5px',
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        color: 'black',
                        padding: '10px 20px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        transition: 'background-color 0.1s',
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                            'rgba(170,170,170,0.3)')
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor =
                            'rgba(255,255,255,0.3)')
                    }
                    onClick={handlejoinClick}
                >
                    Join Us
                </button>
            </div>




            {/* Firebase 레시피 데이터를 렌더링하는 부분 추가 */}
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
                width: 'max-content'
            }}
        >
            모두의레시피
        </h1>
        <div
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
            }}
        >
            {firebaseRecipes.slice(0, 4).map((recipe) => (
                <div
                    key={recipe.id}
                    style={{
                        textAlign: 'center',
                        margin: '10px',
                    }}
                >
                    <div
                        style={{
                            position: 'relative',
                            padding: '16px',
                            backgroundColor: 'white',
                            margin: '10px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                            cursor: 'pointer',
                            width: '250px',
                        }}
                    >
                        <div
                            style={{
                                position: 'relative',
                                width: '100%',
                                height: '250px',
                                overflow: 'hidden',
                            }}
                        >
                            <Image
                                src={recipe.image || '/default-image.png'} // 기본 이미지 URL로 대체
                                alt={`Recipe ${recipe.id}`}
                                layout='fill'
                                objectFit='cover'
                                style={{ borderRadius: '4px' }}
                            />
                        </div>
                        <p
                            style={{
                                fontSize: '14px',
                                fontWeight: 'bold',
                                marginTop: '8px',
                                textAlign: 'left',
                            }}
                        >
                            {recipe.name}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    </div>
</div>




            <div
                style={{
                    backgroundColor: 'white',
                    width: '100%',
                    height: '20px',
                }}
            ></div>

            <div
                style={{
                    width: '100%',
                    height: '200px',
                    backgroundImage: 'url(/png/mainA.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            ></div>

            <div
                style={{
                    backgroundColor: 'white',
                    width: '100%',
                    height: '50px',
                }}
            ></div>

            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: -1,
                        opacity: 0.6,
                    }}
                >
                    <Image
                        src='/png/mainE.png'
                        alt='Background'
                        layout='fill'
                        objectFit='cover'
                    />
                </div>
            </div>
            <style jsx>{`
                .butt {
                    position: relative;
                    transition: color 0.3s ease;
                    text-decoration: none;
                    font-size: 18px; /* 텍스트 크기 고정 */
                }

                .butt:hover {
                    color: #DB0000; /* 호버 시 텍스트 색상 변경 */
                }

                .butt::after {
                    content: '';
                    position: absolute;
                    left: 0;
                    bottom: -4px; /* 텍스트 아래 4px 위치 */
                    width: 0;
                    height: 3px; /* 밑줄 두께 */
                    background-color: #DB0000; /* 밑줄 색상 */
                    transition: width 0.3s ease; /* 애니메이션 효과 */
                }

                .butt:hover::after {
                    width: 100%;
                }
            `}</style>
        </main>
    );
}
