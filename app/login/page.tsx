// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    // 여기에 로그인 로직 추가 (예: API 요청)
    console.log("Username:", username);
    console.log("Password:", password);

    // 예시로 로그인 성공 가정
    if (username === "admin" && password === "password") {
      router.push("/");
    } else {
      alert("로그인 실패");
    }
  };

  return (
    <main className="flex items-center justify-center h-screen p-4">
      <div className="w-full max-w-sm">
        <p className="text-xl font-semibold mb-4">로그인</p>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <label className="flex flex-col">
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="border border-gray-300 p-2 rounded"
            />
          </label>
          <label className="flex flex-col">
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-gray-300 p-2 rounded"
            />
          </label>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Login
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <a href="/signUp" className="text-blue-500 hover:underline text-sm">
            회원가입
          </a>
        </div>
      </div>
    </main>
  );
};

export default Login;
