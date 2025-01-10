const express = require('express');
const router = express.Router();
const conn = require('../../utils/dbUtil'); // 데이터베이스 연결 파일

// 사용자 정보 불러오기
router.get('/:id', async (req, res) => {
  const userId = req.params.id;
  const query = 'SELECT id, name, nick, email, phone_num, addr, DATE_FORMAT(birth_date, "%Y-%m-%d") AS birth_date FROM mem_info WHERE id = ?';

  try {
    const [results] = await conn.query(query, [userId]);
    if (results.length > 0) {
      res.json({ success: true, userData: results[0] });
    } else {
      res.json({ success: false, message: '사용자를 찾을 수 없습니다.' });
    }
  } catch (err) {
    console.error('사용자 정보 불러오기 오류:', err);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

// 사용자 정보 수정
router.put('/update', async (req, res) => {
    // console.log('modify2 update 진입')
  const { userId, pw, name, nick, email, phone_num, addr, birth_date } = req.body;
  // console.log(userId)

  try {
    let query;
    let params;

    // 비밀번호가 제공된 경우 비밀번호도 업데이트
    if (pw) {
      query = `
        UPDATE mem_info 
        SET pw = ?, name = ?, nick = ?, email = ?, phone_num = ?, addr = ?, birth_date = ? 
        WHERE id = ?
      `;
      params = [pw, name, nick, email, phone_num, addr, birth_date, userId];
    } else {
      // 비밀번호가 제공되지 않은 경우 비밀번호를 제외하고 업데이트
      query = `
        UPDATE mem_info 
        SET name = ?, nick = ?, email = ?, phone_num = ?, addr = ?, birth_date = ? 
        WHERE id = ?
      `;
      params = [name, nick, email, phone_num, addr, birth_date, userId];
    }

    await conn.query(query, params);
    res.json({ success: true, message: '회원정보가 수정되었습니다.' });
  } catch (err) {
    console.error('회원정보 수정 오류:', err);
    res.status(500).json({ success: false, message: '회원정보 수정 중 오류가 발생했습니다.' });
  }
});

module.exports = router;