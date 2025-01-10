const express = require('express');
const router = express.Router();
const conn = require('../../utils/dbUtil'); // 데이터베이스 연결 파일 불러오기

// 회원탈퇴 API
router.post('/', async (req, res) => {
  const { userId, pw } = req.body; // 요청에서 userId와 pw 가져오기

  // console.log('세션에 저장된 userId:', userId);

  // 비밀번호가 입력되지 않은 경우
  if (!pw) {
    return res.status(400).json({ success: false, message: '비밀번호를 입력해 주세요.' });
  }

  try {
    // 데이터베이스에서 비밀번호 확인
    // console.log('입력된 비밀번호:', pw);

    const query = 'SELECT * FROM mem_info WHERE id = ?';
    const [results] = await conn.query(query, [userId]);

    // console.log('쿼리 결과:', results);

    const user = results[0];

    // 비밀번호 확인
    if (user.pw !== pw) {
      return res.status(401).json({ success: false, message: '비밀번호가 일치하지 않습니다.' });
    }

    // 비밀번호가 일치하면 회원 정보 삭제
    const updateQuery = 'UPDATE mem_info SET role = ? WHERE id = ?';
    await conn.query(updateQuery, ['탈퇴회원', userId]);

    // 세션 파기
    req.session.destroy((err) => {
      if (err) {
        console.error('세션 삭제 실패:', err);
        return res.status(500).json({ success: false, message: '세션 삭제 중 오류가 발생했습니다.' });
      }

      res.json({ success: true, message: '회원탈퇴가 완료되었습니다.' });
    });
  } catch (error) {
    console.error('회원탈퇴 실패:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;