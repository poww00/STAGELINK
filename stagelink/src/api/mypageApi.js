import axios from "axios";
import axiosInstance from "../util/axiosInstance"; // 커스텀 axios 인스턴스 import


// 예매 내역 리스트 조회 api
export const fetchMyReservations = async () => {
    const token = localStorage.getItem("accessToken"); // jwt 토큰 가져오기

    const response = await axios.get("/api/mypage/reservations", {
        headers: {
            Authorization: `Bearer ${token}`, // 백엔드 인증 정보 같이 보내기
        },
    });
    return response.data; // 백엔드에서 온 예매 내역 리스트
};

// 예매 내역 상세 조회 api
export const fetchReservationDetail = async (reservationId) => {
    const token = localStorage.getItem("accessToken"); // jwt 토큰 가져오기

    const response = await axios.get(`/api/mypage/reservations/${reservationId}`, {
        headers: {
            Authorization: `Bearer ${token}`, // 백엔드 인증 정보 같이 보내기
        },
    });
    return response.data; // 백엔드에서 온 예매 내역 상세 정보
};

// 환불 안내 api
export const fetchRefundPreview = async (reservationId) => {
    try {
        const response = await axiosInstance.get(`/api/mypage/refunds/preview`, {
            params: { reservationId },
        });
        return response.data; // 백엔드에서 온 환불 미리보기 정보
    } catch (error) {
        console.error("환불 미리보기 조회 실패", error);
        throw error; // 에러를 다시 던져서 호출하는 곳에서 처리할 수 있게 함
    }
};

// 찜한 공연 리스트 조회 api
export const fetchMyLikes = async () => {
    const token = localStorage.getItem("accessToken"); // jwt 토큰 가져오기

    const response = await axios.get("/api/mypage/likes", {
        headers: {
            Authorization: `Bearer ${token}`, // 백엔드 인증 정보 같이 보내기
        },
    });
    return response.data; // 백엔드에서 온 찜한 공연 리스트
};
