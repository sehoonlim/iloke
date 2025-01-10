const express = require('express');
const router = express.Router();
const conn = require('../utils/dbUtil'); // DB 유틸 가져오기


// 로그인 처리
router.post('/', async (req, res) => {
    const { userId, password } = req.body;

    try {
        // 관리자 확인 쿼리 실행
        const [rows] = await conn.query(
            `SELECT 1 FROM mem_info WHERE id = ? AND pw = ? AND role = ?`,
            [userId, password, '관리자']
        );

        // 결과 확인
        if (rows.length > 0) {
            // 세션에 사용자 정보 저장
            req.session.user = userId;
            req.session.role = '관리자'; // 추가 정보 저장 (선택 사항)
            return res.json({ success: true, message: '로그인 성공', role: '관리자' });
        } else {
            // 로그인 실패 시 200 상태 코드와 실패 메시지 반환
            return res.json({ success: false, message: '아이디 또는 비밀번호가 틀렸거나 관리자 권한이 없습니다.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
});

module.exports = router;