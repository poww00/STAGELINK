import React from "react";
import { useNavigate } from "react-router-dom";

const MyActivityHome = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-start px-4 py-10 grow overflow-hidden bg-gray-50">
      <h1 className="text-3xl font-bold text-blue-700 mb-10">내 활동</h1>

      <div className="w-full max-w-2xl space-y-6">
        {/* 게시글 카드 */}
        <div
          onClick={() => navigate("/mypage/posts")}
          className="flex items-center justify-between px-6 py-5 bg-white rounded-xl shadow hover:shadow-md hover:scale-[1.01] transition cursor-pointer border-l-4 border-blue-500"
        >
          <div className="flex items-center gap-4">
            <span className="text-2xl text-blue-500">📝</span>
            <span className="text-lg font-semibold text-gray-800">내가 작성한 게시글 보기</span>
          </div>
          <span className="text-gray-400 text-xl">&rsaquo;</span>
        </div>

        {/* 댓글 카드 */}
        <div
          onClick={() => navigate("/mypage/comments")}
          className="flex items-center justify-between px-6 py-5 bg-white rounded-xl shadow hover:shadow-md hover:scale-[1.01] transition cursor-pointer border-l-4 border-green-500"
        >
          <div className="flex items-center gap-4">
            <span className="text-2xl text-green-500">💬</span>
            <span className="text-lg font-semibold text-gray-800">내가 작성한 댓글 보기</span>
          </div>
          <span className="text-gray-400 text-xl">&rsaquo;</span>
        </div>

        {/* QnA 카드 */}
        <div
          onClick={() => navigate("/mypage/qna")}
          className="flex items-center justify-between px-6 py-5 bg-white rounded-xl shadow hover:shadow-md hover:scale-[1.01] transition cursor-pointer border-l-4 border-purple-500"
        >
          <div className="flex items-center gap-4">
            <span className="text-2xl text-purple-500">❓</span>
            <span className="text-lg font-semibold text-gray-800">내가 작성한 QnA 보기</span>
          </div>
          <span className="text-gray-400 text-xl">&rsaquo;</span>
        </div>
      </div>
    </div>
  );
};

export default MyActivityHome;
