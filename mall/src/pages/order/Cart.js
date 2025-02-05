import React, { useState, useEffect } from "react";
import styles from './Cart.module.css';
//   import '../css/default.css';
//   import '../css/fonts.css';
//  import '../css/reset.css';
// import '../css/sub.css';

import { rFetchCartItems, dDeleteCartItem, uSubmitOrder } from '../../services/api';

import Header from "../Header";
import Footer from "../Footer";

const Cart = () => {
  const userId = sessionStorage.getItem('userId');

  // 로그인 상태 확인 후 리다이렉션 처리
  if (!userId) {
    alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
    window.location.href = '/login';
    return null; // 로그인되지 않은 경우 아무것도 렌더링하지 않음
  }

  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isAllChecked, setIsAllChecked] = useState(true);
  const [cartItemCount, setCartItemCount] = useState(0); // ✅ 장바구니 개수 상태 추가
  
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await rFetchCartItems(userId);
        if (response.status !== 200) throw new Error("HTTP 상태 코드: " + response.status);
        const data = response.data;
  
        if (!data || !data.cartItems) throw new Error("cartItems가 비어있습니다.");
  
        setCartItems(data.cartItems.map((item) => ({ ...item, checked: true })));
  
        // ✅ 장바구니 개수 즉시 업데이트
        const itemCount = data.cartItems.length;
        sessionStorage.setItem("cartItemCount", itemCount.toString());
        setCartItemCount(itemCount); // 🟢 상태 즉시 반영
  
        // ✅ storage 이벤트 발생
        window.dispatchEvent(new Event("storage"));
  
        console.log(`🛒 장바구니 개수 업데이트: ${itemCount}`); // ✅ 디버깅 로그 추가
      } catch (error) {
        console.error("🛒 데이터를 가져오는 중 오류 발생:", error);
      }
    };
  
    fetchCartItems();
  }, []);
  
  useEffect(() => {
    const total = cartItems
      .filter((item) => item.checked)
      .reduce((acc, item) => acc + item.final_price * item.quantity, 0);
  
    setTotalPrice(total);
  }, [cartItems]);

  const handleAllCheck = (e) => {
    const checked = e.target.checked;
    setIsAllChecked(checked);
    setCartItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        checked,
      }))
    );
  };

  const handleCheckboxChange = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cart_id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleDeleteSelected = async () => {
    const selectedItems = cartItems.filter((item) => item.checked);
    if (selectedItems.length === 0) {
      alert("삭제할 상품을 선택해주세요.");
      return;
    }
  
    const confirmDelete = window.confirm(
      `선택하신 ${selectedItems.length}개 상품을 장바구니에서 삭제하시겠습니까?`
    );
  
    if (confirmDelete) {
      try {
        // ✅ 서버에 선택한 상품들 삭제 요청
        await Promise.all(selectedItems.map((item) => dDeleteCartItem(item.cart_id)));
  
        // ✅ 삭제 후 남은 장바구니 목록 업데이트
        const updatedCartItems = cartItems.filter((item) => !item.checked);
        setCartItems(updatedCartItems); // 🟢 상태 업데이트
  
        // ✅ 장바구니 개수를 즉시 업데이트
        const newCartCount = updatedCartItems.length;
        sessionStorage.setItem("cartItemCount", newCartCount.toString());
        setCartItemCount(newCartCount); // 🟢 상태 즉시 반영
  
        // ✅ storage 이벤트 발생 (Header.js에서 감지 가능)
        window.dispatchEvent(new Event("storage"));
  
        console.log(`🛒 장바구니에서 삭제됨, 남은 개수: ${newCartCount}`); // ✅ 디버깅 로그
      } catch (error) {
        console.error("장바구니 항목 삭제 중 오류 발생:", error);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  

  const handleOrderProducts = async () => {
    try {
      const userId = sessionStorage.getItem('userId');
      if (!userId) {
        alert("로그인이 필요합니다.");
        window.location.href = '/login';
        return;
      }
  
      const selectedItems = cartItems.filter((item) => item.checked);
      if (!Array.isArray(selectedItems) || selectedItems.length === 0) { 
        alert("선택한 상품이 없습니다. 상품을 선택해주세요.");
        return;
      }
  
      const orderData = selectedItems.map((item, index) => {
        if (!item.product_id) {
          console.warn(` product_id가 누락되었습니다. (index: ${index}, item: ${JSON.stringify(item)})`);
        }
        return {
          product_id: item.product_id ?? 0, 
          quantity: item.quantity ?? 1, //  quantity 기본값 1로 변경 (0 대신 1)
          price: item.price ?? 0 //  item.price로 변경 (item.final_price * item.quantity를 Order에서 계산)
        };
      });
  
     
  
      //  sessionStorage에 주문 데이터 저장
      sessionStorage.setItem('orderData', JSON.stringify(orderData)); 
  
      //  Order 페이지로 이동
      window.location.href = '/order'; 
    } catch (error) {
      console.error(' 주문 데이터 처리 중 오류 발생:', error);
      alert('주문 처리 중 오류가 발생했습니다.');
    }
  };

 

  return (
    <div className={styles.content_jh}>
      <div className={styles.filterHeader}>
        <h2>장바구니</h2>
      </div>
  
      <div className={styles.order_top2}>
        <ol>
          <li className={styles.bold_li}>
            <span>01 장바구니</span>
          </li>
          <li>
            <span>02 주문서작성/결제</span>
          </li>
          <li>
            <span>03 주문완료</span>
          </li>
        </ol>
      </div>
  
      {cartItems.length > 0 ? (
        <div className={styles.table_div}>
          <table>
            <tbody>
              <tr>
                <th>
                  <input 
                    type="checkbox" 
                    id="tot_chk" 
                    checked={isAllChecked} 
                    onChange={handleAllCheck} 
                  />
                </th>
                <th>상품/옵션 정보</th>
                <th>수량</th>
                <th>상품금액</th>
                <th>할인/적립</th>
                <th>합계금액</th>
                <th>배송비</th>
              </tr>
  
              {cartItems.map((item) => (

                
                <tr key={item.cart_id}>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={item.checked} 
                      onChange={() => handleCheckboxChange(item.cart_id)} 
                    />
                  </td>
                  <td className={styles.name_td}>
                  {/* <img 
  src={`/content/img/main/main_product${String(item.product_id).padStart(2, '0')}.jpg`} 
  alt={item.product_name} 
  style={{ width: "40px", height: "32px" }} 
/> */}
                    {item.product_name}

                   {/*  옵션 추가 부분 */}
{item.options && (
  <div className={styles.option_info}>
    {(() => {
      try {
        // 옵션 데이터 확인 및 파싱
        const parsedOptions = typeof item.options === 'string'
          ? JSON.parse(item.options) // JSON 문자열일 경우 파싱
          : item.options; // 이미 객체인 경우 그대로 사용

        // 옵션 값만 보기 좋은 형식으로 변환
        if (parsedOptions && typeof parsedOptions === 'object') {
          return Object.values(parsedOptions).join(' / '); // 값만 추출해서 표시
        } else {
          return "옵션 데이터가 없습니다.";
        }
      } catch (error) {
        console.error("옵션 처리 오류:", error);
        return "옵션 데이터를 표시할 수 없습니다.";
      }
    })()}
  </div>
)}
        {/*  */}
                  </td>
                  <td>{item.quantity}개</td>
                  <td>{item.final_price.toLocaleString()}원</td>
                  <td>{item.discount}%<br />(-{(item.price * (item.discount / 100)).toLocaleString()}원)</td>
                  <td>{(item.final_price * item.quantity).toLocaleString()}원</td>
                  <td>무료배송</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          id="empty_cart_message"
          style={{ textAlign: "center", fontSize: "18px" }}
        >
          <br />
          <br />
          <br />
          장바구니에 담겨있는 상품이 없습니다.
        </div>
      )}
  
      <div className={styles.btn_div}>
        <div className={styles.small_left_div}>
          <div className={styles.delete_btn_div}>
            <button 
              type="button" 
              id="delete_btn" 
              onClick={handleDeleteSelected}
            >
              선택 상품 삭제
            </button>
          </div>
        </div>
  
        <div className={styles.small_right_div}>
          <button
            type="button"
            id="product_btn"
            onClick={() =>  window.location.href = '/goods/goodsList'}
          >
            쇼핑 계속하기
          </button>
        </div>
      </div>
  
      <div className={styles.price_div}>
        <div className={styles.price_sum_right}>
          <div className={styles.left_div}>
            <div>상품금액</div>
            <div className={styles.left_price}>{totalPrice.toLocaleString()}원</div>
          </div>
          <div className={styles.center_div}>
            <div>배송비</div>
            <div className={styles.center_price}>0원</div>
          </div>
          <div className={styles.right_div}>
            <div>합계</div>
            <div className={styles.right_price}>{totalPrice.toLocaleString()}원</div>
          </div>
        </div>
      </div>
  
      <div className={styles.order_bottom_div}>
        <div className={styles.order_btn_div}>
          <button
            type="button"
            id="all_buy_btn"
            onClick={handleOrderProducts}
          >
            상품 주문
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;