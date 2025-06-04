import React from "react";

/**
 * 배우 프로필 카드 컴포넌트
 * @param {Object} actor - 배우 정보 객체 (이름, 프로필, 이미지 등 포함)
 */
const ProfileCard = ({ actor }) => {
  // 배우 정보가 없으면 아무것도 렌더링하지 않음
  if (!actor) return null;

  return (
    // 카드 형태로 배우 정보를 출력 
    <div className="flex flex-col items-center bg-white rounded-2xl shadow p-6 mb-8">
      {/* 배우 이미지 출력 (없으면 기본 이미지 사용), 원형 형태 */}
      <img
        src={actor.actorImage || "/images/default_actor.png"}
        alt={actor.actorName}
        className="w-36 h-36 rounded-full border-2 border-purple-400 mb-4 object-cover"
      />
      {/* 배우 이름 출력 */}
      <h2 className="text-2xl font-bold text-purple-700">{actor.actorName}</h2>

      {/* 배우 프로필 설명 출력 (HTML 허용, 줄바꿈 포함) */}
      {actor.actorProfile && (
        <div
          className="mt-2 text-gray-700 text-center whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: actor.actorProfile }}
        />
      )}
    </div>
  );
};

export default ProfileCard;
