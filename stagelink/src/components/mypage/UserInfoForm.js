import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import WithdrawButton from "./WithdrawButton";
import AlertModal from "../user/AlertModal";


const UserInfoForm = () => {
  const [formData, setFormData] = useState({
    userId: "",
    name: "",
    nickname: "",
    birthday: "",
    gender: "",
    userEmailId: "",
    userEmailDomain: "",
  });

  const [message, setMessage] = useState("");
  const [emailDomainInput, setEmailDomainInput] = useState("");
  const [emailChecked, setEmailChecked] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [initialEmail, setInitialEmail] = useState("");
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const showModal = (message) => {
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const emailDomains = [
    "naver.com", "gmail.com", "hanmail.net", "nate.com",
    "hotmail.com", "daum.net", "outlook.com", "kakao.com", "직접 입력"
  ];

  const validateEmail = (email) =>
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);

  const handleCancel = () => {
    navigate("/mypage");
  };

  useEffect(() => {
    axios.get("/api/mypage/info", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }).then((res) => {
      const data = res.data;
      const [userEmailId, userEmailDomain] = data.userEmail.split("@");
      setFormData({ ...data, userEmailId, userEmailDomain });
      setInitialEmail(data.userEmail);
      setEmailChecked(true);
    }).catch((err) => {
      console.error("내 정보 조회 실패", err);
    });
  }, []);

  useEffect(() => {
    const domain = formData.userEmailDomain === "직접 입력"
      ? emailDomainInput
      : formData.userEmailDomain;
    const fullEmail = `${formData.userEmailId}@${domain}`;

    if (formData.userEmailId && domain) {
      setIsEmailValid(validateEmail(fullEmail));
    } else {
      setIsEmailValid(true);
    }

    if (fullEmail !== initialEmail) {
      setEmailChecked(false);
    }
  }, [formData.userEmailId, formData.userEmailDomain, emailDomainInput]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const checkUserEmail = async () => {
    const domain = formData.userEmailDomain === "직접 입력"
      ? emailDomainInput
      : formData.userEmailDomain;
    const fullEmail = `${formData.userEmailId}@${domain}`;

    if (!validateEmail(fullEmail)) {
      showModal("올바른 이메일 형식이 아닙니다.");
      return;
    }

    try {
      const res = await axios.get(`/api/member/check-email?userEmail=${fullEmail}`);
      if (res.data.available) {
        showModal("사용 가능한 이메일입니다.");
        setEmailChecked(true);
      } else {
        showModal("이미 등록된 이메일입니다.");
        setEmailChecked(false);
      }
    } catch (err) {
      console.error(err);
      showModal("이메일 중복 확인 중 오류 발생");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const domain = formData.userEmailDomain === "직접 입력"
      ? emailDomainInput
      : formData.userEmailDomain;
    const fullEmail = `${formData.userEmailId}@${domain}`;

    if (!formData.userEmailId || !domain) {
      setMessage("이메일을 정확히 입력해주세요.");
      return;
    }

    if (!validateEmail(fullEmail)) {
      setMessage("올바른 이메일 형식이 아닙니다.");
      return;
    }

    if (fullEmail !== initialEmail && !emailChecked) {
      showModal("이메일 중복 확인을 해주세요.");
      return;
    }

    const finalForm = {
      userId: formData.userId,
      name: formData.name,
      nickname: formData.nickname,
      birthday: formData.birthday,
      gender: formData.gender,
      userEmail: fullEmail,
    };

    axios.put("/api/mypage/update", finalForm, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }).then(() => showModal("회원 정보가 수정되었습니다."))
      .catch((err) => {
        console.error("수정 실패", err);
        setMessage("수정에 실패했습니다.");
      });
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-2xl mx-auto px-6">
      <h2 className="text-2xl font-bold text-left text-purple-800 mt-4 mb-6">내 정보 관리</h2>

      <div className="flex items-center gap-4">
        <label className="w-24 text-base font-medium text-gray-700 text-left">아이디</label>
        <input type="text" name="userId" value={formData.userId} disabled className="flex-1 bg-gray-100 p-2.5 border rounded-md" />
      </div>

      {/* 비밀번호 변경 버튼 */}
      <div className="flex items-center gap-4">
      <label className="w-24 font-medium text-gray-700 text-left">비밀번호</label>
      <button
          type="button"
          onClick={() => navigate("/mypage/change-password")}
          className="font-bold text-black-600 underline hover:text-blue-800">
            비밀번호 변경
        </button>
        </div>

      {["name", "nickname", "birthday"].map((field) => (
        <div key={field} className="flex items-center gap-4">
          <label className="w-24 text-base font-medium text-gray-700 text-left">
            {field === "name" ? "이름" : field === "nickname" ? "닉네임" : "생년월일"}
          </label>
          <input type={field === "birthday" ? "date" : "text"} name={field} value={formData[field] || ""} onChange={handleChange} className="flex-1 p-2.5 border rounded-md" />
        </div>
      ))}

      <div className="flex items-center gap-4">
        <label className="w-24 text-base font-medium text-gray-700 text-left">성별</label>
        <select name="gender" value={formData.gender} onChange={handleChange} className="flex-1 p-2.5 border rounded-md">
          <option value="">선택</option>
          <option value="MALE">남성</option>
          <option value="FEMALE">여성</option>
        </select>
      </div>

      <div className="flex items-start gap-4">
        <label className="w-24 text-base font-medium text-gray-700 text-left pt-2">이메일</label>
        <div className="flex flex-1 gap-2">
          <input type="text" name="userEmailId" value={formData.userEmailId || ""} onChange={handleChange} className="w-1/2 h-[42px] p-2.5 border rounded-md" placeholder="이메일 ID" required />
          <span className="pt-2">@</span>
          {formData.userEmailDomain === "직접 입력" ? (
            <input type="text" value={emailDomainInput} onChange={(e) => setEmailDomainInput(e.target.value)} className="w-1/2 h-[42px] p-2.5 border rounded-md" placeholder="도메인 입력" required />
          ) : (
            <select name="userEmailDomain" value={formData.userEmailDomain} onChange={handleChange} className="w-1/2 h-[42px] p-2.5 border rounded-md">
              <option value="">선택</option>
              {emailDomains.map((domain) => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
          )}
          <button type="button" onClick={checkUserEmail} className="w-24 text-sm px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 whitespace-nowrap">중복확인</button>
        </div>
      </div>

      {!isEmailValid && formData.userEmailId && (
        <p className="text-sm text-red-500">올바른 이메일 형식이 아닙니다.</p>
      )}
      
     
        <div className="flex justify-between items-center mt-10">
          {/* 가운데: 취소 + 확인 */}
          <div className="flex gap-4 mx-auto">
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2 border border-purple-400 text-purple-600 rounded-md hover:bg-purple-50"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              확인
            </button>
          </div>
        </div>

      
      {message && <p className="text-sm mt-2 text-center text-green-600">{message}</p>}
    </form>
    {/* 오른쪽: 회원 탈퇴 */}
    <div className="ml-auto">
      <WithdrawButton />
    </div>
      <AlertModal
      isOpen={isModalOpen}
      message={modalMessage}
      onClose={() => setIsModalOpen(false)}
    />
    </>
  );
};

export default UserInfoForm;
