import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
//import ShowDetailPage from "./pages/show/ShowDetailPage";
import RegisterPage from "./pages/user/RegisterPage";
import LoginPage from "./pages/user/LoginPage";
import FindIdPage from "./pages/user/FindIdPage";
import FindPwPage from "./pages/user/FindPwPage";
import ResetPwPage from "./pages/user/ResetPwPage";
import MypageLayout from "./pages/mypage/MypageLayout";
import UserInfoPage from "./pages/mypage/UserInfoPage";
import MypageHome from "./components/mypage/MypageHome";
import RequireLoginRoute from "./components/common/RequiredLoginRoute";
import KakaoCallback from "./pages/user/KakaoCallback";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        { /* <Route path="/shows/:id" element={<ShowDetailPage />} /> */}

        {/* 회원가입 */}
        <Route path='/register' element={<RegisterPage />} />

        {/* 로그인 페이지 */}
        <Route path="/login" element={<LoginPage />} />

        {/*아이디 찾기 페이지 */}
        <Route path='/find-id' element={<FindIdPage />} />

        {/*비밀번호 찾기 페이지 */}
        <Route path='/find-pw' element={<FindPwPage />} />

        {/* 비밀번호 재설정 페이지*/}
        <Route path='/reset-password' element={<ResetPwPage />} />

        {/* 카카오 콜백 처리 페이지 */}
        <Route path="/member/kakao" element={<KakaoCallback />} />

        {/* 마이페이지 레이아웃 - 인증이 필요한 경로를 RequireLoginRoute로 */}
        <Route path="/mypage/:id" element={
          <RequireLoginRoute>
          <MypageLayout />
          </RequireLoginRoute>
          }>
          <Route index element={<MypageHome />} />
          <Route path="info" element={<UserInfoPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
