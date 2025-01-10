import { useEffect, useState } from 'react';
import {Link} from 'react-router-dom'
import {goodsSelect} from '../../services/api';
import styles from "./goodsList.module.scss";

function GoodsList(props) {

    const [listVal, setListVal] = useState([]);//데이터 초기값
    const [chkVal, setChkVal] = useState(null);//옵션 체크박스 초기값
    

    let listLength = listVal.length;//리스트 개수
    let listTxt = listLength;

    function listNon(){//리스트 없을ㄸㅐ
        if(listLength){
            // return()
        }
    } 

    // 데이터 연결
    useEffect(()=>{
        if(!listLength || listLength == 0){
            listTxt = 0
        }
        goodsSelect()
        .then(res =>{
            // console.log(res.data);// data 확인 - 배열
            setListVal(res.data)
        })
        .catch(err => {
            console.error('상품리스트 db 프론트 불러오기 오류 ', err)
        })
    },[listLength])
    
    
    
    useEffect(()=>{
        //////옵션 아코디언
        const openFn = (e) =>{
            const filterList = e.target.nextElementSibling; // .filter-tit 다음에 있는 .filter-list 선택
            if (filterList.style.display == "block") {
                // filterList(.filter-list)이 블록일 때
                filterList.style.display = "none"; // 감추고
            } else {
                filterList.style.display = "block"; // 아닌경우 보여줌
            }
        }//클릭 시 실행되는 기능

        document.querySelectorAll(".filter_tit").forEach((tit)=>{
            tit.addEventListener('click', openFn)
        })//클릭이벤트

        // 좌측 체크박스 기능
        const chkFn = (e) =>{
            let chk_name = e.target.name;//체크박스 name값
            let chk_value = e.target.value;//체크박스 value값

            if (value === 'all') {
                setCheckedValues([]);
            }else{
                setChkVal((prevChkVal)=>{//체크된 값들이 precChkVal에 배열로 들어감
                    if(e.target.checked){
                        return [...prevChkVal, chk_value]// 체크 시 기존 배열에 새 value 값 추가
                    }else{
                        return prevChkVal.filter(value => value !== chk_value)
                    }
                })
            }
        } 
        return () =>{
            document.querySelectorAll(".filter_tit").forEach((tit)=>{
                tit.removeEventListener('click', openFn)
            })
        }//화면에 없을 때 이벤트 제거
    },[]);


    return (
        
        <div>
            <div className={styles.wrap}>
                {/* <!-- content는 고정 className --> */}
                <section className='filter-section'>
                    <div className='filter-header'>
                        <h2>내게 맞는 상품 찾기</h2>
                        <span>상품 전체보기</span>
                    </div>
                </section>
                <main className={styles.main_content}>
                    {/* <aside className={styles.sidebar}>
                        <div className={styles.filter_category}>
                            <div className={styles.filter_title}>
                                <h2>스마트 필터</h2>
                            </div>
                            <div className={styles.filter_box}>
                                <div className='filter_tit'>마감재</div>
                                <div className='filter_list'>
                                    <div className='filter_option'>
                                        <input type="checkbox" value="all" name="fin_mat" defaultChecked/>
                                        <span>전체</span>
                                    </div>
                                    <div className='filter_option'>
                                        <input type="checkbox" value="leather" name="fin_mat"/>
                                        <span>가죽</span>
                                    </div>
                                    <div className='filter_option'>
                                        <input type="checkbox" value="fabric" name="fin_mat"/>
                                        <span>패브릭</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className={styles.filter_box}>
                                <div className='filter_tit'>가격대</div>
                                <div className='filter_list'>
                                    <span className='coupon_standard'>
                                        ＊혜택 적용 전 가격 기준
                                    </span>
                                    <div className='filter_option'>
                                        <input type="checkbox" value="all" name="price" defaultChecked/>
                                        <span>전체</span>
                                    </div>
                                    <div className='filter_option'>
                                        <input type="checkbox" value="0" name="price"/>
                                        <span>0-200만원</span>
                                    </div>
                                    <div className='filter_option'>
                                        <input type="checkbox" value="200" name="price"/>
                                        <span>200-300만원</span>
                                    </div>
                                    <div className='filter_option'>
                                        <input type="checkbox" value="300" name="price"/>
                                        <span>300-400만원</span>
                                    </div>
                                    <div className='filter_option'>
                                        <input type="checkbox" value="400" name="price"/>
                                        <span>400-500만원</span>
                                    </div>
                                    <div className='filter_option'>
                                        <input type="checkbox" value="500" name="price"/>
                                        <span>500만원 이상</span>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        </aside> */}
                        <section className={styles.product_section}>
                            <article className={styles.sort_controls}>
                                <div className={styles.summary_header}>
                                    <span className={styles.total_products}>총 제품 수</span>
                                    <span className={styles.products_count}>{listTxt}</span>
                                </div>
                                {/* <ul>
                                    <li><Link to="#" className={styles.active}>판매 인기순</Link></li>
                                    <li><Link to="#">리뷰 많은순</Link></li>
                                    <li><Link to="#">낮은 가격순</Link></li>
                                    <li><Link to="#">높은 가격순</Link></li>
                                    <li><Link to="#">신상품순</Link></li>
                                    <li><Link to="#">상품명순</Link></li>
                                </ul>
                                <select name="" id="">
                                    <option value="판매 인기순">판매 인기순</option>
                                    <option value="리뷰 많은순">리뷰 많은순</option>
                                    <option value="낮은 가격순">낮은 가격순</option>
                                    <option value="높은 가격순">높은 가격순</option>
                                    <option value="신 상품순">신 상품순</option>
                                    <option value="상품명순">상품명순</option>
                                </select> */}
                            </article>
                        
                        {/* <!-- 필터선택된 리스트 표기하는 article 인데 초기엔 안보임 처리--> */}
                        <article className={styles.filter_ctl}>
                            <div className={styles.checked_tag_box}>
                                {/* <!-- 이곳에 필터 선택된 리스트 표기예정
                                <div className={styles.tags" data-value="일자">
                                    <span>일자형</span>
                                    <div className={styles.xs-close">
                                    <img src="./content/img/main/close_icon.svg" alt="" />
                                    </div>
                                </div>
                                <div className={styles.tags" data-value="모듈">
                                    <span>모듈형</span>
                                    <div className={styles.xs-close">
                                        <img src="./content/img/main/close_icon.svg" alt="" />
                                    </div>
                                </div>
                                <div className={styles.tags" data-name="util" data-value="미기능성">
                                    <span>기능성 없음</span>
                                    <div className={styles.xs-close">
                                        <img src="./content/img/main/close_icon.svg" alt="" />
                                    </div>
                                    
                                </div>
                                <div className={styles.tags" data-name="price" data-value="500">
                                    <span>400-500 만원</span>
                                    <div className={styles.xs-close">
                                        <img src="./content/img/main/close_icon.svg" alt="" />
                                    </div>
                                </div>
                            --> */}
                            </div>
                            <Link to="#none" className={styles.btn_reset} >필터 초기화</Link>
                        </article> 
                        <article className={styles.product_grid}>
                            <div className={styles.product_list}>
                                {listVal.map((item, idx)=>{
                                    // 할인율0일때 안보이게
                                    const disV = item.discount;
                                    let discount = disV + '%';
                                    let slash = item.price + '원';
                                    if(!item.discount || item.discount == 0){
                                        discount = '';
                                        slash = ''
                                    }
                                    // console.log(listVal)

                                    //최종가 계산 area
                                    const price = item.price;
                                    //1000단위 쉼표 제거 후 숫자변환
                                    const orPrice = parseInt(price.replace(/,/g, ''), 10);

                                    //소수점 제거
                                    let newFnPrice = Math.round(orPrice - (orPrice * (disV / 100)));
                                    //1원단위 남지 않게 10으로 나눠서 소수점 올림 후 다시 10 곱하기
                                    newFnPrice = Math.round(newFnPrice / 10) * 10;
                                    // console.log(newFnPrice.toLocaleString())
                                    //toLocaleString() => 1000단위 쉼표찍는 리액트 메서드

                                    // console.log(item)
                                    // console.log(item.id)
                                    
                                    return(
                                        <Link to={`/goodsDetail/${item.id}`} className={styles.product_item} key={idx}>
                                            <div className={styles.product_image_link}>
                                                    <img src="https://picsum.photos/300/240" alt="protoImage"/>
                                                    <p>{item.name}</p>
                                                <span className={styles.original_price}>{slash}</span>
                                                <div className={styles.price_container}>
                                                    <div className={styles.price_details}>
                                                        <b className={styles.discount_percent}>{discount}</b>
                                                        <strong className={styles.discounted_price}>{newFnPrice.toLocaleString()}원</strong>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                })    
                            }

                        </div>
                    </article>
                </section>
            </main>
        </div>
    </div>
    )
}

export default GoodsList;