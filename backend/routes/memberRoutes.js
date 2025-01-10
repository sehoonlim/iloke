const express = require('express');
const memberController = require('./member/memberController'); // memberController 경로 맞게 설정
const router = express.Router();

// 소스 로그 보는곳 (추가 로그 필요시 여기에 작성)
router.use((req, res, next) => {
    // console.log(`[${req.method}] ${req.url}`);
    next();
});

// 회원 관련 라우터
router.use('/member', memberController()); // memberController에서 정의된 라우터를 연결

module.exports = router;