import React, { useState } from "react";
import StepSeat from "../../components/payment/StepSeat";
import StepPeopleDiscount from "../../components/payment/StepPeopleDiscount";
import StepPay from "../../components/payment/StepPay";
import StepConfirm from "../../components/payment/StepConfirm";
import { useLocation } from "react-router-dom";

/**
 * PaymentStepperPage
 * - 예매/결제 단계별로 StepSeat → StepPeopleDiscount → StepPay → StepConfirm 컴포넌트 순차 진행
 * - 각 단계는 step 상태값(1~4)로 관리, 각 단계별 정보는 state/props로 전달
 */
const PaymentStepperPage = () => {
  // === 라우터를 통해 받은 결제/예매 정보 ===
  const location = useLocation();
  const state = location.state; // ex) {showId, selectedSeats, date, time, showTitle, ...}

  // === 진행 단계 ===
  const [step, setStep] = useState(1); // 1: 좌석, 2: 할인, 3: 결제, 4: 결과
  // === 할인 정보/결제 결과 상태 ===
  const [discounts, setDiscounts] = useState(null);
  const [payResult, setPayResult] = useState(null);

  // 공연명 등 라우터 state에서 가져오기(없으면 기본값)
  const showTitle = state?.showTitle || "공연명 정보 없음";

  // 필수 정보 누락시 잘못된 접근
  if (!state || !state.selectedSeats || !state.showId) {
    return <div className="text-center mt-20 text-red-500">잘못된 접근입니다.</div>;
  }

  // === 단계별 공통으로 넘길 props ===
  const commonProps = {
    showId: state.showId,
    showTitle,                // 공연명
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
          onNext={() => setStep(2)}        // "선택 완료" → Step 2로
          onBack={() => {}}                // 필요시 뒤로가기 구현
        />
      )}
      {/* Step 2: 할인/인원 선택 */}
      {step === 2 && (
        <StepPeopleDiscount
          {...commonProps}
          onNext={d => { setDiscounts(d); setStep(3); }} // 할인정보 저장 후 Step 3로
          onBack={() => setStep(1)}                      // "뒤로가기" → Step 1로
        />
      )}
      {/* Step 3: 결제(카카오페이) */}
      {step === 3 && (
        <StepPay
          {...commonProps}
          discounts={discounts}
          onPaySuccess={result => {
            setPayResult(result);    // 결제/예매 성공시 결과 저장
            setStep(4);              // Step 4로
          }}
          onBack={() => setStep(2)}  // "뒤로가기" → Step 2로
        />
      )}
      {/* Step 4: 결제 결과(완료) */}
      {step === 4 && (
        <StepConfirm
          {...commonProps}
          discounts={discounts}
          payResult={payResult}
          onClose={() => window.location.href = "/"} // "닫기"→메인 등 원하는 곳 이동
        />
      )}
    </div>
  );
};

export default PaymentStepperPage;
