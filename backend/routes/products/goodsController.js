const express = require('express');
const router = express.Router();
const conn = require('../../utils/dbUtil')

    router.get('/',async (req,res)=>{
        console.log('쇼핑몰 상품리스트 요청')
        try {
            const [ret] = await conn.execute(`
                select 
                id,
                name,
                FORMAT(price, 0) AS price,
                discount
                from products`
            )
            res.json(ret)
        } catch (err) {  
            console.error('쇼핑몰 상품 리스트 sql 실패 : ', err.message)
            res.status(500).send(`쇼핑몰 상품 리스트 DB 오류: ${err.message}`)   
        }   
        
    })

    router.get(`/goodsDetail/:id`,async (req,res)=>{
            console.log('쇼핑몰 디테일 접근')
            try {
                const [ret] = await conn.execute(
                    `SELECT 
                        p.name AS name,  -- 상품 이름
                        p.price AS price,  -- 상품 가격
                        p.discount AS discount,  -- 상품 할인
                        ok.type AS option_keyword_type,
                        ok.name AS option_keyword_name,
                        ok.req AS option_keyword_req,
                        ok.status AS option_keyword_status,
                        ok.code AS option_keyword_code,
                        okv.code AS opkey_value_code,
                        okv.main_code AS opkey_value_main_code,
                        okv.type AS opkey_value_type,
                        okv.name AS opkey_value_name,
                        okv.price AS opkey_value_price,
                        okv.status AS opkey_value_status
                    FROM 
                        products p
                    JOIN 
                        product_detail pd ON p.id = pd.id
                    JOIN 
                        option_keyword ok ON pd.main_code = ok.code
                    JOIN 
                        opkey_value okv ON ok.code = okv.main_code  
                        -- option_keyword.code와 opkey_value.main_code가 일치하는 조건
                    WHERE 
                        p.id = ?
                        AND pd.main_code = okv.main_code
                        AND pd.code = okv.code
                        `,
                    [req.params.id]
                );
        
                res.json(ret);
    
            } catch (err) {  
                console.error('쇼핑몰 상품 디테일 sql 실패 : ', err.message)
                res.status(500).send('쇼핑몰 상품 디테일 db 오류')   
            }  
            
        })

    module.exports = router;