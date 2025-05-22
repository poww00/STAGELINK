import React, { useState } from "react";
import { Link, redirect } from "react-router-dom";
import SocialLoginButtons from "../../components/user/SocialLoginButtons"
import LoginForm from "../../components/user/LoginForm";

function LoginPage() {


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg min-h-[500px] px-10 py-16 rounded-2xl shadow-lg flex flex-col justify-center">
        {/* STAGE LINK 로고 */}
        <div className="text-5xl font-bold text-center mb-12">
          <Link to="/">
            <span className="text-blue-600">STAGE</span>
            <span className="text-purple-600">LINK</span>
          </Link>
        </div>

          {/* 로그인 폼 */}
          <LoginForm />

          {/* 소셜 로그인 버튼 그룹 */}
          <SocialLoginButtons/>
     
        {/* 하단 링크 */}
        <p className="mt-10 text-center text-sm text-gray-600 space-x-4">
          <Link to="/find-id" className="hover:text-blue-500 transition">
            아이디 찾기
          </Link>
          <span>|</span>
          <Link to="/find-pw" className="hover:text-blue-500 transition">
            비밀번호 찾기
          </Link>
          <span>|</span>
          <Link to="/register" className="hover:text-blue-500 transition">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
