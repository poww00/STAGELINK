import { Link } from "react-router-dom";

const MypageSidebar = () => {
  return (
    <div className="w-60 p-4 bg-gray-100 rounded-xl shadow-md sticky top-24">
      <h2 className="text-xl font-semibold mb-4">마이페이지</h2>
      <ul className="space-y-2">
        <li><Link to="/mypage/info" className="hover:text-purple-600">내 정보 관리</Link></li>
        <li><Link to="/mypage/reservations" className="hover:text-purple-600">나의 예매 내역</Link></li>
        <li><Link to="/mypage/posts" className="hover:text-purple-600">내 활동</Link></li>
      </ul>
    </div>
  );
};

export default MypageSidebar;