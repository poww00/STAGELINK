// src/pages/home/SectionFilter.js
import React, { useState } from "react";

const SectionFilter = ({ selected, onChange }) => {
  const [activeTab, setActiveTab] = useState(selected || "top20");
  const [genderState, setGenderState] = useState(null);
  const [ageIndex, setAgeIndex] = useState(null);

  const ageGroups = ["10대", "20대", "30대", "40대", "50대", "60대 이상"];

  const handleTabClick = (value) => {
    if (value === "gender") {
      if (activeTab === "gender") {
        const next = genderState === "MALE" ? "FEMALE" : "MALE";
        setGenderState(next);
        onChange && onChange(value + ":" + next);
      } else {
        setGenderState("MALE");
        setAgeIndex(null);
        setActiveTab("gender");
        onChange && onChange(value + ":MALE");
      }
    } else if (value === "age") {
      if (activeTab === "age") {
        const nextIndex = ageIndex === null ? 0 : (ageIndex + 1) % ageGroups.length;
        setAgeIndex(nextIndex);
        onChange && onChange(value + ":" + ageGroups[nextIndex]);
      } else {
        setAgeIndex(0);
        setGenderState(null);
        setActiveTab("age");
        onChange && onChange(value + ":" + ageGroups[0]);
      }
    } else {
      setActiveTab("top20");
      setGenderState(null);
      setAgeIndex(null);
      onChange && onChange("top20");
    }
  };

  const renderLabel = (value) => {
    if (value === "top20") return "예매율";
    if (value === "gender") return activeTab === "gender" ? (genderState === "MALE" ? "남성" : "여성") : "성별";
    if (value === "age") return activeTab === "age" && ageIndex !== null ? ageGroups[ageIndex] : "연령별";
    return value;
  };

  return (
    <div className="flex justify-center space-x-4 my-16">
      {["top20", "gender", "age"].map((value) => (
        <button
          key={value}
          onClick={() => handleTabClick(value)}
          className={`w-40 py-2 rounded-full font-semibold border transition
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
