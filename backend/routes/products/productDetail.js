const express = require('express');
const router = express.Router();
const conn = require('../../utils/dbUtil')

router.get('/',async (req,res)=>{
    console.log('상품 디테일 요청')
    try {
        const [ret] = await conn.execute(`
            select 
            main_code,
            code,
            id,
            turn,
            type,
            reg_id,
            DATE_FORMAT(reg_date, '%Y-%m-%d') as reg_date,
            upt_id,
            DATE_FORMAT(upt_date, '%Y-%m-%d') as upt_date
            from product_detail`
        )
        res.json(ret)
    } catch (err) {  
        console.error('쇼핑몰 상품 리스트 sql 실패 : ', err.message)
        res.status(500).send(`쇼핑몰 상품 리스트 DB 오류: ${err.message}`)   
    }   
    
})



router.get('/:id', async (req, res) => {//지피티 참조
    const { id } = req.params;  // id를 파라미터로 받음
    console.log('상품 디테일 요청, id:', id);

    try {
        // product_detail 테이블에서 id에 해당하는 모든 정보를 가져옵니다
        const [productDetails] = await conn.execute(
            'SELECT * FROM product_detail WHERE id = ?',
            [id]
        );

        // product_detail에 해당하는 main_code 값을 추출
        const mainCodes = productDetails.map(item => item.main_code);

        // option_keyword 테이블에서 status = 1인 옵션들의 name과 type을 가져옵니다
        const [options] = await conn.execute(
            'SELECT code, name, type FROM option_keyword WHERE status = 1 AND code IN (?)',
            [mainCodes] // 해당 main_code 값에 해당하는 옵션을 찾습니다
        );

        const codeArrays = []; // main_code에 해당하는 code 배열
        const nameArrays = []; // main_code에 해당하는 name 배열
        const priceArrays = []; // main_code에 해당하는 price 배열
        const typeArrays = []; // main_code에 해당하는 type 배열

        // 옵션별로 opkey_value 테이블에서 가격과 name을 가져옵니다
        for (let i = 0; i < options.length; i++) {
            const option = options[i];

            // opkey_value 테이블에서 main_code에 해당하는 code 값 가져오기
            const [opkeyValues] = await conn.execute(
                'SELECT code, name, type, price FROM opkey_value WHERE main_code = ? AND status = 1',
                [option.code]
            );

            const codes = opkeyValues.map(item => item.code);  // 코드들
            const names = opkeyValues.map(item => item.name);  // 이름들
            const types = opkeyValues.map(item => item.type);  // 타입들
            const prices = opkeyValues.length ? opkeyValues.map(item => item.price) : [null]; // 가격이 없으면 null

            // 각 배열에 값을 추가
            codeArrays.push(codes);
            nameArrays.push(names);
            typeArrays.push(types);
            priceArrays.push(prices);
        }

        // 결과 데이터를 JSON으로 반환
        res.json({
            main_code: mainCodes,  // main_code 배열
            code: codeArrays,      // 각 main_code에 대한 code 배열
            name: nameArrays,      // 각 main_code에 대한 name 배열
            type: typeArrays,      // 각 main_code에 대한 type 배열
            price: priceArrays     // 각 main_code에 대한 price 배열
        });
    } catch (err) {
        console.error('상품 디테일 쿼리 실패: ', err.message);
        res.status(500).send(`상품 디테일 DB 오류: ${err.message}`);
    }
});




router.get('/:main_code/:id', async (req, res) => {
    const { main_code, id } = req.params
    // console.log(main_code)
    console.log('상품 디테일 요청')

    try {
        const [mainCodes] = await conn.execute(
            'SELECT DISTINCT main_code FROM product_detail WHERE id = ?',
            [id]
        )

        const codeArrays = []; // main_code에 code 담기
        const nameArrays = []; // main_code에 해당하는 name 담기
        const priceArrays = [] // 가격배열 추가

        for (let i = 0; i < mainCodes.length; i++) {

            const [codes] = await conn.execute(//codes
                'SELECT code FROM opkey_value WHERE main_code = ? AND status = 1',
                [mainCodes[i].main_code]
            )

            const [names] = await conn.execute(//names
                'SELECT name FROM opkey_value WHERE main_code = ?',
                [mainCodes[i].main_code]
            )
            // main_code에 해당하는 price 조회
            const [prices] = await conn.execute(
                'SELECT price FROM opkey_value WHERE main_code = ?',
                [mainCodes[i].main_code]
            );

            codeArrays.push(codes.map(item => item.code));// code  
            nameArrays.push(names.map(item => item.name));//name
            priceArrays.push(prices.length ? prices.map(item => item.price) : [null])//가격 없으면 null처리

        }
        res.json({
            main_code: mainCodes.map(item => item.main_code), // main_code 배열
            code: codeArrays, // 각 main_code에 대한 code 배열
            name: nameArrays ,
            price: priceArrays
        });
    } catch (err) {
        console.error('쇼핑몰 상품 리스트 SQL 실패: ', err.message);
        res.status(500).send(`쇼핑몰 상품 리스트 DB 오류: ${err.message}`);
    }
});

module.exports = router;