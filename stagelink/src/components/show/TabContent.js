import React from "react";

const mockShowDetail = {
  description: "뮤지컬 위키드는 1900년에 발표된 소설 오즈의 마법사를 재해석한 작품으로, ...",
  styImgs: ["/images/image1.jpg", "/images/image2.jpg", "/images/image3.jpg"],
};
const mockCasts = [
  { id: 1, name: "홍길동", role: "엘파바 역", image: "/images/actor1.jpg" },
  { id: 2, name: "김영희", role: "글린다 역", image: "/images/actor2.jpg" },
  // ...
];
const mockReviews = [
  { id: 1, title: "최고의 공연이었어요!", preview: "무대와 연출이 정말 인상 깊었습니다.", postId: 101 },
  { id: 2, title: "배우들 연기가 좋았어요", preview: "특히 엘파바 배우의 연기력은 최고!", postId: 102 },
];

const TabContent = ({ tab = "info", showId }) => {
  return (
    <div className="text-sm"> {/* 전체 기본 폰트 text-base→text-sm */}
      <div className="flex space-x-4 border-b mb-4">
        <a
          href={`?tab=info`}
          className={`pb-1 font-semibold ${
            tab === "info" ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-500"
          }`}
        >
          공연정보
        </a>
        <a
          href={`?tab=cast`}
          className={`pb-1 font-semibold ${
            tab === "cast" ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-500"
          }`}
        >
          출연진
        </a>
        <a
          href={`?tab=review`}
          className={`pb-1 font-semibold ${
            tab === "review" ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-500"
          }`}
        >
          후기
        </a>
      </div>
      {(!tab || tab === "info") && (
        <div className="text-gray-700">
          <h3 className="text-base font-bold mb-1">공연 상세 정보</h3>
          <p className="mb-2">{mockShowDetail.description}</p>
          <div className="space-y-2">
            {mockShowDetail.styImgs.map((src, idx) => (
              <img key={idx} src={src} alt={`공연 이미지 ${idx + 1}`} className="w-full rounded" />
            ))}
          </div>
        </div>
      )}
      {tab === "cast" && (
        <div className="text-gray-700">
          <h3 className="text-base font-bold mb-2">출연진</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {mockCasts.map((cast) => (
              <a
                key={cast.id}
                href={`/actors/${cast.id}`}
                className="text-center hover:shadow-md rounded-lg p-1 transition block"
              >
                <img
                  src={cast.image}
                  alt={cast.name}
                  className="w-16 h-16 object-cover rounded-full mx-auto mb-1"
                />
                <div className="font-semibold text-sm">{cast.name}</div>
                <div className="text-xs text-gray-500">{cast.role}</div>
              </a>
            ))}
          </div>
        </div>
      )}
      {tab === "review" && (
        <div className="text-gray-700 space-y-2">
          <h3 className="text-base font-bold mb-1">관람 후기</h3>
          {mockReviews.map((review) => (
            <a
              key={review.id}
              href={`/community/post/${review.postId}`}
              className="block border rounded p-2 hover:bg-gray-50"
            >
              <h4 className="font-semibold text-purple-700 text-sm">{review.title}</h4>
              <p className="text-xs text-gray-600">{review.preview}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default TabContent;
