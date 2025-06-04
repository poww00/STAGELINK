// StepConfirm.js  ───────────────────────────────────────
import React, { useEffect, useState } from "react";
import axios from "axios";

const labels = { normal:"일반", patriot:"국가 유공자", mildDisabled:"경증 장애인", severeDisabled:"중증 장애인" };

export default function StepConfirm({
  reservationNo,
  show, showInfo,
  selectedSeats = [],
  date, time,
  discounts = null,
  payResult,
  onClose      
}) {

  /* ─ 서버 조회(선택) ───────────────────────────── */
  const [detail, setDetail]   = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // selectedSeats 가 비어있으면 서버에서 상세 조회
    if (!reservationNo || selectedSeats.length) return;
    setLoading(true);
    axios.get(`/api/reservation/${reservationNo}`)
         .then(res => setDetail(res.data))
         .catch(()  => alert("예약 상세 조회 실패"))
         .finally(() => setLoading(false));
  }, [reservationNo, selectedSeats.length]);

  /* ─ 화면에 쓸 데이터 결정 ──────────────────────── */
  const seats       = detail?.seats       || selectedSeats;
  const title       = detail?.showTitle   || showInfo?.name;
  const showDate    = detail?.showDate    || date;
  const showTime    = detail?.showTime    || time;
  const totalAmount = detail?.totalAmount || payResult?.totalAmount || 0;

  if (loading || (!payResult && !detail))
    return <div className="p-20 text-center text-lg">결제 결과를 불러오는 중...</div>;

  return (
    <div className="relative h-full pb-24 flex flex-col">
      {/* 1. 공연 정보 */}
      <section className="mb-6">
        <h3 className="font-bold mb-2">공연 정보</h3>
        <p>공연명: <strong>{title}</strong></p>
        <p>날짜&nbsp;: {showDate}</p>
        <p>시작 시간: &nbsp;: {showTime}</p>
      </section>

      {/* 2. 좌석 정보 */}
      <section className="mb-6">
        <h3 className="font-bold mb-2">좌석 정보</h3>
        {seats.length ? (
          <ul className="list-disc list-inside">
            {seats.map((s,i) => (
              <li key={i}>{typeof s === "string" ? s : `${s.grade}-${s.number}`}</li>
            ))}
          </ul>
        ) : <p className="text-gray-500">좌석 정보가 없습니다.</p>}
      </section>

      {/* 3. 할인 내역 */}
      <section className="mb-6">
        <h3 className="font-bold mb-2">할인 내역</h3>
        {discounts && Object.values(discounts).some(v=>v>0) ? (
          <ul>
            {Object.entries(discounts).map(
              ([k,v]) => v>0 && <li key={k}>{labels[k]}: {v}명</li>
            )}
          </ul>
        ) : <p className="text-gray-500">적용된 할인이 없습니다.</p>}
      </section>

      {/* 4. 메시지 & 금액 */}
      <p className="text-green-600 font-semibold mb-4">
        결제가 성공적으로 완료되었습니다!<br/>
        마이페이지에서 예매 내역을 확인할 수 있습니다.
      </p>

      <p className="text-xl font-bold">
        최종 결제 금액: {totalAmount.toLocaleString()}원
      </p>
    </div>
  );
}
