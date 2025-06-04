// src/components/show/TabContent.js
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const TabContent = ({ showId }) => {
  /* 현재 탭 */
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") ?? "info";

  /* 데이터 state */
  const [detail, setDetail] = useState(null);
  const [casts, setCasts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* 데이터 로딩 */
  useEffect(() => {
    let live = true;
    const load = async () => {
      try {
        setLoading(true);
       
        const [dRes, cRes, rRes] = await Promise.all([
          axios.get(`/api/showinfo/${showId}/detail`),
          axios.get(`/api/showinfo/${showId}/casts`),
          axios.get(`/api/showinfo/${showId}/reviews`, { params: { size: 10 } })
        ]);
        if (!live) return;
        setDetail(dRes.data);
        setCasts(cRes.data);
        setReviews(rRes.data);
        setError(null);
      } catch (err) {
        console.error(err);
        if (live) setError("데이터를 불러오지 못했습니다.");
      } finally {
        if (live) setLoading(false);
      }
    };
    load();
    return () => { live = false; };
  }, [showId]);

  /* 로딩 / 오류 */
  if (loading) return <p className="py-8 text-center animate-pulse">불러오는 중…</p>;
  if (error) return <p className="py-8 text-center text-red-500">{error}</p>;

  return (
    <div className="text-sm">
      {/* 탭 헤더 */}
      <div className="flex space-x-4 border-b mb-4">
        {["info", "cast", "review"].map(t => (
          <a key={t} href={`?tab=${t}`}
             className={`pb-1 font-semibold ${tab === t
               ? "text-purple-600 border-b-2 border-purple-600"
               : "text-gray-500"}`}>
            {t === "info" ? "공연정보" : t === "cast" ? "출연진" : "후기"}
          </a>
        ))}
      </div>

      {/* ─ 공연 정보 ─ */}
      {tab === "info" && detail && (
        <section className="text-gray-700">
          <h3 className="font-bold mb-2 text-base">공연 상세 정보</h3>
          <p className="mb-2 whitespace-pre-line">{detail.description}</p>
          <div className="space-y-2">
            {detail.styleImgs.map((src, i) => (
              <img key={i} src={src} alt={`공연 이미지 ${i + 1}`} className="w-full rounded" />
            ))}
          </div>
        </section>
      )}

      {/* ─ 출연진 ─ */}
      {tab === "cast" && (
        <section className="text-gray-700">
          <h3 className="font-bold mb-2 text-base">출연진</h3>
          {casts.length === 0 ? (
            <p className="text-sm text-gray-400">등록된 출연진 정보가 없습니다.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {casts.map(c => (
                <a key={c.id} href={`/actors/${c.id}`}
                   className="block text-center hover:shadow-md rounded-lg p-1 transition">
                  <img src={c.image} alt={c.name}
                       className="w-16 h-16 object-cover rounded-full mx-auto mb-1" />
                  <div className="font-semibold text-sm">{c.name}</div>
                  <div className="text-xs text-gray-500">{c.role}</div>
                </a>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ─ 후기 ─ */}
      {tab === "review" && (
        <section className="text-gray-700">
          <h3 className="font-bold mb-1 text-base">관람 후기</h3>
          {reviews.length === 0 ? (
            <p className="text-sm text-gray-400">아직 후기가 없습니다.</p>
          ) : (
            <div className="space-y-2">
              {reviews.map(r => (
                <a key={r.id} href={`/community/posts/${r.postId}`}
                   className="block border rounded p-2 hover:bg-gray-50">
                  <h4 className="font-semibold text-purple-700 text-sm">{r.title}</h4>
                  <p className="text-xs text-gray-600">{r.preview}</p>
                </a>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default TabContent;
