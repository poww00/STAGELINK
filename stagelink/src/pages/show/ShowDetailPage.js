import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";

// 공통 레이아웃/컴포넌트
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import LoginModal from "../../components/common/LoginModal";
import PosterInfo from "../../components/show/PosterInfo";
import StickyBookingPanel from "../../components/show/StickyBookingPanel";
import TabContent from "../../components/show/TabContent";
import SeatModal from "../../components/show/SeatModal";

// === 목데이터 (실제에선 API로 대체) ===
const mockShowInfo = {
  id: 1,
  title: "뮤지컬 〈위키드〉 내한 공연(WICKED The Musical)",
  poster: "/images/poster1.jpg",
  locationId: 1,
  locationName: "(재)경기문화재단",
  startDate: "2025-05-01",
  endDate: "2025-06-01",
  ageLimit: 8,
  seatVipPrice: 150000,
  seatRPrice: 120000,
  seatSPrice: 80000,
  rating: 4.5,
};

/**
 * 공연 상세 페이지
 * - 공연 기본 정보, 포스터, 상세 탭, 찜하기/예매 패널, 좌석/결제 모달
 */
const ShowDetailPage = () => {
  // === 라우터 파라미터, 쿼리, 네비게이터 ===
  const { id } = useParams();                       // 공연 ID(경로에서)
  const [searchParams] = useSearchParams();         // 탭 정보(쿼리에서)
  const tab = searchParams.get("tab") || "info";    // 활성 탭
  const navigate = useNavigate();

  // === 상태값 관리 ===
  const [showInfo, setShowInfo] = useState(null);       // 공연 상세정보(객체)
  const [liked, setLiked] = useState(false);            // 찜하기 상태
  const [loginModal, setLoginModal] = useState({ open: false, message: "" }); // 로그인 안내 모달
  const [seatModalOpen, setSeatModalOpen] = useState(false); // 좌석선택/결제 모달
  const [reserveInfo, setReserveInfo] = useState({ date: null, time: null }); // 예매일/회차

  // userId: JWT에서 추출
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        setUserId(jwtDecode(token).id);
      } catch (e) {
        setUserId(null);
      }
    } else {
      setUserId(null);
    }
  }, []);

  // === 공연 상세정보 불러오기 (mount/ID 변경시) ===
  useEffect(() => {
    // 실제 API라면 여기서 showInfo를 axios로 받아옴
    setShowInfo(mockShowInfo);
  }, [id]);

  // === 현재 유저의 찜 여부 조회 ===
  useEffect(() => {
    if (id && userId) {
      axios
        .get(`/api/likes/check?showNo=${id}&userId=${userId}`)
        .then(res => setLiked(res.data))
        .catch(() => setLiked(false));
    }
  }, [id, userId]);

  // === 안내 모달 열기 ===
  const openLoginModal = (message) => setLoginModal({ open: true, message });

  // === 찜하기/취소 버튼 클릭시 ===
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

  // === 예매하기(좌석 선택 모달 열기) ===
  const handleReserve = (date, time) => {
    setReserveInfo({ date, time });
    setSeatModalOpen(true);
  };

  // === 공연 정보 없으면 로딩 메시지 ===
  if (!showInfo) return <div className="text-center py-20">공연 정보를 불러오는 중입니다...</div>;

  // === 실제 렌더 ===
  return (
    <>
      <Header />
      <div className="relative max-w-7xl mx-auto px-4 py-10">
        {/* === 우측 고정 예매/찜 패널 === */}
        <div
          className="hidden lg:block fixed z-40"
          style={{ top: "180px", left: "calc(50% + 300px)", width: "300px" }}
        >
          <StickyBookingPanel
            showId={id}
            onLike={handleLike}
            onReserve={handleReserve}
            liked={liked}
            userId={userId}
            openLoginModal={openLoginModal}
          />
        </div>
        {/* === 공연 포스터/정보/탭 === */}
        <div className="lg:pr-[340px]">
          <PosterInfo show={showInfo} />
          <div className="mt-12">
            <TabContent tab={tab} showId={id} />
          </div>
        </div>
      </div>
      {/* === 로그인 안내 모달 === */}
      {loginModal.open && (
        <LoginModal
          message={loginModal.message}
          onClose={() => setLoginModal({ open: false, message: "" })}
        />
      )}
      {/* === 좌석/할인/결제/완료 모달 === */}
      {seatModalOpen && (
        <SeatModal
          showInfo={showInfo}   // 실제 공연 정보 객체 전체 전달!
          showId={id}
          date={reserveInfo.date}
          time={reserveInfo.time}
          onClose={() => setSeatModalOpen(false)}
        />
      )}
      <Footer />
    </>
  );
};

export default ShowDetailPage;
