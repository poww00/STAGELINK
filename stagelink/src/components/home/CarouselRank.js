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
 * CarouselRank - 인기 공연 캐러셀 슬라이더
 * @param {string} filter - "top20", "gender:MALE", "age:20대" 형태의 필터 조건
 */
const CarouselRank = ({ filter = "top20" }) => {
  // ───────── state ─────────
  const [shows, setShows] = useState([]);           // 공연 리스트
  const [currentPage, setPage] = useState(0);       // 현재 슬라이드 페이지
  const [loading, setLoading] = useState(false);    // 로딩 상태
  const [error, setError] = useState(null);         // 에러 메시지
  const navigate = useNavigate();                   // 상세 페이지 이동용
  const carouselRef = useRef(null);                 // ref 사용 가능하도록 설정

  // ───────── 슬라이더 설정 ─────────
  const pageSize = 5;            // 한 슬라이드에 보일 카드 수
  const cardWidth = 170;         // 카드 너비
  const gap = 16;                // 카드 간격
  const visibleWidth = pageSize * cardWidth + (pageSize - 1) * gap; // 보여질 영역 너비

  // ───────── 데이터 로딩 ─────────
  const fetchRank = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPage(0);

    try {
      let url = "/api/main/ranking/top20";
      if (filter.startsWith("gender:")) {
        url = `/api/main/ranking/gender/${filter.split(":")[1]}`;
      } else if (filter.startsWith("age:")) {
        url = `/api/main/ranking/age/${encodeURIComponent(filter.split(":")[1])}`;
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

  // ───────── 페이지 이동 ─────────
  const totalPage = Math.max(1, Math.ceil(shows.length / pageSize));
  const prev = () => setPage((p) => (p - 1 + totalPage) % totalPage);
  const next = () => setPage((p) => (p + 1) % totalPage);

  // 키보드 ← → 슬라이드 지원
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentPage]);

  // ───────── 제목 렌더링 ─────────
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

  // ───────── 로딩/에러 처리 ─────────
  if (loading)
    return <div className="my-8 text-center animate-pulse">로딩 중…</div>;
  if (error)
    return (
      <div className="my-8 text-center text-red-500 whitespace-pre-wrap">
        {error}
      </div>
    );

  // ───────── 메인 렌더링 ─────────
  return (
    <div className="my-8">
      {/* 타이틀 */}
      <h2 className="text-xl font-bold text-blue-700 mb-4 text-center">
        {title}
      </h2>

      <div className="relative max-w-6xl mx-auto px-4 select-none" ref={carouselRef}>
        <div className="flex justify-center items-center gap-8">
          {/* ◀ 이전 버튼 */}
          <button
            onClick={prev}
            aria-label="이전"
            className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-30"
            disabled={totalPage === 1}
          >
            <ArrowLeftIcon className="w-8 h-8 text-gray-500" />
          </button>

          {/* ▶ 캐러셀 뷰포트 */}
          <div
            className="overflow-hidden"
            style={{ width: `${visibleWidth}px` }}
          >
            {/* ▶ 카드 리스트 (슬라이더) */}
            <div
              className="flex gap-[16px] transition-transform duration-500 ease-in-out"
              style={{
                width: `${shows.length * cardWidth + (shows.length - 1) * gap}px`,
                transform: `translateX(-${currentPage * (cardWidth + gap) * pageSize}px)`, // 정확히 5장 단위 이동
              }}
            >
              {shows.map((s) => (
                <div
                  key={s.id}
                  onClick={() => goDetail(s.id)}
                  className="w-[170px] border rounded-xl overflow-hidden shadow hover:shadow-md transition cursor-pointer flex flex-col"
                >
                  {/* 포스터 이미지 (3:4 비율) */}
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

                  {/* 제목/카테고리/연령 */}
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
            </div>
          </div>

          {/* ▶ 다음 버튼 */}
          <button
            onClick={next}
            aria-label="다음"
            className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-30"
            disabled={totalPage === 1}
          >
            <ArrowRightIcon className="w-8 h-8 text-gray-500" />
          </button>
        </div>

        {/* ●●● 인디케이터 (하단 점) */}
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
