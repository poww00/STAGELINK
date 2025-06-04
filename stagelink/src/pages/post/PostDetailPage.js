import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const PostDetailPage = () => {
  const { postNo } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [commentRating, setCommentRating] = useState(5);
  const [commentPage, setCommentPage] = useState(1);
  const commentPageSize = 10;

  const accessToken = localStorage.getItem('accessToken');
  const isLoggedIn = !!accessToken;

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

  const loginMemberId = isLoggedIn ? parseJwt(accessToken)?.id : null;
  const isAuthor = isLoggedIn && post?.member != null && Number(post.member) === loginMemberId;

  useEffect(() => {
    if (accessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }
  }, [accessToken]);

  useEffect(() => {
    axios.get(`/api/community/posts/${postNo}`)
      .then((res) => setPost(res.data))
      .catch((err) => console.error('게시글 조회 실패:', err));
  }, [postNo]);

  const fetchComments = () => {
    axios.get(`/api/community/posts/comments/${postNo}`)
      .then((res) => setComments(res.data))
      .catch((err) => console.error('댓글 조회 실패:', err));
  };

  useEffect(() => {
    fetchComments();
  }, [postNo]);

  const handleSubmitComment = () => {
    if (!isLoggedIn) {
      alert('로그인 후 이용해주세요.');
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

  const totalCommentPages = Math.ceil(comments.length / commentPageSize);
  const pagedComments = comments.slice((commentPage - 1) * commentPageSize, commentPage * commentPageSize);
  const formattedDate = post?.postRegisterDate?.substring(0, 10);

  if (!post) {
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
      <main className="grow w-[1000px] mx-auto py-10 min-h-[calc(100vh-96px)]">
        <button
          onClick={() => navigate('/community/posts')}
          className="text-blue-600 hover:underline text-sm mb-6"
        >
          ← 목록으로 돌아가기
        </button>

        <h1 className="text-2xl font-bold text-blue-700 mb-2">{post.postTitle}</h1>

        {post.showName && (
          <div className="mb-4 text-blue-500 text-sm font-medium">
            🎭 관련 공연: {post.showName}
          </div>
        )}

        <div className="flex justify-between items-center text-sm text-gray-500 border-b pb-2 mb-4">
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

        <div className="text-yellow-500 text-sm mb-4">
          {'★'.repeat(post.postRating || 0)}
          {'☆'.repeat(5 - (post.postRating || 0))}
        </div>

        <div className="whitespace-pre-wrap leading-relaxed text-gray-800 text-base mb-10">
          {post.postContent}
        </div>

        {/* 댓글 작성 */}
        <div className="mb-10 border-t pt-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">댓글 쓰기</h2>
            {isAuthor && (
              <div className="text-sm space-x-2">
                <button
                  onClick={() => navigate(`/community/posts/edit/${post.postNo}`)}
                  className="text-blue-600 hover:underline"
                >
                  수정하기
                </button>
                <span className="text-gray-400">|</span>
                <button
                  onClick={handleDeletePost}
                  className="text-red-500 hover:underline"
                >
                  삭제하기
                </button>
              </div>
            )}
          </div>

          {isLoggedIn ? (
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
          ) : (
            <p className="text-sm text-gray-500 mt-2">
              로그인 후 댓글을 작성하실 수 있습니다.
            </p>
          )}
        </div>

        {/* 댓글 목록 */}
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-4">댓글</h2>
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

              <div className="flex justify-center mt-6 space-x-1">
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
