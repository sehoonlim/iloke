import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OAuthRedirect = () => {
  const navigate = useNavigate();

  // 환경 변수로 API 키 및 Redirect URI 설정
  const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;
  const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
  const TOKEN_API_URL = "https://kauth.kakao.com/oauth/token";

  useEffect(() => {
    // URL에서 인증 코드 추출
    const code = new URL(window.location.href).searchParams.get("code");
    if (code) {
        console.log("인증 코드: ", code)
      getAccessToken(code); // 액세스 토큰 요청
    }
  }, []);

  // 액세스 토큰 요청
  const getAccessToken = async (code) => {
    try {
      const response = await axios.post(
        TOKEN_API_URL,
        null, // POST 요청의 body는 비우기
        {
          params: {
            grant_type: "authorization_code",
            client_id: process.env.REACT_APP_KAKAO_REST_API_KEY, // 환경 변수로부터 API 키 사용
            redirect_uri: process.env.REACT_APP_REDIRECT_URI, // 환경 변수로부터 Redirect URI 사용
            code: code,
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      console.log('엑세스 토큰 응답:',response.data);
      const { access_token } = response.data;

      // 액세스 토큰으로 사용자 정보 가져오기
      const userInfo = await getUserInfo(access_token);

      // 사용자 정보 세션 스토리지에 저장
      sessionStorage.setItem("userId", userInfo.id);
      sessionStorage.setItem("userName", userInfo.properties.nickname);

      alert(`${userInfo.properties.nickname}님, 카카오 로그인 성공!`);
      navigate("/home"); // 홈 페이지로 이동
    } catch (error) {
      console.error("카카오 로그인 처리 중 오류 발생:", error);
      alert("로그인에 실패했습니다. 다시 시도해주세요.");
      navigate("/login"); // 로그인 페이지로 이동
    }
  };

  // 사용자 정보 요청
  const getUserInfo = async (accessToken) => {
    try {
      const response = await axios.get("https://kapi.kakao.com/v2/user/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      console.log("사용자 정보:", response.data);  // 사용자 정보 확인
      const { id, properties } = response.data;
      
      // 사용자 정보를 세션에 저장
      sessionStorage.setItem("userId", id);
      sessionStorage.setItem("userName", properties.nickname);
  
      // 로그인 성공 후 홈으로 이동
      alert(`${properties.nickname}님, 카카오 로그인 성공!`);
      navigate("/home");  // 홈 페이지로 이동
    } catch (error) {
      console.error("사용자 정보 요청 실패:", error.response);
      alert("사용자 정보를 불러오는 데 실패했습니다.");
      navigate("/login");  // 로그인 페이지로 이동
    }
  };

  return <div>카카오 로그인 처리 중...</div>;
};

export default OAuthRedirect;