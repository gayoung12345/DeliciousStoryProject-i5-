// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const FreeBoard = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    // 여기에 로그인 로직 추가 (예: API 요청)
    console.log("Username:", username);
    console.log("Password:", password);

    // 예시로 로그인 성공 가정
    if (username === "admin" && password === "password") {
      router.push("/dashboard");
    } else {
      alert("로그인 실패");
    }
  };

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div>
        <p>로그인</p>
        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", width: "300px" }}
        >
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit">Login</button>
        </form>
      </div>
    </main>
  );
};

export default FreeBoard;
