import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchRefundPreview } from "../../api/mypageApi";
import axios from "../../util/axiosInstance";

const RefundPreviewPage = () => {
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    };

    const [showModal, setShowModal] = useState(false);

    // 환불 요청 함수
    const handleRefund = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        await axios.post(
          "/api/mypage/refunds",
          {reservationNo: reservationId},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("환불 요청이 완료되었습니다.")
        navigate("/mypage");
      } catch (error) {
        console.error("환불 요청 실패", error);
        alert("환불에 실패했습니다: " + (error.response?.data?.message || "알 수 없는 오류"));
      }
    };


  const { reservationId } = useParams();
  const navigate = useNavigate();
  const [refundData, setRefundData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPreview = async () => {
      try {
        const data = await fetchRefundPreview(reservationId);
        console.log("환불 안내 데이터:", data);
        setRefundData(data);
      } catch (err) {
        setError("환불 안내 정보를 불러오지 못했습니다.");
      }
    };
    loadPreview();
  }, [reservationId]);

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  if (!refundData) return null;

  const {
    showTitle,
    poster,
    venue,
    showStartTime,
    reservationNo,
    reservationDate,
    seatClass,
    seatNumber,
    refundAmount,
    fee,
  } = refundData;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-purple-700 mb-6">환불 안내</h2>

      <div className="bg-white rounded-2xl shadow-md p-6 flex gap-6">
        {/* 포스터 */}
        <div>
          <img
            src={poster}
            alt="포스터"
            className="w-40 h-60 object-cover rounded-md border"
          />
        </div>

        {/* 정보 */}
        <div className="flex-1 text-sm space-y-2">
          <div><span className="font-semibold text-gray-700"></span><strong>{showTitle}</strong></div>
          <div><span className="font-semibold text-gray-700">공연 장소:</span> {venue}</div>
          <div><span className="font-semibold text-gray-700">관람 일시:</span> {formatDateTime(showStartTime)}</div>
          <div><span className="font-semibold text-gray-700">예매 번호:</span> {reservationNo}</div>
          <div><span className="font-semibold text-gray-700">예매 일시:</span> {formatDate(reservationDate)}</div>
          <div><span className="font-semibold text-gray-700">좌석 정보:</span> {seatClass}석 {seatNumber}번</div>
        </div>
      </div>

        {/* 안내 문구*/}
        <div className="text-center mt-8">
            <p className="text-blue-600 font-semibold text-2xl">
                취소내역 및 환불금액 안내를 확인하시고 예매취소해주세요.
            </p>
        </div>


      {/* 환불 정보 */}
      <div className="mt-6 bg-gray-50 rounded-xl p-4 space-y-2 text-base">
        <div><strong className="text-purple-600">환불 수수료:</strong> {fee.toLocaleString()}원</div>
        <div><strong className="text-purple-600">예상 환불 금액:</strong> {refundAmount.toLocaleString()}원</div>
      </div>

      {/* 버튼 */}
      <div className="mt-8 flex justify-center gap-4">
        <button
          className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-xl"
          onClick={() => navigate(-1)}
        >
          돌아가기
        </button>
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-xl"
          onClick={() => setShowModal(true)} // 모달 열기
        >
          예매 취소하기
        </button>
      </div>
      
      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h3 className="text-lg font-bold mb-4 text-gray-800">정말 예매를 취소하시겠습니까?</h3>
            <p className="text-sm text-gray-600 mb-6">환불 처리 후 되돌릴 수 없습니다.</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                onClick={() => setShowModal(false)}
              >
                아니요
              </button>
              <button
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                onClick={() => {
                  setShowModal(false);
                  handleRefund();
                }}
              >
                취소하기
              </button>
            </div>
          </div>
        </div>
      )}



    </div>
  );
};

export default RefundPreviewPage;
