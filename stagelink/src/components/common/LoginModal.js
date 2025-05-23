import React from "react";

const LoginModal = ({ onClose, message }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-xl shadow-xl flex flex-col items-center">
      <span className="text-lg font-semibold mb-6">{message || "로그인이 필요한 서비스입니다. 로그인 해주세요!"}</span>
      <button
        className="bg-blue-600 hover:bg-blue-800 text-white px-6 py-2 rounded-lg mt-2"
        onClick={onClose}
      >
        닫기
      </button>
    </div>
  </div>
);

export default LoginModal;
