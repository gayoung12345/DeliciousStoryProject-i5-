'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebaseConfig';
import {
    FaArrowLeft,
    FaHeart,
    FaPause,
    FaPlay,
    FaStop,
    FaTrash,
} from 'react-icons/fa';
import TextToSpeechDiv from '@/components/tts/textToSpeech';
import {
    doc,
    query,
    where,
    collection,
    addDoc,
    getDoc,
    getDocs,
    deleteDoc,
} from 'firebase/firestore';
import { useAuth } from '@/app/context/AuthContext';
import Image from 'next/image';

interface Recipe {
    title: string;
    description: string;
    category: {
        method: string;
        ingredient: string;
    };
    // info: {
    //     servings: string;
    //     time: string;
    //     difficulty: string;
    // };
    images: {
        'main-image': string;
    };
    steps: {
        description: string;
        image: string | null;
    }[];
    ingredients: {
        name: string;
        quantity: string;
        unit: string;
    }[];
    user: string;
}
const RecipeDetail = ({ params }: { params: { id: string } }) => {
    const [liked, setLiked] = useState(false);
    const router = useRouter();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const { id } = params;
    const [speechRate, setSpeechRate] = useState<any>(1);
    const [utterance, setUtterance] = useState<any>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [user, setUser] = useState<any | null>(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const checkIfLiked = async () => {
            if (user && recipe) {
                const likesRef = collection(db, 'likes');
                const q = query(
                    likesRef,
                    where('recipeId', '==', id),
                    where('userId', '==', user.uid)
                );
                const querySnapshot = await getDocs(q);

                setLiked(!querySnapshot.empty);
            }
        };

        checkIfLiked();
    }, [user, recipe]);

    const speakText = (text: any) => {
        if ('speechSynthesis' in window) {
            const newUtterance = new SpeechSynthesisUtterance(text);
            newUtterance.rate = speechRate; // Set speech rate
            setUtterance(newUtterance);
            speechSynthesis.speak(newUtterance);
            setIsSpeaking(true);
        } else {
            console.warn('Speech synthesis not supported in this browser.');
        }
    };

    const handleTtsClick = () => {
        if (recipe) {
            // 레시피 이름 읽어주기
            speakText(recipe.title);

            // 메뉴얼 읽어주기
            recipe.steps.forEach((item) => {
                speakText(item.description);
            });
        }
    };

    const handleRateChange = (event: any) => {
        setSpeechRate(parseFloat(event.target.value));
    };

    const handlePauseClick = () => {
        if ('speechSynthesis' in window && isSpeaking) {
            speechSynthesis.pause();
        }
    };

    const handleResumeClick = () => {
        if ('speechSynthesis' in window && isSpeaking) {
            speechSynthesis.resume();
        }
    };

    const handleStopClick = () => {
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    const handleBackClick = () => {
        router.back();
    };

    const handleLikeToggle = async () => {
        if (user) {
            const likesRef = collection(db, 'likes');
            const q = query(
                likesRef,
                where('recipeId', '==', id),
                where('userId', '==', user.uid)
            );
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                // 좋아요가 없는 경우, 좋아요 추가
                try {
                    await addDoc(likesRef, {
                        recipeId: id,
                        userId: user.uid,
                    });
                    setLiked(true);
                } catch (error) {
                    console.error('Error adding like:', error);
                }
            } else {
                // 좋아요가 있는 경우, 좋아요 제거
                try {
                    querySnapshot.forEach(async (doc) => {
                        await deleteDoc(doc.ref);
                    });
                    setLiked(false);
                } catch (error) {
                    console.error('Error removing like:', error);
                }
            }
        } else {
            // 로그인하지 않은 경우 알림과 리다이렉트
            alert('좋아요를 클릭하려면 로그인해야 합니다.');
            router.push('/login'); // 로그인 페이지로 리다이렉트
        }
    };

    const handleAddComment = async () => {
        if (user) {
            if (newComment.trim()) {
                try {
                    await addDoc(collection(db, 'comments'), {
                        recipeId: id,
                        userId: user.uid,
                        text: newComment,
                        timestamp: new Date(),
                    });
                    setComments([
                        ...comments,
                        { userId: user.uid, text: newComment },
                    ]);
                    setNewComment('');
                } catch (error) {
                    console.error('Error adding comment:', error);
                }
            }
        } else {
            // 로그인하지 않은 경우 알림과 리다이렉트
            alert('댓글을 작성하려면 로그인해야 합니다.');
            router.push('/login'); // 로그인 페이지로 리다이렉트
        }
    };

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'comments'));
                const commentsList = querySnapshot.docs.map((doc) =>
                    doc.data()
                );

                // 댓글 목록에서 recipeId가 일치하는 댓글만 필터링
                setComments(
                    commentsList.filter((comment) => comment.recipeId === id)
                );
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        if (recipe) {
            fetchComments();
        }
    }, [recipe]);

    useEffect(() => {
        const fetchRecipe = async () => {
            if (id) {
                let docRef = doc(db, 'userRecipe', id);
                let docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setRecipe(docSnap.data() as Recipe);
                } else {
                    // If the recipe is not in 'userRecipe', check 'testRecipe'
                    docRef = doc(db, 'testRecipe', id);
                    docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const testRecipeData = docSnap.data();
                        // Adjust data to match the structure of Recipe interface
                        const adjustedRecipe: Recipe = {
                            user: '',
                            title: testRecipeData.title || '',
                            description: testRecipeData.description || '',
                            category: {
                                method: testRecipeData.category?.method || '',
                                ingredient:
                                    testRecipeData.category?.ingredient || '',
                            },

                            images: {
                                'main-image': testRecipeData['main-image']
                                    ? testRecipeData['main-image']
                                    : '',
                            },
                            steps: testRecipeData.steps || [],
                            ingredients: testRecipeData.ingredients
                                ? testRecipeData.ingredients.map(
                                      (ingredient: string) => {
                                          const [name, quantity, unit] =
                                              ingredient.split(' ');
                                          return { name, quantity, unit };
                                      }
                                  )
                                : [],
                        };
                        setRecipe(adjustedRecipe);
                    } else {
                        console.error('No such document!');
                        router.push('/404');
                    }
                }
            }
        };

        fetchRecipe();
    }, [id]);

    const handleDeleteRecipe = async () => {
        if (confirm('정말로 이 레시피를 삭제하시겠습니까?')) {
            try {
                // 레시피 삭제
                await deleteDoc(doc(db, 'userRecipe', id));
                alert('레시피가 삭제되었습니다.');
                router.push('/'); // 홈으로 리다이렉트
            } catch (error) {
                console.error('Error deleting recipe:', error);
            }
        }
    };

    if (!recipe) {
        return <div>Loading...</div>;
    }

    return (
        <main className='max-w-4xl mx-auto p-4'>
            <button
                onClick={router.back}
                style={{
                    color: '#ffffff',
                    backgroundColor: '#383838',
                    position: 'fixed',
                    top: 150,
                    left: 50,
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
                <FaArrowLeft
                    size={24}
                    color='#ffffff'
                />
            </button>
            <Image
                width={400}
                height={200}
                src={recipe.images['main-image']}
                alt={recipe.title}
                className='w-full object-cover mb-4'
            />

            {/* 회색 박스 */}
            <div
                style={{
                    backgroundColor: '#f0f0f0',
                    padding: '20px',
                    borderRadius: '8px',
                }}
            >
                {/* 제목 */}
                <TextToSpeechDiv>
                    <h1
                        style={{
                            fontSize: '32px',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            marginBottom: '16px',
                        }}
                    >
                        {recipe.title}
                    </h1>
                </TextToSpeechDiv>
                <TextToSpeechDiv>
                    <div
                        style={{
                            justifyContent: 'center',
                            textAlign: 'center',
                            padding: '20px',
                            maxWidth: '60%',
                            margin: '0 auto',
                            wordBreak: 'keep-all',
                        }}
                    >
                        <p>{recipe.description}</p>
                    </div>
                </TextToSpeechDiv>
                <br />

                {/* 재료 */}
                <TextToSpeechDiv>
                    <h2
                        style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            textAlign: 'left',
                            marginBottom: '8px',
                        }}
                    >
                        재료
                    </h2>
                    <div
                        style={{
                            fontSize: '18px',
                            textAlign: 'left',
                            marginBottom: '24px',
                        }}
                    >
                        {recipe.ingredients.map((ingredient, index) => (
                            <div key={index}>
                                {ingredient.name} {ingredient.quantity}
                                {ingredient.unit}
                            </div>
                        ))}
                    </div>
                </TextToSpeechDiv>
                {/* 조리법 */}
                <TextToSpeechDiv>
                    <h2
                        style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            textAlign: 'left',
                            marginBottom: '8px',
                        }}
                    >
                        조리법
                    </h2>
                    <div>
                        {recipe.steps.map((step, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: '16px',
                                }}
                            >
                                {step.image && (
                                    <Image
                                        width={150}
                                        height={150}
                                        src={step.image}
                                        alt={`Step ${index + 1}`}
                                        style={{
                                            width: '150px',
                                            height: '150px',
                                            objectFit: 'cover',
                                            marginRight: '16px',
                                            borderRadius: '8px',
                                        }}
                                    />
                                )}

                                <p style={{ fontSize: '18px' }}>
                                    {index + 1}. {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </TextToSpeechDiv>
                {/* TTS Reproduction Button */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        gap: '16px',
                        marginTop: '56px',
                        marginBottom: '16px',
                    }}
                >
                    <button
                        onClick={handleTtsClick}
                        style={{
                            color: '#ffffff',
                            backgroundColor: '#FF8C00', // 기본 주황색
                            width: 100,
                            height: 40,
                            borderRadius: 20,
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '16px',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            transition:
                                'background-color 0.3s, box-shadow 0.3s, color 0.3s',
                        }}
                        onMouseDown={(e) => {
                            e.currentTarget.style.backgroundColor = '#FF7F00'; // 클릭 시 색상
                            e.currentTarget.style.color = '#ffffff'; // 클릭 시 글씨 색상
                        }}
                        onMouseUp={(e) => {
                            e.currentTarget.style.backgroundColor = '#FF8C00'; // 기본 색상으로 복구
                            e.currentTarget.style.color = '#ffffff'; // 기본 글씨 색상
                        }}
                    >
                        TTS 재생
                    </button>
                    <select
                        value={speechRate}
                        onChange={handleRateChange}
                        style={{
                            width: 100,
                            height: 40,
                            borderRadius: 20,
                            border: '1px solid #ddd',
                            padding: '0 10px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            textAlign: 'center',
                            boxSizing: 'border-box',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        }}
                    >
                        <option value={0.5}>0.5배속</option>
                        <option value={1}>1배속</option>
                        <option value={2}>2배속</option>
                    </select>
                    <button
                        onClick={handlePauseClick}
                        style={{
                            color: '#ffffff',
                            backgroundColor: '#FF8C00', // 기본 주황색
                            width: 80,
                            height: 40,
                            borderRadius: 20,
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '16px',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            transition:
                                'background-color 0.3s, box-shadow 0.3s, color 0.3s',
                        }}
                        onMouseDown={(e) => {
                            e.currentTarget.style.backgroundColor = '#FF7F00'; // 클릭 시 색상
                            e.currentTarget.style.color = '#ffffff'; // 클릭 시 글씨 색상
                        }}
                        onMouseUp={(e) => {
                            e.currentTarget.style.backgroundColor = '#FF8C00'; // 기본 색상으로 복구
                            e.currentTarget.style.color = '#ffffff'; // 기본 글씨 색상
                        }}
                    >
                        <FaPause size={15} />
                    </button>
                    <button
                        onClick={handleResumeClick}
                        style={{
                            color: '#ffffff',
                            backgroundColor: '#FF8C00', // 기본 주황색
                            width: 80,
                            height: 40,
                            borderRadius: 20,
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '16px',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            transition:
                                'background-color 0.3s, box-shadow 0.3s, color 0.3s',
                        }}
                        onMouseDown={(e) => {
                            e.currentTarget.style.backgroundColor = '#FF7F00'; // 클릭 시 색상
                            e.currentTarget.style.color = '#ffffff'; // 클릭 시 글씨 색상
                        }}
                        onMouseUp={(e) => {
                            e.currentTarget.style.backgroundColor = '#FF8C00'; // 기본 색상으로 복구
                            e.currentTarget.style.color = '#ffffff'; // 기본 글씨 색상
                        }}
                    >
                        <FaPlay size={15} />
                    </button>
                    <button
                        onClick={handleStopClick}
                        style={{
                            color: '#ffffff',
                            backgroundColor: '#FF8C00', // 기본 주황색
                            width: 80,
                            height: 40,
                            borderRadius: 20,
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '16px',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            transition:
                                'background-color 0.3s, box-shadow 0.3s, color 0.3s',
                        }}
                        onMouseDown={(e) => {
                            e.currentTarget.style.backgroundColor = '#FF7F00'; // 클릭 시 색상
                            e.currentTarget.style.color = '#ffffff'; // 클릭 시 글씨 색상
                        }}
                        onMouseUp={(e) => {
                            e.currentTarget.style.backgroundColor = '#FF8C00'; // 기본 색상으로 복구
                            e.currentTarget.style.color = '#ffffff'; // 기본 글씨 색상
                        }}
                    >
                        <FaStop size={15} />
                    </button>
                </div>
            </div>
            <div style={{ marginTop: '16px' }}>
                <h3>댓글</h3>
                {comments.map((comment, index) => (
                    <div
                        key={index}
                        style={{
                            border: '1px solid #ddd',
                            padding: '8px',
                            marginBottom: '8px',
                            borderRadius: '4px',
                        }}
                    >
                        <p>작성자: {comment.userId}</p>
                        <p>{comment.text}</p>
                    </div>
                ))}

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        marginTop: '16px',
                    }}
                >
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={3}
                        placeholder='댓글을 작성하세요...'
                        style={{
                            width: '100%',
                            padding: '8px',
                            borderRadius: '4px',
                            border: '1px solid #ddd',
                            fontSize: '16px',
                            boxSizing: 'border-box',
                        }}
                    />
                    <button
                        onClick={handleAddComment}
                        style={{
                            color: '#ffffff',
                            backgroundColor: '#FF8C00', // 기본 주황색
                            width: '100%',
                            height: 40,
                            borderRadius: 20,
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '16px',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            transition:
                                'background-color 0.3s, box-shadow 0.3s, color 0.3s',
                        }}
                        onMouseDown={(e) => {
                            e.currentTarget.style.backgroundColor = '#FF7F00'; // 클릭 시 색상
                            e.currentTarget.style.color = '#ffffff'; // 클릭 시 글씨 색상
                        }}
                        onMouseUp={(e) => {
                            e.currentTarget.style.backgroundColor = '#FF8C00'; // 기본 색상으로 복구
                            e.currentTarget.style.color = '#ffffff'; // 기본 글씨 색상
                        }}
                    >
                        댓글 작성
                    </button>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <button onClick={handleLikeToggle}>
                            <FaHeart color={liked ? 'red' : 'gray'} />
                        </button>
                    </div>
                </div>
                {user && user.email === recipe.user && (
                    <button
                        onClick={handleDeleteRecipe}
                        className='flex items-center p-2 border rounded bg-red-500 text-white'
                    >
                        <FaTrash
                            size={24}
                            className='mr-2'
                        />
                        Delete Recipe
                    </button>
                )}
            </div>
        </main>
    );
};

export default RecipeDetail;
