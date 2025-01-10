import { useState, useEffect } from "react";
import BoardPage from "../pages/board/BoardPage"; // BoardPage 컴포넌트 임포트
import BoardPromotionPage from "../pages/board/BoardPromotionPage"; // Promotion 컴포넌트 임포트
import OptionPage from "../pages/products/OptionPage"; // OptionPage 컴포넌트 임포트
import MemberPage from "../pages/member/MemberPage"; // MemberPage 컴포넌트 임포트
//import MileagePage from '../pages/member/MileagePage';  // MileagePage 컴포넌트 임포트
import OrderPage from "../pages/order/OrderPage"; // OrderPage 컴포넌트 임포트
import SettlePage from "../pages/order/SettlePage"; // SettlePage 컴포넌트 임포트
import KeywordPage from "../pages/products/KeywordPage";
import ProductsList from "../pages/products/ProductsList";
import ProductsAddPage from "../pages/products/ProductsAddPage";
import ProductsDetailPage from "../pages/products/ProductsDetailPage";
import ProductsModifyPage from "../pages/products/ProductsModifyPage";
import BoardRegistrationPage from "../pages/board/BoardRegistrationPage";
import BoardAnswerPage from "../pages/board/BoardAnswerPage";
import RefundPage from "../pages/order/RefundPage";
import LoginHome from "../pages/LoginHome"; // LoginHome 임포트

// 커스텀 훅: 경로에 맞는 콘텐츠를 반환
function useContent(path) {
  const [content, setContent] = useState(); // 초기 콘텐츠 설정

  useEffect(() => {
    const auth = sessionStorage.getItem("auth"); // 세션에서 로그인 상태 확인
    if (auth !== "true" && path.startsWith("/home")) {
      // 로그인되지 않으면 로그인 페이지로 리디렉션
      setContent(<LoginHome />);
    } else {
      // 경로에 맞는 콘텐츠를 설정
      if (!path || path === "/" || path === "/home") {
        setContent(<div>관리자 홈페이지다</div>);
      } else if (path === "/boards") {
        setContent(<BoardPage />); // 예시
      } else if (path === "/board/promotion") {
        setContent(<BoardPromotionPage />); // 프로모션 관리
      } else if (path === "/board/answer") {
        setContent(<BoardAnswerPage />); // 게시판 답변관리
      } else if (path === "/board/registration") {
        setContent(<BoardRegistrationPage />); // 게시판 등록관리
      } else if (path === "/products") {
        setContent(<ProductsList />); // 상품목록
      } else if (path === "/products/detail") {
        setContent(<ProductsDetailPage />); // 상품상세
      } else if (path === "/products/add") {
        setContent(<ProductsAddPage />); // 상품등록
      } else if (path === "/option") {
        setContent(<OptionPage />); // 옵션관리
      } else if (path === "/keyword") {
        setContent(<KeywordPage />); // 키워드관리
      } else if (path === "/member") {
        setContent(<MemberPage />); // 멤버관리
      } else if (path === "/mileage") {
        setContent(<MileagePage />); // 마일리지관리
      } else if (path === "/deposit") {
        setContent(<DepositPage />); // 예치금관리
      } else if (path === "/order") {
        setContent(<OrderPage />); // 주문관리
      } else if (path === "/settle") {
        setContent(<SettlePage />); // 정산관리
      } else if (path === "/refund") {
        setContent(<RefundPage />); // 환불관리
      } else if (path === "/iwantgohome") {
        setContent(<div>집에가세요~</div>); // 정산관리
      }

      //디테일 링크이동
      const matchProductDetailId = path.match(/^\/products\/detail\/([^/]+)$/);
      const matchProductModifyId = path.match(/^\/products\/modify\/([^/]+)$/);
      const matchOptionDetailCode = path.match(/^\/option\/value\/([^/]+)$/);
      const matchKeywordDetailCode = path.match(/^\/keyword\/detail\/([^/]+)$/);
      if (matchProductDetailId) {
        const productId = matchProductDetailId[1];
        // console.log('productId,',productId)
        setContent(<ProductsDetailPage id={productId} />); //아이디값 들고가기
        // console.log('Extracted product ID:', productId);
      } else if (matchProductModifyId) {
        const productId = matchProductModifyId[1];
        setContent(<ProductsModifyPage id={productId} />); //아이디값 들고가기
      }
    }
  }, [path]); // path가 변경될 때마다 실행

  return content; // 콘텐츠 반환
}

export default useContent;
