import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyPostsPage = () => {
  // 내가 작성한 게시글 목록 상태
  const [posts, setPosts] = useState([]);

  // 현재 페이지 상태
  const [page, setPage] = useState(1);

  // 삭제 모달 표시 여부 및 삭제 대상 postNo
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPostNo, setSelectedPostNo] = useState(null);

  // 페이지당 게시글 수
  const pageSize = 15;

  const navigate = useNavigate();

  // 페이지 진입 시: 로그인 확인 및 게시글 데이터 가져오기
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인 후 이용 가능합니다.');
      navigate('/login');
      return;
    }

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchMyPosts();
  }, []);

  // 서버에서 게시글 목록 불러오기
  const fetchMyPosts = async () => {
    try {
      const res = await axios.get('/api/mypage/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('내 게시글 조회 실패:', err);
    }
  };

  // 게시글 삭제 요청
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/mypage/posts/${selectedPostNo}`);
      alert('게시글이 삭제되었습니다.');
      setShowConfirmModal(false);
      fetchMyPosts(); // 삭제 후 다시 목록 불러오기
    } catch (err) {
      console.error('삭제 실패:', err);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(posts.length / pageSize);

  // 현재 페이지에 해당하는 게시글 목록
  const pagedPosts = posts.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* 타이틀 */}
      <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">
        내가 작성한 게시글
      </h1>

      {/* 게시글이 없는 경우 */}
      {pagedPosts.length === 0 ? (
        <p className="text-gray-500 text-center">작성한 게시글이 없습니다.</p>
      ) : (
        <>
          {/* 게시글 카드 리스트 */}
          <div className="space-y-4">
            {pagedPosts.map((post) => (
              <div
                key={post.postNo}
                className="border rounded p-4 bg-white shadow-sm hover:bg-gray-50 relative cursor-pointer"
                onClick={() => navigate(`/community/posts/${post.postNo}`)}
              >
                {/* 게시글 제목 */}
                <div className="text-lg font-semibold text-blue-700">
                  {post.postTitle}
                </div>

                {/* 별점 */}
                <div className="text-yellow-500 text-sm mb-1">
                  {'★'.repeat(post.postRating)}{'☆'.repeat(5 - post.postRating)}
                </div>

                {/* 작성일 */}
                <div className="text-sm text-gray-500">
                  {post.postRegisterDate?.substring(0, 10)}
                </div>

                {/* 삭제 버튼 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // 부모 div 클릭 방지
                    setSelectedPostNo(post.postNo);
                    setShowConfirmModal(true);
                  }}
                  className="absolute bottom-2 right-2 text-xs text-red-500 hover:underline"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>

          {/* 페이지네이션 */}
          <div className="flex justify-center mt-8 space-x-1">
            {/* 이전 페이지 버튼 */}
            <button onClick={() => setPage((p) => Math.max(1, p - 1))}>
              &laquo;
            </button>

            {/* 페이지 번호 */}
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-2 py-1 rounded ${
                  i + 1 === page
                    ? 'bg-blue-600 text-white'
                    : 'text-blue-600'
                }`}
              >
                {i + 1}
              </button>
            ))}

            {/* 다음 페이지 버튼 */}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
              &raquo;
            </button>
          </div>
        </>
      )}

      {/* 삭제 확인 모달 */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white px-8 py-6 rounded-xl shadow-xl w-[320px] text-center">
            <p className="text-lg font-semibold text-gray-800 mb-2">삭제하시겠어요?</p>
            <p className="text-sm text-gray-500 mb-6">이 작업은 되돌릴 수 없어요.</p>
            <div className="flex justify-center gap-4">
              {/* 취소 버튼 */}
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-5 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 transition"
              >
                아니요
              </button>

              {/* 삭제 실행 버튼 */}
              <button
                onClick={handleDelete}
                className="px-5 py-2 rounded-full bg-white border border-red-300 hover:bg-red-500 hover:text-white text-sm text-red-500 font-medium transition"
              >
                삭제할게요
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPostsPage;
