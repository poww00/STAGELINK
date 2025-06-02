import React from 'react';
import { useNavigate } from 'react-router-dom';

const PostCard = ({ post, index }) => {
  const navigate = useNavigate();

  // 날짜 포맷을 YYYY-MM-DD로 가공
  let formattedDate = '날짜 없음';
  if (post.postRegisterDate) {
    const parsedDate = new Date(post.postRegisterDate);
    if (!isNaN(parsedDate.getTime())) {
      formattedDate = parsedDate.toISOString().split('T')[0];
    }
  }

  // 평점에 따라 별 아이콘 렌더링
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'text-yellow-400' : 'text-gray-300'}>
          ★
        </span>
      );
    }
    return stars;
  };

  // 클릭 시 상세 페이지로 이동
  const handleClick = () => {
    navigate(`/community/posts/${post.postNo}`);
  };

  return (
    // 게시글 카드 행 전체를 클릭 가능하게 함
    <div
      className="grid grid-cols-12 py-3 min-h-[56px] items-center border-b text-sm text-center cursor-pointer hover:bg-blue-50 transition"
      onClick={handleClick}
    >
      {/* 번호 */}
      <div className="col-span-1">{index + 1}</div>

      {/* 제목 - 왼쪽 정렬 */}
      <div className="col-span-5 text-left pl-2 text-gray-900">{post.postTitle}</div>

      {/* 별점 표시 */}
      <div className="col-span-2">{renderStars(post.postRating)}</div>

      {/* 작성자 닉네임 */}
      <div className="col-span-2">{post.nickname}</div>

      {/* 등록일자 */}
      <div className="col-span-2">{formattedDate}</div>
    </div>
  );
};

export default PostCard;
