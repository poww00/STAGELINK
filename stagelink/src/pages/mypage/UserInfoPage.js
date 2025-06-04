import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCustomLogin from "../../hook/useCustomLogin";
import UserInfoForm from "../../components/mypage/UserInfoForm";

const UserInfoPage = () => {
  const { user } = useCustomLogin(); 
  const navigate = useNavigate();

  useEffect(() => {
    console.log("현재 유저 정보", user);
    if (user?.signupType === "KAKAO") {
      alert("카카오 계정으로 가입한 사용자는 회원정보 수정이 불가능합니다.");
      navigate("/mypage/home", { replace: true });
    }
  }, [user, navigate]);


  if (!user || user.signupType === "KAKAO") return null; // 카카오 계정으로 가입한 사용자는 회원정보 수정 불가

// GENERAL 회원만 접근 가능
  return (
    <div className="max-w-2xl mx-auto mt-4">
      <UserInfoForm />
    </div>
  );
};

export default UserInfoPage;