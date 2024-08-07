import { StyleSheet, Text } from "react-native";

const myPage = () => {
  return (
    <main>
      <div style={styles.head}>
        <p>회원정보 확인/수정하기</p>
      </div>

      <div style={styles.container}>
        <div>
          이름 :{" "}
        <input
          type="text"
          autoFocus
          placeholder="아이디"
          size={10}
          maxLength={4}
        />
        </div>
        <div>
          아이디 :{" "}
        <input
          type="text"
          autoFocus
          placeholder="아이디"
          size={10}
          maxLength={4}
        />
        </div>
        <div>
          비밀번호 : <input type="password" />
        </div>
        <div>
          비밀번호 확인 : <input type="password" />
        </div>
        <div>
          이메일 : <input type="email" value="test@naver.com" required />
        </div>
        <div>
          <input type="submit" value="수정하기" />
        </div>
      </div>
    </main>
  );
};

const styles = StyleSheet.create({
  head: {
    height: 200,
    marginTop: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 32,
  },
  container: {
    width: 500,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#383838',
  },
});

export default myPage;
