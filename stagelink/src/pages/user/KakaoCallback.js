import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const KakaoCallback = () => {
  const navigate = useNavigate();
  const onceRef = useRef(false);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (!code) {
      navigate("/", { replace: true });
      return;
    }

    if (onceRef.current) return;
    onceRef.current = true;

    axios
      .get(`http://localhost:8080/api/member/kakao?code=${code}`)
      .then((res) => {
        const { accessToken, refreshToken, nickname } = res.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        alert(`${nickname}님 로그인 되었습니다!`);

        // 리렌더 직후 실행
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 0);
      })
      .catch((err) => {
        console.error("카카오 로그인 실패", err);
        alert("카카오 로그인 실패");
      });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg font-semibold">카카오 로그인 처리 중입니다...</p>
    </div>
  );
};

export default KakaoCallback;
