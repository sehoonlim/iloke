import React from 'react';
import {useRef, useEffect} from 'react';
import {Link} from 'react-router-dom'

//swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { EffectFade, Navigation } from 'swiper/modules';


const promotions = [
  [
    { img: "./content/img/main/main_prom01.jpg", title: "title", description: "Lorem, ipsum dolor sit amet" },
    { img: "./content/img/main/main_prom02.jpg", title: "title", description: "Lorem, ipsum dolor sit amet" },
    { img: "./content/img/main/main_prom07.jpg", title: "title", description: "Lorem, ipsum dolor sit amet" },
  ],
  [
    { img: "./content/img/main/main_prom03.jpg", title: "title", description: "Lorem, ipsum dolor sit amet" },
    { img: "./content/img/main/main_prom04.jpg", title: "title", description: "Lorem, ipsum dolor sit amet" },
  ],
  [
    { img: "./content/img/main/main_prom05.jpg", title: "title", description: "Lorem, ipsum dolor sit amet" },
    { img: "./content/img/main/main_prom06.jpg", title: "title", description: "Lorem, ipsum dolor sit amet" },
  ],
];

// import 필요한 부분
{/* <head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ILOKE</title>
  <link rel="stylesheet" href="./css/reset.css" />
  <link rel="stylesheet" href="./css/fonts.css" />
  <link rel="stylesheet" href="./css/default.css" />
  <link rel="stylesheet" href="./css/sub.css" />
  <script src="./js/jquery-3.7.1.min.js"></script>
  <script src="./js/default.js"></script>
  <script src="./js/sub.js"></script>

  <!-- fontawsome 6.6.0 (아이콘)-->
  <!-- swiper  -->
  <link rel="stylesheet" href="./content/swiper/swiper-bundle.min.css">
  <script src="./content/swiper/swiper-bundle.min.js"></script>
</head> */}

function Home(props) {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      };
    
      // useRef : 값을 계속 유지하고 싶은 경우, DOM 요소에 접근하기 위해 가장 자주 사용
      const prevRef = useRef(null);
      const nextRef = useRef(null);
    
      useEffect(() => {
        // body에 클래스 추가
        document.body.classList.add('main_body');
    
        // 컴포넌트가 unmount 될 때 클래스 제거
        return () => {
          document.body.classList.remove('main_body');
        };
      }, []);
      const contentElement = document.getElementById("content");
      const loadContent = (url) => {
        // console.log(`Loading content from ${url}`);
        if (contentElement) {
            fetch(url)
            .then((response) => response.text())
            .then((html) => {
                document.getElementById("content").innerHTML = html;
            });
        }
      };

    return (
        <div>
        <div className="main-container" id="main">
          <Swiper
            tag='section'
            className='main-banner main-con'
            wrapperTag='div'
            loop= {true}
            autoPlay = {
                {delay: 4000 ,disableOnInteraction: false}
            }
            modules={[EffectFade]} 
            effect="fade"
            speed = {1000}
            >
                <SwiperSlide className="banner-img01"></SwiperSlide>
                <SwiperSlide className="banner-img02"></SwiperSlide>
                <SwiperSlide className="banner-img03"></SwiperSlide>
                <SwiperSlide className="banner-img04"></SwiperSlide>
                <SwiperSlide className="banner-img05"></SwiperSlide>
          </Swiper>
          <section className="main-sec01 main-con">
            <div className="wrap">
              <div className="left-text">
                <h2>Smart Living,<br />Stylish Choices</h2>
                <p>간편한 조립으로 효율적인 공간</p>
                <p>실용성과 스타일을 겸비한 다양한 제품을 만나보세요!</p>
                <Link to={'/goods/goodsList'} className="view">
                  ABOUT ILOKE
                  <i className="fa-solid fa-angle-right"></i>
                  <i className="fa-solid fa-angles-right"></i>
                </Link>
              </div>
              <div className="right-video">
                <video src="./content/img/main/man-video05.webm" muted autoPlay loop></video>
                <img src="./content/img/main/main_product23.png" alt="" />
              </div>
            </div>
          </section>
          <section className="main-sec02 main-con">
            <div className="wrap">
              <div className="pro-top">
                <h2>products</h2>
    
                {/* 
                product-swipe 외부 네비게이션 컨트롤러 영역 
                ref : DOM 요소에 직접 접근할 수 있음. 함수형 컴포넌트로 useRef 사용
                */}
                <div className="product-btn">
                  <span className="btn-left" ref={prevRef}>
                    <i className="fa-solid fa-angle-left"></i>
                  </span>
                  <span className="btn-right" ref={nextRef}>
                    <i className="fa-solid fa-angle-right"></i>
                  </span>
                </div>
    
              </div>
              <Swiper
                tag='div'
                className='product-swipe'
                wrapperTag='ul'
                loop= {true}
                slidesPerView = {1}
                spaceBetween = {30}
                modules={{Navigation}}
                navigation={{
                  //스와이퍼 외부에 컨트롤러 설정하기 
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }}
                onBeforeInit={(swiper) => {
                // 초기화 전에 네비게이션 버튼을 swiper에 할당
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                }}
                autoPlay = {
                    { delay: 3000 ,
                      disableOnInteraction: false}
                }
                speed = {1000}
                breakpoints={{ 
                  1200: { slidesPerView: 3, spaceBetween : 60 },
                  800: { slidesPerView: 2, spaceBetween : 30 } 
                }}
                >
                  {[
                  "main_product09.jpg",
                  "main_product10.jpg",
                  "main_product11.jpg",
                  "main_product12.jpg",
                  "main_product13.jpg",
                  "main_product14.jpg",
                  "main_product15.jpg",
                  "main_product16.jpg",
                ].map((image, index) => (
                  <SwiperSlide 
                    tag='li' 
                    key={index}>
                    <Link to={'/'}>
                      <span className="product-img">
                        <img
                          src={`./content/img/main/${image}`}
                          alt={`Product ${index + 1}`}
                        />
                      </span>
                      <span className="product-tit">Lorem ipsum dolor</span>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </section>
          <section className="main-sec03 main-con">
            <div className="wrap">
              <h2>
                ILOKE <strong>promotion</strong>
              </h2>
              <div className="prom-list">
                {promotions.map((group, groupIndex) => (
                  <ul key={groupIndex}>
                    {group.map((item, index) => (
                      <li key={index}>
                        <Link to={'/'}>
                          <div className="prom-img">
                            <img src={item.img} alt={item.title} />
                          </div>
                          <div className="prom-txt">
                            <b>{item.title}</b>
                            <span>{item.description}</span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          </section>
          <div id="smart-area">
            <div className="smart-wrap">
            <a
              href="/goods/goodsList">
                <i className="fa-solid fa-magnifying-glass"></i>
                <div className="smart-txt">
                  <span>내게 맞는 가구 찾으려면?</span>
                  <span>스마트 필터 이용하기</span>
                </div>
              </a>
            </div>
          </div>
          <div id="quick">
            <div className="quick-wrap">
              <div className="q-btn">
                <i className="fa-solid fa-plus"></i>
              </div>
              <ul className="q-list">
                <li className="q-all">
                <a
                  href="/goods/goodsList">
                    <i className="fa-solid fa-couch"></i>
                  </a>
                </li>
                <li className="q-up">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault(); // 기본 동작 방지
                      scrollToTop();
                    }}
                  >
                    <i className="fa-solid fa-arrow-up"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          {/* 나머지 섹션들 */}
        </div>
        </div>
      );
    };

export default Home;