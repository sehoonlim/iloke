const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session'); // 세션 모듈 추가
const upload = require("./utils/uploadUtil_bak");
const conn = require('./utils/dbUtil');

const imageLoadController = require('./routes/imageLoadController');
const boardRoutes = require('./routes/boardRoutes');
const proRouters = require('./routes/proRouters');
const dtRouters = require('./routes/products/productDetail');
const optionRoutes = require('./routes/optionRouters');
const keyRoutes = require('./routes/keyRouters');
const orderRoutes = require('./routes/order/order');
const refundRoutes = require('./routes/order/refund');
const settleRoutes = require('./routes/order/settle');
const AaaRoutes = require('./routes/order/aaa');

const FrontOrderRoutes = require('./routes/order/FrontOrder');  // 프론트 페이지
const CartRoutes = require('./routes/order/Cart'); // 프론트 페이지
const MyPageRoutes = require('./routes/order/MyPage'); // 프론트 페이지

const ShowRoomRoutes = require('./routes/order/showrooms'); // db

const memberRouter = require('./routes/member/memberController');
const loginController = require('./routes/loginController'); // 관리자 로그인

const memLoginController = require('./routes/member/memLoginController');       // 회원 로그인
const joinController = require('./routes/member/joinController');               // 회원가입
const findIdController = require('./routes/member/findIdController');           // 회원 아이디 찾기
const findPwController = require('./routes/member/findPwController');           // 회원 비밀번호 찾기
const resetPwController = require('./routes/member/resetPwController');         // 회원 비밀번호 변경
const memDelController = require('./routes/member/memDelController');           // 회원 탈퇴
const memModify1Controller = require('./routes/member/memModify1Controller');   // 회원 정보 수정 전 비밀번호 확인
const memModify2Controller = require('./routes/member/memModify2Controller');   // 회원 정보 불러오기 및 수정
const checkNickController = require('./routes/member/checkNickController');     // 닉네임 중복확인
const checkIdController = require('./routes/member/checkIdController');         // 아이디 중복확인
const mileageHistoryController = require('./routes/member/mileageController');  // 마이페이지 마일리지 내역

const goodsRoutes = require('./routes/products/goodsController'); // 쇼핑몰 상품 리스트

const kakaoController = require('./routes/member/kakaoController');

const app = express();

// 바디파서 설정
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 세션 설정
app.use(session({
  secret: '1234', // 세션 암호화용 키
  resave: false,             // 세션을 항상 저장할지 여부
  saveUninitialized: false,   // 초기화되지 않은 세션도 저장할지 여부
  cookie: { secure: false, httpOnly: false, }
}));

// CORS 설정
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5500"], // 프론트엔드 주소
  credentials: true,
}));

// 로깅 미들웨어 (필요시 주석 처리)
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// 정적 파일 서빙 (업로드된 파일 제공)
app.use('/image', express.static(path.join(__dirname, 'image')));

// 라우터 등록
app.use('/api/img', imageLoadController);     // front (관리자) 이미지 불러오기
app.use('/mall/img', imageLoadController);     // mall (쇼핑몰) 이미지 불러오기
app.use('/api/boards', boardRoutes);  // 게시판 관련 라우터
app.use('/api/products', proRouters); // 상품관리
app.use('/api/detail', dtRouters); // 상품관리
app.use('/api/option', optionRoutes); // 옵션관리
app.use('/api/keyword', keyRoutes); // 키워드관리
app.use('/api/order', orderRoutes);
app.use('/api/refund', refundRoutes);
app.use('/api/settle', settleRoutes); // 정산관리
app.use('/api/mileage', AaaRoutes);
app.use('/api/login', loginController); // 관리자 로그인 라우터
app.use('/api/settle', loginController); // 관리자 로그인 라우터
app.use('/api/member', memberRouter());
app.use('/api/showrooms', ShowRoomRoutes); // 지도

app.use('/mall/cart', CartRoutes); // 프론트 페이지
app.use('/mall/order', FrontOrderRoutes); // 프론트 페이지
app.use('/mall/mypage', MyPageRoutes); // 프론트 페이지

// 회원 파트
app.use('/mall/memlogin', memLoginController);      // 회원 로그인 라우터
app.use('/mall/member', joinController);            // 회원가입 라우터
app.use('/mall/find-id', findIdController);         // 회원 아이디 찾기 라우터
app.use('/mall/find-pw', findPwController);         // 회원 비밀번호 찾기 라우터
app.use('/mall/reset-pw', resetPwController);       // 회원 비밀번호 변경 라우터
app.use('/mall/memDel', memDelController);          // 회원 탈퇴 라우터
app.use('/mall/memModify1', memModify1Controller);  // 회원정보 수정 전 비밀번호 확인 라우터
app.use('/mall/memModify2', memModify2Controller);  // 회원정보 불러오기 및 수정 라우터
app.use('/mall/checkNick', checkNickController);    // 닉네임 중복확인
app.use('/mall/checkId', checkIdController);        // 아이디 중복확인
app.use('/mall/mileage', mileageHistoryController);  // 마이페이지 마일리지 내역

// 카카오 로그인 라우터
app.use('/api/login/kakao', kakaoController);

// 쇼핑몰 상품 리스트
app.use('/mall/goods/goodsList', goodsRoutes); // 상품 리스트

// 게시판 파트
app.use('/mall/boards', boardRoutes);  // 게시판 관련 라우터

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack); // 에러 스택 출력
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
