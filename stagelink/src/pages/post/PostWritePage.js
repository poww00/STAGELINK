import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const PostWritePage = () => {
  const navigate = useNavigate();
  const devMode = true; // ✅ 로그인 우회 여부 설정
  const isLoggedIn = !!localStorage.getItem('accessToken');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [showList, setShowList] = useState([]);
  const [selectedShow, setSelectedShow] = useState('');

  useEffect(() => {
    if (!devMode && !isLoggedIn) {
      alert('로그인 후 글쓰기가 가능합니다.');
      navigate('/login');
    }
  }, [devMode, isLoggedIn, navigate]);

  useEffect(() => {
    axios
      .get('/api/show/titles', {
        params: {
          states: [1], // 🎯 1 = 상영중
          page: 0,
          size: 100,
        },
        paramsSerializer: (params) =>
          Object.entries(params)
            .map(([key, value]) =>
              Array.isArray(value)
                ? value.map((v) => `${key}=${encodeURIComponent(v)}`).join('&')
                : `${key}=${encodeURIComponent(value)}`
            )
            .join('&'),
      })
      .then((res) => {
        setShowList(res.data.content || []);
      })
      .catch((err) => {
        console.error('❌ 공연 목록 조회 실패:', err);
        alert('공연 정보를 불러오지 못했습니다.');
      });
  }, []);

  const handleSubmit = () => {
    if (!title.trim() || !content.trim() || !selectedShow) {
      alert('제목, 내용, 공연을 모두 입력해주세요.');
      return;
    }

    const newPost = {
      postTitle: title,
      postContent: content,
      postRating: rating,
      postShowNo: selectedShow,
    };

    axios
      .post('/api/community/posts', newPost, {
        headers: devMode
          ? {}
          : {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
      })
      .then(() => {
        alert('게시글이 등록되었습니다.');
        navigate('/community/posts');
      })
      .catch((err) => {
        console.error('❌ 글 등록 실패:', err);
        alert('글 등록 중 오류가 발생했습니다.');
      });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate('/community/posts')}
          className="mb-6 text-sm text-blue-600 hover:underline"
        >
          ← 목록으로 돌아가기
        </button>

        <h1 className="text-2xl font-bold text-blue-700 mb-6">게시글 작성</h1>

        {/* 🎭 공연 선택 */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">공연 선택</label>
          <select
            value={selectedShow}
            onChange={(e) => setSelectedShow(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="">공연을 선택하세요</option>
            {showList.map((show) => (
              <option key={show.id} value={show.id}>
                {show.showTitle || `공연 ID: ${show.id}`}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="제목을 입력하세요"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm h-40 resize-none"
            placeholder="내용을 입력하세요"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">평점</label>
          <select
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {'★'.repeat(r)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end">
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

export default PostWritePage;
