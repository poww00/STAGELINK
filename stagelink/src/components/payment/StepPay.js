import React, { useRef } from "react";

/**
 * StepPay 컴포넌트
 * - 포트원(아임포트) 결제창을 호출하여 사용자 결제를 처리
 * - 결제 성공 시 imp_uid를 부모로 전달
 * - 결제 실패 또는 사용자가 결제를 취소하면 onPayFail 호출
 */
const StepPay = ({
  show,               // 공연 상세 정보 (좌석 가격 포함)
  showInfo,           // 공연 제목 등 간단 정보
  selectedSeats,      // 선택한 좌석 리스트 ["VIP-1", "R-3", ...]
  onPaySuccess,       // 결제 성공 시 콜백 (imp_uid 전달)
  onPayFail,          // 결제 실패 또는 취소 시 콜백
  onBack,             // 뒤로가기 버튼 클릭 시 콜백
}) => {

  /* 총 결제 금액 계산 */
  const seatPrices = {
    VIP: show?.seatVipPrice,
    R  : show?.seatRPrice,
    S  : show?.seatSPrice,
    A  : show?.seatAPrice,
  };

  // 좌석 등급을 기준으로 각 좌석의 가격을 합산하여 총액 계산
  const totalAmount = selectedSeats
    .map(s => {
      const grade = typeof s === "string" ? s.split("-")[0] : s.grade;
      return seatPrices[grade] || 0;
    })
    .reduce((a, b) => a + b, 0);

  /* 중복 클릭 방지용 락 처리 */
  const lock = useRef(false);

  // withLock(fn): lock을 걸고 일정 시간 동안 중복 실행 방지
  const withLock = fn => (...args) => {
    if (lock.current) return;     // 이미 락 걸려있으면 무시
    lock.current = true;
    fn(...args);                  // 원래 함수 실행
    setTimeout(() => (lock.current = false), 800); // 0.8초 후 락 해제
  };

  /*아임포트 결제 콜백 */
  const handleResult = withLock(rsp => {
    if (rsp.success) {
      // 성공 시 imp_uid를 문자열로 전달
      onPaySuccess(String(rsp.imp_uid));
    } else {
      // 실패 또는 사용자 취소
      alert("결제 실패: " + rsp.error_msg);
      onPayFail();
    }
  });

  /** 💳 결제창 호출 */
  const requestPay = (pg) => {
    if (!window.IMP) return alert("아임포트 JS 로드 실패");
    
    // 가맹점 식별자 설정 (imp로 시작)
    window.IMP.init("imp51662248");

    // 결제 요청
    window.IMP.request_pay(
      {
        pg,                          // 결제사 (카카오페이, 토스 등)
        pay_method: "card",          // 결제 수단
        merchant_uid: `${pg}_${Date.now()}`, // 주문번호 (고유하게 생성)
        name: showInfo?.title || showInfo?.name || "공연 예매", // 결제 항목명
        amount: totalAmount,         // 결제 금액
        buyer_email: "test@user.com", // 테스트용 구매자 이메일
        buyer_name : "홍길동",        // 테스트용 구매자 이름
      },
      handleResult                  // 결제 결과 콜백
    );
  };

  return (
    <div className="relative h-full pb-24">
      {/* 중앙 결제 버튼 2개 */}
      <div className="flex h-full flex-col items-center justify-center gap-4">
        {/* 카카오페이 버튼 */}
        <button
          className="flex w-full items-center justify-center rounded-xl border-2 border-[#FFEB00] bg-white py-4 text-lg font-bold text-[#FFEB00] hover:bg-yellow-50"
          onClick={() => requestPay("kakaopay.TC0ONETIME")}
        >
          <img src="/images/kakaopay.svg" alt="카카오페이" className="mr-3 h-8 w-8" />
          카카오페이 결제
        </button>

        {/* 토스페이 버튼 */}
        <button
          className="flex w-full items-center justify-center rounded-xl border-2 border-[#0064FF] bg-white py-4 text-lg font-bold text-[#0064FF] hover:bg-blue-50"
          onClick={() => requestPay("tosspay.tosstest")}
        >
          <img src="/images/tosspay.svg" alt="토스페이" className="mr-3 h-8 w-8" />
          토스페이 결제
        </button>
      </div>

      {/* 뒤로가기 버튼 */}
      <div className="absolute bottom-0 left-0 flex w-full justify-end border-t border-gray-200 bg-white px-1 pt-3">
        <button onClick={onBack} className="rounded border px-4 py-2">
          뒤로가기
        </button>
      </div>
    </div>
  );
};

export default StepPay;
