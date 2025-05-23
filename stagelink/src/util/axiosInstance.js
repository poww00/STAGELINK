// 토큰 재발급
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080", // API 서버 주소
});

// 요청 인터셉터: 모든 요청에 accessToken 자동 포함
instance.interceptors.request.use(config => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// 응답 인터셉터: accessToken 만료 시 refreshToken으로 재발급
instance.interceptors.response.use(
  response => response, // 정상 응답은 그대로
  async error => {
    const originalRequest = error.config;

    if (
    (error.response?.status === 401 || error.response?.status === 403) &&
    !originalRequest._retry &&
    localStorage.getItem("refreshToken")
  ){
      originalRequest._retry = true;

      try {
        const refreshRes = await instance.post("/api/refresh", {
          refreshToken: localStorage.getItem("refreshToken"),
        });

        // 새 토큰 저장
        localStorage.setItem("accessToken", refreshRes.data.accessToken);
        localStorage.setItem("refreshToken", refreshRes.data.refreshToken);

        // 새 accessToken으로 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${refreshRes.data.accessToken}`;
        return axios(originalRequest);

      } catch (refreshErr) {
        console.error("재발급 실패", refreshErr);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
