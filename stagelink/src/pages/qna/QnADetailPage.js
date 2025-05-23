import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const QnaDetailPage = () => {
  const { questionNo } = useParams();
  const navigate = useNavigate();
  const [qna, setQna] = useState(null);
  const devMode = true;
  const testMemberNo = 1003;
  const isLoggedIn = !!localStorage.getItem('accessToken');

  useEffect(() => {
    axios.get(`/api/community/qna/${questionNo}`)
      .then((res) => setQna(res.data))
      .catch((err) => {
        console.error('QnA 조회 실패:', err);
        alert('QnA 정보를 불러오지 못했습니다.');
      });
  }, [questionNo]);

  const handleDelete = () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    const headers = devMode ? {} : {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    };

    axios.delete(`/api/community/qna/${questionNo}`, { headers })
      .then(() => {
        alert('QnA가 삭제되었습니다.');
        navigate('/community/qna');
      })
      .catch((err) => {
        console.error('QnA 삭제 실패:', err);
        alert('삭제 중 오류가 발생했습니다.');
      });
  };

  const handleRating = (ratingValue) => {
    if (!qna?.answerContents || qna.answerContents.trim() === '') {
      alert('답변이 등록된 이후에만 평점을 남길 수 있습니다.');
      return;
    }

    const headers = devMode ? {} : {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    };

    axios.post(`/api/community/qna/${questionNo}/rating`, {
      rating: ratingValue
    }, { headers })
      .then((res) => {
        alert('평점이 등록되었습니다!');
        setQna(res.data); // 새로 받은 평점 데이터 반영
      })
      .catch((err) => {
        console.error('평점 등록 실패:', err);
        alert('평점 등록 중 오류가 발생했습니다.');
      });
  };

  const formattedDate = qna?.createDate?.substring(0, 10);
  const rating = qna?.qnaRating ?? 0;
  const isAuthor = devMode || qna?.member === testMemberNo;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="grow w-full px-16 py-10 min-h-[calc(100vh-96px)]">
        <button
          onClick={() => navigate('/community/qna')}
          className="mb-6 text-sm text-blue-600 hover:underline"
        >
          ← 목록으로 돌아가기
        </button>

        <h1 className="text-3xl font-bold text-center text-blue-600 mb-10">QnA 상세</h1>

        {qna ? (
          <div className="space-y-8">
            {/* 질문 */}
            <div className="border-b pb-4 mb-6 text-lg text-gray-900 whitespace-pre-line relative">
              {qna.questionContents}
              {isAuthor && (
                <button
                  onClick={handleDelete}
                  className="absolute top-0 right-0 text-sm text-red-500 hover:underline"
                >
                  삭제하기
                </button>
              )}
            </div>

            {/* 답변 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">답변</h2>
              <div className="border rounded p-4 bg-white text-sm flex flex-col gap-2">
                <div className="flex justify-between text-gray-600 text-sm">
                  <span className="font-semibold">관리자</span>
                  <span>{formattedDate}</span>
                </div>
                <div className="text-gray-800 whitespace-pre-line">
                  {qna.answerContents && qna.answerContents.trim() !== ''
                    ? qna.answerContents
                    : '답변이 없습니다.'}
                </div>
                <div className="text-sm text-right text-gray-600">
                  평점:{' '}
                  {qna.answerContents && qna.answerContents.trim() !== '' ? (
                    <span className="text-yellow-500 cursor-pointer">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <span
                          key={value}
                          onClick={() => handleRating(value)}
                          style={{ cursor: 'pointer' }}
                        >
                          {value <= rating ? '★' : '☆'}
                        </span>
                      ))}
                    </span>
                  ) : (
                    <span className="text-gray-400">답변 후 평점 가능</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">로딩 중...</p>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default QnaDetailPage;
