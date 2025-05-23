import React from "react";

/**
 * 상황별 안내 메시지를 토스트로 보여주는 컴포넌트
 * @param {string} message - 안내 문구
 */
const LikeToast = ({ message }) => (
  <div className="fixed bottom-8 right-8 bg-purple-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out">
    {message}
  </div>
);

export default LikeToast;
