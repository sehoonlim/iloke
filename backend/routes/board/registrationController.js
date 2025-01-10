const express = require('express');
const conn = require('../../utils/dbUtil');
const { singleFile } = require("../../utils/uploadUtil");

const router = express.Router();

router.use((req, res, next) => {
    next();
});

router.get('/', async (req, res, next) => {
    const { code, title, reg_id } = req.query;
    const query = `SELECT 
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
                    AND b.TITLE LIKE ?
                    AND b.REG_ID LIKE ?`;

    const params = [
        code,
        title ? `%${title}%` : '%',
        reg_id ? `${reg_id}` : '%'
    ];
    
    try {
        const [ret] = await conn.execute(query, params);
        res.json(ret);
    } catch (err) {
        console.error('SQL 실패: ', err.message);
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        let { id, title, contents, code, userId } = req.body;

        // 입력된 값 검증
        title = title && title.trim() !== '' ? title : '';
        contents = contents && contents.trim() !== '' ? contents : '';
        code = code && code.trim() !== '' ? code : '';
        userId = userId && userId.trim() !== '' ? userId : '';

        console.log('서버에 전달된 데이터 확인:', { id, title, contents, code, userId });

        if (!id || id === "null" || id === "undefined" || id === "") {
            const query = `SELECT 
                                CONCAT(
                                    'bd',
                                    DATE_FORMAT(NOW(), '%Y%m%d'),
                                    LPAD(
                                        IFNULL(
                                            MAX(CAST(SUBSTRING(id, 11, 4) AS UNSIGNED)) + 1,
                                            1
                                        ), 
                                        4, 
                                        '0'
                                    )
                                ) AS new_id
                            FROM board
                            WHERE id LIKE CONCAT('bd', DATE_FORMAT(NOW(), '%Y%m%d'), '%')`;

            try {
                const [rows] = await conn.execute(query);
                id = rows[0]?.new_id;
            } catch (err) {
                console.error('SQL 실패:', err.message);
                return next(err);
            }
        }

        const insertQuery = `INSERT INTO board (
                                id, code, title, contents, reg_id, reg_date, upt_id, upt_date
                            )
                            VALUES (
                                ?, ?, ?, ?, ?, NOW(), ?, NOW()
                            )
                            ON DUPLICATE KEY UPDATE
                                code = VALUES(code),
                                title = VALUES(title),
                                contents = VALUES(contents),
                                upt_id = VALUES(upt_id),
                                upt_date = VALUES(upt_date)`;

        const insertParams = [
            id,
            code,
            title,
            contents, // HTML 콘텐츠를 그대로 전달
            userId,
            userId
        ];

        const [ret] = await conn.execute(insertQuery, insertParams);
        res.json(ret);
    } catch (err) {
        console.error('서버에서 발생한 오류:', err.message);
        res.status(500).json({ error: '서버 오류가 발생했습니다. 다시 시도해 주세요.' });
    }
});


router.post('/image', async (req, res, next) => {
    let id = "";
    const query = `SELECT 
                        CONCAT(
                            'bd',
                            DATE_FORMAT(NOW(), '%Y%m%d'),
                            LPAD(
                                IFNULL(
                                    MAX(CAST(SUBSTRING(id, 11, 4) AS UNSIGNED)) + 1,
                                    1
                                ), 
                                    4, 
                                    '0'
                            )
                        ) AS new_id
                    FROM board
                    WHERE id LIKE CONCAT('bd', DATE_FORMAT(NOW(), '%Y%m%d'), '%')`;

    try {
        const [rows] = await conn.execute(query);
        id = rows[0]?.new_id;
    } catch (err) {
        console.error('SQL 실패:', err.message);
        return next(err);
    }

    try {
        const result = await singleFile(req, res, id, 1, req.originalUrl, "", "1", "1");

        const { title, contents, code, userId } = req.body;
        const boardTitle = title && title !== '' ? title : '';
        const boardContents = contents && contents !== '' ? contents : '';
        const boardCode = code && code !== '' ? code : '';
        const boardUserId = userId && userId !== '' ? userId : '';

        const insertQuery = `INSERT INTO board (id, code, title, contents, reg_id, reg_date, upt_id, upt_date)
                             VALUES (?, ?, ?, ?, ?, NOW(), ?, NOW())`;
        const insertParams = [id, boardCode, boardTitle, boardContents, boardUserId, boardUserId];

        const [ret] = await conn.execute(insertQuery, insertParams);
        res.json(ret);
    } catch (error) {
        console.error('파일 업로드 오류:', error);

        // 파일이 없을 경우, 파일 업로드 없이 데이터만 저장
        const { title, contents, code, userId } = req.body;
        const boardTitle = title && title !== '' ? title : '';
        const boardContents = contents && contents !== '' ? contents : '';
        const boardCode = code && code !== '' ? code : '';
        const boardUserId = userId && userId !== '' ? userId : '';

        const insertQuery = `INSERT INTO board (id, code, title, contents, reg_id, reg_date, upt_id, upt_date)
                             VALUES (?, ?, ?, ?, ?, NOW(), ?, NOW())`;
        const insertParams = [id, boardCode, boardTitle, boardContents, boardUserId, boardUserId];

        try {
            const [ret] = await conn.execute(insertQuery, insertParams);
            res.json(ret);
        } catch (err) {
            console.error('SQL 실패:', err.message);
            res.status(500).send(err.message);
        }
    }
});

module.exports = router;
