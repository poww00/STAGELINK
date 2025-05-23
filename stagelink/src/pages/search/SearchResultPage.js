import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

// 1. 목데이터 배열(더 늘리고 싶으면 추가!)
const mockShows = [
  {
    id: 1,
    name: "뮤지컬 위키드 내한",
    poster: "/images/poster1.jpg",
    category: "뮤지컬",
    age: 15,
    startDate: "2025-05-01",
    endDate: "2025-06-01",
  },
  {
    id: 2,
    name: "연극 햄릿 내한",
    poster: "/images/poster2.jpg",
    category: "연극",
    startDate: "2025-07-01",
    endDate: "2025-07-10",
  },
  {
    id: 3,
    name: "콘서트 BTS 내한",
    poster: "/images/poster3.jpg",
    category: "콘서트",
    startDate: "2025-08-15",
    endDate: "2025-08-16",
  },
  {
    id: 4,
    name: "오페라 라보엠 내한",
    poster: "/images/poster4.jpg",
    category: "오페라",
    startDate: "2025-09-01",
    endDate: "2025-09-05",
  },
  {
    id: 5,
    name: "클래식의 밤",
    poster: "/images/poster5.jpg",
    category: "클래식",
    startDate: "2025-09-20",
    endDate: "2025-09-21",
  },
  {
    id: 6,
    name: "아동극 피터팬 내한",
    poster: "/images/poster6.jpg",
    category: "아동극",
    startDate: "2025-10-01",
    endDate: "2025-10-07",
  },
{
    id: 7,
    name: "위키드 내한 공연",
    poster: "/images/poster1.jpg",
    category: "뮤지컬",
    age: 15,
    startDate: "2025-05-01",
    endDate: "2025-06-01",
  },
  {
    id: 8,
    name: "위키드 내한 공연-3",
    poster: "/images/poster1.jpg",
    category: "뮤지컬",
    age: 15,
    startDate: "2025-05-01",
    endDate: "2025-06-01",
  },
  {
    id: 9,
    name: "위키드 내한 공연-4",
    poster: "/images/poster1.jpg",
    category: "뮤지컬",
    age: 15,
    startDate: "2025-05-01",
    endDate: "2025-06-01",
  },
  {
    id: 10,
    name: "위키드 내한 공연-5",
    poster: "/images/poster1.jpg",
    category: "뮤지컬",
    age: 15,
    startDate: "2025-05-01",
    endDate: "2025-06-01",
  },
  {
    id: 11,
    name: "위키드 내한 공연-5",
    poster: "/images/poster1.jpg",
    category: "뮤지컬",
    age: 15,
    startDate: "2025-05-01",
    endDate: "2025-06-01",
  },
  {
    id: 12,
    name: "위키드 내한 공연-5",
    poster: "/images/poster1.jpg",
    category: "뮤지컬",
    age: 15,
    startDate: "2025-05-01",
    endDate: "2025-06-01",
  },
  {
    id: 13,
    name: "위키드 내한 공연-5",
    poster: "/images/poster1.jpg",
    category: "뮤지컬",
    age: 15,
    startDate: "2025-05-01",
    endDate: "2025-06-01",
  },
  {
    id: 14,
    name: "위키드 내한 공연-5",
    poster: "/images/poster1.jpg",
    category: "뮤지컬",
    age: 15,
    startDate: "2025-05-01",
    endDate: "2025-06-01",
  },
  {
    id: 15,
    name: "위키드 내한 공연-5",
    poster: "/images/poster1.jpg",
    category: "뮤지컬",
    age: 15,
    startDate: "2025-05-01",
    endDate: "2025-06-01",
  },
  {
    id: 16,
    name: "위키드 내한 공연-5",
    poster: "/images/poster1.jpg",
    category: "뮤지컬",
    age: 15,
    startDate: "2025-05-01",
    endDate: "2025-06-01",
  },

  {
    id: 17,
    name: "위키드 내한 공연-5",
    poster: "/images/poster1.jpg",
    category: "뮤지컬",
    age: 15,
    startDate: "2025-05-01",
    endDate: "2025-06-01",
  },{
    id: 18,
    name: "위키드 내한 공연-5",
    poster: "/images/poster1.jpg",
    category: "뮤지컬",
    age: 15,
    startDate: "2025-05-01",
    endDate: "2025-06-01",
  },
  {
    id: 19,
    name: "위키드 내한 공연-5",
    poster: "/images/poster1.jpg",
    category: "뮤지컬",
    age: 15,
    startDate: "2025-05-01",
    endDate: "2025-06-01",
  },
  {
    id: 20,
    name: "위키드 내한 공연-5",
    poster: "/images/poster1.jpg",
    category: "뮤지컬",
    age: 15,
    startDate: "2025-05-01",
    endDate: "2025-06-01",
  },

  {
    id: 21,
    name: "위키드 내한 공연-5",
    poster: "/images/poster1.jpg",
    category: "뮤지컬",
    age: 15,
    startDate: "2025-05-01",
    endDate: "2025-06-01",
  },
  {
    id: 22,
    name: "위키드 내한 공연-5",
    poster: "/images/poster1.jpg",
    category: "뮤지컬",
    age: 15,
    startDate: "2025-05-01",
    endDate: "2025-06-01",
  },
  {
    id: 23,
    name: "위키드 내한 공연-5",
    poster: "/images/poster1.jpg",
    category: "뮤지컬",
    age: 15,
    startDate: "2025-05-01",
    endDate: "2025-06-01",
  },
  {
    id: 24,
    name: "위키드 내한 공연-5",
    poster: "/images/poster1.jpg",
    category: "뮤지컬",
    age: 15,
    startDate: "2025-05-01",
    endDate: "2025-06-01",
  },
  
];

