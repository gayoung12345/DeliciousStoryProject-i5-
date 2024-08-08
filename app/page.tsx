'use client';

import Image from "next/image";
import { useState } from "react";

const slides = [
  { id: 1, image: '/png/mainA.png' },
  { id: 2, image: '/png/mainB.png' },
  { id: 3, image: '/png/mainC.png' },
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

  return (
    <main>
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden', maxHeight: '800px' }}>
        <div
          style={{
            display: 'flex',
            transition: 'transform 0.5s ease',
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {slides.map((slide) => (
            <div key={slide.id} style={{ minWidth: '100%', maxHeight: '800px', overflow: 'hidden' }}>
              <Image
                src={slide.image}
                alt={`Slide ${slide.id}`}
                layout="responsive"
                width={1000}
                height={600}
                objectFit="cover"
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
            backgroundColor: 'rgba(255, 255, 255, 0.7)', // 배경색 (선택적)
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
            backgroundColor: 'rgba(255, 255, 255, 0.7)', // 배경색 (선택적)
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
      </div>

{/* 나중에 수정 */}
      <div>

        {/* 레시피1 */}
<div style={{ maxWidth: '1400px', height:'max-content', margin: '0 auto' }}>
<h1 style={{ textAlign: 'center', margin: '50px', fontSize: '30px', fontWeight: 'bold' }}>
  레시피1
</h1>
  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
    <div style={{ textAlign: 'center', margin: '10px' }}>
      <div style={{ position: 'relative', width: '250px', height: '250px', overflow: 'hidden' }}>
        <Image
          src="/png/mainA.png" // 이미지 경로
          alt="Image A"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <p>Image A</p>
    </div>
    <div style={{ textAlign: 'center', margin: '10px' }}>
      <div style={{ position: 'relative', width: '250px', height: '250px', overflow: 'hidden' }}>
        <Image
          src="/png/mainB.png" // 이미지 경로
          alt="Image B"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <p>Image B</p>
    </div>
    <div style={{ textAlign: 'center', margin: '10px' }}>
      <div style={{ position: 'relative', width: '250px', height: '250px', overflow: 'hidden' }}>
        <Image
          src="/png/mainC.png" // 이미지 경로
          alt="Image C"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <p>Image C</p>
    </div>
    <div style={{ textAlign: 'center', margin: '10px' }}>
      <div style={{ position: 'relative', width: '250px', height: '250px', overflow: 'hidden' }}>
        <Image
          src="/png/mainD.png" // 이미지 경로
          alt="Image D"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <p>Image D</p>
    </div>
  </div>
</div>

{/* 레시피2 */}
<div style={{ maxWidth: '1400px', height:'max-content', margin: '0 auto', backgroundColor:'#BDBDBD' }}>
<h1 style={{ textAlign: 'center', margin: '50px', fontSize: '30px', fontWeight: 'bold' }}>
  레시피2
</h1>
  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
    <div style={{ textAlign: 'center', margin: '10px' }}>
      <div style={{ position: 'relative', width: '250px', height: '250px', overflow: 'hidden' }}>
        <Image
          src="/png/mainA.png" // 이미지 경로
          alt="Image A"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <p>Image A</p>
    </div>
    <div style={{ textAlign: 'center', margin: '10px' }}>
      <div style={{ position: 'relative', width: '250px', height: '250px', overflow: 'hidden' }}>
        <Image
          src="/png/mainB.png" // 이미지 경로
          alt="Image B"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <p>Image B</p>
    </div>
    <div style={{ textAlign: 'center', margin: '10px' }}>
      <div style={{ position: 'relative', width: '250px', height: '250px', overflow: 'hidden' }}>
        <Image
          src="/png/mainC.png" // 이미지 경로
          alt="Image C"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <p>Image C</p>
    </div>
    <div style={{ textAlign: 'center', margin: '10px' }}>
      <div style={{ position: 'relative', width: '250px', height: '250px', overflow: 'hidden' }}>
        <Image
          src="/png/mainD.png" // 이미지 경로
          alt="Image D"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <p>Image D</p>
    </div>
  </div>
</div>

{/* 레시피3 */}
<div style={{ maxWidth: '1400px', height:'max-content', margin: '0 auto' }}>
<h1 style={{ textAlign: 'center', margin: '50px', fontSize: '30px', fontWeight: 'bold' }}>
  레시피3
</h1>
  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
    <div style={{ textAlign: 'center', margin: '10px' }}>
      <div style={{ position: 'relative', width: '250px', height: '250px', overflow: 'hidden' }}>
        <Image
          src="/png/mainA.png" // 이미지 경로
          alt="Image A"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <p>Image A</p>
    </div>
    <div style={{ textAlign: 'center', margin: '10px' }}>
      <div style={{ position: 'relative', width: '250px', height: '250px', overflow: 'hidden' }}>
        <Image
          src="/png/mainB.png" // 이미지 경로
          alt="Image B"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <p>Image B</p>
    </div>
    <div style={{ textAlign: 'center', margin: '10px' }}>
      <div style={{ position: 'relative', width: '250px', height: '250px', overflow: 'hidden' }}>
        <Image
          src="/png/mainC.png" // 이미지 경로
          alt="Image C"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <p>Image C</p>
    </div>
    <div style={{ textAlign: 'center', margin: '10px' }}>
      <div style={{ position: 'relative', width: '250px', height: '250px', overflow: 'hidden' }}>
        <Image
          src="/png/mainD.png" // 이미지 경로
          alt="Image D"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <p>Image D</p>
    </div>
  </div>
</div>

      </div>
    </main>
  );
}