import { useEffect, useState } from "react";
import axios from "../../util/axiosInstance";
import { fetchMyReservations, fetchMyLikes } from "../../api/mypageApi";
import ReservationCard from "../../components/mypage/ReservationCard";
import CarouselLikedShowList from "../../components/mypage/CarouselLikedShowList";

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
        console.log("응답 데이터", res.data);
        setNickname(res.data.nickname);
        setReservationCount(res.data.reservationCount);
      })
      .catch(err => {
        console.error("마이페이지 홈 조회 실패", err);
      });

    fetchMyReservations()
      .then(data => {
        const sorted = data
          .sort((a, b) => Number(b.reservationNumber) - Number(a.reservationNumber))
          .slice(0, 3);
        setRecentReservations(sorted);
      })
      .catch(err => {
        console.error("최근 예매 내역 조회 실패", err);
      });

    fetchMyLikes()
      .then(data => {
        console.log("[찜한 공연 리스트] 서버에서 받아온 데이터:", data); 
        setLikedShows(data);
      })
      .catch(err => {
        console.error("찜한 공연 조회 실패", err);
      });
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-2">
      <h2 className="text-2xl font-bold text-purple-800 mb-2">마이페이지</h2>

      <div className="flex justify-between items-center bg-gray-50 rounded-xl p-4 shadow mb-6">
        <div className="text-xl font-semibold">
          <span>{nickname}</span>님 👋
        </div>

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
          <>
            <div className="grid grid-cols-[80px_1fr_220px_120px] text-sm text-gray-800 px-3 pb-2">
              <span className="text-center">예매일</span>
              <span className="text-center">공연정보</span>
              <span className="text-left">예매정보</span>
              <span className="text-center">상태</span>
            </div>

            {recentReservations.map((res) => (
              <ReservationCard key={res.reservationNumber} reservation={res} />
            ))}
          </>
        )}
      </section>

      {/* 찜한 공연 */}
      <section>
        <CarouselLikedShowList title="찜한 공연" 
        shows={likedShows} 
        setShows={setLikedShows} />
      </section>
    </div>
  );
};

export default MypageHome;
