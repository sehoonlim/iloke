import React, { useState, useEffect } from "react";

import { rFetchOrderInfo } from "../../services/api"; //  API 함수 추가

import "./OrderEnd.css";

const OrderEnd = ({ orderId }) => { //  orderId를 props로 받음
  // 🟢 주문 정보를 저장할 state
  const [orderInfo, setOrderInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null); 

  // URL 파라미터에서 주문번호(order_id) 가져오기
  
  const userId = sessionStorage.getItem('userId'); //  userId 가져오기
  

  //  useEffect로 주문 정보 가져오기
  useEffect(() => {
    const fetchOrderInfo = async () => {
      try {
        const { data } = await rFetchOrderInfo(orderId, userId); //  orderId로 요청
        console.log('📦 서버로부터 받은 데이터 (data):', data); //  디버깅 포인트
        setOrderInfo(data || {});
        console.log('📦 orderInfo 상태로 설정됨:', data || {}); //  디버깅 포인트
      } catch (error) {
        setError("주문 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
  
    if (orderId) {
      fetchOrderInfo();
    }
  }, [orderId, userId]);

  
  //  에러 메시지 표시
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="content_jh">
      {/* 상단 헤더 */}
      <div className="filter-header">
        <h2>주문완료</h2>
      </div>

      {/* 진행 단계 */}
      <div className="complete_top2">
        <ol>
          <li><span>01 장바구니</span></li>
          <li><span>02 주문서작성/결제</span></li>
          <li className="bold_li"><span>03 주문완료</span></li>
        </ol>
      </div>

      {/* 주문 완료 메시지 */}
      <div className="complete_msg_div">
        <i
          className="fa-solid fa-bag-shopping fa-2xl"
           style={{
             color: "#F294B2",
             fontSize: "113px",
             position: "relative",
               margin: "20px 0px",
               height: "80px"
         }}
        ></i>
        <p>주문이 정상적으로 접수 되었습니다.</p>
        <p>감사합니다.</p>
      </div>

      {/* 주문 요약 정보 */}
      <div className="order_tit">
        <p>주문요약정보</p>
      </div>

      <div className="complete_table_div">
        <table className="complete_table">
          <tbody>
            <tr>
              <th>결제수단</th>
              <td>
                <strong>{orderInfo?.pay_method}</strong>
                {/* <ul>
                  <li>입금계좌 : 164-910017-44504</li>
                  <li>예금주명 : 이로케</li>
                </ul> */}
              </td>
            </tr>
            <tr>
              <th>주문번호</th>
              <td>{orderInfo?.order_id}</td>
            </tr>
            <tr>
              <th>주문일자</th>
              <td>{orderInfo?.order_date}</td>
            </tr>
            <tr>
              <th>주문상품</th>
              <td>{orderInfo?.product_summary}</td>
            </tr>
            <tr>
              <th>주문자명</th>
              <td>{orderInfo?.orderer_name}</td>
            </tr>
            <tr>
              <th>배송정보</th>
              <td>
              <strong>수령자:</strong> {orderInfo?.receiver_name} 
    <br />
    <strong>주소:</strong> {orderInfo?.receiver_address}
    <br />
    <strong>핸드폰 번호:</strong> {orderInfo?.receiver_phone} 
  </td>
            </tr>
            {/* <tr>
              <th>상품 금액</th>
              <td><strong className="big_price">{orderInfo?.total_price?.toLocaleString()}원</strong></td>
            </tr>
            <tr>
              <th>배송비</th>
              <td>0원</td>
            </tr> */}
            {/* <tr>
  <th>사용 마일리지</th>
  <td>마일리지 사용: (-){orderInfo?.mileage_used?.toLocaleString()}원</td> 
</tr> */}
<tr>
  <th>총 결제금액</th>
  <td>{new Intl.NumberFormat().format((orderInfo?.total_price || 0) - (orderInfo?.mileage_used || 0))}원</td>
</tr>
          </tbody>
        </table>
      </div>

      {/* 확인 버튼 */}
      <div className="complete_btn_div">
        <button
          type="button"
          className="complete_btn"
          onClick={() => (window.location.href = "/")}
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default OrderEnd;