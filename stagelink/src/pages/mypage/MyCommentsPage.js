import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyCommentsPage = () => {
  // 내가 작성한 댓글 목록 상태
  const [comments, setComments] = useState([]);

  // 현재 페이지 번호
  const [page, setPage] = useState(1);

  // 삭제 모달 상태 및 대상 댓글 번호
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedCommentNo, setSelectedCommentNo] = useState(null);

  const pageSize = 15;
  const navigate = useNavigate();

  // 댓글 목록 로드
  useEffect(() => {
    axios.get('/api/mypage/comments')
      .then(res => setComments(res.data))
      .catch(err => {
        console.error('내 댓글 목록 조회 실패:', err);
        alert('댓글 목록을 불러오는 중 오류가 발생했습니다.');
      });
  }, []);

  // 삭제 모달 열기
  const confirmDelete = (commentNo) => {
    setSelectedCommentNo(commentNo);
    setShowConfirmModal(true);
  };

  // 댓글 삭제 요청
  const handleDelete = () => {
    axios.delete(`/api/mypage/comments/${selectedCommentNo}`)
      .then(() => {
        setComments(prev => prev.filter(c => c.commentNo !== selectedCommentNo));
        setShowConfirmModal(false);
      })
      .catch(err => {
        console.error('댓글 삭제 실패:', err);
        alert('댓글 삭제 중 오류가 발생했습니다.');
      });
  };

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(comments.length / pageSize);

  // 현재 페이지의 댓글 목록
  const pagedComments = comments.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* 타이틀 */}
      <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">내가 쓴 댓글</h1>

      {/* 댓글이 없는 경우 */}
      {pagedComments.length === 0 ? (
        <p className="text-gray-500 text-center">작성한 댓글이 없습니다.</p>
      ) : (
        <>
          {/* 댓글 카드 리스트 */}
          <div className="space-y-4">
            {pagedComments.map(comment => (
              <div
                key={comment.commentNo}
                className="border rounded p-4 bg-white shadow-sm hover:bg-gray-50 relative cursor-pointer"
                onClick={() => navigate(`/community/posts/${comment.postNo}`)}
              >
                {/* 작성일 */}
                <div className="text-sm text-gray-500 mb-1">
                  작성일: {comment.commentRegisterDate?.substring(0, 10)}
                </div>

                {/* 댓글 내용 */}
                <p className="text-sm text-gray-800 whitespace-pre-wrap">{comment.commentContent}</p>

                {/* 별점 */}
                <div className="text-yellow-500 text-sm mt-1">
                  {'★'.repeat(comment.commentRating)}{'☆'.repeat(5 - comment.commentRating)}
                </div>

                {/* 삭제 버튼 */}
                <button
                  className="absolute bottom-2 right-2 text-xs text-red-500 hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDelete(comment.commentNo);
                  }}
                >
                  삭제
                </button>
              </div>
            ))}
          </div>

          {/* 페이지네이션 */}
          <div className="flex justify-center mt-8 space-x-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))}>&laquo;</button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-2 py-1 rounded ${
                  i + 1 === page ? 'bg-blue-600 text-white' : 'text-blue-600'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>&raquo;</button>
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

export default MyCommentsPage;
