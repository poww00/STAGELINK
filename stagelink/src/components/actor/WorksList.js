import React, { useEffect, useState } from "react";
import axios from "axios";

/**
 * 출연작 리스트 컴포넌트 (스토리보드 20p)
 *
 * @param {number}  actorId   배우의 고유 ID (API 호출용)
 * @param {Array}   works     (선택) 상위 컴포넌트에서 내려주는 출연작 배열
 */
const WorksList = ({ actorId, works = [] }) => {
  // 상태 정의: 출연작 데이터, 로딩 여부, 에러 메시지
  const [items, setItems] = useState(works);
  const [loading, setLoading] = useState(!works.length); // works 없으면 로딩 시작
  const [error, setError] = useState(null);

  /* 출연작 데이터를 API로 불러오기 */
  useEffect(() => {
    // 상위에서 works props로 받았으면 API 호출 생략
    if (works.length > 0) return;

    // actorId가 없으면 에러 처리
    if (!actorId) {
      setError("actorId가 없습니다.");
      return;
    }

    let live = true; // 언마운트 방지용 플래그
    const fetch = async () => {
      try {
        setLoading(true); // 로딩 시작
        const res = await axios.get(`/api/actors/${actorId}/works`);
        if (live) {
          setItems(res.data); // 데이터 저장
          setError(null);     // 에러 초기화
        }
      } catch (e) {
        console.error(e);
        if (live) setError("출연작 데이터를 불러오지 못했습니다.");
      } finally {
        if (live) setLoading(false); // 로딩 종료
      }
    };
    fetch();

    // cleanup 함수: 컴포넌트 언마운트 시 API 응답 무시
    return () => { live = false; };
  }, [actorId, works]);

  /* 상태별 UI 렌더링 */
  if (loading) return <p className="py-4 text-center animate-pulse">불러오는 중…</p>;
  if (error) return <p className="py-4 text-center text-red-500">{error}</p>;
  if (!items.length) return <p className="py-4 text-center text-gray-500">등록된 출연작이 없습니다.</p>;

  // 출연작 리스트 렌더링
  return (
    <div className="space-y-6">
      {items.map(show => (
        <div
          key={show.showInfoId}
          className="flex bg-white rounded-2xl shadow p-4 items-center"
        >
          {/* 포스터 이미지 */}
          <img
            src={show.poster || "/images/default_poster.jpg"}
            alt={show.title}
            className="w-24 h-32 rounded-md object-cover border border-gray-300 mr-6 flex-shrink-0"
          />
          {/* 공연 정보 영역 */}
          <div className="flex flex-col justify-between">
            <div className="font-bold text-lg mb-1">{show.title}</div>
            {/* 공연장 이름  */}
            {show.theater && (
              <div className="text-sm text-gray-600 mb-1">{show.theater}</div>
            )}
            {/* 공연 기간 */}
            <div className="text-xs text-gray-500 mb-1">
              {show.startDate} ~ {show.endDate}
            </div>
            {/* 배역 정보 (있을 경우에만 출력) */}
            {show.roleName && (
              <div className="text-xs text-blue-500 font-semibold">
                배역: {show.roleName}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorksList;
