import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../slices/loginSlice";
import { jwtDecode } from "jwt-decode"
import { useNavigate } from "react-router-dom";
import axios from "axios";


const useCustomLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLogin, nickname, userId } = useSelector((state) => state.login);

    // 로그인 상태 복원
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            try {
                const decode = jwtDecode(token);

                // 토큰 만료 확인
                if (decode.exp && decode.exp * 1000 < Date.now()) {
                    localStorage.removeItem("accessToken");
                    dispatch(logout());
                    return;
                }

                dispatch(
                    login({
                        userId: decode.id,
                        nickname: decode.nickname,
                        signupType: decode.signupType,
                    })
                );
            } catch {
                console.error("토큰 복원 실패");
                localStorage.removeItem("accessToken");
                dispatch(logout());
            }
        }
    }, [dispatch]);

    // 로그아웃
    const doLogout = async () => {
        try{
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
            // 서버와 연결 실패해도 일단 클라이언트 로그아웃은 강제 실행할 수 있음
        } finally {
            localStorage.removeItem("accessToken"); // 클라이언트 토큰 제거
            dispatch(logout()); // 리덕스 상태 초기화
            navigate("/"); // 메인으로 이동
        } 
    };

    return {isLogin, nickname, userId, doLogout };
};

export default useCustomLogin;