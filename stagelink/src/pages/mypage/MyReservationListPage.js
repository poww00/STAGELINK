import { useEffect, useState } from "react";
import { fetchMyReservations } from "../../api/mypageApi";
import ReservationCard from "../../components/mypage/ReservationCard";

const MyReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(reservations.length / itemsPerPage);
  const indexOfFirst = (currentPage - 1) * itemsPerPage;
  const currentItems = reservations.slice(indexOfFirst, indexOfFirst + itemsPerPage);

  useEffect(() => {
    fetchMyReservations()
      .then((data) => {
      // 예매 내역을 예약일 기준으로 내림차순 정렬
      const sorted = data.sort((a, b) => Number(b.reservationNumber) - Number(a.reservationNumber));
    setReservations(sorted);
    })
      .catch((err) => {
        console.error("예매 내역 조회 실패", err);
      });
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-2">
      <h2 className="text-2xl font-bold text-purple-800 mb-6">나의 예매 내역</h2>

      {reservations.length === 0 ? (
        <p className="text-gray-500">예매 내역이 없습니다.</p>
      ) : (
        <>
          {/* 라벨 헤더 */}
          <div className="grid grid-cols-[80px_1fr_220px_120px] text-sm text-gray-800 px-3 pb-2">
            <span className="text-center">예매일</span>
            <span className="text-center">공연정보</span>
            <span className="text-left">예매정보</span>
            <span className="text-center">상태</span>
          </div>

          {/* 예매 카드 목록 */}
          {currentItems.map((res) => (
            <ReservationCard key={res.reservationNumber} reservation={res} />
          ))}
        </>
      )}

      {/* 페이징 */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyReservationList;
