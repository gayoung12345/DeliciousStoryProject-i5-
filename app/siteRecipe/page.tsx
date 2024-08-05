import Image from "next/image";

const siteRecipe = () => {
  return (
    <main>
      
      <header>헤더</header>

      <div>
        <h1>레시피 페이지</h1>

        <table>
          <tr>
            <a href="#"><td>
              <Image src="/svg/next.svg" />
              <div><p>레시피 이름</p></div>
            </td></a>
            <a href="#"><td>
              <Image src="/svg/next.svg" />
              <div><p>레시피 이름</p></div>
            </td></a>
            <a href="#"><td>
              <Image src="/svg/next.svg" />
              <div><p>레시피 이름</p></div>
            </td></a>
            <a href="#"><td>
              <Image src="/svg/next.svg" />
              <div><p>레시피 이름</p></div>
            </td></a>
          </tr>
          <tr>
            <a href="#"><td>
              <Image src="/svg/next.svg" />
              <div><p>레시피 이름</p></div>
            </td></a>
            <a href="#"><td>
              <Image src="/svg/next.svg" />
              <div><p>레시피 이름</p></div>
            </td></a>
            <a href="#"><td>
              <Image src="/svg/next.svg" />
              <div><p>레시피 이름</p></div>
            </td></a>
            <a href="#"><td>
              <Image src="/svg/next.svg" />
              <div><p>레시피 이름</p></div>
            </td></a>
          </tr>
          <tr>
            <a href="#"><td>
              <Image src="/svg/next.svg" />
              <div><p>레시피 이름</p></div>
            </td></a>
            <a href="#"><td>
              <Image src="/svg/next.svg" />
              <div><p>레시피 이름</p></div>
            </td></a>
            <a href="#"><td>
              <Image src="/svg/next.svg" />
              <div><p>레시피 이름</p></div>
            </td></a>
            <a href="#"><td>
              <Image src="/svg/next.svg" />
              <div><p>레시피 이름</p></div>
            </td></a>
          </tr>
        </table>
      </div>

      <div> 페이지 숫자 1/2/3/4/5 ... </div>

      <div>
        <input type="search" /> <button type="submit" value="검색"></button>
      </div>


      <footer>푸터</footer>


    </main>
  );
};

export default siteRecipe;
