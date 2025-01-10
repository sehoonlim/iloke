const express = require('express');
const {fieldsFile} = require("../../utils/uploadUtil");
const conn = require('../../utils/dbUtil')
const router = express.Router();

router.get('/',async (req,res)=>{
    console.log('백엔드 연결')
    try {
        const [ret] = await conn.execute(`
            select 
            id,
            name,
            price,
            discount,
            detail_exist,
            quan,
            status,
            benefit,
            reg_id,
            DATE_FORMAT(reg_date, '%Y-%m-%d') as reg_date,
            upt_id,
            DATE_FORMAT(upt_date, '%Y-%m-%d') as upt_date
            from products`)
        res.json(ret)
    } catch (err) {  
        console.error('상품 sql 실패 : ', err.message)
        res.status(500).send(`상품 DB 오류: ${err.message}`)   
    }   
    
})