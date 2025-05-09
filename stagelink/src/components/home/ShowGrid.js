// src/components/home/ShowGrid.js
import React, { useState } from "react";

const mockShows = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `공연 ${i + 1}`,
  poster: `/images/poster${(i % 5) + 1}.jpg`,
  category: i % 2 === 0 ? "뮤지컬" : "연극",
  age: 10 + (i % 5) * 5,
}));

const ShowGrid = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const totalPages = Math.ceil(mockShows.length / itemsPerPage);
  const paginated = mockShows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="my-12 max-w-7xl mx-auto px-4">
      <h2 className="text-xl font-bold text-purple-700 mb-4 text-center">🎭 전체 공연 목록</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 mb-12">
        {paginated.map((show) => (
          <div
            key={show.id}
            className="w-full border rounded-xl overflow-hidden shadow hover:shadow-md transition flex flex-col"
          >
            <img
              src={show.poster}
              alt={show.name}
              className="w-full h-[240px] object-cover"
            />
            <div className="w-full p-4 flex flex-col justify-end h-full">
              <h3 className="font-bold text-base break-words whitespace-normal mt-auto">{show.name}</h3>
              <p className="text-sm text-gray-600">{show.category} · {show.age}세 이상</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              currentPage === i + 1 ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-purple-200"
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
