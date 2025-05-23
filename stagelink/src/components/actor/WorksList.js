import React from "react";

/**
 * 출연작 리스트 (스토리보드 20p 형식)
 * @param {Array} works
 */
const WorksList = ({ works }) => {
  // 목데이터: 관리자 데이터가 없을 때 사용
  const mockWorks = [
    {
      showInfoId: 101,
      title: "위키드",
      poster: "/images/poster1.jpg",
      theater: "예술의전당",
      startDate: "2025-05-01",
      endDate: "2025-06-15",
      roleName: "글린다",
    },
    {
      showInfoId: 102,
      title: "레미제라블",
      poster: "/images/poster2.jpg",
      theater: "샤롯데씨어터",
      startDate: "2025-07-10",
      endDate: "2025-08-20",
      roleName: "장발장",
    },
    {
      showInfoId: 103,
      title: "구텐버그",
      poster: "/images/poster3.jpg",
      theater: "플러스씨어터",
      startDate: "2024-07-10",
      endDate: "2024-08-20",
      roleName: "조풍레",
    },
  ];

  const useWorks = works && works.length > 0 ? works : mockWorks;

  return (
    <div className="space-y-6">
      {useWorks.map((show) => (
        <div
          key={show.showInfoId}
          className="flex bg-white rounded-2xl shadow p-4 items-center"
        >
          {/* 왼쪽: 포스터 */}
          <img
            src={show.poster || "/images/default_poster.jpg"}
            alt={show.title}
            className="w-24 h-32 rounded-md object-cover border border-gray-300 mr-6 flex-shrink-0"
          />
          {/* 오른쪽: 공연 정보 */}
          <div className="flex flex-col justify-between">
            <div className="font-bold text-lg mb-1">{show.title}</div>
            <div className="text-sm text-gray-600 mb-1">{show.theater}</div>
            <div className="text-xs text-gray-500 mb-1">
              {show.startDate} ~ {show.endDate}
            </div>
            <div className="text-xs text-blue-500 font-semibold">{show.roleName && `배역: ${show.roleName}`}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorksList;
