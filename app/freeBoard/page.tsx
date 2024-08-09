// app/FreeBoard.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext'; // 인증 컨텍스트 가져오기
import { fetchPosts } from '../../lib/firestore'; // Firestore에서 게시글을 가져오는 함수

const FreeBoard = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
    const postsPerPage = 10;
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const postsData = await fetchPosts();
                setPosts(postsData);
                setFilteredPosts(postsData);
                console.log('Posts loaded:', postsData); // 디버깅용 로그
            } catch (error) {
                console.error('Error loading posts:', error);
            }
        };

        loadPosts();
    }, []);

    const handleWriteClick = () => {
        router.push('/posting'); // 글 작성 페이지로 이동
    };

    const handlePostClick = (id: string) => {
        router.push(`/listPost?id=${id}`); // 글 상세보기 페이지로 이동
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchClick = () => {
        const results = posts.filter((post) =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPosts(results);
        setCurrentPage(1);
    };

    const handleResetSearch = () => {
        setSearchTerm('');
        setFilteredPosts(posts);
        setCurrentPage(1);
    };

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <main>
            <div style={{ padding: '20px' }}>
                <h1 style={{ textAlign: 'center', fontSize: '36px' }}>
                    자유게시판
                </h1>
                {user && (
                    <button
                        type='button'
                        className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                        style={{ float: 'right', marginBottom: '20px' }}
                        onClick={handleWriteClick}
                    >
                        글 작성하기
                    </button>
                )}

                <div
                    style={{
                        marginTop: '20px',
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    {filteredPosts.length > 0 ? (
                        <>
                            <table
                                style={{
                                    width: '60%',
                                    borderCollapse: 'collapse',
                                }}
                            >
                                <thead>
                                    <tr>
                                        <th
                                            style={{
                                                border: '1px solid #ddd',
                                                padding: '8px',
                                                width: '5%',
                                            }}
                                        >
                                            번호
                                        </th>
                                        <th
                                            style={{
                                                border: '1px solid #ddd',
                                                padding: '8px',
                                                width: '50%',
                                            }}
                                        >
                                            글 제목
                                        </th>
                                        <th
                                            style={{
                                                border: '1px solid #ddd',
                                                padding: '8px',
                                                width: '10%',
                                            }}
                                        >
                                            작성자
                                        </th>
                                        <th
                                            style={{
                                                border: '1px solid #ddd',
                                                padding: '8px',
                                                width: '15%',
                                            }}
                                        >
                                            작성일
                                        </th>
                                        <th
                                            style={{
                                                border: '1px solid #ddd',
                                                padding: '8px',
                                                width: '10%',
                                            }}
                                        >
                                            댓글수
                                        </th>
                                        <th
                                            style={{
                                                border: '1px solid #ddd',
                                                padding: '8px',
                                                width: '10%',
                                            }}
                                        >
                                            조회수
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentPosts.map((post, index) => (
                                        <tr key={post.id}>
                                            <td
                                                style={{
                                                    border: '1px solid #ddd',
                                                    padding: '8px',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                {filteredPosts.length -
                                                    (currentPage - 1) *
                                                        postsPerPage -
                                                    index}
                                            </td>
                                            <td
                                                style={{
                                                    border: '1px solid #ddd',
                                                    padding: '8px',
                                                    cursor: 'pointer',
                                                    color: 'blue',
                                                    textDecoration: 'underline',
                                                }}
                                                onClick={() =>
                                                    handlePostClick(post.id)
                                                }
                                            >
                                                {post.title}
                                            </td>
                                            <td
                                                style={{
                                                    border: '1px solid #ddd',
                                                    padding: '8px',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                {post.author}
                                            </td>
                                            <td
                                                style={{
                                                    border: '1px solid #ddd',
                                                    padding: '8px',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                {post.date}
                                            </td>
                                            <td
                                                style={{
                                                    border: '1px solid #ddd',
                                                    padding: '8px',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                {post.comments}
                                            </td>
                                            <td
                                                style={{
                                                    border: '1px solid #ddd',
                                                    padding: '8px',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                {post.views}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <br />

                            <nav
                                style={{
                                    textAlign: 'center',
                                    marginTop: '20px',
                                }}
                            >
                                <ul
                                    style={{
                                        display: 'inline-flex',
                                        listStyleType: 'none',
                                        padding: 0,
                                    }}
                                >
                                    {[
                                        ...Array(
                                            Math.ceil(
                                                filteredPosts.length /
                                                    postsPerPage
                                            )
                                        ).keys(),
                                    ].map((number) => (
                                        <li
                                            key={number + 1}
                                            style={{ margin: '0 5px' }}
                                        >
                                            <button
                                                onClick={() =>
                                                    paginate(number + 1)
                                                }
                                                style={{
                                                    background:
                                                        number + 1 ===
                                                        currentPage
                                                            ? 'blue'
                                                            : 'white',
                                                    color:
                                                        number + 1 ===
                                                        currentPage
                                                            ? 'white'
                                                            : 'black',
                                                    border: '1px solid #ddd',
                                                    padding: '5px 10px',
                                                    borderRadius: '5px',
                                                }}
                                            >
                                                {number + 1}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </>
                    ) : (
                        <p>작성된 글이 없습니다.</p>
                    )}
                </div>
            </div>
            <div
                style={{
                    marginTop: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <input
                    type='text'
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder='검색어를 입력하세요...'
                    style={{
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                        width: '400px',
                        marginRight: '10px',
                    }}
                />
                <button
                    type='button'
                    className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'
                    onClick={handleSearchClick}
                >
                    검색
                </button>
            </div>
        </main>
    );
};

export default FreeBoard;
