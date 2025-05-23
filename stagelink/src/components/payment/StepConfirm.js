import React from "react";

// 할인 항목에 대한 표시 라벨
const discountLabels = {
  normal: "일반 결제",
  patriot: "국가 유공자",
  mildDisabled: "경증 장애인",
  severeDisabled: "중증 장애인",
};

/**
 * 결제 완료(최종 확인) 페이지
 * - 결제 내역, 공연 정보, 좌석 정보, 할인 정보, 최종 결제 금액 등 표시
 */
const StepConfirm = ({
  showInfo,        // 공연 정보 객체(제목, 가격 등)
  showId,          // 공연 PK (실사용은 showInfo.id)
  selectedSeats,   // 예매 좌석 리스트 ["VIP-24", ...]
  date,            // 예매한 날짜 (예: 2025-05-08)
  time,            // 예매한 회차 (예: "14:00 ~ 16:00")
  discounts,       // 할인 내역 { normal: 1, patriot: 0, ... }
  payResult,       // 결제 결과 객체 (totalAmount 등)
  onClose,         // 닫기 버튼(콜백) - 현재 미사용
}) => {
  // 좌석별 가격 정보 (공연 상세에서 받은 가격)
  const seatPrices = {
    VIP: showInfo.seatVipPrice,
    R: showInfo.seatRPrice,
    S: showInfo.seatSPrice,
  };

  // 실제 결제 금액(payResult에서 받은 totalAmount가 우선)
  const totalAmount = payResult?.totalAmount
    ? payResult.totalAmount
    : selectedSeats
        .map(seat => seatPrices[seat.split("-")[0]] || 0)
        .reduce((a, b) => a + b, 0);

  // 결제 결과 미도착 시 로딩 안내
  if (!payResult) {
    return (
      <div className="p-20 text-center text-lg">
        결제 결과를 불러오는 중...
      </div>
    );
  }

  return (
    <div className="relative h-full pb-24 flex flex-col">
      <div className="flex-1 pr-8">
        {/* 타이틀 */}
        <h2 className="text-2xl font-bold mb-6">결제 완료</h2>

        {/* 1. 공연 정보 */}
        <div className="mb-6">
          <div className="font-bold mb-2">공연 정보</div>
          <div>
            공연명: <span className="font-semibold">{showInfo.title}</span>
          </div>
          <div>날짜: {date}</div>
          <div>회차: {time}</div>
        </div>

        {/* 2. 좌석 정보 */}
        <div className="mb-6">
          <div className="font-bold mb-2">좌석 정보</div>
          <ul className="list-disc list-inside">
            {selectedSeats.map((seat, idx) => (
              <li key={idx}>
                {/* 예: VIP-24 / 150,000원 */}
                {seat} / {seatPrices[seat.split("-")[0]].toLocaleString()}원
              </li>
            ))}
          </ul>
        </div>

        {/* 3. 할인 내역 */}
        <div className="mb-6">
          <div className="font-bold mb-2">할인 내역</div>
          <ul>
            {discounts &&
              Object.entries(discounts).map(
                ([key, count]) =>
                  count > 0 && (
                    <li key={key}>
                      {/* 예: 일반 결제: 1명 */}
                      {discountLabels[key]}: {count}명
                    </li>
                  )
              )}
          </ul>
        </div>

        {/* 4. 성공 메시지 */}
        <div className="text-green-600 text-base font-bold mt-8 mb-2">
          결제가 성공적으로 완료되었습니다!<br />
          마이페이지에서 예매 내역을 확인할 수 있습니다.
        </div>

        {/* 5. 최종 결제 금액 */}
        <div className="flex-1 flex items-center text-xl font-bold mt-6">
          최종 결제 금액: {totalAmount.toLocaleString()}원
        </div>
      </div>
    </div>
  );
};

export default StepConfirm;
