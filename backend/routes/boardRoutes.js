const express = require('express');

const boardCountController = require('./board/boardCountController');
const promotionController = require('./board/promotionController');
const answerController = require('./board/answerController');
const registrationController = require('./board/registrationController');
const adminController = require('./board/adminController');

const router = express.Router();

    // 소스 로그 보는곳 이후 주석처리할것
router.use((req, res, next) => {
    // console.log(`///deps1: [${req.method}] ${req.url}`);
    // console.log(`///deps1: ${req.file}`);
    next();
});

router.use('/admin', adminController);  // 관리자 게시판 관련 라우터(공지사항, FAQ)
router.use('/answer', answerController);  // 사용자 게시판 관련 라우터(전체후기, 포토후기, 상품문의, 1:1문의)
router.use('/registration', registrationController);  // 사용자 게시판 관련 라우터(전체후기, 포토후기, 상품문의, 1:1문의)
router.use('/promotion', promotionController);  // 프로모션 게시판 관련 라우터(온라인 공식몰, 오프라인 쇼룸)
router.use('/count', boardCountController);

module.exports = router;
