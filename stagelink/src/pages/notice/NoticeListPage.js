import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

const NoticeListPage = () => {
  const [notices, setNotices] = useState([]);
  const [filteredNotices, setFilteredNotices] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchType, setSearchType] = useState('제목+내용');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [page, setPage] = useState(1);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const searchOptions = ['제목+내용', '제목', '내용'];
  const pageSize = 10;
  const totalPages = Math.ceil(filteredNotices.length / pageSize);
  const pagedNotices = filteredNotices.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    axios
      .get('/api/community/notice')
      .then((res) => {
        setNotices(res.data);
        setFilteredNotices(res.data);
      })
      .catch((err) => console.error('공지사항 조회 실패:', err));
  }, []);

  const handleSearch = () => {
    const keyword = searchText.toLowerCase();
    const filtered = notices.filter((notice) => {
      const title = notice.noticeTitle?.toLowerCase() || '';
      const content = notice.noticeContent?.toLowerCase() || '';
      if (searchType === '제목') return title.includes(keyword);
      if (searchType === '내용') return content.includes(keyword);
      return title.includes(keyword) || content.includes(keyword);
    });
    setFilteredNotices(filtered);
    setPage(1);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* 콘텐츠 전체 넓힘 적용 */}
      <main className="grow w-[1000px] mx-auto py-10 min-h-[calc(100vh-96px)]">
        {/* 제목 */}
        <div className="flex justify-center items-center mb-6">
        </div>

        {/* 검색창 */}
        <div className="flex justify-center mb-8">
          <div
            className="relative flex items-center w-full max-w-2xl border border-gray-300 rounded-md bg-white shadow-sm"
            ref={dropdownRef}
          >
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center text-sm px-3 py-2 hover:bg-gray-100 border-r h-full"
              >
                {searchType}
                <ChevronDownIcon className="h-4 w-4 ml-1" />
              </button>
              {isDropdownOpen && (
                <div className="absolute left-0 top-full mt-1 bg-white border rounded shadow z-30 w-32">
                  {searchOptions.map((option) => (
                    <div
                      key={option}
                      className="px-4 py-2 text-sm hover:bg-blue-100 cursor-pointer"
                      onClick={() => {
                        setSearchType(option);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="검색어를 입력하세요"
              className="flex-1 px-4 py-2 text-sm focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="px-3 text-blue-600 hover:text-blue-800"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex justify-around border-b mb-6 text-center text-sm font-medium">
          <button
            className="py-2 px-4 text-gray-500 hover:text-blue-600"
            onClick={() => navigate('/community/posts')}
          >
            후기 게시판
          </button>
          <button
            className="py-2 px-4 text-blue-600 border-b-2 border-blue-600"
            disabled
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
        <div className="grid grid-cols-12 bg-gray-100 py-2 font-semibold border-t border-b border-gray-300 text-center text-sm">
          <div className="col-span-1">번호</div>
          <div className="col-span-7">제목</div>
          <div className="col-span-2">글쓴이</div>
          <div className="col-span-2">날짜</div>
        </div>

        {/* 공지사항 목록 */}
        <div>
          {pagedNotices.map((notice, index) => (
            <div
              key={notice.noticeNo}
              onClick={() => navigate(`/community/notice/${notice.noticeNo}`)}
              className="grid grid-cols-12 border-b py-3 min-h-[56px] text-sm text-center items-center hover:bg-blue-50 cursor-pointer"
            >
              <div className="col-span-1">{(page - 1) * pageSize + index + 1}</div>
              <div className="col-span-7 text-left px-2">{notice.noticeTitle}</div>
              <div className="col-span-2">관리자</div>
              <div className="col-span-2">{notice.noticeDate?.substring(0, 10)}</div>
            </div>
          ))}
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

export default NoticeListPage;
