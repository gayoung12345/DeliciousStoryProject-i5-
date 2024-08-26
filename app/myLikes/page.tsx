'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebaseConfig';
import xml2js from 'xml2js';
import debounce from 'lodash/debounce';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/Topbar';

interface Recipe {
    id: string;
    name: string;
    image: string;
    ingredients: string;
}

interface XmlResult {
    COOKRCP01: {
        row: {
            RCP_SEQ: string[];
            RCP_NM: string[];
            ATT_FILE_NO_MAIN: string[];
            RCP_PARTS_DTLS: string[];
        }[];
    };
}

const MyLikes = () => {
    const { user } = useAuth();
    const [likedRecipes, setLikedRecipes] = useState<Recipe[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

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

                const response = await fetch('/data/siterecipe.xml');
                const xmlData = await response.text();
                const parser = new xml2js.Parser();
                const result = (await parser.parseStringPromise(
                    xmlData
                )) as XmlResult;

                const recipes: Recipe[] = result.COOKRCP01.row.map((rec) => ({
                    id: rec.RCP_SEQ[0],
                    name: rec.RCP_NM[0],
                    image: rec.ATT_FILE_NO_MAIN[0] || '/svg/logo.svg',
                    ingredients: rec.RCP_PARTS_DTLS[0],
                }));

                const filteredLikedRecipes = recipes.filter((recipe) =>
                    likedRecipeIds.includes(recipe.id)
                );
                setLikedRecipes(filteredLikedRecipes);
                setSearchResults(filteredLikedRecipes);
            } catch (error) {
                console.error('Error fetching liked recipes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLikedRecipes();
    }, [user]);

    const debouncedSearch = debounce((term: string) => {
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
    }, 300);

    const handleSearch = () => {
        debouncedSearch(searchTerm);
    };

    if (loading) {
        return <div className='spinner'></div>;
    }

    return (
        <div className='p-6'>
            <TopBar />

            <h1
                className='text-2xl font-bold mb-6 text-center'
                style={{ marginTop: '80px' }}
            >
                좋아요 리스트
            </h1>

            <div
                className='mx-auto'
                style={{ width: '50%', marginTop: '80px', marginBottom: '20px' }}
            >
                {searchResults.length > 0 ? (
                    <div>
                        <ul
                            className='grid grid-cols-1 gap-x-2 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                            style={{ marginTop: '20px' }}
                        >
                            {searchResults.map((recipe) => (
                                <li
                                    key={recipe.id}
                                    className='flex flex-col items-center'
                                    onClick={() =>
                                        router.push(`/galleryPost?id=${recipe.id}`)
                                    }
                                >
                                    <Image
                                        src={recipe.image}
                                        alt={recipe.name}
                                        width={200}
                                        height={200}
                                        className='rounded-lg mb-3 cursor-pointer'
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                                '/svg/logo.svg';
                                        }}
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
                                    marginRight: '4px',
                                    marginTop: '30px'
                                }}
                            />
                            <button
                                onClick={handleSearch}
                                type='button'
                                className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'
                                style={{ marginTop: '30px' }}
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
        </div>
    );
};

export default MyLikes;
