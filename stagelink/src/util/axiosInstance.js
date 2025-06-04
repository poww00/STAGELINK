// 토큰 재발급
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080", // API 서버 주소
});

let isRefreshing = false; // 토큰 재발급 중인지 여부
let refreshSubscribers = []; // 토큰 재발급 대기 중인 요청들

// 새로운 토큰 받은 후, 대기 중인 요청에 토큰 적용
const onRefreshed = (newtoken) => {
  refreshSubscribers.forEach((callback) => callback(newtoken));
  refreshSubscribers = [];
}

// 토큰 재발급 대기 중인 요청 등록
const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
}

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

    // 조건: accessToken 만료 (401, 403) & 재발급 중이 아닐 때
    if (
    (error.response?.status === 401 || error.response?.status === 403) &&
    !originalRequest._retry &&
    localStorage.getItem("refreshToken")
  ){
      originalRequest._retry = true;

      // 이미 재발급 중이라면 대기열에 요청 추가
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(instance(originalRequest)); //  토큰 적용 후 재요청
          });
        });
      }

      isRefreshing = true; // 이제 토큰 재발급 시작

      try {
        const refreshRes = await instance.post("/api/refresh", {
          refreshToken: localStorage.getItem("refreshToken"),
        });

        // 새 토큰 저장
        localStorage.setItem("accessToken", refreshRes.data.accessToken);
        localStorage.setItem("refreshToken", refreshRes.data.refreshToken);

        // 모든 대기 요청에 새 토큰 적용
        onRefreshed(refreshRes.data.accessToken);

        // 새 accessToken으로 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${refreshRes.data.accessToken}`;
        return axios(originalRequest);
        // 재발급 실패시 로그아웃 처리
      } catch (refreshErr) {
        console.error("재발급 실패", refreshErr);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false; // 재발급 완료
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
