'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebaseConfig';
import xml2js from 'xml2js'; // XML 데이터를 파싱하기 위한 라이브러리
import debounce from 'lodash/debounce';
import { Image } from '@/components/ui/image';

const MyLikes = () => {
    const { user } = useAuth();
    const [likedRecipes, setLikedRecipes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);

    // 사용자가 좋아요한 레시피 ID 가져오기
    useEffect(() => {
        const fetchLikedRecipes = async () => {
            if (!user) return;

            try {
                const q = query(
                    collection(db, 'likes'),
                    where('userId', '==', user.uid)
                );
                const querySnapshot = await getDocs(q);

                const likedRecipeIds = querySnapshot.docs.map(
                    (doc) => doc.data().recipeId
                );

                // XML 파일에서 전체 레시피 데이터를 가져온 후, 사용자가 좋아요한 레시피로 필터링
                const response = await fetch('/data/siterecipe.xml');
                const xmlData = await response.text();
                const parser = new xml2js.Parser();
                const result = await parser.parseStringPromise(xmlData);

                const recipes = result.COOKRCP01.row.map((rec) => ({
                    id: rec.RCP_SEQ[0],
                    name: rec.RCP_NM[0],
                    image: rec.ATT_FILE_NO_MAIN[0] || '/svg/logo.svg',
                    ingredients: rec.RCP_PARTS_DTLS[0],
                }));

                const likedRecipes = recipes.filter((recipe) =>
                    likedRecipeIds.includes(recipe.id)
                );
                setLikedRecipes(likedRecipes);
                setSearchResults(likedRecipes); // 초기 검색 결과는 전체 좋아요 레시피로 설정
            } catch (error) {
                console.error('Error fetching liked recipes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLikedRecipes();
    }, [user]);

    // 디바운싱된 검색 함수
    const debouncedSearch = debounce((term) => {
        if (term) {
            const filteredRecipes = likedRecipes.filter(
                (recipe) =>
                    recipe.name.toLowerCase().includes(term.toLowerCase()) ||
                    recipe.ingredients
                        .toLowerCase()
                        .includes(term.toLowerCase())
            );
            setSearchResults(filteredRecipes);
        } else {
            setSearchResults(likedRecipes);
        }
    }, 300); // 300ms 디바운싱 시간

    // 검색어로 필터링
    const handleSearch = () => {
        debouncedSearch(searchTerm);
    };

    if (loading) {
        return <div className='text-center p-4'>Loading...</div>;
    }

    return (
        <div className='p-6'>
            <h1
                className='text-3xl font-bold mb-6 text-center'
                style={{ marginTop: '40px' }}
            >
                좋아요 리스트
            </h1>

            {searchResults.length > 0 ? (
                <div style={{ marginTop: '60px', marginBottom: '20px' }}>
                    <ul className='flex flex-wrap justify-center'>
                        {searchResults.map((recipe) => (
                            <li
                                key={recipe.id}
                                className='flex flex-col items-center m-4'
                            >
                                <Image
                                    src={recipe.image}
                                    alt={recipe.name}
                                    width='150'
                                    className='rounded-lg mb-2'
                                />
                                <div className='text-center'>
                                    <h2 className='text-lg font-semibold'>
                                        {recipe.name}
                                    </h2>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div
                        className='flex justify-center mb-6 space-x-1'
                        style={{ marginTop: '40px', marginBottom: '30px' }}
                    >
                        <input
                            type='text'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder='검색어를 입력하세요...'
                            style={{
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ddd',
                                width: '400px',
                                marginRight: '4px', // 검색 버튼과의 간격 조정
                            }}
                        />
                        <button
                            onClick={handleSearch} // Ensure button click triggers search
                            type='button'
                            className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'
                        >
                            검색
                        </button>
                    </div>
                </div>
            ) : (
                <p className='text-center text-gray-600'>
                    No liked recipes found.
                </p>
            )}
        </div>
    );
};

export default MyLikes;
