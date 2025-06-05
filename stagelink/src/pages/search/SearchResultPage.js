import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

const SearchResultPage = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/showinfo/search", {
          params: {
            keyword,
            page,
            size: pageSize,
          },
        });

        setShows(res.data.content); // content는 Page 객체의 공연 리스트
        setTotalPages(res.data.totalPages); // 전체 페이지 수
      } catch (err) {
        console.error("검색 실패", err);
        setShows([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [keyword, page]);

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
              to={`/shows/${show.id}`}
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
