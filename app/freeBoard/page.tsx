// freeBoard 자유게시판 리스트
'use client'; // Next.js에서 이 파일이 클라이언트에서 실행된다는 것을 알림

import React, { useEffect, useState } from 'react'; // React와 필요한 훅들을 import
import { useRouter } from 'next/navigation'; // Next.js의 라우터 훅을 import
import { useAuth } from '../context/AuthContext'; // 인증 컨텍스트에서 현재 사용자 정보를 가져오는 훅을 import
import { fetchPosts } from '../../lib/firestore'; // Firestore에서 게시글을 가져오는 함수 import
import { EditIcon, Icon } from '@/components/ui/icon';

const FreeBoard = () => {
    // 게시글을 저장할 상태 변수와 현재 페이지, 검색어, 필터된 게시글을 위한 상태 변수를 정의
    const [posts, setPosts] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
    const postsPerPage = 10; // 페이지당 게시글 수 설정
    const router = useRouter(); // 라우터 객체 생성
    const { user } = useAuth(); // 현재 사용자 정보를 인증 컨텍스트에서 가져옴

    // 컴포넌트가 마운트될 때 Firestore에서 게시글 데이터를 불러옴
    useEffect(() => {
        const loadPosts = async () => {
            try {
                const postsData = await fetchPosts(); // Firestore에서 게시글 데이터를 불러옴
                setPosts(postsData); // 전체 게시글을 상태 변수에 저장
                setFilteredPosts(postsData); // 초기에는 전체 게시글을 필터된 게시글 상태에도 저장
                console.log('Posts loaded:', postsData); // 디버깅용 로그
            } catch (error) {
                console.error('Error loading posts:', error); // 게시글 로딩 중 에러 발생 시 출력
            }
        };

        loadPosts();
    }, []); // 빈 배열을 의존성으로 설정하여 컴포넌트가 처음 마운트될 때만 실행

    // '글 작성하기' 버튼을 클릭하면 글 작성 페이지로 이동
    const handleWriteClick = () => {
        router.push('/posting');
    };

    // 게시글 제목을 클릭하면 해당 게시글의 상세보기 페이지로 이동
    const handlePostClick = (id: string) => {
        router.push(`/listPost?id=${id}`);
    };

    // 검색어 입력이 변경될 때 호출되어 검색어 상태를 업데이트
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    // '검색' 버튼을 클릭하면 검색어를 포함하는 게시글만 필터링하여 표시
    const handleSearchClick = () => {
        const results = posts.filter((post) =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPosts(results); // 필터링된 게시글을 상태 변수에 저장
        setCurrentPage(1); // 검색 결과를 처음부터 보기 위해 현재 페이지를 1로 설정
    };

    // '검색 초기화' 버튼을 클릭하면 검색어와 필터링된 게시글을 초기 상태로 되돌림
    const handleResetSearch = () => {
        setSearchTerm(''); // 검색어 상태 초기화
        setFilteredPosts(posts); // 필터링된 게시글을 전체 게시글로 초기화
        setCurrentPage(1); // 현재 페이지를 1로 설정
    };

    // 현재 페이지에 표시할 게시글의 인덱스를 계산
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    // 페이지 번호를 클릭하면 해당 페이지로 이동
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // 날짜를 보기 좋게 포맷팅하는 함수
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <main>
            <div style={{ padding: '20px' }}>
                <h1
                className='text-2xl font-bold mb-6'
                style={{
                    textAlign: 'center',
                    marginBottom: '16px',
                    // textDecoration: 'underline',
                    // textUnderlineOffset: '10px',
                }}>
                    자유게시판
                </h1>
                <hr className='h-px my-4 bg-gray-300 border-0 dark:bg-gray-700'></hr>

                {/* 글 작성하기 버튼을 테이블 바로 위에 위치시키기 */}
                {user && ( // 사용자가 로그인되어 있을 때만 글 작성하기 버튼을 표시
                    <div style={{ marginLeft: '1350px', marginBottom: '20px' }}>
                        <button
                            type='button'
                            className='w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center'
                            onClick={handleWriteClick}
                        >
                        <span className='text-sm font-semibold text-center'><Icon as={EditIcon} size='xl' /></span>
                        </button>
                    </div>
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
                                    width: '70%', // 테이블 너비 조정
                                    borderCollapse: 'collapse',
                                }}
                            >
                                <thead>
                                    <tr>
                                        <th
                                            style={{
                                                borderBottom: '2px solid #ddd',
                                                padding: '8px',
                                                textAlign: 'center',
                                                backgroundColor: '#f9f9f9',
                                                width: '10%', // 번호 열 너비
                                            }}
                                        >
                                            번호
                                        </th>
                                        <th
                                            style={{
                                                borderBottom: '2px solid #ddd',
                                                padding: '8px',
                                                textAlign: 'center',
                                                backgroundColor: '#f9f9f9',
                                                width: '50%', // 글 제목 열 너비 조정
                                            }}
                                        >
                                            글 제목
                                        </th>
                                        <th
                                            style={{
                                                borderBottom: '2px solid #ddd',
                                                padding: '8px',
                                                textAlign: 'center',
                                                backgroundColor: '#f9f9f9',
                                                width: '15%', // 작성자 열 너비
                                            }}
                                        >
                                            작성자
                                        </th>
                                        <th
                                            style={{
                                                borderBottom: '2px solid #ddd',
                                                padding: '8px',
                                                textAlign: 'center',
                                                backgroundColor: '#f9f9f9',
                                                width: '15%', // 작성일 열 너비
                                            }}
                                        >
                                            작성일
                                        </th>
                                        <th
                                            style={{
                                                borderBottom: '2px solid #ddd',
                                                padding: '8px',
                                                textAlign: 'center',
                                                backgroundColor: '#f9f9f9',
                                                width: '5%', // 댓글수 열 너비
                                            }}
                                        >
                                            댓글수
                                        </th>
                                        <th
                                            style={{
                                                borderBottom: '2px solid #ddd',
                                                padding: '8px',
                                                textAlign: 'center',
                                                backgroundColor: '#f9f9f9',
                                                width: '5%', // 조회수 열 너비
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
                                                    borderBottom: '1px solid #ddd',
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
                                                    borderBottom: '1px solid #ddd',
                                                    padding: '8px',
                                                    cursor: 'pointer',
                                                    color: 'blue',
                                                    textDecoration: 'underline',
                                                    textAlign: 'left',
                                                    whiteSpace: 'nowrap', // 제목이 너무 길면 줄바꿈 없이 표시
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis', // 텍스트가 넘칠 경우 말줄임표로 표시
                                                }}
                                                onClick={() =>
                                                    handlePostClick(post.id)
                                                }
                                            >
                                                {post.title}
                                            </td>
                                            <td
                                                style={{
                                                    borderBottom: '1px solid #ddd',
                                                    padding: '8px',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                {post.author}
                                            </td>
                                            <td
                                                style={{
                                                    borderBottom: '1px solid #ddd',
                                                    padding: '8px',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                {formatDate(post.date)}
                                            </td>
                                            <td
                                                style={{

                                                    borderBottom: '1px solid #ddd',
                                                    padding: '8px',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                {post.comments}
                                            </td>
                                            <td
                                                style={{
                                                    borderBottom: '1px solid #ddd',
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
                        </>
                    ) : (
                        <p>작성된 글이 없습니다.</p> // 게시글이 없을 때 메시지 표시
                    )}
                </div>

                {/* 검색과 페이지네이션을 아래로 이동 */}
                <div
                    style={{
                        marginTop: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    {/* 검색어 입력과 검색 버튼을 가로로 배치 */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '20px', // 검색 버튼과 검색어 사이 간격
                        }}
                    >
                        <input
                            type='text'
                            value={searchTerm}
                            onChange={handleSearchChange} // 검색어가 변경되면 상태 업데이트
                            placeholder='검색어를 입력하세요...'
                            style={{
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ddd',
                                width: '400px',
                                marginRight: '10px', // 검색 버튼과의 간격 조정
                            }}
                        />
                        <button
                            type='button'
                            className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'
                            onClick={handleSearchClick} // 검색 버튼 클릭 시 필터링된 게시글 표시
                        >
                            검색
                        </button>
                    </div>

                    {/* 페이지네이션 */}
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
                                ).keys(), // 페이지 번호 생성
                            ].map((number) => (
                                <li
                                    key={number + 1}
                                    style={{ margin: '0 5px' }}
                                >
                                    <button
                                        onClick={() =>
                                            paginate(number + 1) // 페이지 번호 클릭 시 해당 페이지로 이동
                                        }
                                        style={{
                                            background:
                                                number + 1 ===
                                                currentPage
                                                    ? 'orange' // 현재 페이지일 경우 배경색 변경
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
                </div>
            </div>
        </main>
    );
};

export default FreeBoard;
