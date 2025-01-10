// //jquery // 헤더 / 메인만 사용
// $(function(){
//         ////////첫 로드 화면 스크롤 위치 인식
//         /////////0보다 높을때 header에 scroll 클래스 바로 주기
//         window.onload = function() {
//             const scrollY01 = window.scrollY;
//             if(scrollY01 > 0){
//                 $('header').removeClass('scroll');
//             }
//         };
//         /////////실시간 스크롤 위치 인식
//         function headerScroll(){
//             window.addEventListener('scroll', () => {
//                 const scrollY02 = window.scrollY;
//                 if(scrollY02 == 0 && $('#cont').val() == 0){
//                     $('header').addClass('scroll');
//                 }else if(scrollY02 > 0 && $('#cont').val() == 0){
//                     $('header').removeClass('scroll');
//                 }
//             });
//         }
//         headerScroll();


//         //메인 배너 위치 이후로 스크롤 내리면 네비 올라가고 스크롤 올리면 네비 내려옴
//         var lastScrollY = window.scrollY;
//         var bannerElement = document.querySelector('.main-banner');
//         var bannerHeight = bannerElement.offsetHeight; // 배너 높이
//         var bannerPosition = bannerElement.offsetTop; // 배너 위치
//         var banner = bannerPosition + bannerHeight; //배너 최종크기

//         window.addEventListener('scroll', () => {
//             const scrollY03 = window.scrollY;
//             // 배너 높이를 넘어서 스크롤 다운할 때
//             if (scrollY03 > banner && scrollY03 > lastScrollY) {
//                 // console.log('배너 이후로 스크롤');
//                 $('body').addClass('down');
//             }else{
//                 $('body').removeClass('down');
//             }

//             if(scrollY03 > lastScrollY){//스마트버튼
//                 $('body').addClass('smart_show');
//                 setTimeout(function(){
//                     $('.smart-wrap').addClass('btn_open');
//                 },800)//.8초뒤에 클래스추가

//             }else{
//                 $('body').removeClass('smart_show');
//                 setTimeout(function(){
//                     $('.smart-wrap').removeClass('btn_open');
//                 },500)//.5초뒤에 클래스삭제

//             }
//             lastScrollY = scrollY03;// 현재 스크롤 위치를 저장
//         });

//     /////////네비 
//     //오류있음 - 처음 화면 줄이고 모바일 네비 아코디언 확인하면 작동 안함
//     //해결완료
//     $('header').mouseover(function(){
//         $(this).addClass('on');
//     }).mouseleave(function(){
//         $(this).removeClass('on');
//     });

//     ///////// 메인메뉴 글자색 / 액티브
//     $('.header-wrap').on('mouseover', function() {
//         $('.gnb ul').on('mouseover', function() {
//             $('.gnb ul > li').addClass('gray');
//         });

//         $('.gnb ul > li').on('mouseover', function() {
//             $('.gnb ul > li').removeClass('active');
//             $(this).addClass('active');
//         });
//     });

//     $('header').mouseleave(function(){
//         $('.gnb ul > li').removeClass('active gray');
//     });

//     ///////// 모바일 햄버거버튼
//     $('.mbl_btn').click(function(e){
//         e.preventDefault();
//         $(this).toggleClass('open_01');
//         $('.resize .gnb').toggleClass('open_02');
//         $('.resize .gnb ul > li').removeClass('open_03');
        
//     });

//     ///////// 검색 아이콘 클릭 - 검색 화면 온오프
//     $('.nav-search').click(function(e){
//         e.preventDefault();
//         $('.nav-search-page').css('display','block');
//     });
//     $('.ns-close').click(function(){
//         $('.nav-search-page').css('display','none');
//     });

//     ///////// 인기 검색어
//     const popRank = $('#pop_rank li a');
// for (let i = 1; i <= popRank.length; i++) {
//     // 1️⃣ 이미 추가된 <span> 태그가 있으면 제거
//     $(popRank[i - 1]).find('span').remove();
//     // 2️⃣ 번호 다시 추가
//     $(popRank[i - 1]).prepend('<span>' + i + '.</span>');
// }//인기검색어 순위 적기 1 - 5

