import { Outlet } from "react-router-dom";
import MypageSidebar from "../../components/mypage/MypageSidebar";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

const MypageLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* 본문 */}
      <div className="flex flex-1">
        <div className="flex-1 p-8">
          <Outlet />  {/* 페이지별 콘텐츠 */}
        </div>
        <MypageSidebar />  {/* 사이드바 오른쪽 */}
      </div>

      
      <Footer />
    </div>
  );
};

export default MypageLayout;
