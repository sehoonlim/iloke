const express = require('express');
const router = express.Router();
const conn = require('../../utils/dbUtil'); // 데이터베이스 연결

router.post('/', async (req, res) => {
  const { name, email } = req.body;

  try {
    const sql = 'SELECT id FROM mem_info WHERE name = ? AND email = ?';
    const [rows] = await conn.execute(sql, [name, email]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: '등록된 정보가 없습니다.' });
    }

    res.json({ success: true, id: rows[0].id, name: rows[0].name });
  } catch (error) {
    console.error('아이디 찾기 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;