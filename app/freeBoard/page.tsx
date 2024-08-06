import React from "react";

// 예시 데이터
const posts = [
  {
    id: 1,
    title: "게시물 제목 1",
    author: "작성자 1",
    date: "2024-08-01",
    comments: 5,
    views: 100,
  },
  {
    id: 2,
    title: "게시물 제목 2",
    author: "작성자 2",
    date: "2024-08-02",
    comments: 3,
    views: 200,
  },
  {
    id: 3,
    title: "게시물 제목 3",
    author: "작성자 3",
    date: "2024-08-03",
    comments: 8,
    views: 150,
  },
];

const FreeBoard = () => {
  return (
    <main>
      <div style={{ padding: "20px" }}>
        <h1 style={{ textAlign: "center", fontSize: "36px" }}>자유게시판</h1>
        {/* 게시판 리스트 */}
        <div style={{ marginTop: "20px" }}>
          {posts.length > 0 ? (
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
            <p>게시물이 없습니다.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default FreeBoard;
