// src/pages/home/SectionFilter.js
import React, { useState } from "react";

const SectionFilter = ({ selected, onChange }) => {
  // 현재 활성화된 필터 탭 (top20, gender, age)
  const [activeTab, setActiveTab] = useState(selected || "top20");
  // 성별 필터 상태 ("MALE" 또는 "FEMALE")
  const [genderState, setGenderState] = useState(null);
  // 연령대 인덱스 (0~5)
  const [ageIndex, setAgeIndex] = useState(null);

  // 연령대 라벨 배열
  const ageGroups = ["10대", "20대", "30대", "40대", "50대", "60대 이상"];

  // 필터 버튼 클릭 시 실행되는 핸들러
  const handleTabClick = (value) => {
    if (value === "gender") {
      if (activeTab === "gender") {
        // 성별 필터 클릭 시 남/여 토글
        const next = genderState === "MALE" ? "FEMALE" : "MALE";
        setGenderState(next);
        onChange && onChange(value + ":" + next);
      } else {
        // 처음 성별 탭 클릭 시 기본값 남성
        setGenderState("MALE");
        setAgeIndex(null);
        setActiveTab("gender");
        onChange && onChange(value + ":MALE");
      }
    } else if (value === "age") {
      if (activeTab === "age") {
        // 연령대 필터 클릭 시 다음 연령대로 순환
        const nextIndex = ageIndex === null ? 0 : (ageIndex + 1) % ageGroups.length;
        setAgeIndex(nextIndex);
        onChange && onChange(value + ":" + ageGroups[nextIndex]);
      } else {
        // 처음 연령대 탭 클릭 시 10대부터 시작
        setAgeIndex(0);
        setGenderState(null);
        setActiveTab("age");
        onChange && onChange(value + ":" + ageGroups[0]);
      }
    } else {
      // top20 탭 클릭 시 초기화
      setActiveTab("top20");
      setGenderState(null);
      setAgeIndex(null);
      onChange && onChange("top20");
    }
  };

  // 버튼에 표시할 라벨 생성
  const renderLabel = (value) => {
    if (value === "top20") return "예매율";
    if (value === "gender")
      return activeTab === "gender" ? (genderState === "MALE" ? "남성" : "여성") : "성별";
    if (value === "age")
      return activeTab === "age" && ageIndex !== null ? ageGroups[ageIndex] : "연령별";
    return value;
  };

  return (
    // 버튼 3개를 수평으로 나열
    <div className="flex justify-center space-x-4 my-16">
      {["top20", "gender", "age"].map((value) => (
        <button
          key={value}
          onClick={() => handleTabClick(value)}
          className={`w-40 py-1.5 text-xs rounded-full font-semibold border transition
            ${activeTab === value
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-600 border-gray-300 hover:bg-blue-50"}`}
        >
          {renderLabel(value)}
        </button>

      ))}
    </div>
  );
};

export default SectionFilter;
