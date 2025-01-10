import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import pageFunction from "../hooks/pageFunction"; // useContent 훅 임포트
import LoginHome from "../pages/LoginHome"; // LoginHome 임포트
import styles from '../admin.module.scss'

function HomePage(props) {
  const navigate = useNavigate(); // 경로 변경을 위한 useNavigate 훅
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(false); // 로그인 상태 관리
  // useContent 훅을 사용하여 경로에 맞는 콘텐츠를 가져옴
  const content = pageFunction(location.pathname);
  const menuItems = [
    // { label: '관리자 페이지 홈', path: '/' },
    { label: '게시판 등록 관리', path: '/board/registration' },
    { label: '게시판 답변 관리', path: '/board/answer' },
    { label: '프로모션 관리', path: '/board/promotion' },
    { label: '회원정보 관리', path: '/member' },
    { label: '상품목록', path: '/products' },
    { label: '상품등록', path: '/products/add' },
    { label: '옵션관리', path: '/option' },
    { label: '상세정보키워드 관리', path: '/keyword' },
    { label: '주문관리', path: '/order' },
    { label: '환불관리', path: '/refund' },
    { label: '정산관리', path: '/settle' },
    { label: '집에가고싶다', path: '/iwantgohome' },
  ]


  useEffect(() => {
    const auth = sessionStorage.getItem("auth"); // 세션 스토리지에서 로그인 상태 확인
    if (auth === "true") {
      setLoggedIn(true); // 로그인 상태면 관리자 페이지로
    } else {
      setLoggedIn(false); // 로그인되지 않으면 LoginHome으로 리디렉션
      navigate("/"); // 로그인되지 않으면 로그인 화면으로 리디렉션
    }
  }, [navigate]);

  //메뉴 클릭 시 이동
  const handleMenuClick = (path) => {
    navigate(path); // 해당 경로로 이동
  }

  // 로그아웃 처리 함수
  const handleLogout = () => {
    //sessionStorage.removeItem('auth');  // 세션 스토리지에서 로그인 상태 제거
    //sessionStorage.removeItem('user')
    sessionStorage.clear(); // 세션 전체 초기화
    alert("로그아웃 성공");

    setLoggedIn(false); // 로그인 상태 변경
    navigate("/"); // 로그인 페이지로 리디렉션
  };
  // 로그인되지 않은 상태에서는 로그인 화면만 보여주기
  if (!loggedIn) {
    return <LoginHome setAuth={setLoggedIn} />;
  }

  return (
    <div className={styles.admin_wrap}>
      <nav>
        {/* <h1>이로케 관리자 페이지</h1> */}
        {/* URL을 /home 과 /boards로 변경 */}
        {/* <button onClick={() => navigate("/board/admin")}>관리자게시판관리</button> */}
          <ul>
          <li onClick={() => navigate('/')} className={styles.home}><i className="fa-solid fa-house"></i></li>
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`menu-item ${location.pathname === item.path ? `${styles.active}` : ''}`}
              onClick={() => handleMenuClick(item.path)}
            >
              {item.label}
            </li>
          ))}
            <li onClick={handleLogout}>로그아웃</li>
          </ul>
      </nav>
      {/* 현재 경로에 맞는 콘텐츠를 렌더링 */}
      <div className={styles.admin_content}>{content}</div>
    </div>
  );
}

export default HomePage;
