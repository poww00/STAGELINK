// src/components/home/CarouselRank.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

const CarouselRank = ({ filter = "top20" }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [currentList, setCurrentList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentPage(0);
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

  const totalPages = Math.ceil(currentList.length / 5);
  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };
  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const paginated = currentList.slice(currentPage * 5, currentPage * 5 + 5);
  const handleClick = (showId) => {
    navigate(`/shows/${showId}`);
  };

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
      <h2 className="text-xl font-bold text-blue-700 mb-4 text-center">{getTitle()}</h2>
      <div className="relative max-w-5xl mx-auto px-4">
        <div className="flex justify-center items-center gap-6">
          <button onClick={handlePrev} className="text-4xl text-gray-500 hover:text-black">◀</button>
          {paginated.map((show) => (
             <div
              key={show.id}
              onClick={() => handleClick(show.id)}
              className="w-[240px] border rounded-xl overflow-hidden shadow hover:shadow-md transition flex flex-col cursor-pointer"
            >
              <img
                src={show.poster}
                alt={show.name}
                className="w-full h-[200px] object-cover"
              />
              <div className="w-full p-3 flex flex-col justify-end">
                <h3 className="font-bold text-sm break-words whitespace-normal">{show.name}</h3>
                <p className="text-xs text-gray-600">{show.category} · {show.age}세 이상</p>
              </div>
            </div>
            ))}

          <button onClick={handleNext} className="text-4xl text-gray-500 hover:text-black">▶</button>
        </div>
      </div>
    </div>
  );
};

export default CarouselRank;
