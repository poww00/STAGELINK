const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;
const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;
const kakaoAuthUrl = "https://kauth.kakao.com/oauth/authorize";

export const getKakaoLoginLink = () => {
  const kakaoURL = `${kakaoAuthUrl}?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
  return kakaoURL;
};
