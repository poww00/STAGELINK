import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const QnaDetailPage = () => {
  const { questionNo } = useParams();
  const navigate = useNavigate();
  const [qna, setQna] = useState(null);

  const accessToken = localStorage.getItem('accessToken');
  const isLoggedIn = !!accessToken;

  // JWT 파싱 함수
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  const loginMemberId = isLoggedIn ? parseJwt(accessToken)?.id : null;
  const isAuthor = isLoggedIn && qna?.member === loginMemberId;

  useEffect(() => {
    if (accessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }

    axios
      .get(`/api/community/qna/${questionNo}`)
      .then((res) => setQna(res.data))
      .catch((err) => {
        console.error('QnA 조회 실패:', err);
        alert('QnA 정보를 불러오지 못했습니다.');
      });
  }, [questionNo, accessToken]);

  const handleDelete = () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    axios
      .delete(`/api/community/qna/${questionNo}`)
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
    if (!isLoggedIn) {
      alert('로그인 후 이용해주세요.');
      return;
    }

    if (!qna?.answerContents || qna.answerContents.trim() === '') {
      alert('답변이 등록된 이후에만 평점을 남길 수 있습니다.');
      return;
    }

    axios
      .post(`/api/community/qna/${questionNo}/rating`, {
        rating: ratingValue,
      })
      .then((res) => {
        alert('평점이 등록되었습니다!');
        setQna(res.data);
      })
      .catch((err) => {
        console.error('평점 등록 실패:', err);
        alert('작성자만 평점을 남길 수 있습니다.');
      });
  };

  const formattedDate = qna?.createDate?.substring(0, 10);
  const rating = qna?.qnaRating ?? 0;

  const hasAnswer =
    qna?.answerContents && qna.answerContents.trim() !== '';

  const showStars = hasAnswer && (rating > 0 || isAuthor);
  const showOnlyMessage = hasAnswer && rating === 0 && !isAuthor;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="grow w-[1000px] mx-auto py-10 min-h-[calc(100vh-96px)]">
        <button
          onClick={() => navigate('/community/qna')}
          className="mb-6 text-sm text-blue-600 hover:underline"
        >
          ← 목록으로 돌아가기
        </button>

        <h1 className="text-3xl font-bold text-center text-blue-600 mb-10">
          QnA 상세
        </h1>

        {qna ? (
          <div className="space-y-8">
            {/* 질문 */}
            <div className="border-b pb-4 mb-6 text-lg text-gray-900 whitespace-pre-line relative">
              {qna.questionContents}
              {isAuthor && (
                <button
                  onClick={handleDelete}
                  className="absolute top-0 right-0 text-red-500 text-sm hover:underline"
                >
                  삭제
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
                  {hasAnswer ? qna.answerContents : '답변이 없습니다.'}
                </div>

                {/* 평점 영역 */}
                {hasAnswer && (
                  <div className="text-sm text-right text-gray-600">
                    {showStars && (
                      <>
                        평점:{' '}
                        <span className="text-yellow-500">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <span
                              key={value}
                              onClick={
                                rating === 0 && isAuthor
                                  ? () => handleRating(value)
                                  : undefined
                              }
                              style={{
                                cursor:
                                  rating === 0 && isAuthor
                                    ? 'pointer'
                                    : 'default',
                              }}
                            >
                              {value <= rating ? '★' : '☆'}
                            </span>
                          ))}
                        </span>
                      </>
                    )}
                    {showOnlyMessage && (
                      <div className="italic text-gray-400 mt-1">
                        작성자만 평점을 남길 수 있어요
                      </div>
                    )}
                  </div>
                )}
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
