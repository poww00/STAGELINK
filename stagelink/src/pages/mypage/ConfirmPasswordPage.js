import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useCustomLogin from '../../hook/useCustomLogin'; 

const ConfirmPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signupType } = useCustomLogin(); 

  // 카카오 계정일 경우 접근 제한
  useEffect(() => {
    if (signupType === "KAKAO") {
      alert("카카오 계정으로 가입한 사용자는 접근할 수 없습니다.");
      navigate("/mypage", { replace: true });
    }
  }, [signupType, navigate]);

  // 카카오일 경우 렌더링 자체 막기
  if (signupType === "KAKAO") return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post('/api/mypage/confirm-password', { password }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      navigate("/mypage/info");
    } catch (err) {
      setError("비밀번호가 틀렸습니다.");
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10 text-center">
      <h2 className="text-2xl font-bold text-purple-800 mb-10">개인정보 수정</h2>
      <p className="text-lg font-semibold mb-1">비밀번호 확인</p>
      <p className="text-sm text-gray-600 mb-6">
        회원님의 <span className="text-red-500 font-semibold">정보를 보호</span>하기 위해
        비밀번호를 한 번 더 입력해주세요.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            className="w-[360px] h-[50px] p-3 border rounded-md text-center"
            required
          />
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>

        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/mypage")}
            className="w-32 py-2 bg-white border border-gray-400 text-gray-700 rounded-md hover:bg-gray-100"
          >
            취소
          </button>
          <button
            type="submit"
            className="w-32 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
          >
            확인
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfirmPasswordPage;
