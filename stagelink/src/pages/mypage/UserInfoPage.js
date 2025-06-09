import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCustomLogin from "../../hook/useCustomLogin";
import UserInfoForm from "../../components/mypage/UserInfoForm";
import AlertModal from "../../components/user/AlertModal";

const UserInfoPage = () => {
  const { signupType } = useCustomLogin(); 
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const showModal = (message) => {
    setModalMessage(message);
    setIsModalOpen(true);
  };

  useEffect(() => {
    console.log("현재 유저 signupType:", signupType);
    if (signupType === "KAKAO") {
      showModal("카카오 계정으로 가입한 사용자는 회원정보 수정이 불가능합니다.");
      navigate("/mypage", { replace: true });
    }
  }, [signupType, navigate]);

  // 카카오 계정으로 가입한 사용자는 회원정보 수정 불가
  if (signupType === "KAKAO") return null;

// GENERAL 회원만 접근 가능
  return (
    <>
    <div className="max-w-5xl mx-auto p-2">
      <UserInfoForm />
    </div>
    <AlertModal
    isOpen={isModalOpen}
    message={modalMessage}
    onClose={() => setIsModalOpen(false)}
  />
</>
  );
};

export default UserInfoPage;