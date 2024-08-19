'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import xml2js from 'xml2js';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { useRouter } from 'next/navigation';
import { RouteMatcher } from 'next/dist/server/future/route-matchers/route-matcher';

// 이미지 예시 데이터
const slides = [
    { id: 1, image: '/png/img3.png' },
    { id: 2, image: '/png/img2.png' },
    { id: 3, image: '/png/img1.png' },
];

const recipeImg1 = [
    { id: '연어구이', name: '작성자1', image: '/png/recipeImg1-1.png' },
    { id: '새우볶음밥', name: '작성자2', image: '/png/recipeImg1-2.png' },
    { id: '라자냐', name: '작성자3', image: '/png/recipeImg1-3.png' },
    { id: '스테이크', name: '작성자4', image: '/png/recipeImg1-4.png' },
];

export default function Home() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prevSlide) =>
            prevSlide === 0 ? slides.length - 1 : prevSlide - 1
        );
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };
    // 슬라이더 끝

    // 레시피 데이터를 저장하는 상태
    const [recipes, setRecipes] = useState([]);
    // 페이지당 아이템 수 상태, 기본값은 4
    const itemsPerPage = 4;
    // useRouter 훅
    const router = useRouter();

    // 컴포넌트가 마운트될 때 XML 데이터를 가져오는 효과
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                // XML 파일을 비동기적으로 가져옴
                const response = await fetch('/data/siterecipe.xml');
                const xmlData = await response.text();
                const parser = new xml2js.Parser();
                // XML 데이터를 JavaScript 객체로 변환
                const result = await parser.parseStringPromise(xmlData);

                // 레시피 데이터를 정리하여 상태에 저장
                const recipeData = result.COOKRCP01.row.map((recipe) => ({
                    id: recipe.RCP_SEQ[0],
                    name: recipe.RCP_NM[0],
                    image: recipe.ATT_FILE_NO_MAIN[0] || '/svg/logo.svg', // 기본 이미지 경로 설정
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

    // 이미지 클릭 시 상세 페이지로 이동하는 함수
    const handleImageClick = (id) => {
        router.push(`/galleryPost?id=${id}`);
    };

    const handleMoreClick = () => {
        router.push('/siteRecipe'); // "/siteRecipe" 페이지로 이동
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
                    height: '100vh', // 뷰포트 높이에 맞춤
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        transition: 'transform 0.5s ease',
                        transform: `translateX(-${currentSlide * 100}%)`,
                        height: '100%', // 슬라이드 높이를 부모와 동일하게
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
                                layout='fill' // 전체 공간을 채우도록 설정
                                objectFit='cover' // 이미지 비율 유지
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
                        backgroundColor: 'rgba(255, 255, 255, 0.7)', // 배경색
                        border: 'none', // 테두리 없애기
                        borderRadius: '50%', // 원형으로 만들기
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '36px', // 화살표 크기 조정
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
                        backgroundColor: 'rgba(255, 255, 255, 0.7)', // 배경색
                        border: 'none', // 테두리 없애기
                        borderRadius: '50%', // 원형으로 만들기
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '36px', // 화살표 크기 조정
                    }}
                >
                    &#10095; {/* Right arrow */}
                </button>

                {/* 페이지네이션 점 또는 원 추가 */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '20px', // 슬라이드 위에 올리기 위해 아래쪽에 위치
                        left: '50%', // 중앙 정렬
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        justifyContent: 'center',
                        zIndex: 1, // 다른 요소 위에 보이게 하기
                    }}
                >
                    {slides.map((_, index) => (
                        <div
                            key={index}
                            onClick={() => goToSlide(index)} // 클릭 시 해당 슬라이드로 이동
                            style={{
                                width: '15px',
                                height: '15px',
                                margin: '0 5px',
                                borderRadius: '50%', // 동그라미로 설정
                                backgroundColor:
                                    currentSlide === index
                                        ? 'black'
                                        : 'lightgray', // 현재 슬라이드에 따라 색상 변경
                                cursor: 'pointer',
                                transition: 'background-color 0.3s', // 부드러운 색상 변화
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* 나중에 수정 */}
            <div>
                {/* 레시피1 */}
                <div
                    style={{
                        width: '100%',
                        backgroundColor: 'white',
                        padding: '40px 0',
                    }}
                >
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <h1
                            className='hover:text-red-600'
                            style={{
                                textAlign: 'center',
                                fontSize: '22px',
                                textDecoration: 'underline',
                                textUnderlineOffset: '10px',
                                cursor: 'pointer',
                                width: 'max-content',
                                margin: '30px auto',
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
                            {recipes.slice(0, itemsPerPage).map((recipe) => (
                                <Box
                                    key={recipe.id}
                                    style={{
                                        position: 'relative',
                                        padding: '16px',
                                        backgroundColor: 'white',
                                        margin: '10px',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                                        cursor: 'pointer',
                                        width: '250px', // width를 명시적으로 설정
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
                                                e.currentTarget.style.opacity =
                                                    '1';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.opacity =
                                                    '0';
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

                {/* 텍스트 및 버튼 영역 */}
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
                        <i style={{ fontSize: '14px' }}>
                            TTS로 들으면서 편하게
                        </i>{' '}
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
                            (e.target.style.backgroundColor =
                                'rgba(170,170,170,0.3)')
                        }
                        onMouseLeave={(e) =>
                            (e.target.style.backgroundColor =
                                'rgba(255,255,255,0.3)')
                        }
                        onClick={handlejoinClick}
                    >
                        Join Us
                    </button>
                </div>

                {/* 레시피2 */}
                <div
                    style={{
                        width: '100%',
                        backgroundColor: 'white',
                        padding: '40px 0',
                    }}
                >
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <h1
                            className='hover:text-red-600'
                            style={{
                                textAlign: 'center',
                                margin: '30px auto',
                                fontSize: '22px',
                                textDecoration: 'underline',
                                textUnderlineOffset: '10px',
                                cursor: 'pointer',
                            }}
                        >
                            인기 레시피
                        </h1>
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                            }}
                        >
                            {recipeImg1.map((photo) => (
                                <div
                                    key={photo.id}
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
                                            boxShadow:
                                                '0 4px 8px rgba(0,0,0,0.3)',
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
                                                src={photo.image}
                                                alt={`Image ${photo.id}`}
                                                layout='fill'
                                                objectFit='cover'
                                                style={{ borderRadius: '4px' }}
                                            />
                                        </div>
                                        <p
                                            style={{
                                                fontSize: '12px',
                                                marginTop: '8px',
                                                color: '#8C8C8C',
                                                textAlign: 'left',
                                            }}
                                        >
                                            {photo.name}
                                        </p>
                                        <p
                                            style={{
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                                marginTop: '2px',
                                                textAlign: 'left',
                                            }}
                                        >
                                            {photo.id}
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
            </div>

            {/* 배경 영역 */}
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    overflow: 'hidden',
                }}
            >
                {/* 고정한 이미지 영역 */}
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
                        src='/png/mainE.png' // 고정될 이미지 경로
                        alt='Background'
                        layout='fill'
                        objectFit='cover'
                    />
                </div>
            </div>
        </main>
    );
}