import React, { useState, useEffect } from "react";

// 좌석 색상 정의 (등급별 색상 및 선택 시 색상)
const seatColors = {
  VIP: {
    base: "bg-blue-200",
    selected: "bg-blue-600 text-white",
  },
  R: {
    base: "bg-purple-300",
    selected: "bg-purple-600 text-white",
  },
  S: {
    base: "bg-yellow-200",
    selected: "bg-yellow-500 text-white",
  },
};

const chunkReversed = (array, size) => {
  if (!Array.isArray(array)) return [];
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks.reverse();
};

const getSeatColor = (seat, isSelected) => {
  const colorSet = seatColors[seat.seatClass] || {
    base: "bg-gray-200",
    selected: "bg-gray-400 text-white",
  };
  return isSelected ? colorSet.selected : colorSet.base;
};

const SeatGrid = ({
  onSelect = () => {},
  onConfirm = () => {},
  selectedSeats = [],
}) => {
  const [seats, setSeats] = useState([]);

  // 좌석 mock 데이터 생성
  useEffect(() => {
    const seatCounts = { VIP: 50, R: 150, S: 200 };
    const mock = [];
    let id = 1;
    Object.entries(seatCounts).forEach(([seatClass, count]) => {
      for (let i = 1; i <= count; i++) {
        mock.push({
          seatId: id++,
          seatClass,
          seatNumber: i,
          reserved: Math.random() < 0.2,
        });
      }
    });
    setSeats(mock);
  }, []);

  // 좌석 클릭 시, selectedSeats 배열 직접 조작 (최대 5개)
  const toggleSeat = (seatId) => {
    // 현재 좌석 id로 seat 객체 찾기
    const seat = seats.find((s) => s.seatId === seatId);
    if (!seat) return;

    const seatLabel = `${seat.seatClass}-${seat.seatNumber}`;
    let next;
    if (selectedSeats.includes(seatLabel)) {
      // 이미 선택된 좌석이면 해제
      next = selectedSeats.filter((s) => s !== seatLabel);
    } else {
      // 새로 선택하는 경우
      if (selectedSeats.length >= 5) {
        alert("최대 5개의 좌석만 선택할 수 있습니다.");
        return;
      }
      next = [...selectedSeats, seatLabel];
    }
    onSelect(next); // 부모에 선택내역 전달
  };

  const resetSelection = () => {
    onSelect([]);
  };

  // 현재 선택된 좌석 객체들
  const selectedSeatObjs = seats.filter((s) => {
    const seatLabel = `${s.seatClass}-${s.seatNumber}`;
    return selectedSeats.includes(seatLabel);
  });

  return (
    <div className="flex gap-6 justify-center items-start relative pb-32">
      {/* 좌석 배치 */}
      <div className="flex flex-col gap-6 items-center w-[550px] max-w-full">
        {["VIP", "R", "S"].map((seatClass) => {
          const rowSeats = seats.filter((s) => s.seatClass === seatClass);
          const seatRows = chunkReversed(rowSeats, 20);
          return (
            <div key={seatClass} className="flex flex-col items-center gap-2">
              <div className="font-bold">{seatClass}석</div>
              {seatRows.map((row, idx) => (
                <div key={idx} className="flex gap-2 justify-center">
                  {row.map((seat) => {
                    const seatLabel = `${seat.seatClass}-${seat.seatNumber}`;
                    const isSelected = selectedSeats.includes(seatLabel);
                    const colorClass = getSeatColor(seat, isSelected);
                    return (
                      <button
                        key={seat.seatId}
                        className={`w-5 h-3 rounded text-[5px] font-semibold shadow transition ${
                          seat.reserved ? "bg-gray-400 cursor-not-allowed" : colorClass
                        }`}
                        disabled={seat.reserved}
                        onClick={() => toggleSeat(seat.seatId)}
                      >
                        {seat.seatClass?.[0] ?? "?"}-{seat.seatNumber}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          );
        })}
      </div>
      {/* 하단 버튼 영역 */}
      <div className="absolute bottom-0 left-0 w-full bg-white pt-3 px-1 border-t border-gray-200">
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={onConfirm}
            disabled={selectedSeatObjs.length === 0}
          >
            선택 완료
          </button>
          <button
            className="px-4 py-2 border border-gray-300 rounded"
            onClick={resetSelection}
          >
            초기화
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatGrid;
