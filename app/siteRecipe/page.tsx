// siteRecipe 공식레시피 리스트
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import xml2js from 'xml2js';
import { useRouter } from 'next/navigation';
import { FaArrowUp } from 'react-icons/fa';

// 스크롤을 페이지 상단으로 이동시키는 함수
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth', // 부드러운 스크롤 효과
    });
};

// 임시 Box 컴포넌트 - 스타일을 적용하여 컨테이너 역할
const Box = ({ children, style, ...props }) => (
    <div
        style={style}
        {...props}
    >
        {children}
    </div>
);

// 임시 Text 컴포넌트 - 텍스트 요소에 스타일을 적용
const Text = ({ children, style, ...props }) => (
    <p
        style={style}
        {...props}
    >
        {children}
    </p>
);

// 임시 Grid 컴포넌트 - 그리드 레이아웃을 제공
const Grid = ({ children, style, ...props }) => (
    <div
        style={style}
        {...props}
    >
        {children}
    </div>
);

const SiteRecipe = () => {
    // 레시피 데이터를 저장하는 상태
    const [recipes, setRecipes] = useState<any[]>([]);
    // 페이지당 아이템 수 상태, 기본값은 24
    const [itemsPerPage, setItemsPerPage] = useState(24);
    // 페이지 이동을 위한 useRouter 훅
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
                const recipeData = result.COOKRCP01.row.map((recipe: any) => ({
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
    const handleImageClick = (id: string) => {
        router.push(`/galleryPost?id=${id}`);
    };

    // 현재 페이지에 표시할 레시피 목록 계산
    const currentRecipes = recipes.slice(0, itemsPerPage);

    // 스크롤 이벤트 핸들러
    const handleScroll = () => {
        const scrollTop = window.scrollY; // 현재 스크롤 위치
        const windowHeight = window.innerHeight; // 현재 뷰포트 높이
        const documentHeight = document.documentElement.offsetHeight; // 전체 문서 높이

        // 스크롤이 문서 하단에 가까워지면 더 많은 아이템을 로드
        if (scrollTop + windowHeight >= documentHeight - 200) {
            // 200px 남았을 때 로드
            if (itemsPerPage < recipes.length) {
                setItemsPerPage((prev) => prev + 1); // 아이템 수 1개씩 증가
            }
        }
    };

    // 스크롤 이벤트 리스너 추가 및 제거
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [itemsPerPage, recipes]);

    return (
        <div>
            {/* 페이지 상단 제목 */}
            <Text
                style={{
                    fontSize: '26px',
                    fontWeight: '700',
                    textAlign: 'center',
                    marginTop: '35px',
                    marginBottom: '35px',
                    textDecoration: 'underline',
                    textUnderlineOffset: '10px',
                }}
            >
                공식 레시피
            </Text>

            {/* 레시피 그리드 컨테이너 */}
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
                    {/* 레시피 목록이 있는 경우 */}
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
                                                fontSize: '16px',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            상세 보기
                                        </Text>
                                    </Box>
                                </Box>
                                <Text
                                    style={{
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        marginTop: '10px',
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
            {/* 페이지 상단으로 이동하는 버튼 */}
            <button
                onClick={scrollToTop}
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
