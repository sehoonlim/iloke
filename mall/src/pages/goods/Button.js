import React, { useState, useEffect } from 'react';
import styles from './Button.module.css'; // CSS 파일은 필요에 따라 경로를 수정하세요

function Button() {
  const [colorOption, setColorOption] = useState("none");
  const [leatherOption, setLeatherOption] = useState("none");
  const [stoolOption, setStoolOption] = useState("none");
  const [optionList, setOptionList] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isHeartActive, setIsHeartActive] = useState(false);

//   useEffect(() => {
//     updateTotalPrice();
//   }, [optionList]);

  const handleColorChange = (e) => {
    const value = e.target.value;
    setColorOption(value);
    if (value === "none") {
      setLeatherOption("none");
      setStoolOption("none");
    }
  };

//   db로 데이터 보내기
  const handleAddToCart = async () => {
    try {
      const memberId = sessionStorage.getItem('userId'); // 사용자 ID를 세션에서 가져옴
      const productId = '104'; // 하드코딩된 productId
  
      if (!memberId) {
        alert('로그인이 필요합니다.');
        return;
      }
  
      if (optionList.length === 0) {
        alert('옵션을 선택해 주세요.');
        return;
      }
  
      // 전송할 데이터 준비
      const cartItems = optionList.map((option) => ({
        memberId, 
        productId, 
        quantity: option.quantity,
        options: {
          color: option.color,
          leather: option.leather,
          stool: option.stool
        }
      }));
  
      console.log("전송할 데이터", cartItems);
  
      const response = await axios.post(`http://localhost:5000/mall/cart/${memberId}`, { cartItems });
      
      if (response.data.success) {
        alert('장바구니에 상품이 추가되었습니다.');
      } else {
        alert('장바구니 추가에 실패했습니다.');
      }
    } catch (error) {
      console.error('장바구니 추가 오류:', error);
      alert('장바구니에 상품을 추가하는 중 오류가 발생했습니다.');
    }
  };

  const handleLeatherChange = (e) => {
    const value = e.target.value;
    setLeatherOption(value);
    if (value === "none") {
      setStoolOption("none");
    }
  };

  const handleStoolChange = (e) => {
    const value = e.target.value;
    setStoolOption(value);
  };

  const optionLabels = {
    "cream-ivory": "크림아이보리",
    "latte": "라떼",
    "camel": "카멜",
    "full-leather": "전체가죽 적용",
    "no-leather": "전체가죽 미적용",
    "standard-stool": "일반 스툴포함",
    "no-stool": "스툴 없음",
  };
  
  const handleOptionSelect = () => {

    const colorOptionElement = document.querySelector('.color_option option:checked');
    const colorCharge = colorOptionElement ? parseInt(colorOptionElement.dataset.chrg || 0) : 0;

    const leatherOptionElement = document.querySelector('.leather_option option:checked');
    const leatherCharge = leatherOptionElement ? parseInt(leatherOptionElement.dataset.chrg || 0) : 0;

    const stoolOptionElement = document.querySelector('.stool_option option:checked');
    const stoolCharge = stoolOptionElement ? parseInt(stoolOptionElement.dataset.chrg || 0) : 0;

    const optionPrice = colorCharge + leatherCharge + stoolCharge;

    // Ensure that base price is available
    const basePriceElement = document.querySelector('.final_price');
    const basePrice = basePriceElement ? parseInt(basePriceElement.dataset.chrg) : 0;
    const finalPrice = basePrice + optionPrice;

    const optionKey = `${optionLabels[colorOption]}_${optionLabels[leatherOption]}_${optionLabels[stoolOption]}`;
    const isDuplicate = optionList.some(opt => opt.key === optionKey);

    if (isDuplicate) {
        alert("이미 선택된 옵션입니다.");
        return;
    }

    setOptionList([...optionList, {
        key: optionKey,
        color: optionLabels[colorOption],
        leather: optionLabels[leatherOption],
        stool: optionLabels[stoolOption],
        price: finalPrice,
        quantity: 1
    }]);
  };
  
  // 🔥 updateTotalPrice 삭제, 불필요한 함수 제거

  useEffect(() => {
    const total = optionList.reduce((acc, option) => acc + (option.price * option.quantity), 0);
    setTotalPrice(total);
  }, [optionList]);

  const handleHeartToggle = () => setIsHeartActive(!isHeartActive);

  const handleClipboardCopy = () => {
    navigator.clipboard.writeText("https://www.jakomo.co.kr");
    alert("URL 주소를 복사했습니다.");
  };

  const increaseQuantity = (key) => {
    setOptionList(optionList.map(option => 
      option.key === key ? { ...option, quantity: option.quantity + 1 } : option
    ));
  };
  co
  
  const decreaseQuantity = (key) => {
    setOptionList(optionList.map(option => 
      option.key === key 
        ? { ...option, quantity: option.quantity > 1 ? option.quantity - 1 : option.quantity } 
        : option
    ));
  };

  return (
    <article className={styles.product}>
      <div className={styles.product-actions}>
        <button className={styles.heart-btn} onClick={handleHeartToggle}>
          <i className={isHeartActive ? "fa-solid fa-heart full" : "fa-regular fa-heart line"}></i>
        </button>
        <button onClick={handleClipboardCopy} className={styles.clipboard-btn} data-clipboard-text="https://www.jakomo.co.kr">
          <i className="fa-regular fa-copy"></i>
        </button>
      </div>

      <div className={styles.exclusive-badge}>공식몰 단독</div>
      <div className={styles.product-title}>
        <h2>뉴 클레버 4인 기능성 비텔로 통가죽 슈렁큰 천연면피 소가죽 소파 + 쿠션 1개</h2>
      </div>
      <div className={styles.product-price}>
        <div className={styles.original-price}>
          <span className={styles.price-origin}>3,200,000원</span>
        </div>
        <div className={styles.product-price-info}>
          <b className={styles.price-percent}>10%</b>
          <strong className={styles.final-price} data-chrg="2880000">2,880,000원</strong>
        </div>
      </div>

      <div className={styles.product-options}>
        <select className={styles.color-option} value={colorOption} onChange={handleColorChange}>
          <option value="none" data-chrg="0">= 색상 선택 =</option>
          <option value="cream-ivory" data-chrg="0">크림아이보리</option>
          <option value="latte" data-chrg="0">라떼</option>
          <option value="camel" data-chrg="0">카멜</option>
        </select>
        <select className={styles.leather-option} value={leatherOption} onChange={handleLeatherChange} disabled={colorOption === 'none'}>
          <option value="none" data-chrg="0">= 전체가죽적용 선택 =</option>
          <option value="no-leather" data-chrg="0">전체가죽 미적용 (+0)</option>
          <option value="full-leather" data-chrg="450000">전체가죽 적용 (+450,000)</option>
        </select>

        <select className={styles.stool-option} value={stoolOption} onChange={handleStoolChange} disabled={leatherOption === 'none'}>
          <option value="none" data-chrg="0">= 스툴 선택: 가격 =</option>
          <option value="no-stool" data-chrg="0">구매안함 (+0)</option>
          <option value="standard-stool" data-chrg="100000">일반 가죽스툴 (+100,000)</option>
          <option value="full-leather-stool" data-chrg="150000">전체가죽 스툴포함 (+150,000)</option>
        </select>
        <button onClick={handleOptionSelect}>옵션 추가</button>
      </div>

      

      <div className={styles.option-wrap}>
        <div className={styles.option-calc}>
          <dl className={styles.option-total}>
            <dt>총 합계금액</dt>
            <dd>{totalPrice.toLocaleString()}원</dd>
          </dl>
        </div>
        {optionList.map((option, index) => (
          <div className={styles.option-bg} key={`${option.key}-${index}`}>
            <span className={styles.option-select}>
              {option.color} / {option.leather} / {option.stool}
            </span>
            <div className={styles.option-display}>
              <div className={styles.option-quantity}>
                <button onClick={() => decreaseQuantity(option.key)}>-</button>
                <span>{option.quantity}</span>
                <button onClick={() => increaseQuantity(option.key)}>+</button>
              </div>
              <div className={styles.option-amount}>
                <strong>{(option.price * option.quantity).toLocaleString()}</strong>원
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.product-choice}>
          <button className={styles.cart-btn} onClick={handleAddToCart}>장바구니</button>
          <button className={styles.buy-btn}>바로구매</button>
      </div>
    </article>
  );
}

export default Button;
