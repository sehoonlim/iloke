const express = require('express');
const conn = require('../../utils/dbUtil')
const router = express.Router();

router.get('/',async (req,res)=>{
    console.log('option 백엔드 연결')
    
    const {reqe, status, name} = req.query;

    try {
        const [ret] = await conn.execute(`
            select 
                code,
                type,
                name,
                req,
                status,
                reg_id,
                DATE_FORMAT(reg_date, '%Y-%m-%d') as reg_date
            from option_keyword
            where type = 1
            and req LIKE ?
            and status LIKE ?
            and name LIKE ? `,
            [
                reqe?`${reqe}` : '%', 
                status?`${status}` : '%', 
                name?`%${name}%` : '%'
            ]);
        res.json(ret)
    } catch (err) {  
        console.error('option sql 실패 : ', err.message)
        res.status(500).send(`option DB 오류: ${err.message}`)   
    }   
    
});

router.post('/',async (req,res)=>{
    console.log('option 백엔드 post 연결')
    
    const tempId = "wsj";
    
    try{
        let reg_id = tempId;
        let upt_id = tempId;
    
        // 값 없을떄 null처리(500에러문제)
        const code = req.body.code !== undefined ? req.body.code : 0;
        const name = req.body.name || null;
        const opReq = req.body.req !== undefined ? req.body.req : 0;
        const status = req.body.status !== undefined ? req.body.status : 0;
        // const name = req.body.name;
        // const opReq = req.body.req;
        // const status = req.body.status;


        // name이 null이면 에러 처리
        if (!name) {
            return res.status(400).send("옵션명은 필수 입력입니다.");
        }
    
        let sql = '';
        let data = [];
        
        if(code){
            sql = `update option_keyword
                    set name = ?,
                        req = ?,
                        status = ?,
                        upt_id = ?,
                        upt_date = now()
                    where code = ?`;
            data = [
                name,
                opReq,
                status,
                upt_id,
                code
            ]
        }else{
            sql = `insert into option_keyword(type, name, req, status, reg_id, reg_date, upt_id, upt_date)
                    VALUES (1, ?, ?, ?, ?,sysdate(),?,sysdate())`;

            data = [
                name,
                opReq,
                status,
                reg_id,
                upt_id
            ];
        }

        const [ret] = await conn.execute(sql,data);

        const [now_code] = await conn.execute(`
            select 
            max(code) code
            from option_keyword`);

        res.json(now_code[0]);
    }
    catch(err) {
        console.error('옵션 등록 오류:', err);
        res.status(500).send(`option DB 오류: ${err}`); // 에러 발생 시 에러 메시지 반환
    }
    
})

module.exports = router;
    