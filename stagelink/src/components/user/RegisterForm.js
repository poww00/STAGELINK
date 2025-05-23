import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// 회원가입 폼
const RegisterForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    confirmPassword: "",
    name: "",
    birthday: "",
    gender: "",
    nickname: "",
    userEmailId: "",
    userEmailDomain: "",
  });

  const [emailDomainInput, setEmailDomainInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [idChecked, setIdChecked] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);
  const [isUserIdValid, setIsUserIdValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [termsChecked, setTermsChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);

  const validateUserId = (value) => /^[A-Za-z0-9]{8,20}$/.test(value);
  const validatePassword = (value) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/.test(value);
  const validateEmail = (email) => /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "userId") {
      setIsUserIdValid(validateUserId(value));
      setIdChecked(false);
    }

    if (name === "password") {
      setIsPasswordValid(validatePassword(value));
    }

    if (name === "userEmailId" || name === "userEmailDomain") {
      setEmailChecked(false);
    }
  };

  useEffect(() => {
    const domain = formData.userEmailDomain === "직접 입력"
      ? emailDomainInput
      : formData.userEmailDomain;
    const fullEmail = `${formData.userEmailId}@${domain}`;
    setIsEmailValid(validateEmail(fullEmail));
  }, [formData.userEmailId, formData.userEmailDomain, emailDomainInput]);

  const checkUserId = async () => {
    if (!formData.userId) return alert("아이디를 입력하세요.");
    if (!isUserIdValid) return alert("아이디 형식을 확인하세요.");
    try {
      const res = await axios.get(`http://localhost:8080/api/member/check-userId?userId=${formData.userId}`);
      if (res.data.available) {
        alert("사용 가능한 아이디입니다.");
        setIdChecked(true);
      } else {
        alert("이미 사용 중인 아이디입니다.");
        setIdChecked(false);
      }
    } catch (err) {
      console.error(err);
      alert("아이디 확인 중 오류가 발생했습니다.");
    }
  };

  const checkUserEmail = async () => {
    const domain = formData.userEmailDomain === "직접 입력" ? emailDomainInput : formData.userEmailDomain;
    const fullEmail = `${formData.userEmailId}@${domain}`;
    if (!formData.userEmailId || !domain) return alert("이메일을 입력하세요.");

    try {
      const res = await axios.get(`http://localhost:8080/api/member/check-email?userEmail=${fullEmail}`);
      if (res.data.available) {
        alert("사용 가능한 이메일입니다.");
        setEmailChecked(true);
      } else {
        alert("이미 등록된 이메일입니다.");
        setEmailChecked(false);
      }
    } catch (err) {
      console.error(err);
      alert("이메일 확인 중 오류가 발생했습니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!idChecked) {
      setErrorMsg("아이디 중복 확인을 해주세요.");
      return;
    }
    if (!emailChecked) {
      setErrorMsg("이메일 중복 확인을 해주세요.");
      return;
    }
    if (!termsChecked || !privacyChecked) {
      setErrorMsg("필수 약관에 동의해주세요.");
      return;
    }

    const domain = formData.userEmailDomain === "직접 입력" ? emailDomainInput : formData.userEmailDomain;
    const finalForm = {
      userId: formData.userId,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      name: formData.name,
      birthday: formData.birthday,
      gender: formData.gender,
      nickname: formData.nickname,
      userEmail: `${formData.userEmailId}@${domain}`,
    };

    try {
      console.log("제출할 데이터:", finalForm);
      await axios.post("http://localhost:8080/api/member/register", finalForm);
      alert("회원가입 성공!");
      navigate("/login");
    } catch (error) {
      console.error("회원가입 실패:", error);
      setErrorMsg("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const emailDomains = [
    "naver.com", "gmail.com", "hanmail.net", "nate.com",
    "hotmail.com", "daum.net", "outlook.com", "kakao.com", "직접 입력"
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-2xl mx-auto px-6">
      <h2 className="text-2xl font-bold text-left text-purple-600 mt-10 mb-6">회원가입</h2>

      <div className="space-y-5">
        {/* 아이디 입력 */}
        <div className="flex items-center gap-4">
          <label className="w-24 text-base font-medium text-gray-700 text-left">아이디</label>
          <div className="flex flex-col flex-1 gap-1">
            <div className="flex gap-2">
              <input
                type="text"
                name="userId"
                placeholder="영문, 숫자 포함 8~20자"
                value={formData.userId}
                onChange={handleChange}
                required
                className="flex-1 p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] text-base"
              />
              <button
                type="button"
                onClick={checkUserId}
                className="whitespace-nowrap bg-gray-200 text-gray-800 px-3 py-2 rounded-md hover:bg-gray-300 transition text-sm"
              >
                중복확인
              </button>
            </div>
            {!isUserIdValid && formData.userId.length > 0 && (
              <p className="text-sm text-red-500">아이디는 영문 또는 숫자 8~20자여야 합니다.</p>
            )}
          </div>
        </div>

        {[ 
          { label: "비밀번호", name: "password", type: "password", placeholder: "영문, 숫자 포함 8~20자" },
          { label: "비밀번호 확인", name: "confirmPassword", type: "password" },
          { label: "이름", name: "name", type: "text" },
          { label: "생년월일", name: "birthday", type: "date" },
          { label: "닉네임", name: "nickname", type: "text", placeholder: "한글 혹은 영문 20자 내외" },
        ].map(({ label, name, type, placeholder }) => (
          <div key={name} className="flex flex-col gap-1">
            <div className="flex items-center gap-4">
              <label className="w-24 text-base font-medium text-gray-700 text-left">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required
                placeholder={placeholder || ""}
                className="flex-1 p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] text-base"
              />
            </div>
            {name === "password" && !isPasswordValid && formData.password.length > 0 && (
              <p className="text-sm text-red-500 pl-28">비밀번호는 영문자와 숫자를 포함한 8~20자여야 합니다.</p>
            )}
          </div>
        ))}

        {/* 성별 */}
        <div className="flex items-center gap-4">
          <label className="w-24 text-base font-medium text-gray-700 text-left">성별</label>
          <div className="flex gap-6">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="gender"
                value="MALE"
                checked={formData.gender === "MALE"}
                onChange={handleChange}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-base text-gray-700">남성</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="gender"
                value="FEMALE"
                checked={formData.gender === "FEMALE"}
                onChange={handleChange}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-base text-gray-700">여성</span>
            </label>
          </div>
        </div>

        {/* 이메일 */}
        <div className="flex items-start gap-4">
          <label className="w-24 text-base font-medium text-gray-700 text-left pt-2">이메일</label>
          <div className="flex gap-2 flex-1">
            <input
              type="text"
              name="userEmailId"
              value={formData.userEmailId}
              onChange={handleChange}
              required
              placeholder="이메일 ID"
              className="w-1/2 p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] text-base"
            />
            <span className="text-gray-600 pt-2">@</span>
            {formData.userEmailDomain === "직접 입력" ? (
              <input
                type="text"
                value={emailDomainInput}
                onChange={(e) => {
                  setEmailChecked(false);
                  setEmailDomainInput(e.target.value);
                }}
                required
                placeholder="도메인 입력"
                className="w-1/2 p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] text-base"
              />
            ) : (
              <select
                name="userEmailDomain"
                value={formData.userEmailDomain}
                onChange={handleChange}
                required
                className="w-1/2 p-2.5 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] text-base"
              >
                <option value="">선택해주세요</option>
                {emailDomains.map((domain) => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </select>
            )}
            <button
              type="button"
              onClick={checkUserEmail}
              className="whitespace-nowrap bg-gray-200 text-gray-800 px-3 py-2 rounded-md hover:bg-gray-300 transition text-sm"
            >
              중복확인
            </button>
          </div>
        </div>

        {!isEmailValid && formData.userEmailId && (
          <p className="text-sm text-red-500 mt-1">올바른 이메일 형식이 아닙니다.</p>
        )}



        
        {/* 약관 동의 영역 */}
      <div className="space-y-2 text-sm text-gray-700">
        <div>
          <label>
            <input
              type="checkbox"
              checked={termsChecked}
              onChange={(e) => setTermsChecked(e.target.checked)}
              className="mr-2"
            />
            이용약관 동의 <span className="text-red-500">(필수)</span>
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={privacyChecked}
              onChange={(e) => setPrivacyChecked(e.target.checked)}
              className="mr-2"
            />
            개인정보 수집 및 이용 동의 <span className="text-red-500">(필수)</span>
          </label>
        </div>

      </div>

        
        {errorMsg && <p className="text-red-500 text-sm font-medium mt-2">{errorMsg}</p>}
        
        <button
          type="submit"
          className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-md text-base transition"
        >
          회원가입
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
