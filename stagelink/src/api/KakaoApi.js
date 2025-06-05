const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;
const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;
const kakaoAuthUrl = "https://kauth.kakao.com/oauth/authorize";

export const getKakaoLoginLink = () => {
  const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;
  const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;
  console.log("(실시간) REST_API_KEY:", REST_API_KEY);
  console.log("(실시간) REDIRECT_URI:", REDIRECT_URI);

  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
  console.log("최종 Kakao URL:", kakaoURL);
  return kakaoURL;
};

