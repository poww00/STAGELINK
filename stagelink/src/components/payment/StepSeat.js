import React from "react";

/**
 * StepSeat - 예매 Step 1: 좌석 선택 최종 확인 컴포넌트
 * @param {Array} selectedSeats - 선택된 좌석 리스트 (예: ["VIP-1", "R-12"])
 * @param {number} showId - 공연 ID (실제 예매엔 사용)
 * @param {string} date - 선택한 날짜
 * @param {string} time - 선택한 회차
 * @param {function} onNext - '선택 완료' 버튼 클릭 시 호출 (다음 단계 이동)
 * @param {function} onBack - '뒤로가기' 버튼 클릭 시 호출 (이전 단계 이동)
 */
const StepSeat = ({ selectedSeats, showId, date, time, onNext, onBack }) => {
  return (
    <div className="relative h-full pb-24">
      {/* === 본문: 좌석 정보 및 날짜/회차 안내 === */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold">선택한 좌석 확인</h2>
        {/* 선택 좌석 리스트 출력 */}
        <ul className="list-disc list-inside text-sm">
          {selectedSeats.map((seat, idx) => (
            <li key={idx}>{seat}</li>
          ))}
        </ul>
        {/* 공연 날짜 및 회차 정보 */}
        <p className="text-gray-600 text-sm">
          공연 날짜: <strong>{date}</strong><br />
          공연 회차: <strong>{time}</strong>
        </p>
      </div>

      {/* === 하단 고정 버튼 영역 === */}
      <div className="absolute bottom-0 left-0 w-full bg-white pt-3 px-1 border-t border-gray-200 flex justify-end gap-2">
        {/* 이전 단계 이동 */}
        <button
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 rounded"
        >
          뒤로가기
        </button>
        {/* 다음 단계(할인/결제)로 이동 */}
        <button
          onClick={onNext}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          선택 완료
        </button>
      </div>
    </div>
  );
};

export default StepSeat;
