import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebaseConfig';
import { useAuth } from '../../app/context/AuthContext';

export async function getStaticPaths() {
  const postsRef = collection(db, 'posts');
  const snapshot = await getDocs(postsRef);
  const paths = snapshot.docs.map(doc => ({
    params: { id: doc.id },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps(context) {
  const { id } = context.params;

  const postDoc = doc(db, 'posts', id);
  const postSnapshot = await getDoc(postDoc);

  if (!postSnapshot.exists()) {
    return { notFound: true };
  }

  const postData = postSnapshot.data();

  return {
    props: {
      post: postData,
    },
  };
}

export default function ListPost({ post }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchComments = async () => {
      const commentsRef = collection(db, 'comments');
      const q = query(commentsRef, where('postId', '==', post.id));
      const querySnapshot = await getDocs(q);
      const fetchedComments = querySnapshot.docs.map(doc => doc.data());
      setComments(fetchedComments);
    };

    fetchComments();
  }, [post.id]);

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    if (user) {
      try {
        await addDoc(collection(db, 'comments'), {
          postId: post.id,
          content: comment,
          author: user.email,
          date: new Date().toISOString(),
        });

        const q = query(collection(db, 'comments'), where('postId', '==', post.id));
        const querySnapshot = await getDocs(q);
        const updatedComments = querySnapshot.docs.map(doc => doc.data());
        setComments(updatedComments);

        alert('댓글이 작성되었습니다!');
        setComment('');
      } catch (error) {
        console.error('댓글 작성 오류:', error);
      }
    } else {
      alert('로그인이 필요합니다.');
      router.push('/login');
    }
  };

  const handleGoBack = () => {
    router.push('/freeBoard');
  };

  if (!post) {
    return <p>게시글을 찾을 수 없습니다.</p>;
  }

  return (
    <main>
      <div style={{ padding: '20px', width: '60%', margin: '0 auto', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '30px' }}>{post.title}</h1>
        <div style={{ marginBottom: '20px', fontSize: '14px', color: '#555', textAlign: 'right' }}>
          <p>작성자: {post.author}</p>
          <p>작성일: {post.date}</p>
          <p>댓글 수 {post.comments || 0} | 조회 수 {post.views || 0}</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', marginBottom: '30px', lineHeight: '1.6', fontSize: '16px', width: '100%', boxSizing: 'border-box' }}>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', marginBottom: '30px', boxSizing: 'border-box', width: '100%' }}>
          <h2 style={{ fontSize: '16px', marginBottom: '20px' }}>댓글 작성하기</h2>
          <form onSubmit={handleCommentSubmit}>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', resize: 'none', height: '100px', marginBottom: '10px', boxSizing: 'border-box' }} placeholder='좋은 말로 댓글을 작성하세요.' required />
            <button type='submit' className='bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600'>등록</button>
          </form>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', marginBottom: '30px', boxSizing: 'border-box', width: '100%' }}>
          <h2 style={{ fontSize: '16px', marginBottom: '20px' }}>댓글 목록</h2>
          {comments.length === 0 ? (
            <p>댓글이 없습니다.</p>
          ) : (
            <ul style={{ listStyleType: 'none', padding: '0' }}>
              {comments.map((comment, index) => (
                <li key={index} style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '4px', marginBottom: '10px' }}>
                  <p><strong>{comment.author}</strong> ({new Date(comment.date).toLocaleDateString()})</p>
                  <p>{comment.content}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px', marginBottom: '10px' }}>
          <button type='button' onClick={handleGoBack} className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'>뒤로 가기</button>
        </div>
      </div>
    </main>
  );
}
