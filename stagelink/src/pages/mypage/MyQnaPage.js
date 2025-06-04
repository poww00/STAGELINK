import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyQnaPage = () => {
  // 내가 작성한 QnA 상태
  const [qnas, setQnas] = useState([]);

  // 현재 페이지 번호
  const [page, setPage] = useState(1);

  // 삭제 모달 상태 및 대상 QnA 번호
  const [selectedQnaId, setSelectedQnaId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const pageSize = 15;
  const navigate = useNavigate();

  // QnA 불러오기
  useEffect(() => {
    axios.get('/api/mypage/qna')
      .then(res => setQnas(res.data))
      .catch(err => {
        console.error('QnA 목록 조회 실패:', err);
        alert('QnA 목록을 불러오는 중 오류가 발생했습니다.');
      });
  }, []);

  // 삭제 모달 열기
  const confirmDelete = (questionNo) => {
    setSelectedQnaId(questionNo);
    setShowConfirmModal(true);
  };

  // QnA 삭제 요청
  const handleDelete = () => {
    axios.delete(`/api/community/qna/${selectedQnaId}`)
      .then(() => {
        setQnas(prev => prev.filter(q => q.questionNo !== selectedQnaId));
        setShowConfirmModal(false);
      })
      .catch(err => {
        console.error('QnA 삭제 실패:', err);
        alert('삭제 중 오류가 발생했습니다.');
      });
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(qnas.length / pageSize);
  const pagedQnas = qnas.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* 타이틀 */}
      <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">내가 작성한 Q&A</h1>

      {/* QnA 없음 */}
      {pagedQnas.length === 0 ? (
        <p className="text-gray-500 text-center">작성한 Q&A가 없습니다.</p>
      ) : (
        <>
          {/* QnA 카드 리스트 */}
          <div className="space-y-4">
            {pagedQnas.map((qna) => (
              <div
                key={qna.questionNo}
                className="border rounded p-4 relative bg-white hover:bg-gray-50 shadow-sm cursor-pointer"
                onClick={() => navigate(`/community/qna/${qna.questionNo}`)}
              >
                {/* 질문 내용 */}
                <div className="text-sm text-gray-800 whitespace-pre-wrap mb-2">
                  {qna.questionContents}
                </div>

                {/* 작성일 */}
                <div className="text-sm text-gray-500">
                  작성일: {qna.createDate?.substring(0, 10)}
                </div>

                {/* 답변 상태 및 평점 */}
                <div className="absolute top-2 right-3 text-right text-sm">
                  {qna.answerContents ? (
                    <>
                      <div className="text-green-600 font-medium">답변 완료</div>
                      {qna.qnaRating > 0 ? (
                        <div className="text-yellow-500">
                          {'★'.repeat(qna.qnaRating)}{'☆'.repeat(5 - qna.qnaRating)}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400 italic">
                          아직 평점이 없어요
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-gray-400 font-medium">답변 대기</div>
                  )}
                </div>

                {/* 삭제 버튼 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDelete(qna.questionNo);
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
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-5 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 transition"
              >
                아니요
              </button>
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

export default MyQnaPage;
