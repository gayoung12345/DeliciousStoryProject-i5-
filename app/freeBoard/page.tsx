"use client";
import React from "react";

// 예시 데이터
const posts = [
  {
    id: 1,
    title: "i5 팀장입니다.",
    author: "추호연",
    date: "2024-08-01",
    comments: 5,
    views: 100,
  },
  {
    id: 2,
    title: "백엔드 경력자입니다.",
    author: "김가영",
    date: "2024-08-02",
    comments: 3,
    views: 200,
  },
  {
    id: 3,
    title: "프론트엔트 경력자입니다.",
    author: "전보람",
    date: "2024-08-03",
    comments: 8,
    views: 150,
  },
  {
    id: 4,
    title: "프론트엔트 경력자2 입니다.",
    author: "이다은",
    date: "2024-08-03",
    comments: 7,
    views: 300,
  },
  {
    id: 5,
    title: "열심히 하려는 사람입니다.",
    author: "김유미",
    date: "2024-08-06",
    comments: 11,
    views: 300,
  },
];

//버튼 클릭하면 글 작성페이지(posting) 로 이동하게 만들어야 됨
const FreeBoard = () => {
  const handleWriteClick = () => {
    // 글쓰기 버튼 클릭 시 실행할 코드
    alert("글쓰기 페이지로 이동합니다.");
  };

  return (
    <main>
      <div style={{ padding: "20px" }}>
        <h1 style={{ textAlign: "center", fontSize: "36px" }}>자유게시판</h1>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" //마우스 올리면 진한 파란색
          style={{ float: "right", marginBottom: "20px" }} // 아래쪽 마진 추가
          onClick={handleWriteClick}
        >
          글 작성하기
        </button>

        {/* 게시판 리스트 */}
        <div style={{ marginTop: "20px" }}>
          {posts.length > 0 ? ( //게시글이 0보다 크면 나오는 코드
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    번호
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    글 제목
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    작성자
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    작성일
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    댓글수
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    조회수
                  </th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      {post.id}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {post.title}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      {post.author}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      {post.date}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      {post.comments}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      {post.views}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            //게시글이 없으면 실행되는 코드
            <p>게시물이 없습니다.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default FreeBoard;
