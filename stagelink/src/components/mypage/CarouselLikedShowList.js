import React, { useEffect, useState } from "react";
import { cancelMyLike } from "../../api/mypageApi";

const CarouselShowList = ({ title, shows, setShows }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 3;
  const cardWidth = 180 + 16; // 카드 너비 + gap

  const totalPages = Math.ceil(shows.length / ITEMS_PER_PAGE);
  const translateX = -currentPage * cardWidth * ITEMS_PER_PAGE;

  // 데이터 개수 변동 시 currentPage 보정
  useEffect(() => {
    if (currentPage > totalPages - 1) {
      setCurrentPage(Math.max(totalPages - 1, 0));
    }
  }, [shows.length, totalPages]);

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
  };

  const handleCancelLike = async (showNo) => {
    try {
      await cancelMyLike(showNo);
      alert("찜이 취소되었습니다.");
      setShows((prev) => prev.filter((s) => s.showNo !== showNo));
    } catch (err) {
      console.error("찜 취소 실패", err);
      alert("찜 취소에 실패했습니다.");
    }
  };
  
  return (
    <section className="relative w-full">
      <h3 className="text-lg font-bold mb-3">{title}</h3>
      {shows.length === 0 ? (
        <p className="text-gray-500">찜한 공연이 없습니다.</p>
      ) : (
        <div className="flex items-center justify-center gap-4 w-full">
          {/* 이전 버튼 */}
          <button
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30"
            onClick={handlePrev}
            disabled={currentPage === 0}
            aria-label="이전"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* 슬라이드 영역 */}
          <div className="overflow-hidden" style={{ width: `${cardWidth * ITEMS_PER_PAGE}px` }}>
            <div
              className="flex gap-4 transition-transform duration-300"
              style={{
                transform: `translateX(${translateX}px)`,
                width: `${cardWidth * shows.length}px`,
              }}
            >
              {shows.map((show) => (
                <div
                  key={show.showNo}
                  className="border rounded-xl p-3 shadow-sm bg-white w-[180px] flex-shrink-0"
                >
                  <img
                    src={show.poster}
                    alt={show.showName}
                    className="w-full h-36 object-cover rounded mb-2"
                  />
                  <h4 className="text-sm font-bold truncate">{show.showName}</h4>
                  <p className="text-xs text-gray-600">{show.period}</p>
                  <p className="text-xs text-gray-600">{show.venue}</p>
                  <p className="text-xs mt-1">
                    예매 가능 여부: {" "}
                    <span className={show.available ? "text-blue-600" : "text-red-500"}>
                      {show.available ? "예매 가능" : "매진"}
                    </span>
                  </p>
                  <div className="flex gap-1 mt-2">
                    {show.available && (
                      <button
                        onClick={() => (window.location.href = `/shows/${show.showNo}`)}
                        className="mt-2 text-xs bg-purple-100 hover:bg-purple-200 px-3 py-1 rounded"
                      >
                        예매하기
                      </button>
                    )}
                    <button
                      onClick={() => handleCancelLike(show.showNo)}
                      className="mt-2 text-xs bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded"
                    >
                      찜취소
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 다음 버튼 */}
          <button
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30"
            onClick={handleNext}
            disabled={currentPage >= totalPages - 1}
            aria-label="다음"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
};

export default CarouselShowList;
