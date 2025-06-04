import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import PostCard from '../../components/post/PostCard';
import qs from 'qs';

const PostListPage = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [showState, setShowState] = useState('전체 공연');
  const [showOptions, setShowOptions] = useState(['공연 전체']);
  const [selectedShowName, setSelectedShowName] = useState('공연 전체');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem('accessToken');

  const showStateMap = {
    '상영중': 1,
    '종료': 2
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const fetchPosts = async () => {
    try {
      let res;
      if (showState === '전체 공연') {
        res = await axios.get('/api/community/posts');
      } else {
        const stateValue = showStateMap[showState];
        if (stateValue === undefined) return;
        res = await axios.get(`/api/community/posts/state/${stateValue}`);
      }
      setPosts(res.data);
    } catch (err) {
      console.error('게시글 조회 실패:', err);
    }
  };

  const fetchShowTitles = async () => {
    try {
      let stateValues = [];
      if (showState === '전체 공연') {
        stateValues = [1, 2];
      } else {
        const value = showStateMap[showState];
        if (value !== undefined) stateValues = [value];
      }

      const res = await axios.get('/api/show/titles', {
        params: {
          states: stateValues,
          page: 0,
          size: 100
        },
        paramsSerializer: params => {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        }
      });

      const titles = res.data.content.map(item => item.showTitle).filter(Boolean);
      const uniqueTitles = Array.from(new Set(titles));
      setShowOptions(['공연 전체', ...uniqueTitles]);
      setSelectedShowName('공연 전체');
    } catch (err) {
      console.error('공연 제목 조회 실패:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchShowTitles();
  }, [showState]);

  useEffect(() => {
    let temp = posts;

    if (selectedShowName !== '공연 전체') {
      temp = temp.filter(p => p.showName === selectedShowName);
    }

    if (searchKeyword.trim() !== '') {
      temp = temp.filter(p =>
        (p.postTitle && p.postTitle.includes(searchKeyword)) ||
        (p.postContent && p.postContent.includes(searchKeyword))
      );
    }

    setFilteredPosts(temp);
    setPage(1);
  }, [posts, selectedShowName, searchKeyword]);

  const totalPages = Math.ceil(filteredPosts.length / pageSize);
  const pagedPosts = filteredPosts.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="grow w-[1000px] mx-auto py-10 min-h-[calc(100vh-96px)]">
        {/* 검색창 + 작성하기 버튼 */}
        <div className="relative mb-6 flex items-center">
          {/* 검색창: 가운데에서 약간 오른쪽으로 */}
          <div className="flex gap-4 pl-[230px]">
            <select
              value={showState}
              onChange={(e) => setShowState(e.target.value)}
              className="border px-3 py-1.5 text-sm rounded"
            >
              <option>전체 공연</option>
              <option>상영중</option>
              <option>종료</option>
            </select>

            <select
              value={selectedShowName}
              onChange={(e) => setSelectedShowName(e.target.value)}
              className="border px-3 py-1.5 text-sm rounded"
            >
              {showOptions.map((name, idx) => (
                <option key={idx} value={name}>{name}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="제목+내용 검색"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="border px-3 py-1.5 text-sm rounded w-64"
            />
          </div>

          {/* 작성하기 버튼: 오른쪽 끝에 고정 */}
          <div className="absolute right-0">
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  alert('로그인 후 글쓰기가 가능합니다.');
                  return;
                }
                navigate('/community/posts/write');
              }}
              className="bg-blue-600 text-white text-sm px-5 py-2.5 rounded hover:bg-blue-700"
            >
              작성하기
            </button>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex justify-around border-b mb-6 text-center text-sm font-medium">
          <button className="py-2 px-4 text-blue-600 border-b-2 border-blue-600" disabled>
            후기 게시판
          </button>
          <button
            className="py-2 px-4 text-gray-500 hover:text-blue-600"
            onClick={() => navigate('/community/notice')}
          >
            공지사항
          </button>
          <button
            className="py-2 px-4 text-gray-500 hover:text-blue-600"
            onClick={() => navigate('/community/qna')}
          >
            Q&A
          </button>
        </div>

        {/* 테이블 헤더 */}
        <div className="grid grid-cols-12 bg-gray-100 py-3 font-semibold border-t border-b border-gray-300 text-center text-sm">
          <div className="col-span-1">번호</div>
          <div className="col-span-5">제목</div>
          <div className="col-span-2">평점</div>
          <div className="col-span-2">글쓴이</div>
          <div className="col-span-2">날짜</div>
        </div>

        {/* 게시글 리스트 */}
        <div>
          {pagedPosts.length > 0 ? (
            pagedPosts.map((post, index) => (
              <PostCard
                key={post.postNo}
                post={post}
                index={(page - 1) * pageSize + index}
              />
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">게시글이 없습니다.</div>
          )}
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-10 space-x-1">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 border rounded text-blue-600 hover:bg-blue-100"
          >
            &laquo;
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                i + 1 === page
                  ? 'bg-blue-600 text-white'
                  : 'text-blue-600 hover:bg-blue-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-3 py-1 border rounded text-blue-600 hover:bg-blue-100"
          >
            &raquo;
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PostListPage;
