import React from "react";

/**
 * 배우 프로필 카드
 * @param {Object} actor
 */
const ProfileCard = ({ actor }) => {
  if (!actor) return null;
  return (
    <div className="flex flex-col items-center bg-white rounded-2xl shadow p-6 mb-8">
      <img
        src={actor.actorImage || "/images/default_actor.png"}
        alt={actor.actorName}
        className="w-36 h-36 rounded-full border-2 border-purple-400 mb-4 object-cover"
      />
      <h2 className="text-2xl font-bold text-purple-700">{actor.actorName}</h2>
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
