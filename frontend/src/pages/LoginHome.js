import { useState } from "react";
import { loginAdmin } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./member/LoginHome.css";

function LoginHome({ setAuth }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await loginAdmin({ userId, password });
    // 서버 응답 확인
    if (response.data.success) {
      sessionStorage.setItem("user", userId);
      sessionStorage.setItem("auth", "true");
      sessionStorage.setItem("role", response.data.role); // 역할 저장
      alert("로그인 성공! 환영합니다, " + userId + "님!");
      setAuth(true);
      navigate("/"); // 홈 페이지로 이동
    } else {
      alert(response.data.message); // 실패 메시지 표시
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h1>이로케 관리자 로그인</h1>
        <input
          type="text"
          placeholder="아이디"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>로그인</button>
      </div>
    </div>
  );
}

export default LoginHome;
