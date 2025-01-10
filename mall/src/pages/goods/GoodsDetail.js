import {goodsDetailSelect} from '../../services/api';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from "./goodsDetail.module.scss";

import { useParams } from 'react-router-dom'; // 추가

//swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, FreeMode } from 'swiper/modules';



function GoodsDetail({id}) {

    // console.log("GoodsDetail : ", id);
    

    const [goodsInfo, setGoodsInfo] = useState("")//상품정보
    const [thumbsSwiper, setThumbsSwiper] = useState(null);//슬라이드 썸네일

    const [orPrice, setOrPrice] = useState('');//원가 문자열(ex 10,000)
    const [fnPrice, setfnPrice] = useState(0)//숫자열로 변경된 최종가 

    const [opOne, setOpOne] = useState(null)//옵션1(1차 작업명 color-option)
    const [opTwo, setOpTwo] = useState(null)//옵션2(1차 작업명 leather-option)
    const [opThree, setOpThree] = useState(null)//옵션3(1차 작업명 stool-option)

    const [opList, setopList] = useState({})//옵션리스트
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    
    const [colorOption, setColorOption] = useState("none");
    const [leatherOption, setLeatherOption] = useState("none");
    const [stoolOption, setStoolOption] = useState("none");
    const [optionList, setOptionList] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isHeartActive, setIsHeartActive] = useState(false);

    const [productId, setProductId] = useState(null) // ✅ 상품 ID 상태 추가
    const memberId = sessionStorage.getItem('userId'); // 사용자 ID를 세션에서 가져옴

    // 데이터 연결
    useEffect(()=>{
        goodsDetailSelect(id)
        .then(res =>{
            // console.log(res.data);// data 확인 - 배열
            setGoodsInfo(res.data)
            // console.log("업데이트된 goodsInfo: ", res.data); // 업데이트 직후 상태 확인
            setLoading(false); // 데이터 로딩
        })
        .catch(err => {
            console.error('상품리스트 db 프론트 불러오기 오류 ', err)
            setLoading(false); // 로딩 실패 시에도
        })
    },[id])


     // 🔥 URL에서 상품 ID 가져오기
     useEffect(() => {
        const path = window.location.pathname; // 현재 URL 경로
        const id = path.split('/').pop(); // URL의 마지막 부분 추출
        setProductId(id); // 상품 ID 설정
        // console.log('상품 ID:', id);
    }, []);


    
    let priceTt =0;//원가
    let disV = 0;//할인율

    //최종가 계산 area
    if(goodsInfo.length){
        // console.log('goodsInfo',goodsInfo[1].price)
        priceTt = goodsInfo[1].price;//원가
        disV = goodsInfo[1].discount;//할인율

    }
    useEffect(()=>{
        if(priceTt || typeof priceTt === 'string'){
            //가격이 있거나 문자열일때만 호출//조건 안걸면 replace 에러
            setOrPrice(priceTt);
            //소수점 제거
            let newFnPrice = Math.round(priceTt - (priceTt * (disV / 100)));
            //1원단위 남지 않게 10으로 나눠서 소수점 올림 후 다시 10 곱하기
            newFnPrice = Math.round(newFnPrice / 10) * 10;
            setfnPrice(newFnPrice);
            // console.log(newFnPrice.toLocaleString())
            //toLocaleString() => 1000단위 쉼표찍는 리액트 메서드

        }

    },[priceTt, disV])

    // console.log(orPrice,',',disV,',',fnPrice)
    let fnPriceNum = fnPrice.toLocaleString();//최종가 1000단위마다 쉼표
    let disVTxt = disV + '%';//할인율에 퍼센트 붙이기

    //할인율 있을때 적용하는 기능
    let disVCon = <b className={styles.price_percent}>{disVTxt}</b>;//있을때 - 할인율
    let priceVCon = <span className={styles.price_origin}>{goodsInfo.price}원</span>
    if(disV==0 || !disV){
        disVCon = null;//없을때
        priceVCon = null;
    }


     /////////// 옵션 데이터 넣기
    //데이터 초기값 설정
    let optionTitArr = [];//옵션명 배열 전체 출력
    let optionTit = [];//옵션명 중복 제거 배열
    let optionMainArr = [];//옵션명 배열 전체 출력
    let optionMain = [];//옵션명 중복 제거 배열
    let optionValCal = {};//옵션값
    let optionValCalAll = [];//옵션값
    let optionData = {};//옵션가격
    let optionName = {};//옵션명
    let optionNameArr = [];//옵션명
    let opValArr = {};
    let opFilArr = [];
    let opFilArrLng = 0;
    
    const opkeyValueCodes = []
    // console.log('optionName:',optionName)

    
    if(goodsInfo){
        optionTitArr = goodsInfo.map(st => st.option_keyword_name);//option_keyword_name만 모은 배열
        optionTit = [...new Set(optionTitArr)];//중복 제거

        optionMainArr = goodsInfo.map(st => st.opkey_value_main_code);//opkey_value_main_code 모은 배열
        optionMain = [...new Set(optionMainArr)];//중복 제거

        optionValCalAll = goodsInfo.map(st => st.opkey_value_code);

        optionNameArr = goodsInfo.map(st => st.opkey_value_name);//옵션값명
        goodsInfo.forEach(st => {
            const optionNameKey = st.option_keyword_name; // 현재 항목의 옵션명
             
            
            // 옵션명이 중복되면 각 배열에 값을 추가
            if (!optionValCal[optionNameKey]) {
                optionValCal[optionNameKey] = []; // 해당 옵션명에 대한 값 배열 초기화
                optionData[optionNameKey] = []; // 해당 옵션명에 대한 가격 배열 초기화
                optionName[optionNameKey] = []; // 해당 옵션명에 대한 옵션값명 배열 초기화
              }
            
            // 각 배열에 데이터 추가
            optionValCal[optionNameKey].push(optionValCalAll);
            optionData[optionNameKey].push(st.opkey_value_price);
            optionName[optionNameKey].push(st.opkey_value_name);
        });
        

        const groupedByMainCode = goodsInfo.reduce((acc, item) => {
            //optionMain 값에 따라 그룹화
            const mainCode = item.opkey_value_main_code;
            if (!acc[mainCode]) {
                acc[mainCode] = [];
            }
        
            acc[mainCode].push(item);
            return acc;
        }, {});
        
        if(groupedByMainCode){
            const getOpValArr = (groupedByMainCode = {}) => {
                return Object.keys(groupedByMainCode).reduce((acc, key) => {
                    acc[key] = groupedByMainCode[key].map(item => item.opkey_value_code);
                    return acc;
                }, {});
            };
            opValArr = getOpValArr(groupedByMainCode);//각 벨류값 뽑기
            // console.log(opValArr);
        }
        
    }
    

    const handleColorChange = (e) => {
        const value = e.target.value;//값 들고오기
        setColorOption(value);
        if (value === "none") {
          setLeatherOption("none");
          setStoolOption("none");
        }
      }

      //   db로 데이터 보내기
  const handleAddToCart = async () => {
    try {
     
  
      if (!memberId) {
        alert('로그인이 필요합니다.');
        window.location.href = '/login';
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
        price: option.price,  //옵션 추가금 포함된 가격
        final_price: option.price,
        options: {
          color: option.color,
          leather: option.leather,
        //   stool: option.stool
        }
      }));

