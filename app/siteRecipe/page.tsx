import Image from 'next/image';
import React from 'react';

const photos = [
  //예시 이미지
  { id: 1, name: '사진 1', image: '/svg/vercel.svg' },
  { id: 2, name: '사진 2', image: '/svg/vercel.svg' },
  { id: 3, name: '사진 3', image: '/svg/vercel.svg' },
  { id: 4, name: '사진 4', image: '/svg/vercel.svg' },
  { id: 5, name: '사진 5', image: '/svg/vercel.svg' },
  { id: 6, name: '사진 6', image: '/svg/vercel.svg' },
  { id: 7, name: '사진 7', image: '/svg/vercel.svg' },
  { id: 8, name: '사진 8', image: '/svg/vercel.svg' },
  { id: 9, name: '사진 9', image: '/svg/vercel.svg' },
  { id: 10, name: '사진 10', image: '/svg/vercel.svg' },
];

const siteRecipe = () => {
  return (
    <div className="recipe-container" style={{ margin: 20 }}>
      <p style={{ margin: 20, fontSize: 14 }}>레시피 페이지</p>
      <div className="photo-grid" style={{ display: "flex", flexWrap: "wrap", width: 1200 }}>
        {photos.length > 0 ? (
          photos.map((photo) => (
            <div key={photo.id} className="photo-card" style={{ margin: 10, border: "1px solid #ddd",
              borderRadius: "5px",
              marginBottom: "10px",
              padding: "10px", }}>
              <Image src={photo.image} alt={photo.name} width={250} height={250} />
              <p style={{ margin: 5, fontSize: 14 }}>{photo.name}</p>
            </div>
          ))
        ) : (
          <p style={{ margin: 20, fontSize: 14 }}>레시피가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default siteRecipe;