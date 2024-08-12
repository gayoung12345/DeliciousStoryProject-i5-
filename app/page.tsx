'use client';

import Image from "next/image";
import { useState } from "react";


const slides = [
  { id: 1, image: '/png/mainA.png' },
  { id: 2, image: '/png/mainB.png' },
  { id: 3, image: '/png/mainC.png' },
  { id: 4, image: '/png/mainD.png' }, // 수정: id가 중복되지 않도록 변경
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? slides.length - 1 : prevSlide - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  
  return (
    <main>
<div style={{ 
  position: 'relative', 
  width: '100%', 
  height: '100vh', // 뷰포트 높이에 맞춤
  overflow: 'hidden' 
}}>
  <div
    style={{
      display: 'flex',
      transition: 'transform 0.5s ease',
      transform: `translateX(-${currentSlide * 100}%)`,
      height: '100%', // 슬라이드 높이를 부모와 동일하게
    }}
  >
    {slides.map((slide) => (
      <div key={slide.id} style={{ minWidth: '100%', height: '100%', position: 'relative' }}>
        <Image
          src={slide.image}
          alt={`Slide ${slide.id}`}
          layout="fill" // 전체 공간을 채우도록 설정
          objectFit="cover" // 이미지 비율 유지
        />
      </div>
    ))}
  </div>

  <button
    onClick={prevSlide}
    style={{
      position: 'absolute',
      top: '50%',
      left: '10px',
      transform: 'translateY(-50%)',
      zIndex: 1,
      width: '80px',
      height: '80px',
      backgroundColor: 'rgba(255, 255, 255, 0.7)', // 배경색
      border: 'none', // 테두리 없애기
      borderRadius: '50%', // 원형으로 만들기
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '36px', // 화살표 크기 조정
    }}
  >
    &#10094; {/* Left arrow */}
  </button>

  <button
    onClick={nextSlide}
    style={{
      position: 'absolute',
      top: '50%',
      right: '10px',
      transform: 'translateY(-50%)',
      zIndex: 1,
      width: '80px',
      height: '80px',
      backgroundColor: 'rgba(255, 255, 255, 0.7)', // 배경색
      border: 'none', // 테두리 없애기
      borderRadius: '50%', // 원형으로 만들기
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '36px', // 화살표 크기 조정
    }}
  >
    &#10095; {/* Right arrow */}
  </button>

  {/* 페이지네이션 점 또는 원 추가 */}
  <div style={{ 
    position: 'absolute', 
    bottom: '20px', // 슬라이드 위에 올리기 위해 아래쪽에 위치
    left: '50%', // 중앙 정렬
    transform: 'translateX(-50%)', 
    display: 'flex', 
    justifyContent: 'center', 
    zIndex: 1 // 다른 요소 위에 보이게 하기
  }}>
    {slides.map((_, index) => (
      <div
        key={index}
        onClick={() => goToSlide(index)} // 클릭 시 해당 슬라이드로 이동
        style={{
          width: '15px',
          height: '15px',
          margin: '0 5px',
          borderRadius: '50%', // 동그라미로 설정
          backgroundColor: currentSlide === index ? 'black' : 'lightgray', // 현재 슬라이드에 따라 색상 변경
          cursor: 'pointer',
          transition: 'background-color 0.3s', // 부드러운 색상 변화
        }}
      />
    ))}
  </div>
</div>


      {/* 나중에 수정 */}
      <div>
        {/* 레시피1 */}
        <div style={{ width: '100%', backgroundColor: 'white', padding: '20px 0' }}>
          <div style={{ maxWidth: '1400px', height: 'max-content', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', margin: '50px', fontSize: '30px', fontWeight: 'bold',textDecoration: 'underline',textUnderlineOffset: '10px', }}>
              레시피1
            </h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
              {['A', 'B', 'C', 'D'].map((letter, index) => (
                <div key={index} style={{ textAlign: 'center', margin: '10px' }}>
                  <div style={{ position: 'relative', width: '250px', height: '250px', overflow: 'hidden' }}>
                    <Image
                      src={`/png/main${letter}.png`} // 이미지 경로
                      alt={`Image ${letter}`}
                      layout="fill"
                      objectFit="cover"
                      style={{borderRadius:'10px'}}
                    />
                  </div>
                  <p>Image {letter}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 레시피2 */}
        <div style={{ width: '100%', backgroundColor: '#BDBDBD', padding: '20px 0' }}>
          <div style={{ maxWidth: '1400px', height: 'max-content', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', margin: '50px', fontSize: '30px', fontWeight: 'bold',textDecoration: 'underline',textUnderlineOffset: '10px', }}>
              레시피2
            </h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
              {['A', 'B', 'C', 'D'].map((letter, index) => (
                <div key={index} style={{ textAlign: 'center', margin: '10px' }}>
                  <div style={{ position: 'relative', width: '250px', height: '250px', overflow: 'hidden' }}>
                    <Image
                      src={`/png/main${letter}.png`} // 이미지 경로
                      alt={`Image ${letter}`}
                      layout="fill"
                      objectFit="cover"
                      style={{borderRadius:'10px'}}
                    />
                  </div>
                  <p>Image {letter}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 텍스트 및 버튼 영역 */}
        <div style={{ position: 'relative', zIndex: 1, padding: '20px 0', textAlign: 'center', color: 'black', marginTop: '50px', marginBottom:'50px' }}>
          <h1 style={{ fontSize: '40px', fontWeight: 'bold' }}>텍스트텍스트텍스트</h1>
          <br />
          <p style={{ fontSize: '20px' }}>레시피 관련한 문구나 간단한 이미지 같은 거</p>
          <br />
          <button style={{
            border: '1px solid gray',
            borderRadius: '5px',
            backgroundColor: 'white', 
            color: 'black',
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.1s',
          }}
          onMouseEnter={e => e.target.style.backgroundColor = '#e0e0e0'} 
          onMouseLeave={e => e.target.style.backgroundColor = 'white'}>
            자세히 보기
          </button>
        </div>

        {/* 레시피3 */}
        <div style={{ width: '100%', backgroundColor: '#BDBDBD', padding: '20px 0' }}>
          <div style={{ maxWidth: '1400px', height: 'max-content', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', margin: '50px', fontSize: '30px', fontWeight: 'bold',textDecoration: 'underline',textUnderlineOffset: '10px', }}>
              레시피3
            </h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
              {['A', 'B', 'C', 'D'].map((letter, index) => (
                <div key={index} style={{ textAlign: 'center', margin: '10px' }}>
                  <div style={{ position: 'relative', width: '250px', height: '250px', overflow: 'hidden' }}>
                    <Image
                      src={`/png/main${letter}.png`} // 이미지 경로
                      alt={`Image ${letter}`}
                      layout="fill"
                      objectFit="cover"
                      style={{borderRadius:'10px'}}
                    />
                  </div>
                  <p>Image {letter}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

{/* 자유게시판 인기글 영역 */}
<div style={{ backgroundColor: 'white', padding: '1.5rem', textAlign: 'center' }}>
    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem',textDecoration: 'underline',textUnderlineOffset: '10px', }}>자유게시판 인기글</h1>
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        {/* Post Card 1 */}
        <div style={{ border: '1px solid #BDBDBD', borderRadius: '0.5rem', padding: '0.8rem', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.3rem', textAlign: 'left', borderBottom: '2px solid #BDBDBD', paddingBottom: '3px' }}>글 제목 1</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ color: '#4A5568', marginBottom: '0.8rem', flex: '1', textAlign: 'left', fontSize: '0.9rem' }}>글 내용</p>
                <a href='#' style={{ color: '#3182CE', textDecoration: 'underline', marginLeft: '0.5rem', fontSize: '0.9rem' }}>자세히 보기</a>
            </div>
        </div>
        {/* Post Card 2 */}
        <div style={{ border: '1px solid #BDBDBD', borderRadius: '0.5rem', padding: '0.8rem', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.3rem', textAlign: 'left', borderBottom: '2px solid #BDBDBD', paddingBottom: '3px' }}>글 제목 2</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ color: '#4A5568', marginBottom: '0.8rem', flex: '1', textAlign: 'left', fontSize: '0.9rem' }}>글 내용</p>
                <a href='#' style={{ color: '#3182CE', textDecoration: 'underline', marginLeft: '0.5rem', fontSize: '0.9rem' }}>자세히 보기</a>
            </div>
        </div>
    </div>

    {/* 제목만 보이는 영역 */}
    <div style={{ marginTop: '1.5rem', textAlign: 'left', padding: '1rem', maxWidth: '1200px', margin: '1rem auto', border: '1px solid #BDBDBD', borderRadius: '0.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', textAlign: 'center',textDecoration: 'underline',textUnderlineOffset: '10px', }}>인기글 목록</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div>
                <h3 style={{ fontSize: '1rem', color: '#4A5568', marginBottom: '0.5rem' }}>글 제목 3</h3>
                <hr style={{ border: '1px solid #A0AEC0', margin: '0.5rem 0' }} /> {/* 얇고 글씨 색상과 동일한 줄 */}
                <h3 style={{ fontSize: '1rem', color: '#4A5568', marginBottom: '0.5rem' }}>글 제목 4</h3>
                <hr style={{ border: '1px solid #A0AEC0', margin: '0.5rem 0' }} />
                <h3 style={{ fontSize: '1rem', color: '#4A5568', marginBottom: '0.5rem' }}>글 제목 5</h3>
                <hr style={{ border: '1px solid #A0AEC0', margin: '0.5rem 0' }} />
                <h3 style={{ fontSize: '1rem', color: '#4A5568', marginBottom: '0.5rem' }}>글 제목 6</h3>
                <hr style={{ border: '1px solid #A0AEC0', margin: '0.5rem 0' }} />
                <h3 style={{ fontSize: '1rem', color: '#4A5568', marginBottom: '0.5rem' }}>글 제목 7</h3>
            </div>
            <div>
                <h3 style={{ fontSize: '1rem', color: '#4A5568', marginBottom: '0.5rem' }}>글 제목 8</h3>
                <hr style={{ border: '1px solid #A0AEC0', margin: '0.5rem 0' }} />
                <h3 style={{ fontSize: '1rem', color: '#4A5568', marginBottom: '0.5rem' }}>글 제목 9</h3>
                <hr style={{ border: '1px solid #A0AEC0', margin: '0.5rem 0' }} />
                <h3 style={{ fontSize: '1rem', color: '#4A5568', marginBottom: '0.5rem' }}>글 제목 10</h3>
                <hr style={{ border: '1px solid #A0AEC0', margin: '0.5rem 0' }} />
                <h3 style={{ fontSize: '1rem', color: '#4A5568', marginBottom: '0.5rem' }}>글 제목 11</h3>
                <hr style={{ border: '1px solid #A0AEC0', margin: '0.5rem 0' }} />
                <h3 style={{ fontSize: '1rem', color: '#4A5568', marginBottom: '0.5rem' }}>글 제목 12</h3>
            </div>
        </div>
    </div>
</div>





<div style={{ width: '100%', backgroundColor: '#BDBDBD', padding: '20px 0' }}>
{/* 텍스트 및 버튼 영역2 */}
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, marginTop: '50px', marginBottom: '50px' }}>
  {/* 왼쪽 이미지 */}
  <div style={{ width: '300px', height: '300px', marginRight: '70px', position: 'relative' }}>
    <Image
      src="/png/mainA.png" // 이미지 경로
      alt="Description"
      layout="fill"
      objectFit="cover"
      style={{ borderRadius: '10px' }}
    />
  </div>

  {/* 오른쪽 텍스트 및 버튼 영역 */}
  <div style={{ textAlign: 'left', color: 'black', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
    <h1 style={{ fontSize: '40px', fontWeight: 'bold' }}>텍스트텍스트텍스트</h1><br />
    <p style={{ fontSize: '20px' }}>레시피 관련한 문구나 간단한 이미지 같은 거</p><br />
    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
      <button style={{
        border: '1px solid black',
        borderRadius: '5px',
        backgroundColor: '#BDBDBD', 
        color: 'black',
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.1s',
      }}
      onMouseEnter={e => e.target.style.backgroundColor = 'white'} 
      onMouseLeave={e => e.target.style.backgroundColor = '#BDBDBD'}>
        자세히 보기
      </button>
    </div>
  </div>
</div>
</div>





</div>


{/* 배경 영역 */}
<div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
  {/* 고정한 이미지 영역 */}
  <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, opacity: 0.5 }}>
    <Image
      src="/png/mainE.png" // 고정될 이미지 경로
      alt="Background"
      layout="fill"
      objectFit="cover"
    />
  </div>
</div>


    </main>
  );
}