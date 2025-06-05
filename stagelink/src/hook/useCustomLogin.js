import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../slices/loginSlice";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const useCustomLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux에서 로그인 관련 상태 가져오기
  const { isLogin, userId, nickname, signupType } = useSelector((state) => state.login);

  // JWT 복원해서 Redux 상태 저장
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      console.log("accessToken 디코드 결과:", decoded);

      // 토큰 만료 검사
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        console.warn("토큰 만료됨");
        localStorage.removeItem("accessToken");
        dispatch(logout());
        return;
      }

      // Redux 상태 저장
      dispatch(
        login({
          userId: decoded.id,
          nickname: decoded.nickname,
          signupType: decoded.signupType,
        })
      );
    } catch (err) {
      console.error("JWT 디코딩 실패:", err);
      localStorage.removeItem("accessToken");
      dispatch(logout());
    }
  }, [dispatch]);

  // 로그아웃 핸들러
  const doLogout = async () => {
    try {
      await axios.post(
        "/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
    } catch (err) {
      console.error("서버 로그아웃 실패:", err);
    } finally {
      localStorage.removeItem("accessToken");
      dispatch(logout());
      navigate("/");
    }
  };

  // 필요한 값 리턴
  return { isLogin, userId, nickname, signupType, doLogout };
};

export default useCustomLogin;
