import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import WorksList from "../../components/actor/WorksList";

const ActorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [actor, setActor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("works"); // 기본 탭: 출연작

  useEffect(() => {
    const fetchActor = async () => {
      try {
        const res = await fetch(`/api/actors/${id}`);
        if (!res.ok) throw new Error("배우 정보를 불러올 수 없습니다.");
        const data = await res.json();
        setActor(data);
      } catch (e) {
        alert(e.message);
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchActor();
  }, [id, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow w-full px-0 py-10">
        {loading ? (
            <div className="text-center text-purple-400">로딩 중...</div>
        ) : actor ? (
            <div className="w-full px-28"> {/* 양쪽 끝 px-28로 대칭 */}
            {/* 상단 프로필 */}
            <div className="flex items-center mb-8 gap-8">
                <img
                src={actor.actorImage || "/images/default_actor.png"}
                alt={actor.actorName}
                className="w-36 h-36 rounded-full border-2 border-purple-400 object-cover"
                />
                <div className="flex flex-col justify-center items-start">
                <h2 className="text-3xl font-bold text-gray-900">{actor.actorName}</h2>
                <div className="text-lg text-gray-500 mt-2">뮤지컬 배우</div>
                </div>
            </div>
            {/* 탭 버튼 + 밑줄 */}
            <div className="relative w-full mb-8">
                <div className="flex space-x-8">
                <button
                    className={`px-6 py-2 font-semibold transition ${
                    tab === "works"
                        ? "text-purple-700 border-b-2 border-purple-700"
                        : "text-gray-400"
                    }`}
                    onClick={() => setTab("works")}
                >
                    출연작
                </button>
                <button
                    className={`px-6 py-2 font-semibold transition ${
                    tab === "info"
                        ? "text-purple-700 border-b-2 border-purple-700"
                        : "text-gray-400"
                    }`}
                    onClick={() => setTab("info")}
                >
                    정보
                </button>
                </div>
                <div className="absolute left-0 right-0 bottom-0 h-0.5 bg-gray-200 z-0" />
            </div>
            {/* 탭 컨텐츠 */}
            <div>
                {tab === "works" && (
                <div className="w-full">
                    <WorksList works={actor.showList || []} />
                </div>
                )}
                {tab === "info" && (
                <div className="bg-white rounded-2xl shadow p-6 mt-4 w-full min-h-[140px]">
                    <div
                    className="text-gray-700 whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: actor.actorProfile }}
                    />
                </div>
                )}
            </div>
            </div>
        ) : (
            <div className="text-center text-red-500">배우 정보를 찾을 수 없습니다.</div>
        )}
        </main>

      <Footer />
    </div>
  );
};

export default ActorDetailPage;
