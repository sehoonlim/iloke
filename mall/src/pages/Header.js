import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// 공통 css, js
import '../css/reset.css';
import '../css/fonts.css';
import '../css/default.css';
import '../js/default.js';
import '../js/sub.js';
import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!sessionStorage.getItem("userName") || !!sessionStorage.getItem("nickname")
  );
  const [username, setUsername] = useState(
    sessionStorage.getItem("userName") || sessionStorage.getItem("nickname") || ""
  );
  const [cartItemCount, setCartItemCount] = useState(
    parseInt(sessionStorage.getItem("cartItemCount")) || 0
  );
  // storage 이벤트를 감지해 로그인 상태 업데이트
  useEffect(() => {
    const handleStorageChange = () => {
      // ✅ 로그인 정보 업데이트
      const storedUserName = sessionStorage.getItem("userName");
      const storedNickname = sessionStorage.getItem("nickname");
      setIsLoggedIn(!!storedUserName || !!storedNickname);
      setUsername(storedUserName || storedNickname || "");
  
      // ✅ 장바구니 개수 업데이트 (즉시 반영)
    const cartCount = parseInt(sessionStorage.getItem("cartItemCount") || "0", 10);
    setCartItemCount(cartCount);
    };
  
    window.addEventListener("storage", handleStorageChange);
  
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
    setUsername('');

    // storage 이벤트 수동 발생
    window.dispatchEvent(new Event('storage'));

    alert('로그아웃 되었습니다.');
    window.location.href = '/';
  };

  return (
    <header className="on">
      <div className="header-wrap">
        <ul className="head-right">
          <li>
            {isLoggedIn ? (
              <span id="welcomeMessage">{username}님, 환영합니다.</span>
            ) : (
              <Link to="/joinMethod" >
                {/* id="join" */}
                회원가입
              </Link>
            )}
          </li>
          <li>
            {isLoggedIn ? (
              <Link to="#"  onClick={handleLogout}>
                {/* id="logout" */}
                로그아웃
              </Link>
            ) : (
              <Link to="/login"  
              // id="loginYn"
>
                로그인
              </Link>
            )}
          </li>
        </ul>
        <div className="gnb-wrap">
          <Link to="/" className="header-logo">
            <img src={`http://localhost:5500/content/img/main/logo.png`} alt="ILOKE logo" />
          </Link>
          <div className="gnb">
            <ul>
              <li>
                <Link to="/goods/goodsList">전체상품</Link>
                <ol>
                  <li>
                    <Link to="/goods/goodsList">전체보기</Link>
                  </li>
                  <li>
                    <Link to="/goods/goodsList">거실가구</Link>
                  </li>
                  <li>
                    <Link to="/goods/goodsList">침실가구</Link>
                  </li>
                  <li>
                    <Link to="/goods/goodsList">주방가구</Link>
                  </li>
                  <li>
                    <Link to="/goods/goodsList">사무가구</Link>
                  </li>
                  <li>
                    <Link to="/goods/goodsList">수납가구</Link>
                  </li>
                </ol>
              </li>
              <li>
                <Link to="/notice/customer_review">고객후기</Link>
                <ol>
                  <li>
                    <Link to="/notice/customer_review">전체후기</Link>
                  </li>
                  <li>
                    <Link to="/notice/photoReview">포토후기</Link>
                  </li>
                </ol>
              </li>
              <li>
                <Link to="/notice/notice_page">고객센터</Link>
                <ol>
                  <li>
                    <Link to="/notice/notice_page">공지사항</Link>
                  </li>
                  <li>
                    <Link to="/notice/itemInquery">상품문의</Link>
                  </li>
                  <li>
                    <Link to="/notice/faq">FAQ</Link>
                  </li>
                  <li>
                    <Link to="/notice/one_inquery">1:1문의</Link>
                  </li>
                  <li>
                    <Link to="/notice/showRoomInfo">지점</Link>
                  </li>
                </ol>
              </li>
            </ul>
          </div>
          <div className="gnb-side">
            <ul>
              <li className="shop">
                <Link to="/cart">
                  <i className="fa-solid fa-cart-shopping"></i>
                  <span>{cartItemCount}</span>
                </Link>
              </li>
              <li>
                {/* ✅ 기존 <Link> 유지하며 replace 속성 추가 */}
                <Link to="/goods/myPage"  >
                {/* 
                 로딩이 덜컹거리거나 insertbefore,removechild 오류의 원인
                <Link to="/goods/myPage" className="nav-user" >
                소거법 형식으로 오류잡는 모습이 인상적
                */}

                  <i className="fa-solid fa-user-large"></i>
                </Link>
              </li>
              <li>
                <a href="#" className="mbl_btn">
                  <span></span>
                  <span></span>
                  <span></span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;