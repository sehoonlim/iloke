const express = require('express');
const router = express.Router();
const db = require('../../utils/dbUtil'); // 데이터베이스 연결

// 카카오 로그인 상태 업데이트
router.post('/', async (req, res) => {
  const { kakaoId, email, nickname } = req.body;

  try {
    console.log('Received kakaoId:', kakaoId, email, nickname);

    // 로그인 상태를 세션에 저장
    req.session.user = {
      id: kakaoId,
      email: email,
      nickname: nickname
    };

    res.json({ success: true, message: '로그인 성공', user: req.session.user });
  } catch (error) {
    console.error('로그인 처리 중 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;