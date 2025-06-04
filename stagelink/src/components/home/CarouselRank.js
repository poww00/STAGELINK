import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// 목데이터: 성별/연령대/전체 인기 공연 정보 20개씩 준비
const mockData = {
  top20: Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `공연 ${i + 1}`,
    poster: `/images/poster${(i % 5) + 1}.jpg`,
    category: i % 2 === 0 ? "뮤지컬" : "연극",
    age: 10 + (i % 5) * 5,
  })),
  gender: {
    MALE: Array.from({ length: 20 }, (_, i) => ({
      id: i + 101,
      name: `남성 선호 공연 ${i + 1}`,
      poster: `/images/poster${(i % 5) + 1}.jpg`,
      category: "콘서트",
      age: 15,
    })),
    FEMALE: Array.from({ length: 20 }, (_, i) => ({
      id: i + 201,
      name: `여성 선호 공연 ${i + 1}`,
      poster: `/images/poster${(i % 5) + 1}.jpg`,
      category: "발레",
      age: 12,
    })),
  },
  age: {
    "10대": Array.from({ length: 20 }, (_, i) => ({
      id: i + 301,
      name: `10대 공연 ${i + 1}`,
      poster: `/images/poster${(i % 5) + 1}.jpg`,
      category: "아동극",
      age: 7,
    })),
    "20대": Array.from({ length: 20 }, (_, i) => ({
      id: i + 321,
      name: `20대 공연 ${i + 1}`,
      poster: `/images/poster${(i % 5) + 1}.jpg`,
      category: "연극",
      age: 19,
    })),
    "30대": Array.from({ length: 20 }, (_, i) => ({
      id: i + 341,
      name: `30대 공연 ${i + 1}`,
      poster: `/images/poster${(i % 5) + 1}.jpg`,
      category: "뮤지컬",
      age: 15,
    })),
    "40대": Array.from({ length: 20 }, (_, i) => ({
      id: i + 361,
      name: `40대 공연 ${i + 1}`,
      poster: `/images/poster${(i % 5) + 1}.jpg`,
      category: "클래식",
      age: 20,
    })),
    "50대": Array.from({ length: 20 }, (_, i) => ({
      id: i + 381,
      name: `50대 공연 ${i + 1}`,
      poster: `/images/poster${(i % 5) + 1}.jpg`,
      category: "오페라",
      age: 17,
    })),
    "60대 이상": Array.from({ length: 20 }, (_, i) => ({
      id: i + 401,
      name: `60대 이상 공연 ${i + 1}`,
      poster: `/images/poster${(i % 5) + 1}.jpg`,
      category: "전통극",
      age: 10,
    })),
  },
};

/**
 * CarouselRank - 인기 공연 캐러셀 컴포넌트
 * @param {string} filter - 필터 타입 ("top20" | "gender:MALE" | "age:20대" 등)
 */
const CarouselRank = ({ filter = "top20" }) => {
  const [currentPage, setCurrentPage] = useState(0);     // 현재 캐러셀 페이지
  const [currentList, setCurrentList] = useState([]);    // 필터링된 공연 리스트
  const navigate = useNavigate();                        // 상세 페이지 이동용

  // 필터가 변경될 때마다 리스트 재설정
  useEffect(() => {
    setCurrentPage(0); // 페이지 초기화
    if (filter.startsWith("gender:")) {
      const gender = filter.split(":")[1];
      setCurrentList(mockData.gender[gender]);
    } else if (filter.startsWith("age:")) {
      const age = filter.split(":")[1];
      setCurrentList(mockData.age[age]);
    } else {
      setCurrentList(mockData.top20);
    }
  }, [filter]);

  // 전체 페이지 수 (5개씩 보여줌)
  const totalPages = Math.ceil(currentList.length / 5);

  // 이전 페이지로 이동 (순환)
  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  // 다음 페이지로 이동 (순환)
  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  // 현재 페이지에 해당하는 5개만 슬라이싱
  const paginated = currentList.slice(currentPage * 5, currentPage * 5 + 5);

  // 공연 클릭 시 상세 페이지로 이동
  const handleClick = (showId) => {
    navigate(`/shows/${showId}`);
  };

  // 상단 타이틀 반환 함수
  const getTitle = () => {
    if (filter.startsWith("gender:")) {
      const gender = filter.split(":")[1];
      return gender === "MALE" ? "🔥 남성 인기 TOP 20" : "🔥 여성 인기 TOP 20";
    } else if (filter.startsWith("age:")) {
      const age = filter.split(":")[1];
      return `🔥 ${age} 인기 TOP 20`;
    }
    return "🔥 인기 공연 TOP 20";
  };

  return (
    <div className="my-8">
      {/* 타이틀 출력 */}
      <h2 className="text-xl font-bold text-blue-700 mb-4 text-center">{getTitle()}</h2>

      {/* 캐러셀 본체 */}
      <div className="relative max-w-5xl mx-auto px-4">
        <div className="flex justify-center items-center gap-6">
          {/* 이전 버튼 */}
          <button onClick={handlePrev} className="text-4xl text-gray-500 hover:text-black">◀</button>

          {/* 공연 카드 5개 렌더링 */}
          {paginated.map((show) => (
            <div
              key={show.id}
              onClick={() => handleClick(show.id)}
              className="w-[240px] border rounded-xl overflow-hidden shadow hover:shadow-md transition flex flex-col cursor-pointer"
            >
              {/* 포스터 이미지 */}
              <img
                src={show.poster}
                alt={show.name}
                className="w-full h-[200px] object-cover"
              />
              {/* 공연 정보 */}
              <div className="w-full p-3 flex flex-col justify-end">
                <h3 className="font-bold text-sm break-words whitespace-normal">{show.name}</h3>
                <p className="text-xs text-gray-600">{show.category} · {show.age}세 이상</p>
              </div>
            </div>
          ))}

          {/* 다음 버튼 */}
          <button onClick={handleNext} className="text-4xl text-gray-500 hover:text-black">▶</button>
        </div>
      </div>
    </div>
  );
};

export default CarouselRank;
