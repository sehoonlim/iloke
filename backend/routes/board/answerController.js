const express = require('express');
const conn = require('../../utils/dbUtil');

const router = express.Router();

    // 소스 로그 보는곳 이후 주석처리할것
router.use((req, res, next) => {
    // console.log(`///deps2: [${req.method}] ${req.url}`);
    // console.log(`///deps1: ${req.file}`);
    next();
});

router.get('/', async (req, res, next) => {
    // 쿼리 매개변수에서 값 가져오기
    const { start_date, end_date, code, title, reg_id} = req.query;

    let query = `SELECT 
                        b.id, b.code, b.title, b.contents, b.read_no, b.score, 
                        CASE 
                            WHEN a.comment is null THEN '답변필요' 
                            ELSE '답변완료' 
                        END AS comment_yn,
                        CASE 
                            WHEN b.delete_yn = 0 THEN '활성' 
                            WHEN b.delete_yn = 1 THEN '삭제' 
                        END AS delete_yn,
                        b.reg_id, DATE_FORMAT(b.reg_date, '%Y-%m-%d %H:%i:%s') AS reg_date,
                        b.upt_id, DATE_FORMAT(b.upt_date, '%Y-%m-%d %H:%i:%s') AS upt_date,
                        a.comment 
                    FROM board b
                    LEFT OUTER JOIN answer a ON a.id = b.id
                    WHERE b.code = ?
                    AND b.reg_date BETWEEN ? AND ?
                    AND b.TITLE LIKE ?
                    AND b.REG_ID LIKE ?`;
                    
        // console.log("???"+req.originalUrl.startsWith('/mall'));

        if(req.originalUrl.startsWith('/mall')){
            query +=  ` AND b.delete_yn = 0`;
        }
        // console.log(query);

    const params = [
        code,
        `${start_date} 00:00:00`,
        `${end_date} 23:59:59`,
        title ? `%${title}%` : '%', // title 라이크절
        reg_id ? `${reg_id}` : '%' // reg_id가 빈 문자열이면 모든 데이터 아니면 값 조회
    ];
    
    try {
        const [ret] = await conn.execute(query, params);
        res.json(ret);
    } catch (err) {
        console.error('SQL 실패: ', err.message);
        next(err); // 에러 미들웨어로 전달
    }
});

router.post('/', async (req, res, next) => {
    const { id, contents, user } = req.body;

    const query = `INSERT INTO answer (id, turn, comment, delete_yn, reg_id, reg_date, upt_id, upt_date)
        VALUES (?, 1, ?, 0, ?, NOW(), ?, NOW())
        ON DUPLICATE KEY UPDATE
            comment = VALUES(comment),
            upt_id = VALUES(upt_id),
            upt_date = VALUES(upt_date)`;

    const params = [
        id,
        contents,
        user,
        user
    ];

    try {
        const [ret] = await conn.execute(query, params);
        res.json(ret);
    } catch (err) {
        console.error('SQL 실패: ', err.message);
        next(err); // 에러 미들웨어로 전달
    }
});


router.delete('/', async (req, res, next) => {
    const query = `UPDATE board 
                    SET delete_yn = CASE WHEN delete_yn = 0 THEN 1 
                                        WHEN delete_yn = 1 THEN 0 
                                        ELSE 0 
                                    END
                    WHERE id = ?`;

    // const params = [code, startDate, endDate, title, reg_id];

    try {
        const [ret] = await conn.execute(query, [req.query.id]);
        res.json(ret);
    } catch (err) {
        console.error('SQL 실패: ', err.message);
        next(err); // 에러 미들웨어로 전달
    }
});

module.exports = router;
