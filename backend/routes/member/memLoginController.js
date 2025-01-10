const express = require('express');
const router = express.Router();
const conn = require('../../utils/dbUtil'); // 데이터베이스 연결

router.post('/', async (req, res) => {
    const { id, pw } = req.body;
  
    try {
      const sql = 'SELECT * FROM mem_info WHERE id = ?';
      const [rows] = await conn.execute(sql, [id]);
  
      if (rows.length === 0) {
        return res.status(401).json({ success: false, message: '아이디가 존재하지 않습니다.' });
      }
  
      const user = rows[0];

      // role 값 로그로 확인
      // console.log('사용자 role:', user.role);

      // 탈퇴한 회원인지 확인
      if (user.role === '탈퇴회원') {
        return res.status(403).json({ success: false, message: '탈퇴한 회원입니다. 로그인할 수 없습니다.' });
      }
  
      // 비밀번호 검증 (평문 비교인 경우)
      if (user.pw !== pw) {
        return res.status(401).json({ success: false, message: '비밀번호가 일치하지 않습니다.' });
      }

      // 로그인 성공 시 세션에 userId 저장
      req.session.userId = user.id;

      // console.log('세션에 저장된 userId:', req.session.userId);
  
      res.json({ success: true, message: '로그인 성공!', user: { id: user.id, name: user.name } });
    } catch (error) {
      console.error('로그인 오류:', error);
      res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
  });
  
  module.exports = router;