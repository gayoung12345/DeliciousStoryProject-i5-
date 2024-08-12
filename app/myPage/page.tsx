"use client";

import React, { useState, useEffect } from 'react';
import { auth } from '../../lib/firebaseConfig';  // Firebase 설정 파일 경로에 맞게 수정하세요
import { onAuthStateChanged, updatePassword } from 'firebase/auth';

function MyPage() {
  // 사용자 정보와 비밀번호 관련 상태를 관리하는 useState 훅
  const [formData, setFormData] = useState({
    username: '',  // 이메일이 들어갈 부분
    password: '',
    confirmPassword: ''
  });

  // 오류 메시지를 저장하는 상태
  const [error, setError] = useState('');
  // 로딩 상태를 관리하는 상태 (Firebase 인증 상태를 확인하는 동안 로딩 중 표시)
  const [loading, setLoading] = useState(true);

  // 컴포넌트가 마운트되었을 때 사용자 인증 상태를 확인
  useEffect(() => {
    // 사용자 인증 상태가 변경될 때 호출되는 함수
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // 사용자가 로그인된 경우, 이메일을 폼 데이터에 설정
        setFormData((prevData) => ({
          ...prevData,
          username: user.email || ''  // 이메일을 아이디로 설정
        }));
        setLoading(false);  // 로딩 상태를 해제
      } else {
        // 사용자가 로그인되어 있지 않은 경우 오류 메시지 설정
        setError('사용자가 로그인되어 있지 않습니다.');
        setLoading(false);  // 로딩 상태를 해제
      }
    });

    // 컴포넌트가 언마운트될 때 구독 해제
    return () => unsubscribe();
  }, []);

  // 입력 필드의 값을 변경하는 핸들러 함수
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // 폼 제출 시 호출되는 함수
  const handleSubmit = async (e) => {
    e.preventDefault();  // 폼의 기본 동작을 방지
    setError('');  // 오류 메시지 초기화

    // 비밀번호와 비밀번호 확인이 일치하는지 확인
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const user = auth.currentUser;  // 현재 로그인한 사용자 정보 가져오기
      if (user) {
        // 현재 사용자에 대해 비밀번호 업데이트
        await updatePassword(user, formData.password);
        alert('비밀번호가 성공적으로 변경되었습니다.');
        window.location.reload(); // 페이지 새로고침        
      } else {
        setError('사용자가 로그인되어 있지 않습니다.');  // 사용자가 로그인되어 있지 않은 경우 오류 메시지 설정
      }
    } catch (error) {
      // 비밀번호 변경 중 오류 발생 시 오류 메시지 설정
      setError('비밀번호 변경 중 오류가 발생했습니다: ' + error.message);
    }
  };

  // 로딩 중 상태일 때 로딩 메시지 표시
  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <main className="flex items-center justify-center h-screen p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl flex flex-col space-y-4">
        <p className="text-2xl font-semibold mb-32 text-center">회원정보 확인/수정하기</p>
        {/* 오류 메시지가 있을 경우 표시 */}
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div className="flex items-center space-x-4">
          <label htmlFor="username" className="w-1/3 text-gray-700 text-center">이메일</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            readOnly
            className="border border-gray-300 p-2 rounded w-2/3 bg-gray-100 cursor-not-allowed"
          />
        </div>
        <hr />
        <div className="flex items-center space-x-4">
          <label htmlFor="password" className="w-1/3 text-gray-700 text-center">새 비밀번호</label>
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
