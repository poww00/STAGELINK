import { useNavigate } from "react-router-dom";

const ReservationCard = ({ reservation }) => {
  const navigate = useNavigate();

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
    <div className="border rounded-xl shadow-sm p-4 mb-4 bg-white">
      <div className="grid grid-cols-[100px_1fr_220px_120px] items-center gap-2">
        {/* 예매일 */}
        <div className="text-sm text-gray-800 font-semibold text-center">
          {reservation.reservationDate}
        </div>

        {/* 공연 정보 */}
        <div className="flex gap-4 items-start">
        {/* 포스터 */}
        <div className="w-[110px] h-[140px] overflow-hidden rounded bg-gray-100">
          {reservation.poster ? (
            <img
              src={reservation.poster}
              alt="포스터"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
              이미지 없음
            </div>
          )}
        </div>

          {/* 텍스트 정보 */}
          <div className="flex flex-col gap-0.5 text-sm">
            <p className="font-bold text-base mb-1">{reservation.showTitle}</p>
            <p className="text-gray-600">{reservation.showPeriod}</p>
            <p className="text-gray-600">{reservation.venue}</p>
          </div>
        </div>

        {/* 예매 정보 */}
        <div className="text-sm text-gray-700 leading-6">
          <p>예매번호: {reservation.reservationNumber}</p>
          <p>관람일시: {reservation.watchDateTime}</p>
          <p>매수: {reservation.ticketCount}매</p>
        </div>

        {/* 상태 및 버튼 */}
        <div className="text-center">
          <p className={`font-semibold mb-2 ${getStatusColor(reservation.status)}`}>
            {getStatusLabel(reservation.status)}
          </p>
          {reservation.status !== "CANCELED" && (
            <button
              onClick={() =>
                navigate(`/mypage/reservations/${reservation.reservationNumber}`)
              }
              className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
            >
              예매 상세
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationCard;
