import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ShowGrid = () => {
  const navigate = useNavigate();

  const [shows, setShows] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // 0부터 시작
  const [totalPages, setTotalPages] = useState(1);

  const [sortBy, setSortBy] = useState("name");
  const [direction, setDirection] = useState("asc");
  const [category, setCategory] = useState("");
  const [excludeEnded, setExcludeEnded] = useState(true);

  const itemsPerPage = 20;

  // 🔁 프론트에서 내부 필드명 치환 함수
  const getSortField = (sortKey) => {
    if (sortKey === "startDate") return "periodStart";
    return sortKey;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/showinfo/sort`, {
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
      } catch (error) {
        console.error("공연 목록을 불러오는 데 실패했습니다.", error);
      }
    };

    fetchData();
  }, [currentPage, sortBy, direction, excludeEnded]);

  const handleClick = (id) => {
    navigate(`/shows/${id}`);
  };

  return (
    <div className="my-12 max-w-5xl mx-auto px-4">
      <h2 className="text-xl font-bold text-purple-700 mb-6 text-center"> 전체 공연 목록 </h2>

      {/* 🔧 정렬/필터 UI */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
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

        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setCurrentPage(0);
          }}
          className="border px-3 py-1 rounded-md"
        >
          <option value="name">이름순</option>
          <option value="startDate">공연일순</option> {/* 프론트 전용 명칭 */}
        </select>

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

      {/* 📦 공연 카드 그리드 */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-6 mb-10">
        {shows
          .filter((show) => (category ? show.category === category : true))
          .map((show) => (
            <div
              key={show.id}
              onClick={() => handleClick(show.id)}
              className="w-[150px] border rounded-xl overflow-hidden shadow hover:shadow-md transition flex flex-col cursor-pointer"
            >
              <img
                src={show.poster}
                alt={show.name}
                className="w-full h-[200px] object-cover"
              />
              <div className="w-full p-3 flex flex-col justify-end">
                <h3 className="font-bold text-sm break-words whitespace-normal mt-auto">
                  {show.name}
                </h3>
                <p className="text-xs text-gray-600">
                  {show.category} · {show.age}세 이상
                </p>
              </div>
            </div>
          ))}
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
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
