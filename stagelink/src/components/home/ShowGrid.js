import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/* 관람 연령 포맷터 ─────────────────────────── */
const formatAge = (ageLabel, age) => {
  if (ageLabel) {
    if (/^\d+세 이상$/.test(ageLabel) && !ageLabel.startsWith("만")) {
      return `만 ${ageLabel}`;          
    }
    return ageLabel;
  }
  if (age == null) return "";
  if (age === 0) return "전체 이용가";
  if (age >= 20) return `${age}개월 이상`;
  return `만 ${age}세 이상`;
};

const ShowGrid = () => {
  const navigate = useNavigate();

  /* ───────── state ───────── */
  const [shows, setShows] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // 0-index
  const [totalPages, setTotalPages] = useState(1);

  const [sortBy, setSortBy] = useState("name");
  const [direction, setDirection] = useState("asc");
  const [category, setCategory] = useState("");
  const [excludeEnded, setExcludeEnded] = useState(true);

  const itemsPerPage = 20;

  /* 외부 → 내부 sort 필드 매핑 */
  const getSortField = (key) => (key === "startDate" ? "periodStart" : key);

  /* ───────── 데이터 로딩 ───────── */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/showinfo/sort", {
          params: {
            sortBy: getSortField(sortBy),
            direction,
            page: currentPage,
            size: itemsPerPage,
            excludeEnded,
          },
        });
        setShows(res.data.content);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("공연 목록을 불러오는 데 실패했습니다.", err);
      }
    };
    fetchData();
  }, [currentPage, sortBy, direction, excludeEnded]);

  const handleClick = (id) => navigate(`/shows/${id}`);

  /* ───────── 렌더 ───────── */
  return (
    <div className="my-12 max-w-5xl mx-auto px-4">
      <h2 className="text-xl font-bold text-purple-700 mb-6 text-center">
        전체 공연 목록
      </h2>

      {/* 정렬 · 필터 UI */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        {/* 장르 선택 */}
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setCurrentPage(0);
          }}
          className="border px-3 py-1 rounded-md"
        >
          <option value="">전체 장르</option>
          <option value="뮤지컬">🎶 뮤지컬</option>
          <option value="복합">🧩 복합</option>
          <option value="서양음악(클래식)">🎻 서양음악(클래식)</option>
          <option value="대중음악">🎧 대중음악</option>
          <option value="한국음악(국악)">🪕 한국음악(국악)</option>
          <option value="연극">🎭 연극</option>
          <option value="서커스/미술">🎪 서커스/미술</option>
          <option value="무용">💃 무용</option>
          <option value="대중 무용">🕺 대중 무용</option>
        </select>

        {/* 정렬 기준 */}
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setCurrentPage(0);
          }}
          className="border px-3 py-1 rounded-md"
        >
          <option value="name">이름순</option>
          <option value="startDate">공연일순</option>
        </select>

        {/* 정렬 방향 */}
        <select
          value={direction}
          onChange={(e) => {
            setDirection(e.target.value);
            setCurrentPage(0);
          }}
          className="border px-3 py-1 rounded-md"
        >
          <option value="asc">오름차순</option>
          <option value="desc">내림차순</option>
        </select>
      </div>

      {/* 카드 그리드 */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-6 mb-10">
        {shows
          .filter((s) => (category ? s.category === category : true))
          .map((s) => (
            <div
              key={s.id}
              onClick={() => handleClick(s.id)}
              className="w-[150px] border rounded-xl overflow-hidden shadow hover:shadow-md transition flex flex-col cursor-pointer"
            >
              <img
                src={s.poster}
                alt={s.name}
                className="w-full h-[200px] object-cover"
              />
              <div className="w-full p-3 flex flex-col justify-end">
                <h3 className="font-bold text-sm break-words whitespace-normal mt-auto">
                  {s.name}
                </h3>
                <p className="text-xs text-gray-600">
                  {s.category}
                  {formatAge(s.ageLabel, s.age) && (
                    <> · {formatAge(s.ageLabel, s.age)}</>
                  )}
                </p>
              </div>
            </div>
          ))}
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center space-x-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              currentPage === i
                ? "bg-purple-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-purple-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ShowGrid;
