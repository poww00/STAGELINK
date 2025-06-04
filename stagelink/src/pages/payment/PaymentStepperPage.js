import React, { useState } from "react";
import StepSeat from "../../components/payment/StepSeat";
import StepPeopleDiscount from "../../components/payment/StepPeopleDiscount";
import StepPay from "../../components/payment/StepPay";
import StepConfirm from "../../components/payment/StepConfirm";
import { useLocation } from "react-router-dom";
import axios from "axios";

/**
 * PaymentStepperPage
 * - 좌석, 할인, 결제, 완료 단계를 reservationNo 중심으로 관리
 * - 임시예약/확정/취소 연동까지 모두 포함
 */
const PaymentStepperPage = () => {
  // 라우터 state로 받은 정보
  const location = useLocation();
  const state = location.state; // ex) {showId, selectedSeats, date, time, showTitle, ...}

  const [step, setStep] = useState(1);
  const [discounts, setDiscounts] = useState(null);
  const [payResult, setPayResult] = useState(null);
  const [reservationNo, setReservationNo] = useState(null); // 임시예약 PK

  const showTitle = state?.showTitle || "공연명 정보 없음";

  if (!state || !state.selectedSeats || !state.showId) {
    return <div className="text-center mt-20 text-red-500">잘못된 접근입니다.</div>;
  }

  // 1단계: 좌석 확인 후 임시 예약
  const handleSeatConfirm = async (selectedSeats) => {
    // seatLabelList: ["VIP-30", "R-12", ...]
    const reservationDTO = {
      userId: state.userId,
      showId: state.showId,
      seatLabelList: selectedSeats, // ★ 반드시 seatLabelList로!
      totalAmount: 0, // 필요시 계산
      reservationDate: new Date().toISOString(),
    };
    try {
      const res = await axios.post("/api/reservation/temp", reservationDTO);
      setReservationNo(res.data.reservationNo);
      setStep(2);
    } catch (e) {
      alert("좌석 임시 예약에 실패했습니다.");
    }
  };


  // 2단계: 할인정보 저장
  const handleDiscountNext = (discountData) => {
    setDiscounts(discountData);
    setStep(3);
  };

  // 3단계: 결제 성공시 확정
  const handlePaySuccess = async (impUid, totalAmount) => {
    try {
      const payload = {
        reservationNo,
        impUid,
        totalAmount,
      };
      await axios.post("/api/reservation/confirm", payload);
      setPayResult({
        reservationNo,
        totalAmount,
        impUid,
      });
      setStep(4);
    } catch (e) {
      alert("결제/예매 확정 실패");
      await axios.post("/api/reservation/cancel", { reservationNo });
      setStep(1);
    }
  };

  // 결제 실패/이탈시
  const handlePayFailOrCancel = async () => {
    if (reservationNo) {
      await axios.post("/api/reservation/cancel", { reservationNo });
    }
    setStep(1);
  };

  // 단계별 공통 props
  const commonProps = {
    showId: state.showId,
    showTitle,
    selectedSeats: state.selectedSeats,
    date: state.date,
    time: state.time,
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Step 1: 좌석 확인 */}
      {step === 1 && (
        <StepSeat
          {...commonProps}
          onNext={handleSeatConfirm}
          onBack={() => {}}
        />
      )}
      {/* Step 2: 할인/인원 선택 */}
      {step === 2 && (
        <StepPeopleDiscount
          {...commonProps}
          onNext={handleDiscountNext}
          onBack={() => setStep(1)}
        />
      )}
      {/* Step 3: 결제 */}
      {step === 3 && (
        <StepPay
          {...commonProps}
          discounts={discounts}
          onPaySuccess={handlePaySuccess}
          onPayFail={handlePayFailOrCancel}
          onBack={() => setStep(2)}
        />
      )}
      {/* Step 4: 결제 결과 */}
      {step === 4 && (
        <StepConfirm
          {...commonProps}
          discounts={discounts}
          payResult={payResult}
          onClose={() => window.location.href = "/"}
        />
      )}
    </div>
  );
};

export default PaymentStepperPage;
