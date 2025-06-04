import React from "react";

/* 좌석 색상 정의 (등급별로 기본/선택/예약 상태 색상 분리) */
const seatColors = {
  VIP: {
    base: "bg-blue-200",
    selected: "bg-blue-600 text-white",
    reserved: "bg-gray-400 text-white",
  },
  R: {
    base: "bg-purple-300",
    selected: "bg-purple-600 text-white",
    reserved: "bg-gray-400 text-white",
  },
  A: {
    base: "bg-orange-200",
    selected: "bg-orange-500 text-white",
    reserved: "bg-gray-400 text-white",
  },
  S: {
    base: "bg-yellow-200",
    selected: "bg-yellow-500 text-white",
    reserved: "bg-gray-400 text-white",
  },
};

/* 좌석 배열을 행 단위로 나누고 극장 스타일로 배치하기 위해 행,열 뒤집기 */
const chunkReversed = (array, size) => {
  if (!Array.isArray(array)) return [];
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    const chunk = array.slice(i, i + size);
    chunks.push(chunk);
  }
  // 극장처럼 뒤에서 앞으로 줄 세우기 + 각 줄도 좌→우 방향으로 정렬
  return chunks.reverse().map(row => row.reverse());
};

/* 좌석의 색상 클래스 반환 함수 */
const getSeatColor = (seat, isSelected) => {
  const colorSet = seatColors[seat.seatClass] || {
    base: "bg-gray-200",
    selected: "bg-gray-400 text-white",
    reserved: "bg-gray-400 text-white",
  };
  if (seat.reserved == 1) return colorSet.reserved; // 이미 예약된 좌석
  return isSelected ? colorSet.selected : colorSet.base;
};

/**
 * SeatGrid 컴포넌트
 * @param {Array} seats           전체 좌석 정보 배열
 * @param {Function} onSelect     좌석 선택 상태 변경 콜백
 * @param {Function} onConfirm    "선택 완료" 버튼 콜백
 * @param {Array} selectedSeats   선택된 좌석들 (["VIP-1", "R-3", ...])
 */
const SeatGrid = ({
  seats = [],
  onSelect = () => {},
  onConfirm = () => {},
  selectedSeats = [],
}) => {

  /* 좌석 클릭 시 선택 처리 (최대 5개 제한) */
  const toggleSeat = (seatId) => {
    const seat = seats.find((s) => s.seatId === seatId);
    if (!seat || seat.reserved) return; // 예약된 좌석은 클릭 불가
    const seatLabel = `${seat.seatClass}-${seat.seatNumber}`;
    let next;
    if (selectedSeats.includes(seatLabel)) {
      // 선택 해제
      next = selectedSeats.filter((s) => s !== seatLabel);
    } else {
      // 최대 5개 제한
      if (selectedSeats.length >= 5) {
        alert("최대 5개의 좌석만 선택할 수 있습니다.");
        return;
      }
      next = [...selectedSeats, seatLabel];
    }
    onSelect(next); // 선택 변경 콜백
  };

  /* 선택 초기화 버튼 처리 */
  const resetSelection = () => {
    onSelect([]);
  };

  /* 현재 선택된 좌석 객체 리스트 (가격 계산 등에 사용 가능) */
  const selectedSeatObjs = seats.filter((s) => {
    const seatLabel = `${s.seatClass}-${s.seatNumber}`;
    return selectedSeats.includes(seatLabel);
  });

  /* 렌더링 */
  return (
    <div className="flex gap-6 justify-center items-start relative pb-32">
      {/* 좌석 배치 전체 영역 */}
      <div className="flex flex-col gap-6 items-center w-[900px] max-w-full">
        {["VIP", "R", "A", "S"].map((seatClass) => {
          const rowSeats = seats.filter((s) => s.seatClass === seatClass);

          // 뒤쪽 좌석이 위에 오도록 재정렬
          const seatsReordered = [...rowSeats].reverse();
          const seatRows = chunkReversed(seatsReordered, 30); // 30개씩 줄 단위 나누기

          return (
            <div key={seatClass} className="flex flex-col items-center gap-2">
              {/* 등급별 타이틀 */}
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
                        className={`w-5 h-3 rounded text-[5px] font-semibold shadow transition ${colorClass} ${
                          seat.reserved == 1 ? "cursor-not-allowed" : ""
                        }`}
                        disabled={seat.reserved}
                        onClick={() => toggleSeat(seat.seatId)}
                      >
                        {seat.seatNumber}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* 하단 고정 버튼 (선택 완료 / 초기화) */}
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
