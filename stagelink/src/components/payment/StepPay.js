import React from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

/**
 * StepPay - 예매 Step 3: 결제(카카오페이) 실행 컴포넌트
 * @param {Object} showInfo - 공연 정보 객체 (좌석 가격 등 포함)
 * @param {number} showId - 공연 ID
 * @param {Array} selectedSeats - 선택한 좌석 리스트 (예: ["VIP-1", "R-12"])
 * @param {string} date - 선택한 날짜
 * @param {string} time - 선택한 회차
 * @param {Object} discounts - 할인 정보 객체 (예: {normal: 1, patriot: 2, ...})
 * @param {function} onPaySuccess - 결제/예매 성공시 호출(결과 전달)
 * @param {function} onBack - 뒤로가기
 */
const StepPay = ({
  showInfo,
  showId,
  selectedSeats,
  date,
  time,
  discounts,
  onPaySuccess,
  onBack,
}) => {
  // userId를 JWT에서 동적으로 추출
  let userId = null;
  try {
    const token = localStorage.getItem("accessToken");
    if (token) {
      userId = jwtDecode(token).id;
    }
  } catch (e) {
    userId = null;
  }

  // 실제 등급별 가격 (백엔드에서 받아옴)
  const seatPrices = {
    VIP: showInfo.seatVipPrice,
    R: showInfo.seatRPrice,
    S: showInfo.seatSPrice,
  };

  // [1] 결제 총액 계산: 선택 좌석 등급별 가격 합
  const totalAmount = selectedSeats
    .map(seat => {
      const grade = seat.split("-")[0];
      return seatPrices[grade] || 0;
    })
    .reduce((a, b) => a + b, 0);

  // [2] 좌석 PK만 추출 (좌석 고유 ID만 모음)
  const seatIdList = selectedSeats.map(seat => {
    if (typeof seat === "string") {
      const matched = seat.match(/\d+$/);
      return matched ? Number(matched[0]) : NaN;
    } else if (typeof seat === "object" && seat.seatId) {
      return Number(seat.seatId);
    }
    return Number(seat);
  });

  /**
   * [3] 결제 검증/예매(서버) 요청: 실패시 최대 3회, 2초 간격 재시도
   * @param {Object} postData - 서버로 전달할 결제/예매 데이터
   * @param {number} tryCount - 재시도 횟수
   */
  const verifyPaymentWithRetry = (postData, tryCount = 0) => {
    axios.post("/api/payment/verify", postData)
      .then(res => {
        if (typeof onPaySuccess === "function") {
          onPaySuccess(res.data); // 성공시 StepConfirm로
        } else {
          alert("onPaySuccess가 함수가 아닙니다! 타입=" + typeof onPaySuccess);
        }
      })
      .catch(err => {
        const errorMsg = err.response?.data || err.message;
        // 결제 정보 미전달(비동기 이슈)면 재시도
        if (
          errorMsg.includes("존재하지 않는 결제 정보") &&
          tryCount < 3
        ) {
          setTimeout(() => {
            verifyPaymentWithRetry(postData, tryCount + 1);
          }, 2000);
        } else {
          alert("결제 검증 실패: " + errorMsg);
        }
      });
  };

  /**
   * [4] 카카오페이 결제 요청 (IMP.request_pay)
   * - 결제 성공시 서버 검증/예매 요청 → StepConfirm로 이동
   */
  const handleIamportPay = () => {
    if (!window.IMP) {
      alert("아임포트 JS 라이브러리가 로드되지 않았습니다.");
      return;
    }
    if (!userId) {
      alert("로그인 후 이용해 주세요!");
      return;
    }
    window.IMP.init("imp51662248"); // [테스트용: 실제론 본인 imp 코드 사용]
    window.IMP.request_pay(
      {
        pg: "kakaopay.TC0ONETIME",
        pay_method: "card",
        merchant_uid: `mid_${new Date().getTime()}`,
        name: showInfo.title || "공연 예매",
        amount: totalAmount,
        buyer_email: "test@user.com",
        buyer_name: "홍길동",
      },
      function (rsp) {
        if (rsp.success) {
          // 결제 성공시 서버로 결제/예매 검증 요청
          const postData = {
            userId,
            showId,
            seatIdList,
            date,
            time,
            totalAmount,
            discounts,
            impUid: rsp.imp_uid,
            reservationDate: new Date().toISOString(),
          };
          verifyPaymentWithRetry(postData);
        } else {
          alert("결제 실패: " + rsp.error_msg);
        }
      }
    );
  };

  return (
    <div className="relative h-full pb-24">
      {/* === 결제 버튼 === */}
      <div className="h-full flex items-center justify-center">
        <button
          className="w-full bg-yellow-300 hover:bg-yellow-400 text-black font-bold py-4 rounded-xl text-lg flex items-center justify-center"
          onClick={handleIamportPay}
        >
          <img src="/images/kakaopay.svg" alt="카카오페이" className="w-8 h-8 mr-3" />
          카카오페이 테스트 결제
        </button>
      </div>
      {/* === 하단 고정: 뒤로가기 버튼 === */}
      <div className="absolute bottom-0 left-0 w-full bg-white pt-3 px-1 border-t border-gray-200 flex justify-end gap-2">
        <button onClick={onBack} className="px-4 py-2 border border-gray-300 rounded">뒤로가기</button>
      </div>
    </div>
  );
};

export default StepPay;
