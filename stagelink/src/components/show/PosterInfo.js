import React, { useState } from "react";
import MapModal from "../common/MapModal";

const PosterInfo = ({ show }) => {
  const [mapOpen, setMapOpen] = useState(false);
  const addr = show.locationAddress || "";
  const rating = show.rating || 0;
  const full = Math.floor(rating), half = rating - full >= .5 ? 1 : 0;

  /* ★ max-w 로 폭 제한, ml-auto 로 왼쪽 정렬 */
  return (
    <div className="my-6 flex max-w-[680px] flex-row items-start gap-8 text-base">
      {/* 포스터 */}
      <img
        src={show.poster}
        alt={show.name}
        onError={e => (e.target.src = "/images/default-poster.png")}
        className="h-[260px] w-[180px] rounded-lg border object-cover shadow"
      />

      {/* 정보 */}
      <div className="mt-2 flex flex-1 flex-col gap-1">
        <h1 className="mb-2 text-xl font-bold text-gray-800">{show.name}</h1>

        <p className="text-sm text-gray-600">
          장소:&nbsp;
          {show.locationName && addr ? (
            <span
              onClick={() => setMapOpen(true)}
              className="cursor-pointer underline text-blue-600"
            >
              {show.locationName}
            </span>
          ) : (
            <span className="text-gray-400">(등록되지 않음)</span>
          )}
        </p>

        <p className="text-sm text-gray-600">
          공연 기간: {show.periodStart || "-"} ~ {show.periodEnd || "-"}
        </p>
        <p className="text-sm text-gray-600">관람 연령: {show.age}세 이상 관람 가능</p>

        {/* 가격 */}
        <div className="mt-2 border-t pt-2">
          <span className="text-xs">💰 가격 정보</span>
          <div className="mt-1 flex gap-4">
            {["VIP","R","S","A"].map(g => (
              <span key={g} className="text-xs text-gray-700">
                {g}석: {show[`seat${g}`]?.toLocaleString() ?? "-"}원
              </span>
            ))}
          </div>
        </div>

        {/* 별점 */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg text-yellow-500">
            {"★".repeat(full)}
            {half ? "☆" : ""}
            {"☆".repeat(5 - full - half)}
          </span>
          <span className="ml-2 text-xs text-gray-600">({rating.toFixed(1)})</span>
        </div>
      </div>

      {mapOpen && <MapModal address={addr} onClose={() => setMapOpen(false)} />}
    </div>
  );
};

export default PosterInfo;
