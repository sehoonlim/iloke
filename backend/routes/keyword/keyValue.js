const express = require('express');
const conn = require('../../utils/dbUtil')
const router = express.Router();

//  소스 로그 보는곳 이후 주석처리할것
router.use((req, res, next) => {
 
    // console.log(`[${req.method}] ${req.url}`);
    next();
});

router.get('/:code',async (req,res)=>{//옵션값
    const optionCode = req.params.code;
    console.log('옵션 디테일 접근')//확인
    try {
        const [ret] = await conn.execute(`
            SELECT 
                main_code,
                code,
                type,
                name,
                price AS opVal_price,
                status,
                reg_id,
                DATE_FORMAT(reg_date, '%Y-%m-%d') AS reg_date,
                upt_id,
                DATE_FORMAT(upt_date, '%Y-%m-%d') AS upt_date
            FROM opkey_value
            WHERE main_code = ?
            AND type=1
            `, [optionCode])//?에 들어갈 값, url/code값
            // 옵션코드 = 옵션값 상위옵션코드 = url code값이 같은 데이터만 호출
            // = 하위 옵션값만 호출
        res.json(ret)
    } catch (err) {  
        console.error('option val sql 실패 : ', err.message)
        res.status(500).send(`option val DB 오류: ${err.message}`)   
    }   
    
})
router.post('/:code',async (req,res)=>{
    console.log('optionValue 백엔드 post 연결');
    let { code, name, opVal_price, status } = req.body;
    const optionCode = req.params.code;

    if(!code || code == "null" || code == null){
        const [new_code] = await conn.execute(`
            SELECT IFNULL(max(CODE)+1,1) code
            FROM opkey_value
            WHERE main_code = ?
            AND type=1
            `, [optionCode]);

        code = new_code[0].code;
    }
    
    const query =  `INSERT INTO 
                    opkey_value(main_code, CODE, type, NAME, price, status, reg_id, reg_date, upt_id, upt_date)
                    VALUES(?, ?, 1, ?, ?, ?, 'dc4638', NOW(), 'dc4638', NOW())
                    ON DUPLICATE KEY UPDATE
                    NAME = VALUES(NAME),
                    price = VALUES(price),
                    status = VALUES(status),
                    upt_id = VALUES(upt_id),
                    upt_date = VALUES(upt_date)`;

    let count = 0;

    try {

        let params = [
            optionCode,
            code,
            name,
            opVal_price,
            status
        ];

        await conn.execute(query, params);

        res.json(count);
    } catch (err) {
        console.error('SQL 실패: ', err.message);
        next(err); // 에러 미들웨어로 전달
    }
    
})

module.exports = router;
    