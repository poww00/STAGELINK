import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./pages/Home/HomePage";
import ShowDetailPage from "./pages/show/ShowDetailPage";
import PostListPage from './pages/post/PostListPage';
import PostDetailPage from './pages/post/PostDetailPage';
import PostWritePage from './pages/post/PostWritePage';
import PostEditPage from './pages/post/PostEditPage';
import NoticeListPage from './pages/notice/NoticeListPage';
import NoticeDetailPage from './pages/notice/NoticeDetailPage';
import QnAListPage from './pages/qna/QnAListPage';
import QnaDetailPage from './pages/qna/QnADetailPage';
import QnaWritePage from './pages/qna/QnAWritePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shows/:id" element={<ShowDetailPage />} />
        <Route path="/community/posts" element={<PostListPage />} />
        <Route path="/community/posts/:postNo" element={<PostDetailPage />} />
        <Route path="/community/posts/write" element={<PostWritePage />} />
        <Route path="/community/posts/edit/:postNo" element={<PostEditPage />} />
        <Route path="/community/notice" element={<NoticeListPage />} />
        <Route path="/community/notice/:id" element={<NoticeDetailPage />} />
        <Route path="/community/qna" element={<QnAListPage />} />
        <Route path="/community/qna/:questionNo" element={<QnaDetailPage />} />
        <Route path="/community/qna/write" element={<QnaWritePage />} />
      </Routes>
    </Router>
  );
}

export default App;
