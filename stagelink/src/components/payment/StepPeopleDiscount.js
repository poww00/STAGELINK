import React, { useState } from "react";

/**
 * StepPeopleDiscount - 예매 Step 2: 할인/인원 분배 선택 컴포넌트
 * @param {number} showId - 공연 ID (실제 예매엔 사용)
 * @param {Array} selectedSeats - 선택된 좌석 리스트 (예: ["VIP-1", "R-12"])
 * @param {string} date - 선택한 날짜
 * @param {string} time - 선택한 회차
 * @param {function} onNext - '선택 완료' 클릭 시, 할인 정보와 함께 다음 단계로 이동
 * @param {function} onBack - '뒤로가기' 클릭 시, 이전 단계로 이동
 */
const StepPeopleDiscount = ({ showId, selectedSeats, date, time, onNext, onBack }) => {
  // 할인 인원 상태값: 초기에 '일반' 인원 = 전체 좌석 수, 나머지는 0
  const [discounts, setDiscounts] = useState({
    normal: selectedSeats.length,
    patriot: 0,
    mildDisabled: 0,
    severeDisabled: 0,
  });

  /**
   * 인원 수 변경 핸들러
   * - 할인 인원을 +/– 버튼으로 조정
   * - 전체 좌석 수 초과/음수 방지
   */
  const handleChange = (type, delta) => {
    const newDiscounts = { ...discounts };
    const total =
      Object.values(newDiscounts).reduce((sum, v) => sum + v, 0) + delta;
    // 좌석 수 초과 또는 음수 방지
    if (total > selectedSeats.length || newDiscounts[type] + delta < 0) return;
    newDiscounts[type] += delta;
    setDiscounts(newDiscounts);
  };

  return (
    <div className="relative h-full pb-24">
      {/* 타이틀 */}
      {/* 선택 좌석 수 안내 */}
      <div className="text-sm text-gray-500 mb-2">
        총 선택한 좌석 수: <span className="font-semibold">{selectedSeats.length}</span>
      </div>
      {/* 할인 인원 조정 UI */}
      {[
        { label: "일반 결제", key: "normal" },
        { label: "국가 유공자", key: "patriot" },
        { label: "경증 장애인", key: "mildDisabled" },
        { label: "중증 장애인", key: "severeDisabled" },
      ].map((item) => (
        <div key={item.key} className="flex items-center justify-between border p-2 mb-2">
          <span>{item.label}</span>
          <div className="flex items-center gap-2">
            <button
              className="bg-gray-200 px-2 rounded"
              onClick={() => handleChange(item.key, -1)}
            >
              -
            </button>
            <span>{discounts[item.key]}</span>
            <button
              className="bg-blue-500 text-white px-2 rounded"
              onClick={() => handleChange(item.key, 1)}
            >
              +
            </button>
          </div>
        </div>
      ))}
      {/* 하단 고정 버튼 영역 */}
      <div className="absolute bottom-0 left-0 w-full bg-white pt-3 px-1 border-t border-gray-200">
        <div className="flex justify-end gap-2">
          {/* 이전 단계 이동 */}
          <button
            className="px-4 py-2 border border-gray-300 rounded"
            onClick={onBack}
          >
            뒤로가기
          </button>
          {/* 다음 단계(결제)로 이동, discounts 정보 전달 */}
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => onNext(discounts)}
          >
            선택 완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepPeopleDiscount;
