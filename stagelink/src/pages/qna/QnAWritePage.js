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

  useEffect(() => {
    if (!isLoggedIn) {
      alert('로그인 후 이용 가능합니다.');
      navigate('/login');
    } else {
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }
  }, [isLoggedIn, accessToken, navigate]);

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
    </div>
  );
};

export default QnaWritePage;
