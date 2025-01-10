import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Home from '../pages/home/Home';
import MyPage from '../pages/order/MyPage';
import Cart from '../pages/order/Cart';
import Order from '../pages/order/Order';
import OrderEnd from '../pages/order/OrderEnd';
import Login from '../pages/member/login';
import Join from '../pages/member/join';
import JoinMethod from '../pages/member/join_method';
import JoinAgreement from '../pages/member/join_agreement';
import Join_fin from '../pages/member/join_fin';
import FindId from '../pages/member/find_id';
import FindId2 from '../pages/member/find_id2';
import FindPw from '../pages/member/find_pw';
import FindPwReset from '../pages/member/find_pw_reset';
import FindPwComplete from '../pages/member/find_pw_complete';
import MemDelete from '../pages/member/memDelete';
import GoodsList from '../pages/goods/GoodsList';
import GoodsDetail from '../pages/goods/GoodsDetail';
import MemModify1 from '../pages/member/memModify1';
import MemModify2 from '../pages/member/memModify2';
import CustomerReview from '../pages/notice/CustomerReview';
import NoticePage from '../pages/notice/NoticePage';
import PhotoReview from '../pages/notice/PhotoReview';
import ShowRoomInfo from '../pages/order/ShowRoomInfo.js';
import ItemInquery from '../pages/notice/ItemInquery';
import Faq from '../pages/notice/Faq';
import OneInquery from '../pages/notice/OneInquery';
import ItemWrite from '../pages/notice/ItemWrite';
import BoardDetails from '../pages/notice/BoardDetails';

import OAuthRedirect from '../pages/member/OAuthRedirect';
import KakaoLogin from '../pages/member/KakaoLogin';
import ItemDetail from '../pages/notice/ItemDetail'; // 추가된 컴포넌트
import KakaoAuth from '../pages/member/KakaoAuth';
export function useContent() {
    const [content, setContent] = useState(<Home />);
    const location = useLocation(); // 현재 경로 가져오기

    useEffect(() => {
        const path = location.pathname;

        if (!path || path === "/" || path === "/home") {
            setContent(<Home />);
        } else if (path === "/goods/myPage") {
            setContent(<MyPage />);
        } else if (path === "/cart") {
            setContent(<Cart />);
        } else if (path === "/order") {
            setContent(<Order />);
        } else if (path === "/login") {
            setContent(<Login />);
        }
        else if (path === "/KakaoLogin") {
            setContent(<KakaoLogin />); // Redirect URI와 KakaoLogin 컴포넌트 매핑
        }
        else if(path === '/KakaoAuth'){
            setContent(<KakaoAuth/>);
        }
        else if (path === "/oauth"){
            setContent(<OAuthRedirect />);
        }
        else if (path === "/join") {
            setContent(<Join />);
        } else if (path === "/joinMethod") {
            setContent(<JoinMethod />);
        } else if (path === "/joinAgreement") {
            setContent(<JoinAgreement />);
        } else if (path === "/joinFin") {
            setContent(<Join_fin />);
        } else if (path === "/findId") {
            setContent(<FindId />);
        } else if (path === "/findPw") {
            setContent(<FindPw />);
        } else if (path === "/findPwComplete") {
            setContent(<FindPwComplete />);
        } else if (path === "/memDelete") {
            setContent(<MemDelete />); // 회원탈퇴 페이지 경로 추가
        } else if (path === "/goods/goodsList") {
            setContent(<GoodsList />);
            // } else if (path === "/button") {
            //     setContent(<Button />);
        } else if (path === "/memModify1") {
            setContent(<MemModify1 />); // 회원정보수정 인증 페이지 경로 추가
        } else if (path === "/memModify2") {
            setContent(<MemModify2 />); // 회원정보수정 페이지 경로 추가
        }

        //         else if (path === "/goods/goodsList/goodsDetail") {
        //             setContent(<GoodsDetail />);
        // } 
        else if (path === "/notice/customer_review") {   // 전체후기
        } else if (path === "/notice/customer_review") {   // 전체후기
            setContent(<CustomerReview />);
        } else if (path === "/notice/photoReview") {   // 포토후기
            setContent(<PhotoReview />);
        } else if (path === "/notice/notice_page") {   // 공지사항
            setContent(<NoticePage />);
        } else if (path === "/notice/itemInquery") {   // 상품문의
            setContent(<ItemInquery />);
        } else if (path === "/notice/itemQueryDetail") {   // 상품문의 글 보기
            setContent(<BoardDetails />);
        } else if (path === "/notice/itemWrite") {   // 상품문의 - 글 쓰기 상세
            setContent(<ItemWrite />);
        } else if (path === "/notice/faq") {   // FAQ
            setContent(<Faq />);
        } else if (path === "/notice/one_inquery") {   // 1:1문의
            setContent(<OneInquery />);
        } else if (path === "/notice/showRoomInfo") {
            setContent(<ShowRoomInfo />); // 맵 페이지 추가
        }  else if (path === "/detail/:id") {   // 상세 페이지
            setContent(<ItemDetail />);
        }

        // 📢 /orderend/:order_id 경로 처리
        const matchOrderEnd = path.match(/^\/orderend\/(\d+)$/); // 🔥 order_id는 숫자로 제한
        if (matchOrderEnd) {
            const orderId = matchOrderEnd[1];
            setContent(<OrderEnd orderId={orderId} />); // 📢 orderId를 컴포넌트에 전달
        }

        // /findId2/:id 이동 처리
        const matchFindId2 = path.match(/^\/findId2\/([^/]+)$/);
        if (matchFindId2) {
            const id = matchFindId2[1];
            setContent(<FindId2 id={id} />);
        }

        // /findPwReset/:userId 이동 처리
        const matchFindPwReset = path.match(/^\/findPwReset\/([^/]+)$/);
        if (matchFindPwReset) {
            const userId = matchFindPwReset[1];
            setContent(<FindPwReset userId={userId} />);
        }

        // /goods/goodsList:id 이동 처리
        const matchGoodsDetail = path.match(/^\/goodsDetail\/([^/]+)$/);
        if (matchGoodsDetail) {
            const id = matchGoodsDetail[1];
            setContent(<GoodsDetail id={id} />);
        }

    }, [location.pathname]);

    return content;
}
