import React from "react";
import { Link } from "react-router-dom";
import useCustomLogin from "../../hook/useCustomLogin";

const Header = () => {

  const { isLogin, userId, doLogout } = useCustomLogin();


  //const userId = 1; //로그인 기능이 아직 없어 임시 선언함

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col">
        {/* 상단 로고와 검색창 */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-4xl font-bold">
              <span className="text-blue-600">STAGE</span>
              <span className="text-purple-600">LINK</span>
            </Link>
            <div className="w-96">
              <input
                type="text"
                placeholder="검색"
                className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* 메뉴 버튼들 */}
        <div className="flex justify-between space-x-4">
          <Link to="/" className="flex-1">
            <button className="w-full text-sm font-bold text-white bg-blue-500 py-3 rounded-full hover:bg-blue-600">
              홈
            </button>
          </Link>
          <Link to="/community/posts" className="flex-1">
            <button className="w-full text-sm font-bold text-white bg-blue-500 py-3 rounded-full hover:bg-blue-600">
              커뮤니티
            </button>
          </Link>
          {/* 로그인 여부에 따라 버튼 분기 */}
          {isLogin ? (
            <Link to={`/mypage/${userId}`} className="flex-1">
              <button className="w-full text-sm font-bold text-white bg-purple-500 py-3 rounded-full hover:bg-purple-600">
                마이페이지
              </button>
            </Link>
          ) : (
            <button
              className="flex-1 w-full text-sm font-bold text-white bg-purple-300 py-3 rounded-full cursor-not-allowed"
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
              className="flex-1 w-full text-sm font-bold text-white bg-purple-500 py-3 rounded-full hover:bg-purple-600"
            >
              로그아웃
            </button>
          ) : (
            <Link to="/login" className="flex-1">
              <button className="w-full text-sm font-bold text-white bg-purple-500 py-3 rounded-full hover:bg-purple-600">
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
