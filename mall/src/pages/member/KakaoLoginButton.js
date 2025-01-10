import React from 'react';
import styles from './login.module.scss';

const KakaoLoginButton = () => {
  const REST_API_KEY = "4c0a1fd995d48357daf4967bf25d50cb";
  const REDIRECT_URI = "http://localhost:5500/KakaoLogin";

  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;

  const handleLogin = () => {
    window.location.href = kakaoAuthUrl;
  };

  return (
    <button onClick={handleLogin} className={styles.kakaobtn}>
      <img
        src="/content/img/main/kakao_login_medium_wide.png"
        alt="카카오로 로그인"
        style={{ cursor: 'pointer' }}
      />
    </button>
  );
};

export default KakaoLoginButton;
