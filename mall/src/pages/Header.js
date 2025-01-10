import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

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
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem('userName') || !!sessionStorage.getItem('nickname'));
  const [username, setUsername] = useState(sessionStorage.getItem('userName') || sessionStorage.getItem('nickname') || '');
  const navigate = useNavigate();

  // storage 이벤트를 감지해 로그인 상태 업데이트
  useEffect(() => {
    const handleStorageChange = () => {
      const storedUserName = sessionStorage.getItem('userName');
      const storedNickname = sessionStorage.getItem('nickname');
      setIsLoggedIn(!!storedUserName || !!storedNickname);
      setUsername(storedUserName || storedNickname || '');
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
    setUsername('');

    // storage 이벤트 수동 발생
    window.dispatchEvent(new Event('storage'));

    alert('로그아웃 되었습니다.');
    //navigate('/'); // 메인 페이지로 이동
    window.location.href = '/';
  };
  // console.log(process.env.REACT_APP_BACK_URL)

  return (
    <header className="on">
      <div className="header-wrap">
        <ul className="head-right">
          <li>
            {isLoggedIn ? (
              <span id="welcomeMessage">{username}님, 환영합니다.</span>
            ) : (
              <Link to="/joinMethod" id="join">
                회원가입
              </Link>
            )}
          </li>
          <li>
            {isLoggedIn ? (
              <Link to="#" id="logout" onClick={handleLogout}>
                로그아웃
              </Link>
            ) : (
              <Link to="/login" id="loginYn">
                로그인
              </Link>
            )}
          </li>
        </ul>
        <div className="gnb-wrap">
          <Link to="/" className="header-logo">
          {/* 이미지 경로 재설정해야함 */}
          <img src={`http://localhost:5500/content/img/main/logo.png`} alt="ILOKE logo" />
            {/* <img src="./content/img/main/logo.png" alt="ILOKE logo" /> */}
          </Link>
          <div className="gnb">
            <ul>
              {/* <li>
                <Link to="/brand/intro">브랜드</Link>
                <ol>
                  <li>
                    <Link to="/brand/intro">브랜드 소개</Link>
                  </li>
                  <li>
                    <Link to="/brand/showRoomInfo">쇼룸 안내</Link>
                  </li>
                </ol>
              </li> */}
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
              {/* <li>
                <Link to="/promotion/online_mall">프로모션</Link>
                <ol>
                  <li>
                    <Link to="/promotion/online_mall">온라인 공식몰</Link>
                  </li>
                  <li>
                    <Link to="/promotion/offline_showroom">오프라인 쇼룸</Link>
                  </li>
                </ol>
              </li> */}
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
              <li>
                {/* <Link to="/search" className="nav-search">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </Link> */}
              </li>
              <li className="shop">
                <Link to="/cart">
                  <i className="fa-solid fa-cart-shopping"></i>
                  <span>0</span>
                </Link>
              </li>
              <li>
                <Link to="/goods/myPage" className="nav-user">
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
