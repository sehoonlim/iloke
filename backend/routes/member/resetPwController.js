const express = require('express');
const router = express.Router();
const conn = require('../../utils/dbUtil'); // 데이터베이스 연결

// 비밀번호 재설정 라우트
router.post('/', async (req, res) => {
  const { userId, userPw } = req.body;

  // 비밀번호 유효성 검사 (숫자와 영문자를 모두 포함한 10글자 이상)
  const pwRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{10,}$/;

  if (!pwRegex.test(userPw)) {
    return res.status(400).json({ success: false, message: '비밀번호는 숫자와 영문자를 모두 포함한 10글자 이상이어야 합니다.' });
  }

  try {
    // 비밀번호 업데이트 쿼리
    const sql = 'UPDATE mem_info SET pw = ? WHERE id = ?';
    const [result] = await conn.execute(sql, [userPw, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: '존재하지 않는 아이디입니다.' });
    }

    res.json({ success: true, message: '비밀번호가 성공적으로 변경되었습니다.' });
  } catch (error) {
    console.error('비밀번호 변경 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;