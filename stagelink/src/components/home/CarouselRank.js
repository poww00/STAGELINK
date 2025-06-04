// src/components/rank/CarouselRank.js
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * CarouselRank - 인기 공연 캐러셀
 * @param {string} filter "top20" | "gender:MALE" | "age:20대" …
 */
const CarouselRank = ({ filter = "top20" }) => {
  /* ─────────────── state ─────────────── */
  const [shows, setShows]       = useState([]);
  const [currentPage, setPage]  = useState(0);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const navigate = useNavigate();

  /* ───────────── data fetch ───────────── */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setPage(0);

      try {
        let url = "/api/main/ranking/top20";

        if (filter.startsWith("gender:")) {
          const g = filter.split(":")[1];
          url = `/api/main/ranking/gender/${g}`;
        } else if (filter.startsWith("age:")) {
          const age = filter.split(":")[1];
          url = `/api/main/ranking/age/${encodeURIComponent(age)}`;
        }

        const { data } = await axios.get(url);
        setShows(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setError("랭킹 정보를 불러오지 못했습니다.");
        setShows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter]);

  /* ─────────── pagination ─────────── */
  const pageSize  = 5;
  const totalPage = Math.max(1, Math.ceil(shows.length / pageSize));

  const pageData = useMemo(() => {
    const start = currentPage * pageSize;
    return shows.slice(start, start + pageSize);
  }, [shows, currentPage]);

  /* ─────────── handlers ─────────── */
  const handlePrev  = () => setPage((p) => (p - 1 + totalPage) % totalPage);
  const handleNext  = () => setPage((p) => (p + 1) % totalPage);
  const handleClick = (id) => navigate(`/shows/${id}`);

  /* ─────────── helpers ─────────── */
  const getTitle = () => {
    if (filter.startsWith("gender:")) {
      return filter.endsWith("MALE") ? "🔥 남성 인기 TOP 20" : "🔥 여성 인기 TOP 20";
    }
    if (filter.startsWith("age:")) {
      return `🔥 ${filter.split(":")[1]} 인기 TOP 20`;
    }
    return "🔥 인기 공연 TOP 20";
  };

  /* ─────────── render ─────────── */
  if (loading) return <div className="my-8 text-center">로딩 중…</div>;
  if (error)   return <div className="my-8 text-center text-red-500">{error}</div>;

  return (
    <div className="my-8">
      {/* 타이틀 */}
      <h2 className="text-xl font-bold text-blue-700 mb-4 text-center">
        {getTitle()}
      </h2>

      {/* 캐러셀 */}
      <div className="relative max-w-5xl mx-auto px-4">
        <div className="flex justify-center items-center gap-6">
          {/* 이전 버튼 */}
          <button
            onClick={handlePrev}
            className="text-4xl text-gray-500 hover:text-black"
          >
            ◀
          </button>

          {/* 카드 5개 */}
          {pageData.map((show) => (
            <div
              key={show.id}
              onClick={() => handleClick(show.id)}
              className="w-[180px] sm:w-[200px] border rounded-xl overflow-hidden shadow hover:shadow-md transition flex flex-col cursor-pointer"
            >
              {/* 포스터 (고정 높이 + object-cover → 여백 제거) */}
              <div className="w-full h-[280px] sm:h-[300px] overflow-hidden">
                <img
                  src={show.poster}
                  alt={show.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 공연 정보 */}
              <div className="w-full p-3 flex flex-col justify-end">
                <h3 className="font-bold text-sm break-words whitespace-normal">
                  {show.name}
                </h3>
                <p className="text-xs text-gray-600">
                  {show.category} · {show.age}세 이상
                </p>
              </div>
            </div>
          ))}

          {/* 다음 버튼 */}
          <button
            onClick={handleNext}
            className="text-4xl text-gray-500 hover:text-black"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarouselRank;
