// src/components/show/StickyBookingPanel.js
import React, { useState, useMemo } from "react";
import axios from "axios";

const StickyBookingPanel = ({
  sessionGroups,            // { 'yyyy-MM-dd': [ sessions … ] }
  onReserve,
  onLike,
  liked,
  userId,
  openLoginModal,
}) => {
  /* ─ 날짜/회차 선택 ───────────────────────────── */
  const today = new Date();
  const [yy, setYY] = useState(today.getFullYear());
  const [mm, setMM] = useState(today.getMonth()); // 0-index
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);

  /* ─ 남은 좌석 state ───────────────────────────── */
  const [remain, setRemain] = useState(null); // { vip,r,a,s }

  /* ─ 달력 계산 ────────────────────────────────── */
  const daysIn = (y, m) => new Date(y, m + 1, 0).getDate();
  const firstD = new Date(yy, mm, 1).getDay();
  const days = daysIn(yy, mm);

  const fmt = (y, m, d) =>
    `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const availableDates = useMemo(
    () => Object.keys(sessionGroups),
    [sessionGroups],
  );
  const sessions = selectedDate ? sessionGroups[selectedDate] : [];

  /* ─ 월/년 이동 ───────────────────────────────── */
  const moveMonth = (d) => {
    const dt = new Date(yy, mm + d);
    setYY(dt.getFullYear());
    setMM(dt.getMonth());
    setSelectedDate(null);
    setSelectedSession(null);
    setRemain(null);
  };
  const moveYear = (d) => {
    setYY((p) => p + d);
    setSelectedDate(null);
    setSelectedSession(null);
    setRemain(null);
  };

  /* ─ 회차 선택 시 남은 좌석 요청 ─────────────── */
  const pickSession = (idx) => {
    const s = sessions[idx] ?? null;
    setSelectedSession(s);
    setRemain(null);
    if (!s) return;
    axios
      .get(`/api/seats/remaining`, { params: { showId: s.id } })
      .then((res) => setRemain(res.data))
      .catch(() => setRemain(null));
  };

  /* ─ 버튼 핸들러 ──────────────────────────────── */
  const reserve = () => {
    if (!userId) {
      openLoginModal("로그인이 필요한 서비스입니다.");
      return;
    }
    if (!selectedDate || !selectedSession) {
      openLoginModal("날짜와 회차를 모두 선택하세요!");
      return;
    }
    onReserve(
      selectedDate,
      selectedSession.startTime.slice(11, 16),
      selectedSession.id,
    );
  };
  const like = () => {
    if (!userId) {
      openLoginModal("로그인이 필요한 서비스입니다.");
      return;
    }
    onLike();
  };

  /* ─ 렌더 ────────────────────────────────────── */
  return (
    <aside
      className="sticky top-[140px] w-80 rounded-lg border bg-white p-4 text-sm shadow-md"
    >
      {/* ── 1. 달력 ────────────────────────────── */}
      <h2 className="mb-2 text-base font-semibold">날짜 선택</h2>

      <div className="mb-3 rounded-lg border p-2">
        {/* 헤더(연·월 이동) */}
        <div className="mb-1 flex items-center justify-between text-center font-medium">
          <button onClick={() => moveYear(-1)}>&lt;&lt;</button>
          <button onClick={() => moveMonth(-1)}>&lt;</button>
          <span className="text-base">
            {yy}년&nbsp;{mm + 1}월
          </span>
          <button onClick={() => moveMonth(1)}>&gt;</button>
          <button onClick={() => moveYear(1)}>&gt;&gt;</button>
        </div>

        {/* 요일 */}
        <div className="mb-1 grid grid-cols-7 text-center text-xs text-gray-500">
          {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* 일자 */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {Array.from({ length: firstD }, (_, i) => (
            <div key={`e${i}`} className="text-gray-300">
              -
            </div>
          ))}
          {Array.from({ length: days }, (_, i) => {
            const d = i + 1,
              date = fmt(yy, mm, d),
              ok = availableDates.includes(date);
            return (
              <button
                key={date}
                disabled={!ok}
                onClick={() => {
                  setSelectedDate(date);
                  setSelectedSession(null);
                  setRemain(null);
                }}
                className={`h-8 w-full rounded-lg text-sm ${
                  !ok
                    ? "cursor-not-allowed text-gray-400"
                    : selectedDate === date
                    ? "bg-orange-500 text-white"
                    : "hover:bg-orange-100"
                }`}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 2. 선택 정보 & 회차 ────────────────── */}
      <div className="mb-3 text-center text-sm">
        선택한 날짜:&nbsp;
        <span className="font-semibold text-purple-700">
          {selectedDate || "-"}
        </span>
      </div>

      <div className="mb-3">
        <h2 className="mb-1 text-sm font-semibold">회차 선택</h2>
        <select
          className="h-9 w-full rounded-md border px-2 text-sm"
          value={sessions.indexOf(selectedSession) ?? ""}
          disabled={!selectedDate}
          onChange={(e) => pickSession(+e.target.value)}
        >
          <option value="">회차를 선택해주세요</option>
          {sessions.map((s, idx) => (
            <option key={s.id} value={idx}>
              {s.startTime.slice(11, 16)} ~ {s.endTime.slice(11, 16)}
            </option>
          ))}
        </select>
      </div>

      {/* ── 3. 잔여 좌석(고정 높이) ─────────────── */}
      <div className="mb-4 min-h-[80px] rounded-md bg-gray-50 p-2 text-xs">
        {selectedSession ? (
          remain ? (
            <ul className="space-y-0.5 text-gray-700">
              <li>🎟️ VIP석&nbsp;: {remain.vip}석</li>
              <li>🎟️ R석&nbsp;&nbsp;&nbsp;: {remain.r}석</li>
              <li>🎟️ A석&nbsp;&nbsp;: {remain.a}석</li>
              <li>🎟️ S석&nbsp;&nbsp;: {remain.s}석</li>
            </ul>
          ) : (
            <p className="text-center text-gray-400">
              잔여 좌석 정보를 불러오는 중...
            </p>
          )
        ) : (
          <p className="text-center text-gray-400">
            날짜와 회차를 선택하면<br />잔여 좌석이 표시됩니다
          </p>
        )}
      </div>

      {/* ── 4. 액션 버튼(세로 배치) ─────────────── */}
      <div className="flex flex-col space-y-2">
        <button
          onClick={reserve}
          className="h-10 w-full rounded-md bg-blue-600 text-base font-medium text-white hover:bg-blue-700"
        >
          예매하기
        </button>
        <button
          onClick={like}
          className={`h-10 w-full rounded-md text-base font-medium text-white ${
            liked
              ? "bg-orange-500 hover:bg-orange-600"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {liked ? "찜 취소" : "찜하기"}
        </button>
      </div>
    </aside>
  );
};

export default StickyBookingPanel;
