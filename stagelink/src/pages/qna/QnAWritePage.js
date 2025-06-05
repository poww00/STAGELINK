import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const QnaWritePage = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');
  const isLoggedIn = !!accessToken;

  const [question, setQuestion] = useState('');
  const [showModal, setShowModal] = useState(false); // 차단 상태 모달

  // JWT 토큰 파싱 함수
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  // 로그인 상태 및 BLOCKED 확인
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (accessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      const decoded = parseJwt(accessToken);
      if (decoded?.memberState === 'BLOCKED') {
        setShowModal(true); // 차단 모달 표시
      }
    }
  }, [isLoggedIn, accessToken, navigate]);

  // 질문 등록
  const handleSubmit = () => {
    if (!question.trim()) {
      alert('질문 내용을 입력해주세요.');
      return;
    }

    const data = { questionContents: question };

    axios
      .post('/api/community/qna', data)
      .then(() => {
        alert('질문이 등록되었습니다.');
        navigate('/community/qna');
      })
      .catch((err) => {
        console.error('질문 등록 실패:', err);
        alert('질문 등록 중 오류가 발생했습니다.');
      });
  };

  // 모달 확인 버튼 클릭 시
  const handleModalConfirm = () => {
    setShowModal(false);
    navigate('/community/qna');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow w-full max-w-5xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate('/community/qna')}
          className="mb-6 text-sm text-blue-600 hover:underline"
        >
          ← 목록으로 돌아가기
        </button>

        <h1 className="text-2xl font-bold text-blue-700 mb-6">질문 등록</h1>

        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="질문 내용을 입력하세요"
          className="w-full border rounded px-4 py-3 text-base h-52 resize-none"
        />

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            등록하기
          </button>
        </div>
      </main>

      <Footer />

      {/* BLOCKED 모달 */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded shadow-lg p-6 w-80 text-center">
            <h2 className="text-lg font-semibold mb-4 text-red-600">작성 권한 제한</h2>
            <p className="text-sm text-gray-700 mb-6 whitespace-nowrap">
              현재 회원님의 글쓰기 권한은 제한되어 있습니다.
            </p>
            <button
              onClick={handleModalConfirm}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QnaWritePage;
