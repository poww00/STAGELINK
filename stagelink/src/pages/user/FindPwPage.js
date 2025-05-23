import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Footer from "../../components/common/Footer";
import Header from "../../components/common/Header";
import { useLocation } from "react-router-dom";



const FindPwPage = () => {
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleFindPw = async (e) => {
    console.log("handleFindId 실행됨");
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/member/find-pw", {
        userId,
        userEmail,
      });

    alert("인증 성공! 비밀번호를 재설정하세요.");
    navigate("/reset-password", {
        state : {
            userId : userId,
            userEmail : userEmail,
        },
    }); // 다음 페이지로 이동

  } catch (err) {
    alert("일치하는 회원이 없습니다.");
    console.error(err);
  }
};

    


return (
  <>
    <Header /> 

    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg min-h-[400px] px-10 py-16 rounded-2xl shadow-lg flex flex-col justify-center">
        <div className="text-3xl font-bold text-center mb-5 text-purple-800">
            비밀번호 찾기
        </div>

        {/* 탭 메뉴 */}
        <div className="flex justify-center mb-12">
        <Link
            to="/find-id"
            className={`px-6 py-2 text-sm font-semibold transition-all rounded-l-full ${
            location.pathname === "/find-id"
                ? "bg-white text-purple-600 border border-gray-300"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
        >
            아이디 찾기
        </Link>
        <Link
            to="/find-pw"
            className={`px-6 py-2 text-sm font-semibold transition-all rounded-r-full ${
            location.pathname === "/find-pw"
                ? "bg-white text-purple-600 border border-gray-300"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
        >
            비밀번호 찾기
        </Link>
        </div>



        <form onSubmit={handleFindPw} className="mx-auto w-full max-w-sm">
          <div className="space-y-0">
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              placeholder="아이디"
              className="w-full border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-t px-5 py-4 text-base placeholder-gray-500"
            />
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
              placeholder="이메일"
              className="w-full border border-gray-300 border-t-0 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-b px-5 py-4 text-base placeholder-gray-500"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-bold py-3.5 rounded-lg transition mt-6"
          >
            비밀번호 찾기
          </button>
        </form>
      </div>

    </div>

    <Footer /> 
  </>
);
};


export default FindPwPage;
