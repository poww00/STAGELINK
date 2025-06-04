// src/components/user/SocialLoginButtons.js
import { getKakaoLoginLink } from "../../api/KakaoApi";


const SocialLoginButtons = () => {
  // 카카오 로그인
  const redirectToKaKaoLogin = () => {
    const link = getKakaoLoginLink();
    window.location.href = link;
  };
 

  return (
    <div className="mt-4 space-y-3 w-full max-w-sm mx-auto">
      <button
        onClick={() => alert("눌림!")}
        className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white 
          hover:bg-[#03C75A] hover:text-white hover:border-[#03C75A]
          text-gray-700 font-medium py-3.5 rounded-lg transition-all duration-200"
      >
        네이버로 로그인
      </button>

      <button
        onClick={redirectToKaKaoLogin}
        className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white 
          hover:bg-[#FEE500] hover:text-black hover:border-[#FEE500]
          text-gray-700 font-medium py-3.5 rounded-lg transition-all duration-200"
      >
        카카오로 로그인
      </button>
    </div>
  );
};

export default SocialLoginButtons;
