import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCustomLogin from "../../hook/useCustomLogin"; // 커스텀 훅을 사용하여 로그인 상태 관리

const Header = () => {

  const [search, setSearch] = useState(""); // 검색어 상태 추가
  const navigate = useNavigate();
  const { isLogin, userId, doLogout } = useCustomLogin(); // 로그인 정보

  // 엔터 입력시 검색 결과 페이지로 이동
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && search.trim() !== "") {
      navigate(`/search?keyword=${encodeURIComponent(search)}`);
    }
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-1 flex flex-col">
        {/* 상단 로고와 검색창 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Link to="/" className="text-xl font-bold">
              <span className="text-blue-600">STAGE</span>
              <span className="text-purple-600">LINK</span>
            </Link>
            <div className="w-64">
              <input
                type="text"
                placeholder="검색"
                className="w-full px-3 py-1 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown} // 엔터키 입력 시 검색
              />
            </div>
          </div>
        </div>

        {/* 메뉴 버튼들 */}
        <div className="flex justify-between space-x-2">
          <Link to="/" className="flex-1">
            <button className="w-full text-xs font-semibold text-white bg-blue-500 py-1.5 rounded-full hover:bg-blue-600">
              홈
            </button>
          </Link>
          <Link to="/community/posts" className="flex-1">
            <button className="w-full text-xs font-semibold text-white bg-blue-500 py-1.5 rounded-full hover:bg-blue-600">
              커뮤니티
            </button>
          </Link>


          {/* 로그인 여부에 따라 버튼 분기 */}
          {isLogin ? (
            <Link to={`/mypage`} className="flex-1">
              <button className="w-full text-xs font-semibold text-white bg-purple-500 py-1.5 rounded-full hover:bg-purple-600">
                마이페이지
              </button>
            </Link>
          ) : (
            <button
              className="flex-1 w-full text-xs font-semibold text-white bg-purple-300 py-1.5 rounded-full cursor-not-allowed"
              disabled
              aria-label="로그인 후 이용 가능"
            >
              마이페이지
            </button>
          )}
          {/* 로그인 여부에 따라 버튼 분기 */}
          {isLogin ? (
            <button
              onClick={doLogout}
              className="flex-1 w-full text-xs font-bold text-white bg-purple-500 py-1.5 rounded-full hover:bg-purple-600"
            >
              로그아웃
            </button>
          ) : (
            <Link to="/login" className="flex-1">
              <button className="w-full text-xs font-bold text-white bg-purple-500 py-1.5 rounded-full hover:bg-purple-600">
                로그인 / 회원가입
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
