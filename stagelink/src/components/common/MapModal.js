// src/components/MapModal.js
import React, { useEffect } from "react";

// 📍 지도 모달 컴포넌트
// props:
// - address: 지도에서 검색할 주소
// - onClose: 모달 닫기 핸들러
const MapModal = ({ address, onClose }) => {
  useEffect(() => {
    const container = document.getElementById("map");

    // 💡 kakao 객체나 container가 없으면 지도 초기화 중단
    if (!window.kakao || !window.kakao.maps || !container) return;

    // ✅ 카카오 지도 SDK가 로드되면 지도 초기화
    window.kakao.maps.load(() => {
      // 기본 위치: 서울 중심 좌표
      const map = new window.kakao.maps.Map(container, {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780),
        level: 3, // 확대 레벨
      });

      // 🧭 주소를 좌표로 변환 (Geocoder 사용)
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(address, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
          map.setCenter(coords); // 지도 중심 이동
          new window.kakao.maps.Marker({ map, position: coords }); // 마커 표시
        }
      });

      // ➕ 줌 컨트롤 추가 (우측 하단)
      const zoomControl = new window.kakao.maps.ZoomControl();
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);
    });
  }, [address]);

  return (
    // 🌑 모달 배경 (화면 전체 덮기)
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      {/* 🗺️ 모달 본체 */}
      <div className="bg-white p-4 rounded-lg w-[500px] h-[460px] relative">
        {/* ✖️ 닫기 버튼 */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>

        {/* 📌 주소 텍스트 */}
        <div className="text-sm font-medium text-center mb-2 text-gray-800">
          {address}
        </div>

        {/* 🗺️ 실제 지도가 들어갈 영역 */}
        <div id="map" className="w-full h-[400px] rounded" />
      </div>
    </div>
  );
};

export default MapModal;

