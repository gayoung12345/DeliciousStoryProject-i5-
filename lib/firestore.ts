import { db } from './firebaseConfig'; // Firebase 설정을 가져옵니다.
import {
    collection,
    getDocs,
    addDoc,
    query,
    orderBy,
    Timestamp,
} from 'firebase/firestore';

// 게시글을 가져오는 함수
// lib/firestore.ts
export const fetchPosts = async () => {
    try {
        const postsCollection = collection(db, 'posts');
        const postsQuery = query(postsCollection, orderBy('date', 'desc'));
        const querySnapshot = await getDocs(postsQuery);

        const postsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        console.log('Fetched posts:', postsData); // 디버깅용 로그

        return postsData;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
};

// 게시글을 Firestore에 추가하는 함수
export const addPost = async (
    title: string,
    author: string,
    content: string
) => {
    try {
        // 'posts' 컬렉션을 참조합니다.
        const postsCollection = collection(db, 'posts');
        // 게시글 문서를 추가합니다.
        const docRef = await addDoc(postsCollection, {
            title,
            author,
            content,
            date: Timestamp.now(), // 현재 시간을 작성일로 설정합니다.
            comments: 0, // 초기 댓글 수는 0입니다.
            views: 0, // 초기 조회수는 0입니다.
        });

        console.log('Document written with ID: ', docRef.id);
    } catch (error) {
        console.error('Error adding post:', error);
        throw error;
    }
};