// 업데이트된 optionList 확인
// console.log("Updated optionList:", optionList);



      const option = optionList.map((option) => ({
        memberId, 
        productId, 
        quantity: option.quantity,
        price: option.price,  //옵션 추가금 포함된 가격
        final_price: option.price, // 최종 가격
        options: {
          color: option.color,
          leather: option.leather,
        //   stool: option.stool
        }
      }));
  
    //   console.log("전송할 데이터", cartItems);
  
      const response = await axios.post(`http://localhost:5000/mall/cart/${memberId}`, { cartItems });
      
      if (response.data.success) {
        alert('장바구니에 상품이 추가되었습니다.');
        window.location.href = '/cart';
      } else {
        alert('장바구니 추가에 실패했습니다.');
      }
    } catch (error) {
      console.error('장바구니 추가 오류:', error);
      alert('장바구니에 상품을 추가하는 중 오류가 발생했습니다.');
    }
  };


  const handleAddToCart2 = async () => {
    try {
      const memberId = sessionStorage.getItem('userId'); // 사용자 ID를 세션에서 가져옴
     
  
      if (!memberId) {
        alert('로그인이 필요합니다.');
        return;
      }
  
      if (optionList.length === 0) {
        alert('옵션을 선택해 주세요.');
        return;
      }
  
      // 전송할 데이터 준비
      const F = optionList.map((option) => ({
        memberId, 
        productId, 
        quantity: option.quantity,
        price: option.price,  //옵션 추가금 포함된 가격,
        options: {
          color: option.color,
          leather: option.leather,
        //   stool: option.stool
        }
      }));
  
      console.log("전송할 데이터:", JSON.stringify(cartItems, null, 2));
  
      const response = await axios.post(`http://localhost:5000/mall/cart/${memberId}`, { cartItems });
      
      if (response.data.success) {
        alert('결제가 진행됩니다.');
        window.location.href = '/order';
      } else {
        alert('결제가 실패했습니다.');
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

//   const optionLabels = {
//     "116": "거실가구",
//     "216": "침실가구",
//     "316": "주방가구",
//     "416": "사무가구",
//     "117": "1111",
//     "217": "2222",
//   };

let optionValCalMapped = {}; // 결과 객체//여기서 옵션명 받아와야함

if(optionValCalAll && optionNameArr && optionMainArr) {
    // 두 배열을 순회하여 객체에 "조합된 키": "옵션명" 형태로 저장
    optionValCalAll.forEach((optionValue, index) => {
        const optionName = optionNameArr[index];  // 해당 인덱스의 옵션명
        const optionMain = optionMainArr[index];  // 해당 인덱스의 메인 코드
        
        // 새로운 키 생성: mainCode + optionValue (예: 42 + 1 = 421)
        const combinedKey = optionMain * 10 + optionValue;
        
        // 새로운 키와 옵션명을 객체에 매핑
        optionValCalMapped[combinedKey] = optionName;
        // console.log(optionValue);//옵션값 코드 전체다
    });
}
let optionLabels = optionValCalMapped;
// console.log(goodsInfo);



 

  
  const handleOptionSelect = () => {

    if (colorOption === "none" || leatherOption === "none" ) {
        alert("옵션 값을 선택해주세요.");
        return;
      }

    // 여기에 들어가야한다.
    // color option
    const colorOptionElement = document.querySelector('.color_option option:checked');
    const colorCharge = colorOptionElement ? parseInt(colorOptionElement.dataset.chrg || 0) : 0;

    // leather option
    const leatherOptionElement = document.querySelector('.leather_option option:checked');
    const leatherCharge = leatherOptionElement ? parseInt(leatherOptionElement.dataset.chrg || 0) : 0;

    // stool option
    const stoolOptionElement = document.querySelector('.stool_option option:checked');
    const stoolCharge = stoolOptionElement ? parseInt(stoolOptionElement.dataset.chrg || 0) : 0;

    const optionPrice = colorCharge + leatherCharge + stoolCharge; //옵션값 더하기기
    
    
    // Ensure that base price is available
    const basePriceElement = document.querySelector('.final_price');
    const basePrice = basePriceElement ? parseInt(basePriceElement.dataset.chrg) : 0;
    const finalPrice = basePrice + optionPrice;

    const optionKey = `${optionLabels[colorOption]}_${optionLabels[leatherOption]}_${optionLabels[stoolOption]}`;
    const isDuplicate = optionList.some(opt => opt.key === optionKey);

    // 값 확인하기



    if (isDuplicate) {
    alert("이미 선택된 옵션입니다.");
    return;
    }
    setOptionList([...optionList, {
        key: optionKey,
        memberId : memberId,
        color: optionLabels[colorOption],
        leather: optionLabels[leatherOption],
        // stool: optionLabels[stoolOption],
        
        price: finalPrice,
        quantity: 1
    }]);



    
    // 옵션 상태 초기화
    setColorOption("none");
    setLeatherOption("none");
    setStoolOption("none");



};

  // 🔥 updateTotalPrice 삭제, 불필요한 함수 제거
  
    useEffect(() => {
      const total = optionList.reduce((acc, option) => acc + (option.price * option.quantity), 0); 
      //옵션값 총 더한 가격
      //A(원가+옵션값) + B(원가+옵션값) 가격이 나와야함
      setTotalPrice(total);
    }, [optionList]);//옵션값 더한
  
  
    const handleClipboardCopy = () => {
      navigator.clipboard.writeText(window.location.href);
      alert("URL 주소를 복사했습니다.");
    };
  
    const increaseQuantity = (key) => {
      setOptionList(optionList.map(option => 
        option.key === key ? { ...option, quantity: option.quantity + 1 } : option
      ));
    };
    // console.log(optionList)
    
    const decreaseQuantity = (key) => {
      setOptionList(optionList.map(option => 
        option.key === key 
          ? { ...option, quantity: option.quantity > 1 ? option.quantity - 1 : option.quantity } 
          : option
        ));
    };
    

    const removeOption = (key) => {
        setOptionList(optionList.filter(option => option.key !== key));
    };

    return (
            <div className={styles.wrap}>
                <main className={styles.main_content}>
                    <section className={styles.product_section}>
                        <article className={styles.product_image_wrapper}>

                            <Swiper
                                style={{
                                    '--swiper-navigation-color': '#fff',
                                    '--swiper-pagination-color': '#fff'
                                }}
                                spaceBetween="5"
                                thumbs={{ swiper: thumbsSwiper }}
                                modules={[FreeMode,Thumbs]}
                                className={`${styles.mySwiper} ${styles.swiper}`}>
                                    
                                {[
                                    "detail_01.jpg",
                                    "detail_02.jpg",
                                    "detail_03.jpg",
                                    "detail_04.jpg",
                                    "detail_05.jpg",
                                    "detail_06.jpg",
                                    ].map((image, index) => (
                                    <SwiperSlide
                                        className={styles.swiper_slide}
                                        key={index}>
                                            <img src={`../../content/img/sample/${image}`} />
                                    </SwiperSlide>
                                ))}
                        </Swiper>

                        <Swiper
                            onSwiper={setThumbsSwiper}
                            spaceBetween={10} 
                            slidesPerView={5} 
                            freeMode={true}
                            watchSlidesProgress={true}
                            modules={[FreeMode, Thumbs]}
                            slideToClickedSlide = {true}
                            className={`${styles.mySwiper2} ${styles.swiper}`} >
                                {[
                                    "thumnail_01.jpg",
                                    "thumnail_02.jpg",
                                    "thumnail_03.jpg",
                                    "thumnail_04.jpg",
                                    "thumnail_05.jpg",
                                    "thumnail_06.jpg"
                                    ].map((image, index) => (
                                    <SwiperSlide 
                                    className={`${styles.mySwiper2_list} ${styles.swiper_slide}`}
                                        key={index}>
                                            {({ isActive }) => (
                                                <div>Current slide is {isActive ? 'active' : 'not active'}</div>
                                            )}
                                            <img src={`../../content/img/sample/${image}`} />
                                    </SwiperSlide>
                                ))}
                        </Swiper>

                        </article>
                        <article className={styles.product}> 
                            <div className={styles.product_actions}>
                                {/* <button className={styles.heart_btn} onClick={handleHeartToggle}>
                                    <i className={isHeartActive ? "fa-solid fa-heart full" : "fa-regular fa-heart line"}></i>
                                </button> */}
                                <button onClick={handleClipboardCopy} className={styles.clipboard_btn} data-clipboard-text="https://www.jakomo.co.kr">
                                    <i className="fa-regular fa-copy"></i>
                                </button>
                            </div>
                            <div className={styles.exclusive_badge}>
                                공식몰 단독
                            </div>
                            <div className={styles.product_title}>
                                {/* 제품명 */}
                                {/* 조건부 렌더링으로 데이터가 있을 때만 접근 */}
                        {goodsInfo && goodsInfo.length > 0 && (
                            <h2>{goodsInfo[0].name}</h2>
                        )}
                            </div>
                            <div className={styles.product_price}>
                                <div className={styles.original_price}>
                                    {/* 원가 */}
                                    {priceVCon}
                                </div>
                                <div className={styles.product_price_info}>
                                    {/* 할인율율 - 없으면x */}
                                    {disVCon}
                                    <strong className="final_price" data-chrg={fnPrice}>
                                        {/* 원가 - 할인율 = 최종가 */}
                                        {fnPriceNum}원
                                    </strong>
                                </div>
                            </div>
                            <div className={styles.card_benefits}>
                                <dl className={styles.card_interest}>
                                    <dt>무이자</dt>
                                    <dd>카드사별 무이자 혜택 안내</dd>
                                </dl>
                                {/* {benefit} */}
                                <dl className={styles.card_point}>
                                    <dt>추가 혜택</dt>
                                    <dd>
                                        <span>네이버페이 최대 3% 적립</span>
                                        <span>페이코 포인트 결제시 1% 적립</span>
                                    </dd>
                                </dl>
                            </div>
                            
                            {goodsInfo.length && !goodsInfo.opkey_value_status ? (
                                                            
                                    <div className={styles.product_options}>{/* 옵션 */}
                                        {
                                            optionMain.map((st, i) => {//옵션 메인코드 
                                                console.log('Rendering optionMain:', st);
                                                const opNameIdx = optionTit[i]//옵션명
                                                const optionValues = opValArr[st] || [];//이걸 나눠야해
                                                const optionPrices = optionData[opNameIdx] || [];//옵션금액
                                                const optionNames = optionName[opNameIdx] || [];//옵션값
                                                // console.log(st)
                                                // console.log(optionMainArr)
                                        
                                                return (
                                                <select 
                                                // className="color_option" 
                                                className={
                                                    i === 0 ? "color_option" : 
                                                    i === 1 ? "leather_option" : "stool_option"
                                                }
                                                value={
                                                    i === 0 ? colorOption : 
                                                    i === 1 ? leatherOption : stoolOption
                                                }
                                                onChange={
                                                    i === 0 ? handleColorChange : 
                                                    i === 1 ? handleLeatherChange : handleStoolChange
                                                } //옵션개수에 따라 핸들러 달라짐
                                                key={i}>
                                                    <option value="none" data-chrg="0">= {opNameIdx} =</option>
                                                    {
                                                        optionValues.map((value, idx) => (
                                                            <option key={idx}
                                                            value={st.toString()+optionValues[idx].toString()} //option의 값
                                                            data-chrg={optionPrices[idx]} //해당 option의 가격
                                                            >
                                                            {optionNames[idx]} (+{optionPrices[idx]}원)
                                                        </option>
                                                    ))}
                                                </select>)
                                            })
                                        }
                                    
                                    <button onClick={handleOptionSelect}>옵션 추가</button>
                                </div>
                                    
                                    ):''}

                            <div className={styles.option_wrap}>
                                {optionList.map((option, index) => 
                                    (<div className={styles.option_bg} key={`${option.key}-${index}`}>
                                        {/* {console.log(option)} */}
                                        <span className={styles.option_select}>
                                            {option.color} / {option.leather}
                                             {/* / {option.stool} */}
                                        </span>
                                        <div className={styles.option_display}>
                                            <div className={styles.option_quantity}>
                                                {option.quantity > 1 ? (
                                                    <>
                                                        <button onClick={() => decreaseQuantity(option.key)}>-</button>
                                                        <span>{option.quantity}</span>
                                                        <button onClick={() => increaseQuantity(option.key)}>+</button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button onClick={() => removeOption(option.key)}>삭제</button>
                                                        <span>{option.quantity}</span>
                                                        <button onClick={() => increaseQuantity(option.key)}>+</button>
                                                    </>
                                                )}
                                            </div>

                                            <div className={styles.option_amount}>
                                                <strong>{(option.price * option.quantity).toLocaleString()}</strong>원
                                            </div>
                                        </div>
                                    </div>)
                                )}
                                <div className={styles.option_calc}>
                                    <dl className={styles.option_total}>
                                        <dt>총 합계금액</dt>
                                        {/* <dd>{fnPriceNum}원</dd> */}
                                        <dd>{totalPrice.toLocaleString()}원</dd>
                                    </dl>
                                </div>
                            </div>


                            <div className={styles.product_choice}>
                                <button className={styles.cart_btn} onClick={handleAddToCart}>장바구니</button>
                                {/* <button className={styles.buy_btn} onClick={handleAddToCart2}>바로구매</button> */}
                            </div>
                        </article>
                    </section>
                    
                    <section className={`${styles.goods_section} ${styles.detail}`} id="detail">
                        <div className={styles.tab_container}>
                            <div className={styles.goods_tab}>
                                <ul>
                                    <li><Link to="#detail" className={`${styles.detail} ${styles.active}`}>상세정보</Link></li>
                                    <li><Link to="/" className={styles.exchange}>주요안내</Link></li>
                                    {/* <li><Link to="/" className={styles.reviews}>후기</Link></li>
                                    <li><Link to="/" className={styles.qna}>문의</Link></li> */}
                                </ul>
                            </div>
                        </div>
                        <div className={styles.goods_section_image}>
                            <div className={styles.goods_section_explain}>
                                <img src="../../content/img/sample/info1_caution.jpg" alt="상품 배송 설명" />
                            </div>
                        </div>
                    </section>

                    <section className={styles.goods_section_notice} id="exchange">

                        <div className={styles.tab_container}>
                            <div className={styles.goods_tab}>
                                <ul>
                                    <li><Link to="#detail" className={styles.detail}>상세정보</Link></li>
                                    <li><Link to="#reviews" className={`${styles.exchange} ${styles.active}`}>주요안내</Link></li>
                                    {/* <li><Link to="/" className={styles.reviews}>후기</Link></li>
                                    <li><Link to="/" className={styles.qna}>문의</Link></li> */}
                                </ul>
                            </div>
                        </div>

                        <div className={styles.goods_exchange}>
                            <h3>취소, 교환 및 반품안내</h3>
                            <span>★ 취소 · 교환 · 반품 안내</span>

                            <div className={styles.goods_exchange_msg}>
                                <p>
                                    자코모 소파는 다음의 제품의 디자인 유형별 · 색상별 · 가죽 종류별 · 고객 요청사항 등 주문요건에 따라 각각 완성되는 제품이 달라지는 특이사항으로,
                                    소비자가 제품을 결제한 날로부터 3일(결제일 포함, 단 일요일/공휴일 제외) 후 제작에 착수하는 '주문제작상품'입니다. 이러한 특성으로 근거법률
                                    (전자상거래 등에서의 소비자보호에 관한 법률 제17조 제2항 제6호, 동법 제19조, 동법 시행령 제21조)에 따라 ‘청약의 철회가 제한되는 재화'에 해당합니다.
                                    소비자가 판매자에게 주문 청약의 철회를 요청 시 판매자에게 이하 내용에 따라 위약금 또는 실 손해배상금을 지급하고 청약을 철회할 수 있습니다.
                                    단, 철회 · 교환 · 반품이 불가한 사항들도 있으니 꼭 확인해 주시기를 바랍니다.
                                </p>
                                <p>
                                    <br/>
                                    1. 계약해제에 따른 위약금의 부과 없이 취소 :
                                    <br/>
                                    - 고객이 제품을 결제한 날로 부터 3일(결제일 포함)이 경과되지 아니할 때.
                                    <br/>
                                    - 단, 일요일 및 공휴일은 제외입니다.
                                </p>
                                <p>
                                    <br/>
                                    2. 계약해제에 따른 위약금 (구매가의 10%) 부과 :
                                    <br/>
                                    - 고객이 제품을 결제한 날로 부터 3일(결제일 포함)이 경과된 후(4일째)부터 배송당일이 되기 전까지의 기간에, 주문 청약 철회를 요청하는 경우
                                    <br/>
                                </p>
                                <p>
                                    3. 계약해제에 따른 위약금 (구매가의 10% + 왕복배송실비) 부과 :
                                    <br/>
                                    - 배송 당일, 제품이 출고된 이후에 주문 청약 철회를 요청하는 경우
                                    <br/>
                                    - 배송 당일(제품 출고 이후), 설치공간의 협소, 높이 낮음, 엘리베이터 크기 제한 등 설치공간과 그 주변의 특이사항으로 설치가 어렵거나 불가능할 경우
                                    <br/>
                                    - 배송 당일(제품 출고 이후), 온라인 상 상세페이지에 기재된 내용을 숙지하지 않고 교환 및 반품을 요청할 경우
                                    <br/>
                                    - 배송 당일(제품 출고 이후), 천연가죽 고유 특성(부위별 색상, 엠보, 결의 불일치, 초기 냄새 등) or 패브릭 본연의 특성(색상, 결의 불일치, 초기 냄새 등) 혹은 제품에 사용된 자재 본연의 특성 등을 이유로 교환 및 반품을 요청하는 경우
                                    <br/>
                                    - 배송 당일(제품 출고 이후), 사이즈 측정방식 및 수작업 제작과정에 따른 제품 표기스펙과의 허용 오차(±3cm 이하) 상태, 미세한 단차를 근거로 한 교환 및 반품 요청의 경우
                                    <br/>
                                    - 제품 설치 후 이상 유무를 고객분께서 확인하고, 확인란에 체크를 완료한 날로부터 2일 이내 교환 및 반품을 요청하는 경우
                                    <br/>
                                </p>
                                <p>
                                    4. 교환 및 반품 불가 : 아래의 사유에 해당할 때
                                    <br/>
                                    - 제품 설치 후 이상 유무를 고객분께서 확인하고, 확인란에 체크를 완료한 날로부터 2일이 경과된 후(3일째) 교환 및 반품을 요청하는 경우
                                    <br/>
                                    - 제품의 설치 후 소비자의 귀책에 의해 제품이 훼손된 경우
                                    <br/>
                                    - 소파의 구성 품목 일부만을 반품 요청하는 경우 (스툴, 1인용피스 등)
                                    <br/>
                                    - 제품의 설치 완료 후, 온라인 상 상세페이지에 기재된 내용을 숙지하지 않고 교환 및 반품을 요청할 경우
                                    <br/>
                                    - 제품 설치 완료 후, 천연가죽 고유 특성(부위별 색상, 엠보, 결의 불일치, 초기 냄새 등) or 패브릭 본연의 특성 (색상, 결의 불일치, 초기 냄새 등) 혹은 제품에 사용된 자재 본연의 특성 등을 이유로 교환 및 반품을 요청하는 경우
                                    <br/>
                                    - 제품의 설치 완료 후, 사이즈 측정방식 및 수작업 제작과정에 따른 제품 스펙과의 허용오차 상태, 미세한 단차를 근거로 한 교환 및 반품 요청의 경우
                                    <br/>
                                </p>
                                <p>
                                    <br/>
                                    <br/>
                                    ※ 일부 특가 상품의 경우, 인수 후에는 제품 하자나 오배송의 경우를 제외한 고객님의 단순변심에 의한 교환, 반품이 불가능할 수 있사오니, 각 상품의 상품상세정보를 꼭 참조하십시오.
                                </p>
                                
                            </div>

                        </div>
                    </section>
                </main>
            </div>
    )
}

export default GoodsDetail;