import { useState } from "react";
import axios from "axios";
import Footer from "../../components/common/Footer";
import Header from "../../components/common/Header";
import { useLocation, useNavigate } from "react-router-dom";
import AlertModal from "../../components/user/AlertModal";

const ResetPwPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { userId, userEmail } = location.state || {};

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const showModal = (message) => {
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const validatePassword = (value) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/.test(value);

  // 비밀번호 입력 시 유효성 검사
  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);

    if (!validatePassword(value)) {
      setPasswordError("비밀번호는 영문자, 숫자 포함 8~20자여야 합니다.");
    } else {
      setPasswordError("");
    }

    if (confirmNewPassword && value !== confirmNewPassword) {
      setConfirmError("비밀번호가 일치하지 않습니다.");
    } else {
      setConfirmError("");
    }
  };

  // 확인 비밀번호 입력 시 검사
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmNewPassword(value);

    if (newPassword !== value) {
      setConfirmError("비밀번호가 일치하지 않습니다.");
    } else {
      setConfirmError("");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!validatePassword(newPassword)) {
      setSubmitError("비밀번호는 영문자, 숫자 포함 8~20자여야 합니다.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setSubmitError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/member/reset-password", {
        userId,
        userEmail,
        newPassword,
        confirmNewPassword,
      });

      showModal("비밀번호가 성공적으로 재설정되었습니다.");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (err) {
      showModal("오류가 발생했습니다.");
      console.error(err);
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white w-full max-w-lg min-h-[400px] px-10 py-16 rounded-2xl shadow-lg flex flex-col justify-center">
          <div className="text-3xl font-bold text-center mb-12 text-purple-800">
            비밀번호 재설정
          </div>

          <form onSubmit={handleResetPassword} className="mx-auto w-full max-w-sm">
            <div className="space-y-0">
              <input
                type="password"
                value={newPassword}
                onChange={handleNewPasswordChange}
                required
                placeholder="새 비밀번호"
                className="w-full border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-t px-5 py-4 text-base placeholder-gray-500"
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}

              <input
                type="password"
                value={confirmNewPassword}
                onChange={handleConfirmPasswordChange}
                required
                placeholder="비밀번호 확인"
                className="w-full border border-gray-300 border-t-0 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-b px-5 py-4 text-base placeholder-gray-500"
              />
              {confirmError && (
                <p className="text-red-500 text-sm mt-1">{confirmError}</p>
              )}
            </div>

            {submitError && (
              <p className="text-red-500 text-sm font-medium mt-4 text-center">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-bold py-3.5 rounded-lg transition mt-6"
            >
              확인
            </button>
          </form>
        </div>
      </div>

      <Footer />
      <AlertModal
        isOpen={isModalOpen}
        message={modalMessage}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ResetPwPage;
