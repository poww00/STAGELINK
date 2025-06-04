import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import PosterInfo from "../../components/show/PosterInfo";
import StickyBookingPanel from "../../components/show/StickyBookingPanel";
import TabContent from "../../components/show/TabContent";
import SeatModal from "../../components/show/SeatModal";
import LoginModal from "../../components/common/LoginModal";
import { jwtDecode } from "jwt-decode";

const ShowDetailPage = () => {
  const { id } = useParams(); // showInfoId
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "info";

  // 상태값
  const [showInfo, setShowInfo] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [seatModalOpen, setSeatModalOpen] = useState(false);
  const [reserveInfo, setReserveInfo] = useState({ date: null, time: null, showNo: null });
  const [loginModal, setLoginModal] = useState({ open: false, message: "" });
  const [liked, setLiked] = useState(false);
  const [userId, setUserId] = useState(null);

  // JWT에서 userId 추출
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        setUserId(jwtDecode(token).id);
      } catch (e) { setUserId(null); }
    } else {
      setUserId(null);
    }
  }, []);

  // 공연 상세 정보
  useEffect(() => {
    axios.get(`/api/showinfo/${id}`)
      .then(res => setShowInfo(res.data))
      .catch(() => setShowInfo(null));
  }, [id]);

  // 회차(날짜/시간) 리스트 (상태 0,1만 반환)
  useEffect(() => {
    axios.get(`/api/shows/byShowInfo/${id}`)
      .then(res => setSessions(res.data))
      .catch(() => setSessions([]));
  }, [id]);

  // 찜 여부
  useEffect(() => {
    if (id && userId) {
      axios
        .get(`/api/likes/check?showNo=${id}&userId=${userId}`)
        .then(res => setLiked(res.data))
        .catch(() => setLiked(false));
    }
  }, [id, userId]);

  // 로그인 안내
  const openLoginModal = (message) => setLoginModal({ open: true, message });

  // 찜하기/취소
  const handleLike = () => {
    if (!userId) {
      openLoginModal("로그인이 필요한 서비스입니다. 로그인 해주세요!");
      return;
    }
    if (liked) {
      axios
        .delete(`/api/likes?showNo=${id}&userId=${userId}`)
        .then(() => {
          setLiked(false);
          openLoginModal("찜 목록에서 삭제되었습니다!");
        })
        .catch(() => openLoginModal("찜 취소에 실패했습니다."));
    } else {
      axios
        .post(`/api/likes?showNo=${id}&userId=${userId}`)
        .then(() => {
          setLiked(true);
          openLoginModal("찜 목록에 추가되었습니다!");
        })
        .catch(() => openLoginModal("찜 추가에 실패했습니다."));
    }
  };

  // 예매(좌석 모달 오픈)
  const handleReserve = (date, time, showNo) => {
    setReserveInfo({ date, time, showNo });
    setSeatModalOpen(true);
  };

  // 날짜별로 회차 그룹핑
  const sessionGroups = sessions.reduce((acc, session) => {
    const dateStr = session.startTime.slice(0, 10);
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(session);
    return acc;
  }, {});

  if (!showInfo) return <div className="text-center py-20">공연 정보를 불러오는 중입니다...</div>;

   return (
    <>
      <Header />

      {/* ★ grid : 768px 이상에서 [본문 680px | 패널 340px] */}
      <div className="relative mx-auto grid max-w-[1052px] gap-8 px-4 py-10
+               justify-center
+               lg:grid-cols-[680px_340px]">
        {/* ─── 왼쪽 본문 ─── */}
        <div>
          <PosterInfo show={showInfo} />
          <div className="mt-8">
            <TabContent tab={tab} showId={id} />
          </div>
        </div>

        {/* ─── 오른쪽 고정 패널 ─── */}
        <div className="relative">
          <div className="sticky top-[120px]">
            <StickyBookingPanel
              sessionGroups={sessionGroups}
              onReserve={handleReserve}
              onLike={handleLike}
              liked={liked}
              userId={userId}
              openLoginModal={openLoginModal}
            />
          </div>
        </div>
      </div>

      {/* (SeatModal · LoginModal 그대로) */}
      {seatModalOpen && (
        <SeatModal
          show={sessions.find(s => s.id === reserveInfo.showNo)}
          showId={reserveInfo.showNo}
          date={reserveInfo.date}
          time={reserveInfo.time}
          onClose={() => setSeatModalOpen(false)}
          userId={userId}
          showInfo={showInfo}
        />
      )}
      {loginModal.open && (
        <LoginModal
          message={loginModal.message}
          onClose={() => setLoginModal({ open: false, message: "" })}
        />
      )}

      <Footer />
    </>
  );
};

export default ShowDetailPage;
