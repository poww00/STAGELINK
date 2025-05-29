import { useEffect, useState } from "react";
import axios from "../../util/axiosInstance";
import { fetchMyReservations, fetchMyLikes } from "../../api/mypageApi"; // 찜 API도 필요
import ReservationCard from "./ReservationCard"; // 그대로 재사용

const MypageHome = () => {
  const [nickname, setNickname] = useState("");
  const [reservationCount, setReservationCount] = useState(0);
  const [recentReservations, setRecentReservations] = useState([]);
  const [likedShows, setLikedShows] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    axios.get("/api/mypage/home", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        setNickname(res.data.nickname);
        setReservationCount(res.data.reservationCount);
      })
      .catch(err => {
        console.error("마이페이지 홈 조회 실패", err);
      });

    fetchMyReservations()
      .then(data => {
        const sorted = data
          //.filter(res => res.status !== "CANCELED") - 취소된 건들도 모두 출력
          .sort((a, b) => new Date(b.reservationDate) - new Date(a.reservationDate))
          .slice(0, 3);
        setRecentReservations(sorted);
      })
      .catch(err => {
        console.error("최근 예매 내역 조회 실패", err);
      });

    fetchMyLikes()
      .then(data => {
        setLikedShows(data.slice(0, 3)); // 찜한 공연 최대 3개
      })
      .catch(err => {
        console.error("찜한 공연 조회 실패", err);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-purple-800 mb-2">마이페이지</h2>

      <div className="flex justify-between items-center bg-gray-50 rounded-xl p-4 shadow mb-6">
        {/* 왼쪽: 닉네임 */}
        <div className="text-xl font-semibold">
          <span className="text-pink-600">{nickname}</span>님 👋
        </div>

        {/* 오른쪽: 예매 건수 */}
        <div className="text-lg text-gray-700">
          총 예매 내역{" "}
          <span className="text-2xl font-bold">{reservationCount}</span>건
        </div>
      </div>




      {/* 최근 예매 내역 */}
      <section className="mb-10">
        <h3 className="text-lg font-bold mb-3">최근 예매/취소</h3>
        {recentReservations.length === 0 ? (
          <p className="text-gray-500">예매 내역이 없습니다.</p>
        ) : (
          recentReservations.map((res) => (
            <ReservationCard key={res.reservationNumber} reservation={res} />
          ))
        )}
      </section>

      {/* 찜한 공연 */}
      <section>
        <h3 className="text-lg font-bold mb-3">찜한 공연</h3>
        {likedShows.length === 0 ? (
          <p className="text-gray-500">찜한 공연이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {likedShows.map((show) => (
              <div
                key={show.showNo}
                className="border rounded-lg p-3 shadow-sm bg-white mx-auto w-[80%] max-w-xs"
              >
                <img
                  src={show.posterUrl}
                  alt={show.showName}
                  className="w-full h-48 object-cover rounded mb-2"
                />
                <h4 className="text-sm font-bold truncate">{show.showName}</h4>
                <p className="text-sm text-gray-600">{show.period}</p>
                <p className="text-sm text-gray-600">{show.venue}</p>
                <p className="text-sm mt-1">
                  예매 가능 여부:{" "}
                  <span className={show.available ? "text-blue-600" : "text-red-500"}>
                    {show.available ? "예매 가능" : "매진"}
                  </span>
                </p>
                {show.available && (
                  <button
                    onClick={() => window.location.href = `/shows/${show.showNo}`}
                    className="mt-2 text-sm bg-purple-100 hover:bg-purple-200 px-3 py-1 rounded"
                  >
                    예매하기
                  </button>
                )}
              </div>
            ))}

          </div>
        )}
      </section>
    </div>
  );
};

export default MypageHome;
