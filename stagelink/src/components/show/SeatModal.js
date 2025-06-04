import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";

import SeatGrid from "./SeatGrid";
import StepPeopleDiscount from "../payment/StepPeopleDiscount";
import StepPay from "../payment/StepPay";
import StepConfirm from "../payment/StepConfirm";

/**
 * SeatModal - 예매 모달 (4단계 프로세스)
 * 1. 좌석 선택
 * 2. 할인 선택
 * 3. 결제 진행
 * 4. 결제 완료 확인
 */
const SeatModal = ({
  showId,      // 공연 PK
  date, time,  // 예매 날짜/시간
  onClose,     // 모달 닫기 콜백
  show,        // 공연 상세 정보 (좌석 가격 등)
  userId,      // 로그인된 사용자 ID
  showInfo,    // 공연 기본 정보 (이름 등)
}) => {

  /** ───────── 상태 정의 ───────── */
  const [step, setStep] = useState(1); // 현재 스텝: 1~4
  const [selectedSeats, setSelectedSeats] = useState([]); // 선택한 좌석들
  const [discounts, setDiscounts] = useState(null);       // 할인 인원 수
  const [payResult, setPayResult] = useState(null);       // 결제 결과 정보

  const [seatList, setSeatList] = useState([]);           // 좌석 목록
  const [reservationNos, setReservationNos] = useState([]); // 임시 예약 번호들
  const [isProcessing, setIsProcessing] = useState(false);  // API 중복 요청 방지용

  /** ───────── 좌석 목록 API 호출 ───────── */
  useEffect(() => {
    if (!showId) return;
    axios.get("/api/seats/all", { params: { showId } })
         .then(res => setSeatList(res.data))
         .catch(() => setSeatList([]));
  }, [showId]);

  /** ───────── 가격 및 할인 계산 ───────── */
  const seatPrices = show ? {
    VIP: show.seatVipPrice ?? 0,
    R:   show.seatRPrice ?? 0,
    S:   show.seatSPrice ?? 0,
    A:   show.seatAPrice ?? 0,
  } : { VIP: 0, R: 0, S: 0, A: 0 };

  // 할인율 정의
  const discountRates = {
    normal: 0,
    patriot: 0.5,
    mildDisabled: 0.3,
    severeDisabled: 0.6
  };

  // 선택한 좌석을 상세 정보로 변환 (등급/번호/가격)
  const getSeatDetails = () =>
    selectedSeats.map(lbl => {
      const [grade, number] = lbl.split("-");
      return { grade, number, label: lbl, price: seatPrices[grade] ?? 0 };
    });

  // 최종 결제 금액 계산 (할인 적용)
  const getTotalPrice = () => {
    const bases = getSeatDetails().map(x => x.price);
    if (!discounts) return bases.reduce((a,b)=>a+b,0);

    const pool = [];
    Object.entries(discounts).forEach(([k, c]) => {
      for (let i = 0; i < c; i++) pool.push(discountRates[k]);
    });
    pool.sort((a, b) => b - a); // 높은 할인율 우선 적용

    return bases.map((p, i) => Math.round(p * (1 - (pool[i] ?? 0))))
                .reduce((a, b) => a + b, 0);
  };

  // 할인 금액 계산
  const totalDiscount =
    getSeatDetails().reduce((s, x) => s + x.price, 0) - getTotalPrice();

  /** ───────── 임시 예약 취소 API ───────── */
  const cancelReservationOnServer = async () => {
    if (!reservationNos.length) return;
    try {
      await axios.post("/api/reservation/cancel", {
        reservationNoList: reservationNos,
      });
    } catch (_) {/* 무시 */}
    setReservationNos([]);
  };

  /** ───────── Step1: 좌석 선택 완료 후 TEMP 예약 ───────── */
  const handleSeatConfirm = async () => {
    if (!userId) { alert("로그인이 필요합니다."); return; }
    if (!selectedSeats.length) { alert("좌석을 선택하세요."); return; }
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const dto = { userId, showId, seatLabelList: selectedSeats };
      const { data } = await axios.post("/api/reservation/temp", dto);
      setReservationNos(data.reservationNoList);
      setStep(2); // 다음 단계로 이동
    } catch {
      alert("좌석 임시 예약에 실패했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  /** ───────── Step3: 결제 성공 처리 ───────── */
  const handlePaySuccess = async (impUid) => {
    if (isProcessing || !reservationNos.length) return;
    setIsProcessing(true);

    try {
      await axios.post("/api/reservation/confirm", {
        reservationNoList: reservationNos,
        impUid: String(impUid),
        totalAmount: getTotalPrice(),
      });

      setPayResult({
        reservationNos,
        impUid: String(impUid),
        totalAmount: getTotalPrice(),
      });

      setStep(4); // 결제 완료 단계로 이동
    } catch {
      alert("결제 및 예매 확정에 실패했습니다.");
      await cancelReservationOnServer();
      setStep(1); // 처음으로 되돌리기
    } finally {
      setIsProcessing(false);
    }
  };

  /** ───────── Step3: 결제 실패 또는 취소 ───────── */
  const handlePayFailOrCancel = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    await cancelReservationOnServer();
    setStep(1);
    setIsProcessing(false);
  };

  /** ───────── 모달 닫기 처리 ───────── */
  const handleClose = async () => {
    if (isProcessing) return;
    if (step < 4) await cancelReservationOnServer(); // 결제 완료 전이면 임시 예약 취소
    setStep(1);
    setSelectedSeats([]);
    setDiscounts(null);
    setPayResult(null);
    onClose(); // 부모에 알림
  };

  /** ───────── 렌더링 ───────── */
  const seatDetails = getSeatDetails();       // 현재 선택 좌석 목록
  const summaryPrice = getTotalPrice();       // 총 결제금액

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative flex min-h-[650px] w-full max-w-[1200px] flex-col rounded-lg bg-white p-6">
        {/* 타이틀 */}
        <h2 className="mb-4 text-xl font-bold">
          {["좌석 선택", "할인 선택", "결제", "결제 완료"][step - 1]}
        </h2>

        {/* 본문 영역 */}
        <div className="flex flex-1 gap-2 overflow-y-auto">
          {/* 좌측: 스텝별 본문 */}
          <div className="flex-1 pr-1">
            {step === 1 && (
              <SeatGrid
                seats={seatList}
                selectedSeats={selectedSeats}
                onSelect={setSelectedSeats}
                onConfirm={handleSeatConfirm}
              />
            )}

            {step === 2 && (
              <StepPeopleDiscount
                showId={showId}
                selectedSeats={seatDetails}
                date={date}
                time={time}
                onNext={d => { setDiscounts(d); setStep(3); }}
                onBack={async () => {
                  await cancelReservationOnServer();
                  setStep(1);
                }}
              />
            )}

            {step === 3 && (
              <StepPay
                show={show}
                showInfo={showInfo}
                selectedSeats={seatDetails}
                onPaySuccess={handlePaySuccess}
                onPayFail={handlePayFailOrCancel}
                onBack={() => setStep(2)}
              />
            )}

            {step === 4 && (
              <StepConfirm
                reservationNo={reservationNos[0]}
                show={show}
                showInfo={showInfo}
                selectedSeats={seatDetails}
                date={date}
                time={time}
                discounts={discounts}
                payResult={payResult}
                onClose={handleClose}
              />
            )}
          </div>

          {/* 우측: 요약 패널 */}
          {step !== 4 && (
            <aside className="w-[230px] shrink-0 space-y-4 border-l pl-3 text-base">
              <div>
                <div className="mb-1 font-bold">
                  {date ? new Date(date).toLocaleDateString() : ""} {time ?? ""}
                </div>
                <div className="text-xs text-gray-500">
                  선택 좌석: {selectedSeats.length} / 5
                </div>
              </div>

              {/* 좌석 가격 요약 */}
              <div>
                <div className="mb-1 flex justify-between font-semibold">
                  <span>등급/좌석</span><span>가격</span>
                </div>
                {seatDetails.map((s, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{s.grade}-{s.number}</span>
                    <span className="min-w-[60px] text-right">
                      {s.price.toLocaleString()}원
                    </span>
                  </div>
                ))}
                {!seatDetails.length && (
                  <p className="text-gray-400">선택된 좌석 없음</p>
                )}
              </div>

              {/* 할인 내역 요약 */}
              {discounts && (
                <div>
                  <div className="mb-1 font-semibold">할인 내역</div>
                  {Object.entries(discounts).map(([k, c]) =>
                    c > 0 && (
                      <div key={k} className="flex justify-between">
                        <span>{k}</span><span>{c}명</span>
                      </div>
                    )
                  )}
                  <div className="mt-2 flex justify-between font-medium text-red-600">
                    <span>할인 금액:</span>
                    <span>-{totalDiscount.toLocaleString()}원</span>
                  </div>
                </div>
              )}

              {/* 총 결제금액 */}
              <div className="text-right text-lg font-bold">
                총합: {summaryPrice.toLocaleString()}원
              </div>
            </aside>
          )}
        </div>

        {/* 하단 닫기 버튼 */}
        <button
          onClick={handleClose}
          disabled={isProcessing}
          className="absolute bottom-6 left-6 rounded bg-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-300 disabled:opacity-60"
        >
          닫기
        </button>
      </div>
    </div>,
    document.body // 포탈로 body에 모달 렌더링
  );
};

export default SeatModal;
