'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebaseConfig';
import xml2js from 'xml2js'; // XML 데이터를 파싱하기 위한 라이브러리

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

                const likedRecipeIds = querySnapshot.docs.map(doc => doc.data().recipeId);

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

                const likedRecipes = recipes.filter(recipe => likedRecipeIds.includes(recipe.id));
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

    const handleSearch = (term) => {
        setSearchTerm(term);
        if (term) {
            const filteredRecipes = likedRecipes.filter(
                (recipe) =>
                    recipe.name.toLowerCase().includes(term.toLowerCase()) ||
                    recipe.ingredients.toLowerCase().includes(term.toLowerCase())
            );
            setSearchResults(filteredRecipes);
        } else {
            setSearchResults(likedRecipes);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>My Liked Recipes</h1>
            <input
                type='text'
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder='Search in liked recipes...'
            />
            {searchResults.length > 0 ? (
                <ul>
                    {searchResults.map((recipe) => (
                        <li key={recipe.id}>
                            <img src={recipe.image} alt={recipe.name} width="100" />
                            <div>
                                <h2>{recipe.name}</h2>
                                <p>{recipe.ingredients}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No liked recipes found.</p>
            )}
        </div>
    );
};

export default MyLikes;
