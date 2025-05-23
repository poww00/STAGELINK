import { useEffect, useState } from "react";
import axios from "../../util/axiosInstance"; // axios 인스턴스 import


const MypageHome = () => {
  const [nickname, setNickname] = useState("");
  const [reservationCount, setReservationCount] = useState(0);

  useEffect(() => {
    // 👉 accessToken 로그 찍기 (제일 먼저 확인)
  const token = localStorage.getItem("accessToken");
  console.log("accessToken:", token);  // 여기서 undefined나 null이면 문제야


    // 닉네임 가져오기
    axios.get("/api/mypage", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    }).then(res => setNickname(res.data.nickname))
    .catch(err => console.error("닉네임 불러오기 실패", err));

    // 예매 건수 가져오기
    //axios.get("/api/reservations/count", {
      //headers: {
        //Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      //}
    //}).then(res => setReservationCount(res.data));
  }, []);

  return (
    <div className="text-xl font-semibold">
      {nickname}님 👋 예매내역 {reservationCount}건
    </div>
  );
};

export default MypageHome;
