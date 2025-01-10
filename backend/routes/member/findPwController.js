const express = require('express');
const router = express.Router();
const conn = require('../../utils/dbUtil'); // 데이터베이스 연결

router.post('/', async (req, res) => {
  const { userId, userName } = req.body;

  try {
    const sql = 'SELECT id FROM mem_info WHERE id = ? AND name =?';
    const [rows] = await conn.execute(sql, [userId, userName]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: '회원정보가 일치하지 않습니다.' });
    }

    res.json({ success: true, message: '아이디가 확인되었습니다.' });
  } catch (error) {
    console.error('비밀번호 찾기 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;