//     /////////최근 검색어
//     let isProcessing = false; // ✅ 중복 실행 방지 플래그 추가

// $(".ns-box label").off('click').on('click', function(e) {
//     if (isProcessing) return; // ✅ 중복 실행 방지 조건 추가
//     isProcessing = true; // ✅ 실행 중 상태로 변경

//     e.preventDefault();  
//     e.stopPropagation();

//     let ns_list = $('#nav_search').val().replace(/\s+/g, ' ').trim();

//     if (ns_list.length === 0) { 
//         alert('입력된 내용이 없습니다.');
//         $('#nav_search').val(''); 
//     } else if (ns_list.length >= 20) {
//         alert('20자 이하로 검색해주세요.');
//         $('#nav_search').val(''); 
//     } else {
//         let ttt = `<li><a href="#">${ns_list}</a>`;
//         ttt += '<i class="fa-solid fa-circle-xmark ns_remove"></i></li>';

//         if ($('#latest_rank li:contains('+ns_list+')').length === 0) { // ✅ 중복 검색어 추가 방지 조건 추가
//             $('#latest_rank').prepend(ttt); 
//         }

//         if ($('#latest_rank li').length > 5) {
//             $('#latest_rank li').last().remove(); // ✅ 마지막 li 삭제로 변경
//         }

//         $('#nav_search').val(''); // ✅ 리셋 코드 수정
//     }

//     setTimeout(() => isProcessing = false, 500); // ✅ 실행 후 0.5초 후에 중복 실행 가능
// });

//     $("#latest_rank").on("click", ".ns_remove", function() { // 검색어 삭제 클릭
//         $(this).parent('li').remove(); // 클릭된 li 요소 제거
//     });

//     ///////// 퀵버튼
//     $('.q-btn').click(function(){
//         $(this).toggleClass('q-open');
//         $(this).next('.q-list').toggleClass('show-q');
//         setTimeout(function(){
//             $('.q-list').toggleClass('q-delay');
//         },800);//.5초뒤에 클래스삭제
//     })

//     $('.q-up a').click(function(e) {
//         e.preventDefault(); // a 태그 클릭 동작 방지
        
//         $('html, body').animate({
//             scrollTop: 0 // 스크롤을 최상단으로 이동
//         }, 800); // 0.8초 동안 애니메이션
//     })

    
//     /////////첫화면 사이즈 인식
//     function open_chatroom(){
//         var windowWidth = $( window ).width();
        
//         if(windowWidth <= 1200) {//창 가로 크기가 1200 미만일 경우

//             $('header').addClass('resize');
//             $('.mbl_btn').removeClass('open_01');
//             $('.resize .gnb').removeClass('open_02');
//             $('.resize .gnb ul > li').removeClass('open_03');
            
//             $('.resize .gnb ul > li').off('click').on('click', function() {
//                 $('.gnb ul > li').not(this).removeClass('open_03');
//                 $(this).toggleClass('open_03');
//             });
//         } else {//창 가로 크기가 1200 이상
//             $('header').removeClass('resize');
//         }
//     }
//     open_chatroom();

//     ///////// 반응형(실시간)
//     $(window).resize(function() {
//         open_chatroom();
//     });


//     ///////// 스와이퍼 영역
//     const swiper01 = new Swiper('.main-banner', {
//         // Optional parameters
//         loop: true,
//         autoplay: {
//             delay: 4000,
//             disableOnInteraction: false,
//         },
//         effect: "fade",
//         speed : 1000,
//     });

//     const swiper02 = new Swiper('.product-swipe', {
//         loop: true,
//         slidesPerView : 1,
//         spaceBetween : 30,
//         navigation : {
//             prevEl : '.product-btn .btn-left',
//             nextEl : '.product-btn .btn-right',
//         },
//         autoplay: {
//             delay: 3000,
//             disableOnInteraction: false,
//         },
//         speed : 1000,
//         breakpoints: {
//             1200:{
//                 slidesPerView : 3,
//                 spaceBetween : 60,
//             },
//             800:{
//                 slidesPerView : 2,
//                 spaceBetween : 30,
//             },
//         }
//     });





// })//jquery end