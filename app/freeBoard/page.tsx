import React from "react";

// 예시 데이터
const posts = [
  { id: 1, title: "게시물 제목 1", content: "게시물 내용 1" },
  { id: 2, title: "게시물 제목 2", content: "게시물 내용 2" },
  { id: 3, title: "게시물 제목 3", content: "게시물 내용 3" },
];

const FreeBoard = () => {
  return (
    <main>
      <div style={{ padding: "20px" }}>
        <h1>자유게시판</h1>
        <p>test</p>
        {/* 게시판 리스트 */}
        <div style={{ marginTop: "20px" }}>
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  marginBottom: "10px",
                  padding: "10px",
                }}
              >
                <h2 style={{ margin: "0", fontSize: "18px" }}>{post.title}</h2>
                <p style={{ margin: "5px 0 0", fontSize: "14px" }}>
                  {post.content}
                </p>
              </div>
            ))
          ) : (
            <p>게시물이 없습니다.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default FreeBoard;
