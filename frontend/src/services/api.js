import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_BACK_URL + "/api", // 환경 변수 사용
});

// CRUD 명칭 앞에 붙일 것
// c : [post] -> insert
// r : [get] -> select
// u : [put] -> update
// d : [delete] -> delete

// 게시판 관리
export const fetchBoards = () => API.get("/boards/admin");

export const insertBoards = (frmData) =>
  API.post("/boards/admin", frmData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updateBoards = () => API.put("/boards/admin");

// 이미지 호출
export const selectImageLoad = (id) => API.get(`/img`, { params: { id } });

// 답변 게시판
export const selectBoardAnswer = (myData) =>
  API.get(`/boards/answer`, { params: myData });
export const updateBoardAnswer = () => API.put("/boards/answer");
export const insertBoardAnswer = (myData) => API.post("/boards/answer", myData);
export const deleteBoardAnswer = (id) =>
  API.delete(`/boards/answer`, { params: { id } }); // 실제론 update

// 등록게시판
export const insertBoardRegistration = (myData) =>
  API.post("/boards/registration", myData);

// 상품 관리
export const selectProduct = () => API.get("/products");
export const selectProductDetail = (id) => API.get(`/products/detail/${id}`);
export const updateProduct = (id) => API.get(`/products/modify/${id}`);
export const insertProduct = (frmData) =>
  API.post("/products/add", frmData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

//상품디테일
export const selectDetail = () => API.get("/detail");
// export const selectDetailInfoId = (id) => API.get(`/detail/${id}`);
export const selectDetailInfo = (main_code, id) =>
  API.get(`/detail/${main_code}/${id}`);

//옵션
export const selectOption = (myData) => API.get(`/option`, { params: myData }); // 옵션 목록
export const insertOption = (editData) => API.post(`/option`, editData); // 옵션 등록
export const updateOption = (editData) => API.put(`/option`, editData); // 옵션 등록

// 옵션값
export const selectOptionVal = (code) => API.get(`/option/value/${code}`); // 옵션 디테일(값)
export const insertOptionVal = (myData) =>
  API.post(`/option/value/${myData.main_code}`, myData); // 옵션 디테일(값) 등록
export const updateOptionVal = (myData) =>
  API.put(`/option/value/${myData.main_code}`, myData); // 옵션 디테일(값) 등록

// 옵션+옵션값 동시
export const totalOptionVal = (main_code) =>
  API.get(`/option/value/${main_code}`); // 옵션 디테일(값) 등록

//키워드
export const selectKeyword = (myData) =>
  API.get(`/keyword`, { params: myData }); // 옵션 목록
export const insertKeyword = (editData) => API.post(`/keyword`, editData); // 옵션 등록
export const updateKeyword = (editData) => API.put(`/keyword`, editData); // 옵션 등록

// 키워드값
export const selectKeywordVal = (code) => API.get(`/keyword/value/${code}`); // 옵션 디테일(값)
export const insertKeywordVal = (myData) =>
  API.post(`/keyword/value/${myData.main_code}`, myData); // 옵션 디테일(값) 등록
export const updateKeywordVal = (myData) =>
  API.put(`/keyword/value/${myData.main_code}`, myData); // 옵션 디테일(값) 등록

// 회원 관리
export const fetchMem = (params) => API.get(`/member?${params.toString()}`);
export const detailMem = (id) => API.get(`/member/detail/${id}`);
export const deleteMem = (id) => API.delete(`/member/delete/${id}`);
export const joinMem = (data) => API.post("/member/join", data);
export const modifyMem = (myData) => API.put("/member/modify", myData);

// 관리자 로그인
export const loginAdmin = (userData) => {
  return API.post("/login", userData); // POST 요청
};

// 정산 관리
export const fetchSalesData = (type) =>
  API.get(`/settle`, { params: { type } });

// 주문 관리
export const fetchOrders = (params) => API.get(`/order`, { params }); // 주문 데이터 가져오기
export const fetchOrderDetail = (id) => API.get(`/order/${id}`); // 주문 상세 정보
export const confirmOrder = (orderId) =>
  API.post(`/order/confirm`, { order_id: orderId }); // 주문 구매확정
export const cancelOrder = (orderId, reason) =>
  API.put(`/order/cancel`, { order_id: orderId, reason }); // 주문 취소
export const modifyOrder = (data) => API.put(`/order/modify`, data); // 주문 수정

export const updateOrderStatus = (orderId, newStatus) =>
  API.patch(`/order/status`, { orderId, newStatus }); // 배송 상태 변경 (배송중, 배송완료)

// 환불 관리
export const fetchRefunds = (params) => API.get(`/refund`, { params }); // 환불 데이터 가져오기
export const updateRefundStatus = (refundId, status) =>
  API.patch(`/refund/${refundId}/update-status`, { status }); // 환불 상태 업데이트
export const updateRefundReason = (refundId, reason) =>
  API.patch(`/refund/${refundId}/update-reason`, { refuseReason: reason }); // 환불 거절 사유 업데이트
