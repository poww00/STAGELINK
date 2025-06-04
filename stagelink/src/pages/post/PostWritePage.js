import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const PostWritePage = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('accessToken');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [showList, setShowList] = useState([]);
  const [selectedShow, setSelectedShow] = useState('');

  // 로그인 상태 확인 및 Axios 헤더 설정
  useEffect(() => {
    if (!isLoggedIn) {
      alert('로그인 후 글쓰기가 가능합니다.');
      navigate('/login');
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [isLoggedIn, navigate]);

  // 공연 목록 불러오기 (상영중 공연만)
  useEffect(() => {
    axios
      .get('/api/show/titles', {
        params: {
          states: [1],
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
        console.error('공연 목록 조회 실패:', err);
        alert('공연 정보를 불러오지 못했습니다.');
      });
  }, []);

  // 등록 버튼 클릭 시
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
      .post('/api/community/posts', newPost)
      .then(() => {
        alert('게시글이 등록되었습니다.');
        navigate('/community/posts');
      })
      .catch((err) => {
        console.error('글 등록 실패:', err);
        alert('글 등록 중 오류가 발생했습니다.');
      });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="grow w-[1000px] mx-auto py-10 min-h-[calc(100vh-96px)]">
        <button
          onClick={() => navigate('/community/posts')}
          className="mb-6 text-sm text-blue-600 hover:underline"
        >
          ← 목록으로 돌아가기
        </button>

        <h1 className="text-2xl font-bold text-blue-700 mb-6">게시글 작성</h1>

        {/* 공연 선택 */}
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
