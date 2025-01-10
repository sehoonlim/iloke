const express = require('express');
const conn = require('../../utils/dbUtil');

const router = express.Router();

    // 소스 로그 보는곳 이후 주석처리할것
router.use((req, res, next) => {
    // console.log(`///deps2: [${req.method}] ${req.url}`);
    // console.log(`///deps1: ${req.file}`);
    next();
});

router.put('/', async (req, res, next) => {
    const { id } = req.query;
    
    if (!id) {
        return res.status(400).json({ error: 'id is required' });
    }

    // console.log(req.query); // id가 제대로 출력되는지 확인

    let query = `UPDATE board 
                SET read_no = read_no + 1
                WHERE id = ?`;

    try {
        const [ret] = await conn.execute(query, [id]);
        res.json(ret);
    } catch (err) {
        console.error('SQL 실패: ', err.message);
        next(err); // 에러 미들웨어로 전달
    }
});

module.exports = router;