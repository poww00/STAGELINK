import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// 📦 목데이터 생성
const mockShows = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `공연 ${String.fromCharCode(65 + (i % 26))}${i + 1}`, // 이름 순서 확인용 A~Z
  poster: `/images/poster${(i % 5) + 1}.jpg`,
  category: ["뮤지컬", "연극", "콘서트", "오페라", "클래식", "아동극"][i % 6],
  age: 10 + (i % 5) * 5,
  startDate: `2025-0${(i % 6) + 1}-0${(i % 9) + 1}`, // 2025-01-01 ~ 2025-06-09
  showState: i % 6 === 5 ? 5 : 1, // 일부는 종료 공연
}));

const ShowGrid = () => {
  const navigate = useNavigate();

  const [filtered, setFiltered] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [sortBy, setSortBy] = useState("name");
  const [direction, setDirection] = useState("asc");
  const [category, setCategory] = useState("");
  const [excludeEnded, setExcludeEnded] = useState(true);

  const itemsPerPage = 20;

  const handleClick = (id) => {
    navigate(`/shows/${id}`);
  };

  // 🎯 정렬 함수
  const sortData = (data, sortBy, direction) => {
    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (typeof aVal === "string") {
        return direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      } else {
        return direction === "asc" ? aVal - bVal : bVal - aVal;
      }
    });
    return sorted;
  };

  // 📌 필터링 + 정렬 처리
  useEffect(() => {
    let data = [...mockShows];

    if (excludeEnded) {
      data = data.filter((show) => show.showState !== 5);
    }

    if (category) {
      data = data.filter((show) => show.category === category);
    }

    data = sortData(data, sortBy, direction);

    setTotalPages(Math.ceil(data.length / itemsPerPage));
    setFiltered(data);
    setCurrentPage(1); // 필터 변경 시 첫 페이지로
  }, [sortBy, direction, category, excludeEnded]);

  // 현재 페이지 데이터 추출
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="my-12 max-w-5xl mx-auto px-4">
      <h2 className="text-xl font-bold text-purple-700 mb-6 text-center"> 전체 공연 목록 </h2>

      {/* 🔧 정렬/필터 UI */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-3 py-1 rounded-md"
        >
          <option value="">전체 장르</option>
          <option value="뮤지컬">🎶뮤지컬</option>
          <option value="연극">🎭연극</option>
          <option value="콘서트">👨‍🎤콘서트</option>
          <option value="오페라">🎭오페라</option>
          <option value="클래식">🎻클래식</option>
          <option value="아동극">🍼아동</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border px-3 py-1 rounded-md"
        >
          <option value="name">이름순</option>
          <option value="startDate">공연일순</option>
        </select>

        <select
          value={direction}
          onChange={(e) => setDirection(e.target.value)}
          className="border px-3 py-1 rounded-md"
        >
          <option value="asc">오름차순</option>
          <option value="desc">내림차순</option>
        </select>
      </div>

      {/* 📦 공연 카드 그리드 */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-6 mb-10">
        {paginated.map((show) => (
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
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              currentPage === i + 1
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
