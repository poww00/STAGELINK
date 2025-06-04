// src/components/common/AppInitializer.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { login } from "../../slices/loginSlice";

const AppInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        dispatch(login({
          userId: decoded.sub,
          nickname: decoded.nickname
        }));
      } catch (error) {
        console.error("JWT 디코딩 실패:", error);
        localStorage.removeItem("accessToken");
      }
    }
  }, [dispatch]);

  return null;
};

export default AppInitializer;
