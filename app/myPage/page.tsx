"use client";

import React, { useState, useEffect } from 'react';

function MyPage() {
  const [formData, setFormData] = useState({
    name: '이름',  // 초기값을 예시로 설정
    username: '아이디',  // 초기값을 예시로 설정
    password: '',
    confirmPassword: '',
    email: ''
  });

  // 사용자의 정보를 가져오는 함수 (예: API 호출)
  const fetchUserData = async () => {
    try {
      // 예: 사용자 정보를 가져오는 API 호출
      const response = await fetch('/api/user'); // API URL
      const data = await response.json();
      setFormData((prevData) => ({
        ...prevData,
        email: data.email,  // 실제 사용자 이메일로 업데이트
        name: data.name,    // 실제 사용자 이름으로 업데이트 (필요한 경우)
        username: data.username // 실제 사용자 아이디로 업데이트 (필요한 경우)
      }));
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기서 formData를 제출하는 로직을 추가합니다.
    console.log('Form submitted:', formData);
  };

  return (
    <main className="flex items-center justify-center h-screen p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl flex flex-col space-y-4">
        <p className="text-2xl font-semibold mb-32 text-center">회원정보 확인/수정하기</p>
        <div className="flex items-center space-x-4">
          <label htmlFor="name" className="w-1/3 text-gray-700 text-center">이름</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            readOnly
            className="border border-gray-300 p-2 rounded w-2/3 bg-gray-100 cursor-not-allowed"
          />
        </div>
        <hr />
        <div className="flex items-center space-x-4">
          <label htmlFor="username" className="w-1/3 text-gray-700 text-center">아이디</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            readOnly
            className="border border-gray-300 p-2 rounded w-2/3 bg-gray-100 cursor-not-allowed"
          />
        </div>
        <hr />
        <div className="flex items-center space-x-4">
          <label htmlFor="password" className="w-1/3 text-gray-700 text-center">비밀번호</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-2/3"
          />
        </div>
        <hr />
        <div className="flex items-center space-x-4">
          <label htmlFor="confirmPassword" className="w-1/3 text-gray-700 text-center">비밀번호 확인</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-2/3"
          />
        </div>
        <hr />
        <div className="flex items-center space-x-4">
          <label htmlFor="email" className="w-1/3 text-gray-700 text-center">이메일</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-2/3"
          />
        </div>
        <hr />
        <button
          type="submit"
          className="bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-500 w-1/3 mx-auto">
          수정하기
        </button>
      </form>
    </main>
  );
}

export default MyPage;
