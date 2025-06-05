// src/components/rank/CarouselRank.js
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";

/**
 * CarouselRank
 * @param {string} filter "top20" | "gender:MALE" | "age:20대" …
 */
const CarouselRank = ({ filter = "top20" }) => {
  /* ───────── state ───────── */
  const [shows, setShows] = useState([]);
  const [currentPage, setPage] = useState(0); // 0-based
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const carouselRef = useRef(null);

  /* ───────── data fetch ───────── */
  const fetchRank = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPage(0);

    try {
      let url = "/api/main/ranking/top20";
      if (filter.startsWith("gender:")) {
        url = `/api/main/ranking/gender/${filter.split(":")[1]}`;
      } else if (filter.startsWith("age:")) {
        url = `/api/main/ranking/age/${encodeURIComponent(
          filter.split(":")[1]
        )}`;
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
  }, [filter]);

  useEffect(() => {
    fetchRank();
  }, [fetchRank]);

  /* ───────── pagination ───────── */
  const pageSize = 5;
  const totalPage = Math.max(1, Math.ceil(shows.length / pageSize));

  const pageData = useMemo(() => {
    const start = currentPage * pageSize;
    return shows.slice(start, start + pageSize);
  }, [shows, currentPage]);

  const prev = () => setPage((p) => (p - 1 + totalPage) % totalPage);
  const next = () => setPage((p) => (p + 1) % totalPage);

  /* 키보드 ← → 이동 지원 */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  /* ───────── helpers ───────── */
  const title = useMemo(() => {
    if (filter.startsWith("gender:"))
      return filter.endsWith("MALE")
        ? "🔥 남성 인기 TOP 20"
        : "🔥 여성 인기 TOP 20";
    if (filter.startsWith("age:"))
      return `🔥 ${filter.split(":")[1]} 인기 TOP 20`;
    return "🔥 인기 공연 TOP 20";
  }, [filter]);

  const goDetail = (id) => navigate(`/shows/${id}`);

  /* ───────── render ───────── */
  if (loading)
    return <div className="my-8 text-center animate-pulse">로딩 중…</div>;
  if (error)
    return (
      <div className="my-8 text-center text-red-500 whitespace-pre-wrap">
        {error}
      </div>
    );

  return (
    <div className="my-8">
      {/* 타이틀 */}
      <h2 className="text-xl font-bold text-blue-700 mb-4 text-center">
        {title}
      </h2>

      {/* 캐러셀 */}
      <div
        className="relative max-w-6xl mx-auto px-4 select-none"
        ref={carouselRef}
      >
        <div className="flex justify-center items-center gap-8">
          {/* ◀  */}
          <button
            onClick={prev}
            aria-label="이전"
            className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-30"
            disabled={totalPage === 1}
          >
            <ArrowLeftIcon className="w-8 h-8 text-gray-500" />
          </button>

          {/* 카드 5개 */}
          {pageData.map((s) => (
            <div
              key={s.id}
              onClick={() => goDetail(s.id)}
              className="w-[230px] border rounded-xl overflow-hidden shadow hover:shadow-md transition cursor-pointer flex flex-col"
            >
              {/* 포스터 3:4 */}
              <div
                className="relative w-full overflow-hidden"
                style={{ aspectRatio: "3 / 4" }}
              >
                <img
                  src={s.poster}
                  alt={s.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              {/* 제목+정보 (112px 고정) */}
              <div className="w-full p-4 flex flex-col justify-start h-[112px]">
                <h3 className="font-bold text-sm line-clamp-3 break-words">
                  {s.name}
                </h3>
                <p className="text-xs text-gray-600 mt-auto">
                  {s.category} · {s.age}세 이상
                </p>
              </div>
            </div>
          ))}

          {/* ▶ */}
          <button
            onClick={next}
            aria-label="다음"
            className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-30"
            disabled={totalPage === 1}
          >
            <ArrowRightIcon className="w-8 h-8 text-gray-500" />
          </button>
        </div>

        {/* ●●● 페이지 인디케이터 */}
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPage }).map((_, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full ${
                i === currentPage ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarouselRank;
