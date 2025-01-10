import React, { useState, useEffect } from "react";
// import "./Order.css";
import styles from './Order.module.css';

import ShowRoomInfo from "./ShowRoomInfo";

import { rFetchCartItems, dDeleteCartItem, uSubmitOrder, rFetchMileageInfo } from "../../services/api"; //  uSubmitOrder 추가




const Order = () => {
  const [formData, setFormData] = useState({
    ordererName: "임세훈",
    ordererPhone: "01057966269",
    ordererMobile: "01057966269",
    ordererEmail: "sehoon@naver.com",
    recipientName: "임세훈",
    recipientAddress: "어딘가",
    recipientPhone: "02-579-6269",
    recipientMobile: "010-5796-6269",
    recipientComment: "",
    mileage: "",
    deposit: "",
    agree: false,
    items: [],
    total_price: 0,
    pay_method: "신용카드",
  });

  const [showModal, setShowModal] = useState(false); // 모달 상태


   // 쇼룸 선택 시 실행되는 콜백
   const handleSelectShowroom = (showroom) => {
    setFormData((prev) => ({
      ...prev,
      recipientAddress: showroom.address, // 선택된 쇼룸 주소 저장
    }));
    setShowModal(false); // 모달 닫기
  };

  const [errors, setErrors] = useState({}); // 유효성 에러 상태 추가

  const userId = sessionStorage.getItem('userId'); //  로그인한 사용자 ID 가져오기

  //  장바구니 데이터를 담는 state 정의
  const [carts, setCarts] = useState([]);

// 유효성 검사 함수
  const validateForm = () => {
    const errors = {};
  
  
    // 받으실 분 유효성 검사
    if (!/^[가-힣a-zA-Z]{2,5}$/.test(formData.recipientName)) {
      errors.recipientName = "받으실 분은 2~5자의 한글 또는 영문만 입력할 수 있습니다.";
    }
  
    // 받으실 곳 유효성 검사
    if (!/^[가-힣a-zA-Z]{3,50}$/.test(formData.recipientAddress)) {
      errors.recipientAddress = "받으실 곳은 3~50자의 한글 또는 영문만 입력할 수 있습니다.";
    }
  
   // 전화번호 유효성 검사 (입력된 경우만 검사)
  if (formData.recipientPhone && !/^(\d{3}-\d{4}-\d{4}|\d{2}-\d{3}-\d{4}|\d{2}-\d{4}-\d{4})$/.test(formData.recipientPhone)) {
    errors.recipientPhone = "전화번호는 xxx-xxxx-xxxx 형식이어야 합니다.";
  }
  
    // 수취인 휴대폰 번호 유효성 검사
    if (!/^\d{3}-\d{4}-\d{4}$/.test(formData.recipientMobile)) {
      errors.recipientMobile = "휴대폰 번호는 xxx-xxxx-xxxx 형식이어야 합니다.";
    }
  
    setErrors(errors);
  
    // 에러가 없으면 true 반환
    return Object.keys(errors).length === 0;
  };




  const totalPrice = carts.reduce((sum, item) => {
    const itemPrice = Number(item?.final_price) || 0;
    const itemQuantity = Number(item?.quantity) || 0;
    return sum + itemPrice * itemQuantity;
  }, 0);
  
  const finalPaymentAmount = totalPrice - (Number(formData.mileage) || 0);

//  carts의 총 상품 금액을 계산하여 total_price에 업데이트
useEffect(() => {
 

  setFormData(prevFormData => ({
    ...prevFormData,
    total_price: totalPrice //  formData의 total_price에 계산된 총 금액 저장
  }));

  
}, [carts]); //  carts가 변경될 때마다 실행




  // 🟢 페이지 마운트 시 장바구니 데이터 가져오기
  useEffect(() => {
    const fetchCarts = async () => {
      if (!userId) return;
      try {
        //  장바구니 데이터 가져오기
        const { data: cartData } = await rFetchCartItems(userId); 

       // console.log("cartData : ", cartData);
        
        setCarts(Array.isArray(cartData.cartItems) ? cartData.cartItems : []);
        
        //  사용자 마일리지 정보 가져오기
        const { data: userInfoData } = await rFetchMileageInfo(userId); 
        setFormData(prevFormData => ({
          ...prevFormData,
          availableMileage: userInfoData.userInfo.m_remain || 0 //  m_remain 가져오기
        }));
      } catch (error) {
        console.error(' 장바구니 또는 마일리지 불러오기 에러:', error.message);
        setCarts([]);
        setFormData(prevFormData => ({ ...prevFormData, availableMileage: 0 }));
      }
    };
    fetchCarts();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      agree: e.target.checked, // 🚀 체크박스의 선택 상태를 formData에 반영
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.agree) {
      alert("이용약관에 동의해주세요.");
      return;
    }
  
    // console.log('🛒 carts 데이터:', carts);

     //  백엔드로 전송할 데이터 준비
  const requestData = {
    member_id: userId, 
    pay_method: formData.pay_method, 
    mileage_used: formData.mileage, 
    total_price: totalPrice, 
    orderer_name: formData.ordererName, 
    receiver_name: formData.recipientName, 
    receiver_phone: formData.recipientPhone, 
    receiver_address: formData.recipientAddress, 
    orderItems: carts.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.final_price,
    })),
  };
  
    console.log('📦 전송 데이터 확인 (requestData):', JSON.stringify(requestData, null, 2));
  
    try {

      // console.log("requestData : ", requestData);
        
      const { data } = await uSubmitOrder(requestData); 
      if (data.success) {
        alert(`결제가 완료되었습니다.`);
      
        window.location.href = `/orderend/${data.orderId}`; //  URL에 orderId 포함
      } else {
        alert('결제 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error(' 결제 요청 중 오류 발생:', error.message);
      alert('결제 처리 중 오류가 발생했습니다.');
    }
  };

  let sumOfPrice = 0;
  for(let i = 0; i < carts.length; i++) {
    const cart = carts[i];
    sumOfPrice += cart.final_price * cart.quantity;
  }

  const handleOrderValidation = (e) => {
    e.preventDefault(); // 기본 동작 막기 (폼 제출이나 새로고침 방지)
  
    // 유효성 검사
    
    if (!/^[가-힣a-zA-Z]{2,5}$/.test(formData.recipientName)) {
      return alert("수취인 이름은 2~5자의 한글 또는 영문만 입력할 수 있습니다.");
    }
    if (!/^[가-힣a-zA-Z]{3,50}$/.test(formData.recipientAddress)) {
      return alert("수취인 주소는 3~50자의 한글 또는 영문만 입력할 수 있습니다.");
    }
    if (!/^(\d{3}-\d{4}-\d{4}|\d{2}-\d{3}-\d{4}|\d{2}-\d{4}-\d{4})$/.test(formData.recipientPhone)) {
      return alert("전화번호는 xxx-xxxx-xxxx 형식이어야 합니다.");
    }
    if (!/^\d{3}-\d{4}-\d{4}$/.test(formData.recipientMobile)) {
      return alert("휴대폰 번호는 xxx-xxxx-xxxx 형식이어야 합니다.");
    }
    if (!formData.agree) {
      return alert("이용 약관에 동의해주세요.");
    }
  
    // 유효성 검사 통과 시 제출
    handleSubmit(e); // e를 handleSubmit에 전달
  };


  return (
    <div className={styles.content_jh}>
      <div className={styles.filter_header}>
        <h2>주문서작성/결제</h2>
      </div>
  
      <div className={styles.order_top2}>
        <ol>
          <li><span>01 장바구니</span></li>
          <li className={styles.bold_li}><span>02 주문서작성/결제</span></li>
          <li><span>03 주문완료</span></li>
        </ol>
      </div>
  
      <div className={styles.order_tit}>
        <p>주문상세내역</p>
      </div>
  
      <div className={styles.table_div}>
        <table className={styles.list_table}>
          {/* <thead> */}
            <tr>
              <th>상품/옵션 정보</th>
              <th>수량</th>
              <th>상품금액</th>
              <th>할인/적립</th>
              <th>합계금액</th>
            </tr>
          {/* </thead> */}
          <tbody>
          {carts.map((cart, index) => (
    <tr key={index}>
      <td>
        {cart.product_name}
        <div className={styles.option_info}>
          {(() => {
            try {
              // 옵션 데이터를 파싱 (JSON 문자열인지 확인)
              const parsedOptions = typeof cart.options === 'string'
                ? JSON.parse(cart.options) // JSON 문자열일 경우 파싱
                : cart.options; // 객체일 경우 그대로 사용

              console.log("최종 파싱된 options:", parsedOptions);

              // 옵션 값을 보기 좋은 형식으로 표시
              if (parsedOptions && typeof parsedOptions === 'object') {
                return Object.values(parsedOptions).join(' / '); // 값만 표시
              } else {
                return "옵션: 없음";
              }
            } catch (error) {
              console.error("옵션 처리 오류:", error);
              return "옵션 데이터를 표시할 수 없습니다.";
            }
          })()}
        </div>
      </td>
      <td>{cart.quantity}개</td>
      <td>{cart.price.toLocaleString()}원</td>
      <td>{cart.discount}%</td>
      <td>{(cart.final_price * cart.quantity).toLocaleString()}원</td>
    </tr>
))}
</tbody>
        </table>
      </div>
  
     
      <div className={styles.btn_div}>
        <button 
          type="button" 
          className={styles.cart_button} 
          id="cart_btn" 
          onClick={() => window.location.href = './cart'}
        >
          장바구니 가기
        </button>
      </div>
  
     

      <div className={styles.wrap}>
    

      <div className={styles.price_div}>
        <div className={styles.price_sum_right}>
          <div className={styles.left_div}>
            <div> {carts.length} 종류의 총 상품금액</div>
            <div className={styles.left_price}>
            {new Intl.NumberFormat().format(sumOfPrice)}원
            </div>
          </div>
          <div className={styles.symbol_left_div}><i className="fa-solid fa-circle-plus fa-lg" style={{ color: '#cccccc' }}></i></div>
          <div className={styles.center_div}>
            <div>배송비</div>
            <div className={styles.center_price}>0원</div>
          </div>
          <div className={styles.symbol_right_div}><i className="fa-solid fa-circle-pause fa-rotate-90 fa-lg" style={{ color: '#767676' }}></i></div>
          <div className={styles.right_div}>
          <div>합계</div>
<div className={styles.right_price}>
  {new Intl.NumberFormat().format(sumOfPrice)}원
</div>
          </div>
        </div>
      </div>

      {/* <div className={styles.order_tit}>
        <p>주문자 정보</p>
      </div>

      <div className={styles.orderer_table_div}>
        <table className={styles.orderer_table}>
          <tbody>
          <tr>
  <th>
    <i 
      id="order_i" 
      className="fa-solid fa-square fa-2xs" 
      style={{ color: '#F294B2' }}
    ></i>
    주문하시는 분
  </th>
  <td>
  <input 
  type="text" 
  name="ordererName" 
  value={formData.ordererName} 
  onChange={(e) => {
    const onlyKorean = e.target.value.replace(/[^ㄱ-ㅎㅏ-ㅣ가-힣]/g, "");
    setFormData({ ...formData, ordererName: onlyKorean });
  }} 
  className={styles.input220}
/>
  </td>
</tr>
            <tr>
              <th>주소</th>
              <td>서울 서초구 서초대로78길 48 (송림빌딩)</td>
            </tr>
            <tr>
  <th>전화번호</th>
  <td>
    <input 
      type="text" 
      name="ordererPhone" 
      value={formData.ordererPhone} 
      onChange={(e) => {
        const onlyNumbers = e.target.value.replace(/[^0-9]/g, "");
        setFormData({ ...formData, ordererPhone: onlyNumbers });
      }} 
      className={styles.input220}
    />
  </td>
</tr>
<tr>
  <th>
    <i 
      id="order_i" 
      className="fa-solid fa-square fa-2xs" 
      style={{ color: '#F294B2' }}
    ></i>
    휴대폰 번호
  </th>
  <td>
    <input 
      type="text" 
      name="ordererMobile" 
      value={formData.ordererMobile} 
      onChange={(e) => {
        const onlyNumbers = e.target.value.replace(/[^0-9]/g, "");
        setFormData({ ...formData, ordererMobile: onlyNumbers });
      }} 
      className={styles.input220}
    />
  </td>
</tr>
            <tr>
              <th>
              <i 
      id="order_i" 
      className="fa-solid fa-square fa-2xs" 
      style={{ color: '#F294B2' }}
    ></i>
                이메일</th>
              <td>
              <input 
  type="text" 
  name="ordererEmail" 
  value={formData.ordererEmail} 
  onBlur={() => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.ordererEmail)) {
      alert('올바른 이메일 형식을 입력해주세요.');
    }
  }}
  onChange={handleInputChange} 
  className={styles.input220}
/>
              </td>
            </tr>
          </tbody>
        </table>
      </div> */}

      <div className={styles.order_tit}>
        <p>배송정보</p>
      </div>

      <div className={styles.delivery_table_div}>
        <table className={styles.delivery_table}>
          <tbody>
            <tr>
              <th>
              <i 
      id="order_i" 
      className="fa-solid fa-square fa-2xs" 
      style={{ color: '#F294B2' }}
    ></i>
                받으실 분</th>
              <td>
                <input 
                  type="text" 
                  name="recipientName" 
                  value={formData.recipientName} 
                  onChange={handleInputChange} 
                  className={styles.input220}
                />
              </td>
            </tr>
            <tr>
              <th>
              <i 
      id="order_i" 
      className="fa-solid fa-square fa-2xs" 
      style={{ color: '#F294B2' }}
    ></i>
                받으실 곳</th>
              <td>
              <input 
  type="text" 
  name="recipientAddress" 
  value={formData.recipientAddress} 
  onChange={handleInputChange} //  handleInputChange로 일원화
  className={styles.long_address}
/>
              </td>
            </tr>
            {/* 모달창! */}
            <button
                type="button"
                onClick={() => setShowModal(true)} // 모달 열기
                className={styles.select_button}
              >
                주소 선택
              </button>
               {/* 모달창! */}
            <tr>
              <th>전화번호</th>
              <td>
                <input 
                  type="text" 
                  name="recipientPhone" 
                  value={formData.recipientPhone} 
                  onChange={handleInputChange} 
                  className={styles.input220}
                />
              </td>
            </tr>
            <tr>
  <th>
    <i 
      id="order_i" 
      className="fa-solid fa-square fa-2xs" 
      style={{ color: '#F294B2' }}
    ></i>
    휴대폰 번호
  </th>
  <td>
    <input 
      type="text" 
      name="recipientMobile" 
      value={formData.recipientMobile} 
      onChange={handleInputChange} 
      className={styles.input220}
    />
  </td>
</tr>
{/* <tr>
  <th>남기실 말씀</th>
  <td>
    <input 
      type="text" 
      name="recipientComment" 
      value={formData.recipientComment} 
      onChange={handleInputChange} 
      className={styles.input220}
    />
  </td>
</tr> */}
          </tbody>
        </table>

{/* 모달 창 */}
{showModal && (
      <div className={styles.modal_overlay}>
        <div className={styles.modal_content}>
          <button
            className={styles.close_button}
            onClick={() => setShowModal(false)} // 모달 닫기
          >
            닫기
          </button>
          <ShowRoomInfo 
          onSelectShowroom={handleSelectShowroom}
          mode="modal" // 모달에서는 modal 모드로 설정
           />
        </div>
      </div>
    )}

      </div>

      <div className={styles.payment_table_div}>
        <table className={styles.payment_table}>
          <tbody>
            <tr>
              <th>&nbsp;&nbsp;&nbsp;&nbsp;상품 합계 금액</th>
              <td>{new Intl.NumberFormat().format(sumOfPrice)}원</td>
            </tr>
            <tr>
              <th>&nbsp;&nbsp;&nbsp;&nbsp;배송비</th>
              <td>0원</td>
            </tr>
            <tr>
              <th>&nbsp;&nbsp;&nbsp;&nbsp;할인 및 적립</th>
              <td>적립 마일리지</td>
            </tr>
            <tr>
              <th>&nbsp;&nbsp;&nbsp;&nbsp;쿠폰 사용</th>
              <td>쿠폰 조회 및 적용</td>
            </tr>
            <tr>
  <th>&nbsp;&nbsp;&nbsp;&nbsp;마일리지 사용</th>
  <td>
    <input 
      type="text" 
      name="mileage" 
      value={formData.mileage} 
      onChange={(e) => {
        let mileage = e.target.value.replace(/[^0-9]/g, "");
        const availableMileage = formData.availableMileage || 0; 
        if (parseInt(mileage) > availableMileage) mileage = availableMileage.toString(); 
        setFormData({ ...formData, mileage });
      }} 
      className={styles.input220} 
    />
    &nbsp;점
    <span>(보유 마일리지 : {new Intl.NumberFormat().format(formData.availableMileage)}점)</span> 
  </td>
</tr>
            <tr>
  <th>&nbsp;&nbsp;&nbsp;&nbsp;최종 결제 금액</th>
  <td id={styles.total_price}>
    {new Intl.NumberFormat().format(finalPaymentAmount)}원
    <br />
    <small className={styles.mileage_discount}>
      (마일리지 사용: -{new Intl.NumberFormat().format(Number(formData.mileage) || 0)}원)
    </small>
  </td>
</tr>
          </tbody>
        </table>
      </div>

      <div className={styles.order_tit}>
        <p>결제수단 선택 / 결제</p>
      </div>

      <div className={styles.payment_method_div}>
        <div className={styles.payment_left_div}>일반결제</div>
        <div className={styles.payment_right_div}>
        <ul>
  <li>
    <input 
      type="radio" 
      name="pay_method" 
      value="신용카드" 
      checked={formData.pay_method === '신용카드'} 
      onChange={(e) => setFormData({ ...formData, pay_method: e.target.value })} 
    />
    <label>신용카드</label>
  </li>
  <li>
    <input 
      type="radio" 
      name="pay_method" 
      value="휴대폰" 
      checked={formData.pay_method === '휴대폰'} 
      onChange={(e) => setFormData({ ...formData, pay_method: e.target.value })} 
    />
    <label>휴대폰</label>
  </li>
</ul>
        </div>
      </div>

      <div className={styles.tot_amount_div}>
  <div className={styles.tot_amount_div_right}>
    <div className={styles.tot_left}>최종 결제 금액</div>
    <div className={styles.tot_right}>
      {new Intl.NumberFormat().format(finalPaymentAmount)}원
      
    </div>
  </div>
</div>

      <div className={styles.agreement_div}>
        <div className={styles.agreement_top}>
            <input 
        type="checkbox" 
        id="agree_chk" 
        name="agree" 
        checked={formData.agree} // 🚀 상태를 formData.agree에 바인딩
        onChange={handleCheckboxChange} // 🚀 상태 변경을 추적하여 formData에 반영
      />
          <label htmlFor="agree_chk">
            <em>
              <b>(필수)</b> 소비자 <b>위약금 부과</b>에 대한 고지와 구매하실 상품의 <b>결제정보</b>를 확인하였으며,
              구매진행에 동의합니다.
            </em>
          </label>
        </div>
        <div className={styles.agreement_bottom}>
          <p>소비자 위약금 부과에 대한 고지</p>
          자코모 소파는 제품의 디자인별 • 색상별 • 가죽 종류별 • 고객 요청사항 등 주문 요건에 따라 각각 완성되는
          제품이 달라지는 특이사항으로,
          <br />
          고객이 제품을 주문한 날(결제가 완료된 날)로부터 3일 후 제작에 착수하는 '주문제작상품'입니다.
          <br />
          근거법률(전자상거래 등에서의 소비자보호에 관한 법률 제17조 제2항 제6호, 동법 제19조, 동법 시행령 제21조)에
          따라 ‘청약의 철회가 제한되는 재화'에 해당하므로,
          <br />
          주문청약 취소 요청 시 고객님께 <b>위약금이 부과되거나 교환 • 반품이 불가할 수 있으니</b> 구매 결정 이전,
          제품의 온라인 상 상세페이지의 내용(제품 특성 및 명시사항 등)을 반드시 확인해주시기 바랍니다.
        </div>
      </div>

      <div className={styles.order_btn_div}>

      <button 
  type="button" 
  className={styles.order_btn} 
  onClick={handleOrderValidation} // 🚀 단순하게 handleOrderValidation로 연결
>
  결제하기
</button>
      </div>


    </div>



    </div>

    // 

    
    
  );
};

export default Order;