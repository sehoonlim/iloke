const express = require('express');
const router = express.Router();
const conn = require('../../utils/dbUtil'); // 데이터베이스 연결 파일

// 비밀번호 확인 라우터
router.post('/', async (req, res) => {
  const { userId, password } = req.body;
  // console.log('요청 데이터:', userId, password); // 요청 데이터 확인

  if (!userId || !password) {
    return res.status(400).json({ success: false, message: '아이디와 비밀번호를 모두 입력해주세요.' });
  }

  const query = 'SELECT * FROM mem_info WHERE id = ? AND pw = ?';

  try {
    const [results] = await conn.query(query, [userId, password]);
    // console.log('쿼리 결과:', results); // 쿼리 결과 확인

    if (results.length > 0) {
      return res.json({ success: true, message: '비밀번호가 일치합니다.' });
    } else {
      return res.status(401).json({ success: false, message: '비밀번호가 일치하지 않습니다.' });
    }
  } catch (err) {
    console.error('SQL 쿼리 오류:', err); // 쿼리 실행 중 오류 확인
    return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;