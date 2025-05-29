import { Link, useLocation } from "react-router-dom";

const MypageSidebar = () => {
  const location = useLocation();

  const menu = [
    { path: "/mypage/reservations", label: "나의 예매 내역" },
    { path: "/mypage/info", label: "내 정보 관리" },
    { path: "/mypage/activity", label: "내 활동" },
  ];

  return (

    <aside className="w-full h-full flex items-center border-l-2 border-gray-200 pl-6">
      <div className="flex flex-col justify-center w-full">
        {/* 타이틀 */}
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-left">
          마이페이지
        </h2>

        {/* 메뉴 리스트 */}
        <ul className="flex flex-col gap-4">
          {menu.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`block text-base font-medium transition-all duration-150
                    ${
                      isActive
                        ? "text-violet-700 underline underline-offset-4"
                        : "text-gray-600 hover:text-violet-600"
                    }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>

  );
};

export default MypageSidebar;