const SearchResultPage = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0); // 0부터 시작
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 20;

  // 목데이터로 검색/페이징 처리
  useEffect(() => {
    setLoading(true);

    // 2. JS로 검색어 포함 공연 필터링
    let filtered = mockShows;
    if (keyword.trim() !== "") {
      filtered = mockShows.filter((show) =>
        show.name.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    // 3. 페이징 계산
    const start = page * pageSize;
    const paginated = filtered.slice(start, start + pageSize);
    setShows(paginated);
    setTotalPages(Math.ceil(filtered.length / pageSize) || 1);

    setLoading(false);
  }, [keyword, page]);

  // 엔터 등으로 새로운 검색이 들어오면 페이지 초기화
  useEffect(() => {
    setPage(0);
  }, [keyword]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) setPage(newPage);
  };

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8 min-h-[60vh]">
        <h1 className="text-xl font-bold text-purple-600 mb-4">
          “{keyword}” 검색 결과
        </h1>
        {loading && (
          <div className="text-center text-gray-400 py-10">검색 중...</div>
        )}
        {!loading && shows.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            검색 결과가 없습니다.
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {shows.map((show) => (
            <Link
                to={`/show/${show.id}`}
                key={show.id}
                className="bg-white rounded-2xl shadow p-0 flex flex-col overflow-hidden transition hover:shadow-xl border"
                style={{ width: 240 }}
                >
                <img
                    src={show.poster}
                    alt={show.name}
                    className="w-full h-72 object-cover"
                />
                <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 truncate">{show.name}</h3>
                    <div className="text-sm text-gray-600 mb-1">
                    {show.category}
                    {show.age && (
                        <>
                        <span className="mx-1">·</span>
                        {show.age}세 이상
                        </>
                    )}
                    </div>
                    {show.startDate && (
                    <div className="text-xs text-gray-400">
                        공연기간: {show.startDate} ~ {show.endDate || ""}
                    </div>
                    )}
                </div>
            </Link>


          ))}
        </div>
        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 0}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:opacity-50"
            >
              이전
            </button>
            {[...Array(totalPages).keys()].map((p) => (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                className={`px-3 py-1 rounded ${
                  p === page
                    ? "bg-purple-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {p + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages - 1}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:opacity-50"
            >
              다음
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default SearchResultPage;
