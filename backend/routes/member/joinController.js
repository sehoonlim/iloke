const express = require('express');
const router = express.Router();
const conn = require('../../utils/dbUtil');

router.post('/join', async (req, res) => {
    const { id, pw, name, nick, birth_date, phone_num, email, addr } = req.body;

    if (!id || !pw || !name || !email || !phone_num || !addr) {
        return res.status(400).json({ success: false, message: '필수 항목이 누락되었습니다.' });
    }

    try {
        const sql = `
            INSERT INTO mem_info (id, pw, name, nick, birth_date, phone_num, email, addr, reg_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const data = [
            id,
            pw, // 비밀번호를 평문으로 저장 (권장하지 않음)
            name,
            nick || null,
            birth_date || null,
            phone_num,
            email,
            addr,
            id, 
        ];

        const [result] = await conn.execute(sql, data);

        res.json({ success: true, message: '회원가입이 완료되었습니다.' });
    } catch (error) {
        console.error('회원가입 오류:', error);
        res.status(500).json({ success: false, message: '회원가입 중 오류가 발생했습니다.' });
    }
});

module.exports = router;