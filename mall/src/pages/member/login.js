import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { memLogin } from '../../services/api';
import KakaoLoginButton from './KakaoLoginButton';
import styles from './login.module.scss';
import axios from 'axios';

const Login = () => {
  const [id, setPid] = useState('');
  const [pw, setPassword] = useState('');
  const navigate = useNavigate();

  // 카카오 로그인 후처리
  const handleKakaoLoginCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      try {
        // 카카오 액세스 토큰 요청
        const tokenResponse = await axios.post(
          'https://kauth.kakao.com/oauth/token',
          null,
          {
            params: {
              grant_type: 'authorization_code',
              client_id: process.env.REACT_APP_KAKAO_REST_API_KEY,
              redirect_uri: process.env.REACT_APP_REDIRECT_URI,
              code,
            },
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );

        const accessToken = tokenResponse.data.access_token;

        // 카카오 사용자 정보 요청
        const userResponse = await axios.get(
          'https://kapi.kakao.com/v2/user/me',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        

        const kakaoAccount = userResponse.data.kakao_account;
        const kakaoId = userResponse.data.id;

        // 기존 사용자 정보와 매칭 시도
        const response = await axios.post(`${process.env.REACT_APP_BACK_URL}/api/login/kakao`, {
          kakaoId,
          email: kakaoAccount.email,
        });

        if (response.data.success) {
          // 로그인 성공: 세션 스토리지에 저장
          sessionStorage.setItem('userId', response.data.user.id);
          sessionStorage.setItem('userName', response.data.user.name);
          sessionStorage.setItem('auth', 'true');
          window.dispatchEvent(new Event('storage'));
          alert(`${response.data.user.name}님, 환영합니다!`);
          navigate('/home');
        } else {
          // 매칭 실패: 신규 회원 등록 절차
          if (window.confirm('카카오 계정과 연동된 회원 정보가 없습니다. 새 계정을 생성하시겠습니까?')) {
            const registerResponse = await axios.post(`${process.env.REACT_APP_BACK_URL}/api/register/kakao`, {
              kakaoId,
              email: kakaoAccount.email,
              nickname: kakaoAccount.profile.nickname,
            });

            if (registerResponse.data.success) {
              alert('회원가입이 완료되었습니다. 로그인 중입니다...');
  
              // 회원가입 성공 후 자동 로그인 요청
              const loginResponse = await axios.post(`${process.env.REACT_APP_BACK_URL}/api/login/kakao`, {
                kakaoId,
                email: kakaoAccount.email,
              });
  
              if (loginResponse.data.success) {
                sessionStorage.setItem('userId', loginResponse.data.user.id);
                sessionStorage.setItem('userName', loginResponse.data.user.name);
                sessionStorage.setItem('auth', 'true');
                window.dispatchEvent(new Event('storage'));
                alert(`${loginResponse.data.user.name}님, 환영합니다!`);
                navigate('/home');
              } else {
                alert('로그인에 실패했습니다.');
              }
            } else {
              alert('회원가입에 실패했습니다.');
            }
          }
        }
      } catch (error) {
        console.error('카카오 로그인 중 오류:', error);
        alert('카카오 로그인에 실패했습니다. 다시 시도해 주세요.');
      }
    }
  };

  useEffect(() => {
    handleKakaoLoginCallback(); // 카카오 로그인 콜백 처리
  }, []);

  useEffect(() => {
    if (window.location.pathname === '/KakaoLogin') {
      handleKakaoLoginCallback();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await memLogin(id, pw);

      if (response.data.success) {
        const userName = response.data.user.name;
        sessionStorage.setItem('userId', id);
        sessionStorage.setItem('userName', userName);
        sessionStorage.setItem('userType', 'member'); // 사용자 유형 저장
        sessionStorage.setItem('auth', 'true');
        window.dispatchEvent(new Event('storage'));
        alert(`${userName}님, 환영합니다!`);
        navigate('/home');
      } else {
        alert(response.data.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      alert('로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <section className={styles.loginSection}>
      <div className={styles.loginContainer}>
        <div className={styles.loginTitle}>회원 로그인</div>
        <form id="login-form" onSubmit={handleLogin}>
          <input
            type="text"
            className={styles.inputLogin}
            id="pid"
            placeholder="아이디"
            required
            value={id}
            onChange={(e) => setPid(e.target.value)}
          />
          <input
            type="password"
            id="password"
            placeholder="비밀번호"
            required
            value={pw}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input type="submit" className={styles.btnLogin} value="로그인" />
        </form>

        <div className={styles.linkButtons}>
          <Link to="/joinMethod" className={`${styles.linkButton} ${styles.active}`}>
            회원가입
          </Link>
          <Link to="/findId" className={styles.linkButton}>
            아이디 찾기
          </Link>
          <Link to="/findPw" className={styles.linkButton}>
            비밀번호 찾기
          </Link>
        </div>

        <hr />

        <div className={styles.snsLoginSection}>
          <div className={styles.snsLoginTitle}>SNS 간편 로그인</div>
          <KakaoLoginButton />
        </div>
      </div>
    </section>
  );
};

export default Login;
