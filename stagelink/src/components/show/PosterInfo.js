// src/components/show/PosterInfo.js
import React, { useEffect, useState } from "react";
import MapModal from "../common/MapModal";
import axios from "axios";

/**
 * 공연 상세 상단 포스터 및 기본 정보 컴포넌트
 * @param {Object} show - 공연 정보(포스터, 공연명, 장소, 가격 등)
 */
const PosterInfo = ({ show }) => {
  // 지도 모달 열림 여부
  const [mapOpen, setMapOpen] = useState(false);
  // 공연장 주소 상태
  const [address, setAddress] = useState("");

  // 공연장 주소 정보 불러오기
  useEffect(() => {
    if (show && show.locationId) {
      axios
        .get(`/api/showlocation/${show.locationId}`)
        .then((res) => setAddress(res.data.address))
        .catch(() => setAddress(null));
    }
  }, [show]);

  return (
    <div className="flex flex-col lg:flex-row items-center gap-6 my-6 text-base">
      {/* === 1. 포스터 이미지 === */}
      <img
        src={show.poster}
        alt={show.title}
        className="w-[208px] h-[288px] object-cover rounded-lg shadow-lg"
      />

      {/* === 2. 공연 정보 영역 === */}
      <div className="flex-1 space-y-2">
        {/* 공연명 */}
        <h1 className="text-xl font-bold text-gray-800">{show.title}</h1>

        {/* 장소(지도 모달) */}
        <p className="text-gray-600 text-sm">
          장소:{" "}
          {address ? (
            <span
              className="text-blue-600 underline cursor-pointer"
              onClick={() => setMapOpen(true)}
            >
              {show.locationName}
            </span>
          ) : (
            <span className="text-gray-500">(등록되지 않음)</span>
          )}
        </p>

        {/* 공연 기간 */}
        <p className="text-gray-600 text-sm">
          공연 기간: {show.startDate} ~ {show.endDate}
        </p>

        {/* 관람 연령 */}
        <p className="text-gray-600 text-sm">
          관람 연령: {show.ageLimit}세 이상 관람 가능
        </p>

        {/* 가격 정보 */}
        <div className="border-t pt-2 mt-2 space-y-0.5">
          <p className="text-xs">💰 가격 정보</p>
          <p className="text-xs text-gray-700">
            VIP석: {show.seatVipPrice?.toLocaleString()}원
          </p>
          <p className="text-xs text-gray-700">
            R석: {show.seatRPrice?.toLocaleString()}원
          </p>
          <p className="text-xs text-gray-700">
            S석: {show.seatSPrice?.toLocaleString()}원
          </p>
        </div>

        {/* 평점 */}
        <div className="mt-2">
          <p className="text-yellow-500 text-base">
            {/* 별점 UI */}
            {"★".repeat(Math.floor(show.rating))}
            {"☆".repeat(5 - Math.floor(show.rating))}
            <span className="text-gray-600 text-xs ml-2">
              ({show.rating?.toFixed(1)})
            </span>
          </p>
        </div>
      </div>

      {/* === 3. 지도 모달 === */}
      {mapOpen && <MapModal address={address} onClose={() => setMapOpen(false)} />}
    </div>
  );
};

export default PosterInfo;
