import { Outlet } from "react-router-dom";
import MypageSidebar from "../../components/mypage/MypageSidebar";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

const MypageLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 헤더 */}
      <Header />

      {/* 본문 영역: 콘텐츠 + 사이드바 */}
      <div className="flex flex-1 px-0 py-10 gap-10 justify-center">
        {/* 콘텐츠 영역 */}
        <div className="max-w-[800px] w-full pr-2"> {/* 콘텐츠 너비 조절 */}
          <Outlet /> {/* 페이지별 콘텐츠 */}
        </div>

        {/* 사이드바 - 콘텐츠에 바짝 붙여서 오른쪽 */}
        <div className="w-[200px] h-max sticky top-[20vh] self-start">
          <MypageSidebar />
        </div>
      </div>

      {/* 푸터 */}
      <Footer />
    </div>
  );
};

export default MypageLayout;
