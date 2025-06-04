import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchReservationDetail } from "../../api/mypageApi";
import { useNavigate } from "react-router-dom";

const ReservationDetail = () => {
  const { reservationId } = useParams();
  const [detail, setDetail] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReservationDetail(reservationId)
      .then(setDetail)
      .catch((err) => console.error("예매 상세 정보 조회 실패", err));
  }, [reservationId]);

  if (!detail) return <p>로딩 중...</p>;

  const cancelDeadline = new Date(detail.cancelAvailableUntil);
  const now = new Date();

  const getStatusLabel = (status) => {
    switch (status) {
      case "TEMP":
        return "예매 완료(미결제)";
      case "CONFIRMED":
        return "예매 완료";
      case "CANCELED":
        return "취소 완료";
      default:
        return "알 수 없음";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "TEMP":
      case "CONFIRMED":
        return "text-blue-600";
      case "CANCELED":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-purple-700 mb-6">예매 상세</h2>

      <div className="bg-white shadow p-4 rounded mb-6 flex gap-6">
        <div className="w-[120px] h-[180px] overflow-hidden rounded bg-gray-100">
          {detail.poster ? (
            <img
              src={detail.poster}
              alt="포스터"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
              이미지 없음
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1 text-sm">
          <p><strong>공연명:</strong> {detail.showTitle}</p>
          <p><strong>예매번호:</strong> {detail.reservationId}</p>
          <p><strong>예매일시:</strong> {detail.reservationDate}</p>
          <p><strong>관람일시:</strong> {detail.showDateTime}</p>
          <p><strong >취소 가능:</strong> <span className="text-red-500"> {detail.cancelAvailableUntil} </span></p>
          <p><strong>공연장:</strong> {detail.venue}</p>
          <p><strong>상태:</strong> <span className={getStatusColor(detail.status)}>
            {getStatusLabel(detail.status)}
            </span></p>
        </div>
      </div>

      <div className="text-sm mb-6">
        <h3 className="text-base font-semibold mb-2">티켓 수령 방법</h3>
        <p>현장 수령</p>
      </div>

      <div className="text-sm">
        <h3 className="text-base font-semibold mb-2">구매 내역</h3>
        <div className="border-t pt-4">
      
          <div className="grid grid-cols-4 gap-x-6 gap-y-2 font-semibold pb-2 text-center">
            <span>좌석등급</span>
            <span>좌석번호</span>
            <span>결제금액</span>
            <span>예매취소</span>
          </div>
          <div className="grid grid-cols-4 gap-x-6 gap-y-2 items-center text-center border-b border-gray-200 py-3">
            <span>{detail.seatClass}</span>
            <span>{detail.seatNumber}</span>
            <span>{detail.totalAmount?.toLocaleString()}원</span>
            <div className="flex justify-center">            
          
              {now < cancelDeadline ? (
                <button 
                  onClick={() => navigate(`/mypage/refunds/preview/${reservationId}`)}
                  className="text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded border border-gray-300 w-[80px] text-center">
                  예매 취소
                </button>
              ) : (
                <span className="text-sm text-gray-400">취소 불가</span>
              )}
          
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 text-sm">
        <h3 className="font-bold text-base mb-3">취소 수수료</h3>
        <table className="w-full border-t border-b border-gray-300 text-left text-sm mb-6">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 px-3 w-1/2">취소일</th>
              <th className="py-2 px-3">취소 수수료</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="py-2 px-3">예매 후 7일 이내</td>
              <td className="py-2 px-3">없음</td>
            </tr>
            <tr>
              <td className="py-2 px-3">예매 후 8일 ~ 관람일 10일 전까지</td>
              <td className="py-2 px-3">장당 4000원 (티켓금액의 10% 한도)</td>
            </tr>
            <tr>
              <td className="py-2 px-3">관람일 9일 전 ~ 7일 전까지</td>
              <td className="py-2 px-3">티켓 금액의 10%</td>
            </tr>
            <tr>
              <td className="py-2 px-3">관람일 6일 전 ~ 3일 전까지</td>
              <td className="py-2 px-3">티켓 금액의 20%</td>
            </tr>
            <tr>
              <td className="py-2 px-3">관람일 2일 전 ~ 1일 전까지</td>
              <td className="py-2 px-3">티켓 금액의 30%</td>
            </tr>
          </tbody>
        </table>

        <h3 className="font-bold text-base mb-3">유의사항</h3>
        <ul className="list-disc list-inside leading-relaxed text-gray-700 space-y-1">
          <li>취소마감시간 이후 또는 관람일 당일 예매하신 건에 대해서는 취소/변경/환불이 불가합니다.</li>
          <li>예매취소 시점과 결제 시 사용하신 신용카드사의 환불 처리기준에 따라 취소금액의 환급방법과 환급일은 다소 차이가 있을 수 있습니다.</li>
          <li>신용카드 할부결제로 구매하신 고객께서 수량의 일부를 취소하실 경우, 신용카드사의 사정에 따라 혜택(무이자 할부 등)이 적용 여부가 달라질 수 있음을 유의하시기 바랍니다.</li>
          <li>기타 문의사항은 이용안내를 참조하시거나 고객센터 <strong>1234-1234</strong>를 이용하시기 바랍니다.</li>
        </ul>
      </div>

    </div>
  );
};

export default ReservationDetail;
