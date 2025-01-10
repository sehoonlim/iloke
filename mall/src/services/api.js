import axios from 'axios';

const API = axios.create({
    baseURL: process.env.REACT_APP_BACK_URL + '/mall', // 환경 변수 사용
});

// crud 명칭 앞에 붙일것
// c : [post] -> insert
// r : [get] -> select
// u : [put] -> update
// d : [delete] -> delete

// 📦 게시판 관련 API
export const fetchBoards = () => API.get('/boards/admin');

export const insertBoardContent = (frmData) => API.post('/boards/registration', frmData);

export const insertBoardContentImage = (frmData) => API.post('/boards/registration/image', frmData); 

// export const insertBoardContentImage = (frmData) => API.post('/boards/registration/image', frmData, {
//   headers: {
//       'Content-Type': 'multipart/form-data',
//   }
// });

export const insertBoards = (frmData) => API.post('/boards/admin', frmData, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

export const updateBoards = () => API.put('/boards/admin');

// 하단에 관련 url 나열(바로 위에 코드 참고)

// 📦 이미지 관련 API
export const selectImageLoad = (id) => API.get(`/img`, { params: { id } });

// 📦 답변 게시판 관련 API
export const selectBoardAnswer = (myData) => API.get(`/boards/answer`,{ params: myData });
export const updateBoardAnswer = () => API.put('/boards/answer');
export const insertBoardAnswer = (myData) => API.post('/boards/answer', myData);
export const deleteBoardAnswer = (id) => API.delete(`/boards/answer`, { params: { id } });   // 실제론 update 

// 게시판 상세 조회시 count +1
// export const updateBoardCount = (id) => API.put(`/boards/count`, { params: { id } });
export const updateBoardCount = (id) => API.put(`/boards/count?id=${id}`);

// 📦 게시판 콘텐츠 조회 API (새로 추가됨)
export const getBoardContent = async (id) => {
    try {
        const response = await API.get(`/board/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching board content:", error);
        throw error;
    }
};

// 📦 상품 관련 API
export const proList = () => API.get('/products');
export const proAdd = (frmData) => API.post('/products/add', frmData, {
    headers: { 
        'Content-Type': 'multipart/form-data',
    },
});
export const productDetailSelect = (id) => API.get(`/products/${id}`);//상품상세
//쇼핑몰 상품
// export const goodsSelect = () => API.get('/goods/goodsList');//상품리스트API
export const goodsSelect = () => API.get('/goods/goodsList');//상품리스트API2
export const goodsDetailSelect = (id) => API.get(`/goods/goodsList/goodsDetail/${id}`);//상품상세

// 📦 장바구니 관련 API (새로 추가됨)
export const rFetchCartItems = (id) => API.get(`/cart/${id}`); // 장바구니 조회
export const dDeleteCartItem = (id) => API.delete(`/cart/${id}`); // 장바구니 항목 삭제

// 📦 주문 관련 API (새로 추가됨)
export const uSubmitOrder = (requestData) => API.post('/order', requestData); // 주문 생성

// 📦 마이페이지 관련 API (수정 완료)
export const rFetchOrderCounts = (memberId) => API.get('/mypage/order-counts', { 
    headers: { 'user-id': memberId } 
  });
export const rFetchOrderInfo = (orderId, userId) => API.get(`/order/${orderId}`, {
    headers: { 'user-id': userId } // 🔥 헤더에 userId 추가
  });

  export const rFetchUserOrders = (memberId, params = {}) => API.get('/mypage', { 
    params: { ...params }, 
    headers: { 'user-id': memberId } 
  });

export const rFetchMemberUserInfo = (memberId) => API.get('/mypage/userinfo', { 
    headers: { 'user-id': memberId } 
  });
export const uConfirmPurchase = (orderData) => 
    API.patch('/mypage/confirm', orderData);

export const uRequestCancelOrReturn = (memberId, requestData) => 
    API.patch('/mypage/request', 
      requestData, 
      {
        headers: { 'user-id': memberId } // 🔥 헤더에 추가
      }
    );

    // 🔥 신규 API 추가 (회원 잔여 마일리지 가져오기)
export const rFetchMileageInfo = (memberId) => 
  API.get(`/mypage/userinfo`, { 
    headers: { 'user-id': memberId } 
  });


export const rFetchMileageHistory = (memberId) => 
    API.get(`/mileage/mileageHistory/${memberId}`, {
      headers: { 'user-id': memberId } // 회원 마일리지
    });


// 회원 파트
export const memLogin = (id, pw) => API.post('/memlogin', { id, pw });                      // 회원 로그인
export const memJoin = (formData) => API.post('/member/join', formData);                    // 회원가입
export const findId = (name, email) =>  API.post('/find-id', { name, email });              // 회원 아이디 찾기
export const findPw = (userId, userName) => API.post('./find-pw', { userId, userName });                        // 회원 비밀번호 찾기
export const findPwReset = (userId, userPw) => API.post('./reset-pw', {userId, userPw})     // 회원 비밀번호 재설정
export const memDel = (userId, pw) => API.post('/memDel', { userId, pw });                  // 회원 탈퇴
export const checkPw = (userId, password) => API.post('/memModify1', { userId, password }); // 회원정보 수정 전 비밀번호 확인
export const fetchData = (userId) => API.get(`/memModify2/${userId}`);                      // 회원정보 수정 회원 정보 불러오기
export const checkNickDup = (nick) => API.post('/checkNick', { nick });                     // 닉네임 중복체크
export const updateUser = (dataToSend) => API.put('/memModify2/update', dataToSend);        // 회원정보 수정완료
export const checkIdDup = (id) => API.post('./checkId', { id });                            // 아이디 중복체크
