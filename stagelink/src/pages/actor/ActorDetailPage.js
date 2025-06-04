import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import WorksList from "../../components/actor/WorksList";

/**
 * ActorDetailPage
 * - 배우 상세 페이지
 * - 배우 이미지, 이름, 탭(출연작/정보) 구성
 * - /api/actors/:id 로 배우 정보 fetch
 */
const ActorDetailPage = () => {
  const { id } = useParams();               // URL에서 배우 ID 추출 (/actors/:id)
  const navigate = useNavigate();           // 페이지 이동용
  const [actor, setActor] = useState(null); // 배우 상세 정보
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [tab, setTab] = useState("works");  // 현재 선택된 탭 (기본: 출연작)

  /* 배우 상세 데이터 fetch */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/actors/${id}`);
        if (!res.ok) throw new Error("배우 정보를 불러올 수 없습니다.");
        setActor(await res.json());
      } catch (e) {
        alert(e.message);
        navigate(-1); // 실패 시 이전 페이지로
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  /* 렌더링 시작 */
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow w-full px-0 py-10">
        {/* 로딩 중 메시지 */}
        {loading ? (
          <p className="text-center text-purple-400">로딩 중…</p>
        ) : actor ? (
          <div className="w-full px-28">
            {/* ── 프로필 영역 ── */}
            <div className="flex items-center mb-8 gap-8">
              <img
                src={actor.actorImage || "/images/default_actor.png"}
                alt={actor.actorName}
                className="w-36 h-36 rounded-full border-2 border-purple-400 object-cover"
              />
              <div>
                <h2 className="text-3xl font-bold">{actor.actorName}</h2>
                <p className="text-lg text-gray-500 mt-2">뮤지컬 배우</p>
              </div>
            </div>

            {/* ── 탭 버튼 영역 ── */}
            <div className="relative w-full mb-8">
              <div className="flex space-x-8">
                {["works", "info"].map(t => (
                  <button
                    key={t}
                    className={`px-6 py-2 font-semibold transition ${
                      tab === t
                        ? "text-purple-700 border-b-2 border-purple-700"
                        : "text-gray-400"
                    }`}
                    onClick={() => setTab(t)}
                  >
                    {t === "works" ? "출연작" : "정보"}
                  </button>
                ))}
              </div>
              {/* 하단 라인 */}
              <div className="absolute left-0 right-0 bottom-0 h-0.5 bg-gray-200" />
            </div>

            {/* ── 탭 컨텐츠 영역 ── */}
            {tab === "works" && (
              <WorksList
                actorId={actor.actorNo}       // actorId 넘겨 self-fetch 가능하게
                works={actor.shows || []}     // 서버에서 받은 출연작 배열 직접 전달
              />
            )}

            {tab === "info" && (
              <div className="bg-white rounded-2xl shadow p-6 mt-4 w-full min-h-[140px]">
                <div
                  className="text-gray-700 whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: actor.actorProfile || "" }}
                />
              </div>
            )}
          </div>
        ) : (
          // 배우 정보 없음 (404 또는 에러 발생 시)
          <p className="text-center text-red-500">배우 정보를 찾을 수 없습니다.</p>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ActorDetailPage;
