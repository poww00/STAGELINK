// src/components/show/SeatModal.js
import ReactDOM from "react-dom";
import React, { useState } from "react";
import SeatGrid from "./SeatGrid";
import StepPeopleDiscount from "../payment/StepPeopleDiscount";
import StepPay from "../payment/StepPay";
import StepConfirm from "../payment/StepConfirm";

/**
 * SeatModal
 * - 예매 플로우(좌석 선택 → 할인 선택 → 결제 → 결제완료)를 모달창에서 스텝별로 진행
 * - showInfo에서 실시간 가격, 좌석정보 등 전달
 */
const SeatModal = ({ showId, date, time, onClose, showInfo }) => {
  // === 각 스텝/상태 관리 ===
  const [step, setStep] = useState(1);           // 1: 좌석, 2: 할인, 3: 결제, 4: 완료
  const [selectedSeats, setSelectedSeats] = useState([]); // 사용자가 선택한 좌석 목록
  const [discounts, setDiscounts] = useState(null);       // 할인 항목별 인원수
  const [payResult, setPayResult] = useState(null);       // 결제/예매 결과

  // ======= 스텝 이동용 콜백들 =======
  // 좌석 선택
  const handleSeatSelect = (seatList) => setSelectedSeats(seatList);
  const handleSeatConfirm = () => setStep(2);
  // 할인 선택 완료
  const handleDiscountConfirm = (discountData) => {
    setDiscounts(discountData);
    setStep(3);
  };
  // 결제 성공 → payResult(서버 응답) 저장
  const handlePayConfirm = (payResult) => {
    setPayResult(payResult);
    setStep(4);
  };

  // === 실시간 가격 정보/할인율(공연정보 기반, 없으면 0)
  const seatPrices = showInfo
    ? {
        VIP: showInfo.seatVipPrice || 0,
        R: showInfo.seatRPrice || 0,
        S: showInfo.seatSPrice || 0,
      }
    : { VIP: 0, R: 0, S: 0 };
  const discountRates = { normal: 0, patriot: 0.5, mildDisabled: 0.3, severeDisabled: 0.6 };

  // === 선택한 좌석 상세 (등급/라벨/개별가격)
  const getSelectedSeatDetails = () =>
    selectedSeats.map((seat) => {
      const [grade] = seat.split("-");
      return { grade, label: seat, price: seatPrices[grade] || 0 };
    });

  // === 총 결제 금액 계산
  const getTotalPrice = () => {
    const seatDetails = getSelectedSeatDetails();
    if (!discounts) return seatDetails.reduce((sum, s) => sum + s.price, 0);
    let prices = [...seatDetails.map((s) => s.price)];
    let discountPool = [];
    Object.entries(discounts).forEach(([key, count]) => {
      for (let i = 0; i < count; i++) discountPool.push(discountRates[key]);
    });
    discountPool.sort((a, b) => b - a); // 할인율 큰 순
    const final = prices.map((price, i) => {
      const rate = discountPool[i] || 0;
      return Math.round(price * (1 - rate));
    });
    return final.reduce((a, b) => a + b, 0);
  };

  // === 총 할인 금액 계산
  const getTotalDiscountAmount = () => {
    const originalTotal = getSelectedSeatDetails().reduce((sum, s) => sum + s.price, 0);
    return originalTotal - getTotalPrice();
  };

  // 렌더에 필요한 각종 값
  const seatDetails = getSelectedSeatDetails();
  const summaryPrice = getTotalPrice();
  const totalDiscount = getTotalDiscountAmount();

  // === 실제 모달 렌더 (React Portal로 body에 출력) ===
  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white p-6 rounded-lg max-w-6xl w-full min-h-[600px] flex flex-col">
        {/* 타이틀 영역(스텝별 문구) */}
        <h2 className="text-xl font-bold mb-4">
          {step === 1 && "좌석 선택"}
          {step === 2 && "할인 선택"}
          {step === 3 && "결제"}
          {step === 4 && "결제 완료"}
        </h2>
        <div className="flex gap-6 flex-1 overflow-y-auto">
          <div className="flex-1">
            {/* === Step 1: 좌석 선택 === */}
            {step === 1 && (
              <SeatGrid
                onSelect={handleSeatSelect}
                onConfirm={handleSeatConfirm}
                selectedSeats={selectedSeats}
              />
            )}
            {/* === Step 2: 할인 선택 === */}
            {step === 2 && (
              <StepPeopleDiscount
                showId={showId}
                selectedSeats={selectedSeats}
                date={date}
                time={time}
                onNext={handleDiscountConfirm}
                onBack={() => setStep(1)}
              />
            )}
            {/* === Step 3: 결제 === */}
            {step === 3 && (
              <StepPay
                showId={showId}
                selectedSeats={selectedSeats}
                date={date}
                time={time}
                discounts={discounts}
                onPaySuccess={handlePayConfirm}
                onBack={() => setStep(2)}
                showInfo={showInfo}
              />
            )}
            {/* === Step 4: 결제 완료 === */}
            {step === 4 && (
              <StepConfirm
                showInfo={showInfo}
                showId={showId}
                selectedSeats={selectedSeats}
                date={date}
                time={time}
                discounts={discounts}
                payResult={payResult}
                onClose={onClose}
              />
            )}
          </div>
          {/* === 우측 요약패널: 결제완료(4)에서는 안보이게 처리 === */}
          {step !== 4 && (
            <div className="w-[280px] shrink-0 border-l pl-4 text-sm space-y-4">
              <div>
                <div className="font-bold mb-1">
                  {new Date(date).toLocaleDateString()} {time}
                </div>
                <div className="text-xs text-gray-500">
                  선택 좌석: {selectedSeats.length} / 5
                </div>
              </div>
              <div>
                <div className="font-semibold mb-1">등급 / 가격</div>
                {seatDetails.map((s, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{s.label}</span>
                    <span>{s.price.toLocaleString()}원</span>
                  </div>
                ))}
                {seatDetails.length === 0 && <div className="text-gray-400">선택된 좌석 없음</div>}
              </div>
              {discounts && (
                <div>
                  <div className="font-semibold mb-1">할인 내역</div>
                  {Object.entries(discounts).map(([key, count]) => (
                    count > 0 && (
                      <div key={key} className="flex justify-between">
                        <span>{key}</span>
                        <span>{count}명</span>
                      </div>
                    )
                  ))}
                  <div className="flex justify-between font-medium text-red-600 mt-2">
                    <span>할인 금액:</span>
                    <span>-{totalDiscount.toLocaleString()}원</span>
                  </div>
                </div>
              )}
              <div className="font-bold text-right text-lg">
                총합: {summaryPrice.toLocaleString()}원
              </div>
            </div>
          )}
        </div>
        {/* 닫기 버튼(항상 우측하단 고정) */}
        <button
          className="absolute bottom-6 left-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm rounded font-medium transition z-10"
          onClick={onClose}
        >
          닫기
        </button>
      </div>
    </div>,
    document.body
  );
};

export default SeatModal;
