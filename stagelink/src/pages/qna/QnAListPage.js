import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

const QnAListPage = () => {
  const [qnas, setQnas] = useState([]);
  const [filteredQnas, setFilteredQnas] = useState([]);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchType, setSearchType] = useState('질문');
  const pageSize = 7;
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const devMode = false; // true/false
  const isLoggedIn = !!localStorage.getItem('accessToken');

  const searchOptions = ['질문'];

  useEffect(() => {
    axios
      .get('/api/community/qna')
      .then((res) => {
        setQnas(res.data);
        setFilteredQnas(res.data);
      })
      .catch((err) => console.error('QnA 조회 실패:', err));
  }, []);

  const handleSearch = () => {
    const keyword = searchText.toLowerCase();
    const filtered = qnas.filter((qna) =>
      qna.questionContents?.toLowerCase().includes(keyword)
    );
    setFilteredQnas(filtered);
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

  const totalPages = Math.ceil(filteredQnas.length / pageSize);
  const pagedQnas = filteredQnas.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="grow w-full px-16 py-10 min-h-[calc(100vh-96px)]">
        {/* 제목 + 질문 등록 버튼 */}
        <div className="flex justify-center relative items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">Q&A</h1>
          <div className="absolute right-0">
            <button
              onClick={() => {
                if (!devMode && !isLoggedIn) {
                  alert('로그인 후 질문을 등록할 수 있습니다.');
                  return;
                }
                navigate('/community/qna/write');
              }}
              className="bg-blue-600 text-white text-sm px-5 py-2.5 rounded hover:bg-blue-700 transition duration-150"
            >
              질문 등록
            </button>
          </div>
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
                <div className="absolute left-0 top-full mt-1 bg-white border rounded shadow z-30 w-28">
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
            className="py-2 px-4 text-gray-500 hover:text-blue-600"
            onClick={() => navigate('/community/notice')}
          >
            공지사항
          </button>
          <button
            className="py-2 px-4 text-blue-600 border-b-2 border-blue-600"
            disabled
          >
            Q&A
          </button>
        </div>

        {/* 테이블 헤더 */}
        <div className="grid grid-cols-10 bg-gray-100 py-2 font-semibold border-t border-b border-gray-300 text-center text-sm">
          <div className="col-span-1">번호</div>
          <div className="col-span-6">질문</div>
          <div className="col-span-1">답변</div>
          <div className="col-span-1">평점</div>
          <div className="col-span-1">날짜</div>
        </div>

        {/* QnA 리스트 */}
        <div>
          {pagedQnas.map((qna, index) => {
            const rating = Number(qna.qnaRating) || 0;
            const preview =
              qna.questionContents?.length > 40
                ? `${qna.questionContents.slice(0, 40)}...`
                : qna.questionContents;

            return (
              <div
                key={qna.questionNo}
                onClick={() => navigate(`/community/qna/${qna.questionNo}`)} // ✅ 경로 수정
                className="grid grid-cols-10 border-b py-3 min-h-[56px] text-sm text-center items-center cursor-pointer hover:bg-gray-50"
              >
                <div className="col-span-1">{(page - 1) * pageSize + index + 1}</div>
                <div className="col-span-6 text-left px-2">{preview}</div>
                <div className="col-span-1">
                  {qna.answerContents ? (
                    <span className="text-green-600">완료</span>
                  ) : (
                    <span className="text-gray-400">대기</span>
                  )}
                </div>
                <div className="col-span-1 text-yellow-500 text-sm flex justify-center items-center gap-0.5">
                  {'★'.repeat(rating)}
                  {'☆'.repeat(5 - rating)}
                </div>
                <div className="col-span-1 text-gray-500 text-sm leading-none">
                  {qna.createDate?.substring(0, 10) || '날짜 없음'}
                </div>
              </div>
            );
          })}
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

export default QnAListPage;
