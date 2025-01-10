const express = require('express');
const conn = require('../utils/dbUtil');

const router = express.Router();

    // 소스 로그 보는곳 이후 주석처리할것
// router.use((req, res, next) => {
//     console.log(`///image: [${req.method}] ${req.url}`);
//     // console.log(`///deps1: ${req.file}`);
//     next();
// });

router.get('/', async (req, res, next) => {
    const query = ` SELECT 
                        turn, 
                        api_url, org_name, new_name, 
                        ext, path, size, dsct, 
                        reg_id, DATE_FORMAT(reg_date, '%Y-%m-%d %H:%i:%s') reg_date,
                        upt_id, DATE_FORMAT(upt_date, '%Y-%m-%d %H:%i:%s') upt_date
                    FROM file_manage
                    WHERE id = ? `;
    try {
        const [ret] = await conn.execute(query, [req.query.id]);
        res.json(ret);
    } catch (err) {
        console.error('SQL 실패: ', err.message);
        next(err); // 에러 미들웨어로 전달
    }
});

module.exports = router;
