import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const validatePassword = (pw) => {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/.test(pw);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setPasswordError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage("모든 필드를 입력해주세요.");
      return;
    }

    if (!validatePassword(newPassword)) {
      setPasswordError("비밀번호는 영문자, 숫자 포함 8~20자여야 합니다.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await axios.put("/api/mypage/change-password", {
        currentPassword,
        newPassword,
        confirmPassword,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
      });

      alert("비밀번호가 성공적으로 변경되었습니다.");
      navigate("/mypage");
    } catch (error) {
      console.error("비밀번호 변경 실패", error);
      setMessage("현재 비밀번호가 일치하지 않거나 오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold text-purple-800 text-left mb-8">비밀번호 변경</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-4">
          <label className="w-32 text-base font-medium text-gray-700 text-left">현재 비밀번호</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="flex-1 p-2.5 border rounded-md"
            required
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="w-32 text-base font-medium text-gray-700 text-left">새 비밀번호</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="영문, 숫자 포함 8~20자"
            className="flex-1 p-2.5 border rounded-md"
            required
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="w-32 text-base font-medium text-gray-700 text-left">비밀번호 확인</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="flex-1 p-2.5 border rounded-md"
            required
          />
        </div>

        {passwordError && (
          <p className="text-sm text-red-500 text-left">{passwordError}</p>
        )}
        {message && (
          <p className="text-sm text-red-500 text-left">{message}</p>
        )}

        <div className="flex justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/mypage")}
            className="w-32 py-2 bg-white border border-gray-400 text-gray-700 rounded-md hover:bg-gray-100"
          >
            취소
          </button>
          <button
            type="submit"
            className="w-32 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            확인
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
