import React from 'react';
import { useNavigate } from 'react-router-dom';

const PostCard = ({ post, index }) => {
  const navigate = useNavigate();

  let formattedDate = '날짜 없음';
  if (post.postRegisterDate) {
    const parsedDate = new Date(post.postRegisterDate);
    if (!isNaN(parsedDate.getTime())) {
      formattedDate = parsedDate.toISOString().split('T')[0];
    }
  }

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

  const handleClick = () => {
    navigate(`/community/posts/${post.postNo}`);
  };

  return (
    <div
      className="grid grid-cols-12 py-3 min-h-[56px] items-center border-b text-sm text-center cursor-pointer hover:bg-blue-50 transition"
      onClick={handleClick}
    >
      <div className="col-span-1">{index + 1}</div>
      <div className="col-span-5 text-left pl-2 text-gray-900">{post.postTitle}</div>
      <div className="col-span-2">{renderStars(post.postRating)}</div>
      <div className="col-span-2">{post.nickname}</div>
      <div className="col-span-2">{formattedDate}</div>
    </div>
  );
};

export default PostCard;
