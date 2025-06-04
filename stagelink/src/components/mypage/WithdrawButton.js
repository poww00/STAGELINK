import axios from "axios";
import { useNavigate} from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../slices/loginSlice";

const WithdrawButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleWithdraw = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.get("/api/mypage/check-can-withdraw", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsModalOpen(true);
    } catch (error) {
      setIsError(true);
      if (error.response?.status === 409) {
        setMessage("예매 내역이 있어 탈퇴할 수 없습니다. 예매 내역을 취소한 후 다시 시도해주세요.");
      } else {
        setMessage("탈퇴 가능 여부를 확인하는 데 실패했습니다. 나중에 다시 시도해주세요.");
      }
    }
  };

  const confirmWithdraw = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete("/api/mypage/withdraw", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 로그아웃 처리
      dispatch(logout());
      localStorage.removeItem("accessToken");

      setMessage("탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.");
      setIsError(false);
      setIsModalOpen(false);

      setTimeout(() => navigate("/"), 1500); // 1.5초 후 홈으로 이동
    } catch (error) {
      setIsError(true);
      setMessage("탈퇴 처리 중 오류가 발생했습니다. 나중에 다시 시도해주세요.");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleWithdraw}
        className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition"
      >
        회원 탈퇴
      </button>

      {/* 탈퇴 확인 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
            <p className="mb-4 text-lg font-semibold">정말 탈퇴하시겠습니까?</p>
            <p className="text-sm text-gray-600 mb-6">탈퇴 시 모든 정보가 삭제되며 복구할 수 없습니다.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                취소
              </button>
              <button
                onClick={confirmWithdraw}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                탈퇴
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 결과 알림 모달 */}
      {message && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
            <p className={`mb-4 text-base ${isError ? "text-black-600" : "text-black-600"}`}>{message}</p>
            <button
              onClick={() => setMessage("")}
              className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WithdrawButton;
