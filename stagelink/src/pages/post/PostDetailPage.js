import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const PostDetailPage = () => {
  // URL에서 postNo 추출
  const { postNo } = useParams();
  const navigate = useNavigate();

  // 상태 변수 정의
  const [post, setPost] = useState(null);               // 게시글 정보
  const [comments, setComments] = useState([]);         // 댓글 목록
  const [commentContent, setCommentContent] = useState(''); // 댓글 내용
  const [commentRating, setCommentRating] = useState(5);    // 댓글 평점
  const [commentPage, setCommentPage] = useState(1);        // 현재 댓글 페이지
  const commentPageSize = 10;                               // 댓글 페이지당 개수

  // 토큰 가져오기 및 로그인 여부 판단
  const accessToken = localStorage.getItem('accessToken');
  const isLoggedIn = !!accessToken;

  // JWT 토큰 파싱 함수
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  // 로그인 사용자 정보
  const loginMemberId = isLoggedIn ? parseJwt(accessToken)?.id : null;
  const memberState = isLoggedIn ? parseJwt(accessToken)?.memberState : null;
  const isAuthor = isLoggedIn && post?.member != null && Number(post.member) === loginMemberId;

  // Axios 전역 헤더 설정
  useEffect(() => {
    if (accessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }
  }, [accessToken]);

  // 게시글 정보 불러오기
  useEffect(() => {
    axios.get(`/api/community/posts/${postNo}`)
      .then((res) => setPost(res.data))
      .catch((err) => console.error('게시글 조회 실패:', err));
  }, [postNo]);

  // 댓글 목록 불러오기
  const fetchComments = () => {
    axios.get(`/api/community/posts/comments/${postNo}`)
      .then((res) => setComments(res.data))
      .catch((err) => console.error('댓글 조회 실패:', err));
  };

  useEffect(() => {
    fetchComments();
  }, [postNo]);

  // 댓글 등록
  const handleSubmitComment = () => {
    if (!isLoggedIn) {
      alert('로그인 후 이용해주세요.');
      return;
    }

    if (memberState === 'BLOCKED') {
      alert('현재 댓글 작성 권한이 제한된 상태입니다.');
      return;
    }

    if (!commentContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    const newComment = {
      postNo: parseInt(postNo),
      commentContent,
      commentRating,
    };

    axios.post('/api/community/posts/comments', newComment)
      .then(() => {
        setCommentContent('');
        setCommentRating(5);
        fetchComments();
        setCommentPage(1);
      })
      .catch((err) => {
        console.error('댓글 등록 실패:', err);
        alert('댓글 등록 중 오류가 발생했습니다.');
      });
  };

  // 댓글 삭제
  const handleDeleteComment = (commentNo) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;

    axios.delete(`/api/community/posts/comments/${commentNo}`)
      .then(() => {
        alert('댓글이 삭제되었습니다.');
        fetchComments();
      })
      .catch((err) => {
        console.error('댓글 삭제 실패:', err);
        alert('댓글 삭제 중 오류가 발생했습니다.');
      });
  };

  // 댓글 신고
  const handleReportComment = (commentNo) => {
    if (!isLoggedIn) {
      alert('로그인 후 이용해주세요.');
      return;
    }

    axios.post(`/api/community/posts/comments/${commentNo}/report`, {
      reason: '부적절한 내용입니다.'
    })
      .then(() => alert('댓글을 신고했습니다.'))
      .catch((err) => {
        console.error('댓글 신고 실패:', err);
        alert('이미 신고했거나 오류가 발생했습니다.');
      });
  };

  // 게시글 신고
  const handleReportPost = () => {
    if (!isLoggedIn) {
      alert('로그인 후 이용해주세요.');
      return;
    }

    const reportData = {
      postNo: post.postNo,
      suspectId: post.member,
      reportReason: '부적절한 콘텐츠입니다.'
    };

    axios.post(`/api/community/posts/${post.postNo}/report`, reportData)
      .then(() => alert('게시글을 신고했습니다.'))
      .catch((err) => {
        console.error('게시글 신고 실패:', err);
        alert('이미 신고했거나 오류가 발생했습니다.');
      });
  };

  // 게시글 삭제
  const handleDeletePost = () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    axios.delete(`/api/community/posts/${postNo}`)
      .then(() => {
        alert('게시글이 삭제되었습니다.');
        navigate('/community/posts');
      })
      .catch((err) => {
        console.error('게시글 삭제 실패:', err);
        alert('삭제 중 오류가 발생했습니다.');
      });
  };

  // 댓글 페이징 계산
  const totalCommentPages = Math.ceil(comments.length / commentPageSize);
  const pagedComments = comments.slice((commentPage - 1) * commentPageSize, commentPage * commentPageSize);

  const formattedDate = post?.postRegisterDate?.substring(0, 10);

  if (!post) {
    // 게시글 로딩 중 화면
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-gray-500">게시글을 불러오는 중입니다...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="grow w-[1000px] mx-auto py-6 min-h-[calc(100vh-96px)]">
        {/* 목록으로 돌아가기 버튼 */}
        <button
          onClick={() => navigate('/community/posts')}
          className="text-blue-600 hover:underline text-sm mb-4"
        >
          ← 목록으로 돌아가기
        </button>

        {/* 게시글 제목 */}
        <h1 className="text-2xl font-bold text-blue-700 mb-2">{post.postTitle}</h1>

        {/* 공연명 표시 */}
        {post.showName && (
          <div className="mb-2 text-blue-500 text-sm font-medium">
            관련 공연: {post.showName}
          </div>
        )}

        {/* 작성자 정보 및 신고 버튼 */}
        <div className="flex justify-between items-center text-sm text-gray-500 border-b pb-2 mb-3">
          <span>작성자: {post.nickname}</span>
          <div className="flex items-center gap-4">
            <span>{formattedDate}</span>
            <button
              onClick={handleReportPost}
              className="text-xs text-red-500 hover:underline"
            >
              신고하기
            </button>
          </div>
        </div>

        {/* 게시글 평점 */}
        <div className="text-yellow-500 text-sm mb-3">
          {'★'.repeat(post.postRating || 0)}
          {'☆'.repeat(5 - (post.postRating || 0))}
        </div>

        {/* 게시글 본문 */}
        <div className="whitespace-pre-wrap leading-relaxed text-gray-800 text-base mb-4">
          {post.postContent}
        </div>

        {/* 수정/삭제 버튼 - 본문 하단 오른쪽 */}
        {isAuthor && (
          <div className="flex justify-end mb-4 space-x-3">
            <button
              onClick={() => navigate(`/community/posts/edit/${post.postNo}`)}
              className="text-blue-600 hover:underline text-sm"
            >
              수정하기
            </button>
            <span className="text-gray-400">|</span>
            <button
              onClick={handleDeletePost}
              className="text-red-500 hover:underline text-sm"
            >
              삭제하기
            </button>
          </div>
        )}

        {/* 댓글 작성 영역 */}
        <div className="mb-6 border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">댓글 쓰기</h2>
          {isLoggedIn ? (
            memberState === 'BLOCKED' ? (
              <p className="text-sm text-red-500 mt-2">
                현재 댓글 작성 권한이 제한된 상태입니다.
              </p>
            ) : (
              <>
                <div className="mb-2">
                  <label className="text-sm mr-2">평점</label>
                  <select
                    value={commentRating}
                    onChange={(e) => setCommentRating(parseInt(e.target.value))}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    {[1, 2, 3, 4, 5].map((r) => (
                      <option key={r} value={r}>
                        {'★'.repeat(r)}
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="댓글 내용을 입력하세요 (최대 500자)"
                  maxLength={500}
                  className="w-full border rounded p-2 mb-2 text-sm"
                />
                <button
                  onClick={handleSubmitComment}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  등록하기
                </button>
              </>
            )
          ) : (
            <p className="text-sm text-gray-500 mt-2">
              로그인 후 댓글을 작성하실 수 있습니다.
            </p>
          )}
        </div>

        {/* 댓글 목록 */}
        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold mb-3">댓글</h2>
          {comments.length === 0 ? (
            <p className="text-gray-500 text-sm">등록된 댓글이 없습니다.</p>
          ) : (
            <>
              <div className="space-y-4">
                {pagedComments.map((comment) => {
                  const canDelete = isLoggedIn && Number(comment.member) === loginMemberId;

                  return (
                    <div key={comment.commentNo} className="border p-3 rounded relative">
                      <div className="flex justify-between items-center mb-1 text-sm text-gray-600">
                        <span className="font-semibold">{comment.nickname}</span>
                        <div className="flex items-center gap-2">
                          <span>{comment.commentRegisterDate?.substring(0, 10)}</span>
                          <button
                            onClick={() => handleReportComment(comment.commentNo)}
                            className="text-xs text-red-500 hover:underline"
                          >
                            신고
                          </button>
                        </div>
                      </div>
                      <div className="text-yellow-500 text-sm mb-1">
                        {'★'.repeat(comment.commentRating || 0)}
                        {'☆'.repeat(5 - (comment.commentRating || 0))}
                      </div>
                      <div className="text-sm text-gray-800 whitespace-pre-wrap">
                        {comment.commentContent}
                      </div>
                      {comment.commentReportCount > 0 && (
                        <div className="text-xs text-red-500 mt-1">
                          ※ 신고 {comment.commentReportCount}회
                        </div>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => handleDeleteComment(comment.commentNo)}
                          className="absolute bottom-2 right-2 text-xs text-red-500 hover:underline"
                        >
                          삭제
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 댓글 페이징 */}
              <div className="flex justify-center mt-5 space-x-1">
                <button
                  onClick={() => setCommentPage((prev) => Math.max(prev - 1, 1))}
                  className="px-3 py-1 border rounded text-blue-600 hover:bg-blue-100"
                >
                  &laquo;
                </button>
                {[...Array(totalCommentPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCommentPage(i + 1)}
                    className={`px-3 py-1 border rounded ${
                      i + 1 === commentPage
                        ? 'bg-blue-600 text-white'
                        : 'text-blue-600 hover:bg-blue-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCommentPage((prev) => Math.min(prev + 1, totalCommentPages))}
                  className="px-3 py-1 border rounded text-blue-600 hover:bg-blue-100"
                >
                  &raquo;
                </button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PostDetailPage;
