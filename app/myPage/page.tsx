const myPage = () => {
  return (
    <main>
      <div>
        <p>회원정보 확인/수정</p>
        <p>보람</p>
        이름 : <input type="text" autofocus placeholder="아이디" size={10} maxlength="4" /><br />
        아이디 : <input type="text" autofocus placeholder="아이디" size="10" maxlength="4" /><br />
        비밀번호 : <input type="password" /><br />
        비밀번호 확인 : <input type="password" /><br />
        이메일 : <input type="email" value="test@naver.com" required /><br />
        <input type="submit" value="수정하기" />
      </div>
    </main>
  );
};

export default myPage;
