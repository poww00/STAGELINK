import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const NoticeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/community/notice/${id}`)
      .then((res) => setNotice(res.data))
      .catch((err) => console.error('공지사항 상세조회 실패:', err));
  }, [id]);

  if (!notice) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-gray-500">공지사항을 불러오는 중입니다...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* ✅ 넓은 레이아웃으로 수정 */}
      <main className="flex-grow w-full px-16 py-10">
        {/* ← 목록으로 돌아가기 */}
        <button
          onClick={() => navigate('/community/notice')}
          className="text-blue-600 hover:underline text-sm mb-6"
        >
          ← 목록으로 돌아가기
        </button>

        {/* 제목 */}
        <h1 className="text-2xl font-bold text-blue-700 mb-4">
          {notice.noticeTitle}
        </h1>

        {/* 작성자 & 날짜 */}
        <div className="flex justify-between text-sm text-gray-500 border-b pb-2 mb-6">
          <span>작성자: 관리자</span>
          <span>{notice.noticeDate?.substring(0, 10)}</span>
        </div>

        {/* 본문 */}
        <div className="text-gray-800 text-base whitespace-pre-wrap leading-relaxed">
          {notice.noticeContent}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NoticeDetailPage;
