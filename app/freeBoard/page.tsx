'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// 예시 데이터 (하나의 게시글)
const examplePosts = [
    {
        id: 1,
        title: '게시물 제목 1',
        author: '작성자 1',
        date: '2024-08-01',
        comments: 5,
        views: 100,
    },
];

const FreeBoard = () => {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
    const [filteredPosts, setFilteredPosts] = useState([]); // 필터링된 게시글 상태
    const postsPerPage = 10; // 페이지당 게시글 수
    const router = useRouter();

    useEffect(() => {
        const savedPosts =
            JSON.parse(localStorage.getItem('posts')) || examplePosts;
        // 최신 게시글이 위로 오도록 정렬
        savedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        setPosts(savedPosts);
        setFilteredPosts(savedPosts); // 초기 상태에서는 모든 게시글을 표시
    }, []);

    const handleWriteClick = () => {
        router.push('/posting');
    };

    const handlePostClick = (id) => {
        router.push(`/listPost?id=${id}`);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchClick = () => {
        // 검색어로 필터링된 게시글 가져오기
        const results = posts.filter((post) =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPosts(results);
        setCurrentPage(1); // 검색 시 첫 페이지로 돌아가기
    };

    const handleResetSearch = () => {
        setSearchTerm('');
        setFilteredPosts(posts); // 검색어 초기화 시 모든 게시글로 복원
        setCurrentPage(1); // 초기화 시 첫 페이지로 돌아가기
    };

    // 현재 페이지의 게시글 가져오기
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    // 페이지 번호 변경 핸들러
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <main>
            <div style={{ padding: '20px' }}>
                <h1 style={{ textAlign: 'center', fontSize: '36px' }}>
                    자유게시판
                </h1>
                <button
                    type='button'
                    className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                    style={{ float: 'right', marginBottom: '20px' }}
                    onClick={handleWriteClick}
                >
                    글 작성하기
                </button>

                <div style={{ marginTop: '20px' }}>
                    {filteredPosts.length > 0 ? (
                        <>
                            <table
                                style={{
                                    width: '100%',
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
                            {/* 페이지 네비게이션 */}
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
                        <p>게시물이 없습니다.</p>
                    )}
                </div>
            </div>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                {/* 검색창 */}
                <input
                    type='text'
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder='검색어를 입력하세요...'
                    style={{
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                        width: '300px',
                        marginRight: '10px',
                    }}
                />
                <button
                    type='button'
                    className='bg-black text-white px-4 py-2 rounded hover:bg-gray-600'
                    onClick={handleSearchClick}
                >
                    검색
                </button>
            </div>
        </main>
    );
};

export default FreeBoard;
