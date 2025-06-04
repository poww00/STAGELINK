import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./pages/Home/HomePage";

import PostListPage from './pages/post/PostListPage';
import PostDetailPage from './pages/post/PostDetailPage';
import PostWritePage from './pages/post/PostWritePage';
import PostEditPage from './pages/post/PostEditPage';
import NoticeListPage from './pages/notice/NoticeListPage';
import NoticeDetailPage from './pages/notice/NoticeDetailPage';
import QnAListPage from './pages/qna/QnAListPage';
import QnaDetailPage from './pages/qna/QnADetailPage';
import QnaWritePage from './pages/qna/QnAWritePage';
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
import ShowDetailPage from "./pages/show/ShowDetailPage";
import ActorDetailPage from "./pages/actor/ActorDetailPage";
import SearchResultPage from "./pages/search/SearchResultPage";
import PaymentStepperPage from "./pages/payment/PaymentStepperPage";
import MyPostsPage from "./pages/mypage/MyPostsPage";
import MyCommentsPage from "./pages/mypage/MyCommentsPage";
import MyQnaPage from "./pages/mypage/MyQnaPage";
import MyActivityHome from "./components/mypage/MyActivityHome";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shows/:id" element={<ShowDetailPage />} />
        <Route path="/actors/:id" element={<ActorDetailPage />} />
        <Route path="/search" element={<SearchResultPage />} />
        <Route path="/payment/stepper" element={<PaymentStepperPage />} />

        <Route path="/community/posts" element={<PostListPage />} />
        <Route path="/community/posts/:postNo" element={<PostDetailPage />} />
        <Route path="/community/posts/write" element={<PostWritePage />} />
        <Route path="/community/posts/edit/:postNo" element={<PostEditPage />} />
        <Route path="/community/notice" element={<NoticeListPage />} />
        <Route path="/community/notice/:id" element={<NoticeDetailPage />} />
        <Route path="/community/qna" element={<QnAListPage />} />
        <Route path="/community/qna/:questionNo" element={<QnaDetailPage />} />
        <Route path="/community/qna/write" element={<QnaWritePage />} />
        
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
        <Route path="/mypage/*" element={
          <RequireLoginRoute>
          <MypageLayout />
          </RequireLoginRoute>
          }>
          <Route index element={<MypageHome />} />
          <Route path="info" element={<UserInfoPage />} />
          <Route path="activity" element={<MyActivityHome />} />
          <Route path="posts" element={<MyPostsPage />} />
          <Route path="comments" element={<MyCommentsPage />} />
          <Route path="qna" element={<MyQnaPage />} />
        </Route>


      </Routes>
    </Router>
  );
}

export default App;
