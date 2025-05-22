import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { login } from "../../slices/loginSlice"
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";

const LoginForm = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/login", {
        userId,
        password,
      });

      const { accessToken, refreshToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);


      const decode = jwtDecode(accessToken);
      dispatch(
        login({
            userId: decode.id,
            nickname: decode.nickname,
        })
      );
      
      // 메인페이지로 이동
      navigate("/");
    } catch (error) {
      console.error("로그인 실패", error.response?.data || error.message);
      alert("로그인에 실패했어요.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-sm">
      <div className="space-y-0">
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
          placeholder="아이디"
          className="w-full border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-t px-5 py-4 text-base placeholder-gray-500"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="비밀번호"
          className="w-full border border-gray-300 border-t-0 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-b px-5 py-4 text-base placeholder-gray-500"
        />
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-bold py-3.5 rounded-lg transition mt-6"
      >
        로그인
      </button>
    </form>
  );
};

export default LoginForm;
