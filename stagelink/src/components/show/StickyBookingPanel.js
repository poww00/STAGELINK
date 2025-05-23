import React, { useState, useEffect } from "react";
import LoginModal from "../common/LoginModal";

const availableDates = [
  "2025-04-28", "2025-05-02", "2025-05-04",
  "2025-05-08", "2025-06-01", "2025-06-05", "2025-06-15"
];
const mockTimes = [
  { id: 1, label: "10:00 ~ 12:00" },
  { id: 2, label: "14:00 ~ 16:00" },
  { id: 3, label: "18:00 ~ 20:00" },
];

const StickyBookingPanel = ({ showId, onLike, onReserve, liked, memberId, openLoginModal }) => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [seatCounts, setSeatCounts] = useState({ VIP: 0, R: 0, S: 0 });

  useEffect(() => {
    setSeatCounts({ VIP: 14, R: 23, S: 32 });
  }, [showId]);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const changeMonth = (delta) => {
    const newDate = new Date(currentYear, currentMonth + delta);
    setCurrentYear(newDate.getFullYear());
    setCurrentMonth(newDate.getMonth());
  };
  const changeYear = (delta) => setCurrentYear((prev) => prev + delta);
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const formatDate = (year, month, day) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  // 예매 버튼 클릭 시: 로그인 체크 → 모달 안내 또는 예매 진행
  const handleReserveClick = () => {
    if (!memberId) {
      openLoginModal("로그인이 필요한 서비스입니다. 로그인 해주세요!");
      return;
    }
    if (!selectedDate || !selectedTime) {
      openLoginModal("날짜와 회차를 선택해주세요.");
      return;
    }
    onReserve(selectedDate, selectedTime.label);
  };

  // 찜하기도 로그인 체크 필요시 아래 방식 사용 권장
  const handleLikeClick = () => {
    if (!memberId) {
      openLoginModal("로그인이 필요한 서비스입니다. 로그인 해주세요!");
      return;
    }
    onLike();
  };

  return (
    <div className="bg-white shadow-md p-3 rounded-lg border border-gray-200 text-xs w-[88%] mx-auto">
      <h2 className="text-base font-semibold mb-2">날짜 선택</h2>
      {/* 달력 UI */}
      <div className="border rounded mb-2 p-1.5">
        <div className="flex justify-between items-center mb-1 px-1 text-center font-medium text-xs">
          <button onClick={() => changeYear(-1)}>{`<<`}</button>
          <button onClick={() => changeMonth(-1)}>{`<`}</button>
          <span>{currentYear}년 {currentMonth + 1}월</span>
          <button onClick={() => changeMonth(1)}>{`>`}</button>
          <button onClick={() => changeYear(1)}>{`>>`}</button>
        </div>
        <div className="grid grid-cols-7 gap-0.5 text-center text-[11px] text-gray-500 mb-1">
          <div>일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div>토</div>
        </div>
        <div className="grid grid-cols-7 gap-0.5 text-center">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="text-gray-300">-</div>
          ))}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const day = idx + 1;
            const dateStr = formatDate(currentYear, currentMonth, day);
            const isAvailable = availableDates.includes(dateStr);

            return (
              <button
                key={dateStr}
                disabled={!isAvailable}
                onClick={() => setSelectedDate(dateStr)}
                className={`py-0.5 rounded text-xs ${
                  !isAvailable
                    ? "text-gray-400 cursor-not-allowed"
                    : selectedDate === dateStr
                    ? "bg-orange-400 text-white"
                    : "hover:bg-orange-100"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
      <div className="mb-2 text-center">
        선택한 날짜: <span className="text-purple-700 font-semibold">{selectedDate || "-"}</span>
      </div>
      <div className="mb-2">
        <h2 className="font-semibold mb-1 text-xs">회차 선택</h2>
        <select
          onChange={(e) => {
            const timeId = parseInt(e.target.value);
            const time = mockTimes.find((t) => t.id === timeId);
            setSelectedTime(time);
          }}
          className="w-full border px-2 py-1.5 rounded text-xs"
          defaultValue=""
        >
          <option value="" disabled>
            회차를 선택해주세요
          </option>
          {mockTimes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
      <ul className="text-[11px] text-gray-600 mb-2 space-y-0.5">
        <li>🎟️ VIP석: {seatCounts.VIP}석</li>
        <li>🎟️ R석: {seatCounts.R}석</li>
        <li>🎟️ S석: {seatCounts.S}석</li>
      </ul>
      <div className="flex gap-2">
        <button
          onClick={handleReserveClick}
          className="bg-blue-600 text-white w-full py-1.5 rounded hover:bg-blue-700 text-xs"
        >
          예매하기
        </button>
        <button
          onClick={handleLikeClick}
          className={`w-full py-1.5 rounded text-xs 
            ${liked ? "bg-orange-400 text-white hover:bg-orange-500" : "bg-purple-500 text-white hover:bg-purple-600"}`}
        >
          {liked ? "찜 취소" : "찜하기"}
        </button>
      </div>
    </div>
  );
};

export default StickyBookingPanel;
