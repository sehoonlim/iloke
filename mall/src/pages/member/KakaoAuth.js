import React, { useState } from 'react';
import axios from 'axios';

async function registerKakaoUser(kakaoId, email, nickname) {
  const url = `${process.env.REACT_APP_BACK_URL}/api/register/kakao`;
  const data = { kakaoId, email, nickname };

  try {
    const response = await axios.post(url, data);
    alert(response.data.message);
  } catch (error) {
    console.error('회원가입 에러:', error);
    alert('문제가 생겼어요.');
  }
}

async function loginKakaoUser(kakaoId) {
  const url = `${process.env.REACT_APP_BACK_URL}/api/login/kakao`;
  const data = { kakaoId };

  try {
    const response = await axios.post(url, data);
    alert(response.data.message);
  } catch (error) {
    console.error('로그인 에러:', error);
    alert('문제가 생겼어요.');
  }
}

function KakaoAuth() {
  const [kakaoId, setKakaoId] = useState('');
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');

  return (
    <div>
      <h1>카카오 인증</h1>
      <input
        type="text"
        placeholder="카카오 ID"
        value={kakaoId}
        onChange={(e) => setKakaoId(e.target.value)}
      />
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="닉네임"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <button onClick={() => registerKakaoUser(kakaoId, email, nickname)}>회원가입</button>
      <button onClick={() => loginKakaoUser(kakaoId)}>로그인</button>
    </div>
  );
}

export default KakaoAuth;
