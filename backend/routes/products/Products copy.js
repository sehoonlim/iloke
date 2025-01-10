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
                FORMAT(price, 0) AS price,
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
    
    router.get('/detail/:id',async (req,res)=>{
        console.log('디테일 접근')//확인
        try {
            const [ret] = await conn.execute(
                'select * from products where id = ?', 
                [req.params.id])

            // 상품과 관련된 파일 정보 조회
            const [files] = await conn.execute(
                'SELECT * FROM file_manage WHERE id = ?', 
                [req.params.id])

            res.json({
                ret: ret[0],
                files: files
            })

        } catch (err) {  
            console.error('sql 실패 : ', err.message)
            res.status(500).send('db 오류')   
        }  
        
    })

    router.post('/add',async(req,res)=>{

        // 상품고유아이디
        const id_num = new Date().getTime().toString().slice(-8); //getTime 뒤 10자리(랜덤숫자)
        const pro_id = `pd${id_num}`;
        let writeId = 'admin'

        // 테스트값으로 세팅(난수값으로 변경)
        const id = `K${Date.now()}`;//"bd202411250006";    // id 값은 중복나지않게 바꿔서 테스트 <<
        const turn = 1;
        const api_url = `${req.originalUrl}/${pro_id}`;
        const dsct = "비고란";
        const tempId = "dc4638";
        let reg_id = tempId;
        let upt_id = tempId;


        const file_name = [
            { name: 'upfile' }, 
            { name: 'upMultiFiles' }   
        ];

        try {
            // 파일 업로드 및 DB 저장 처리
            //단일파일
            console.log("파일업로드 진입");

            const result = await fieldsFile(req, res, id, file_name, api_url, dsct, reg_id, upt_id);
            
            if (!result || result.length === 0) {
                return res.status(500).send('파일 업로드 실패');
            }
            let detailExistValue = (result.upfile && Array.isArray(result.upfile) && result.upfile.length > 0) ? 1 : 0;
    
            // console.log('단일 파일 업로드 : ', result);
            
            //파일형식 처리 후 json 형식으로 자동 변환
            // 상품쿼리값
            let sql = `INSERT INTO products(id, name, price, discount, detail_exist, quan, status, benefit, reg_id, reg_date)`
                sql +=`VALUES (?,?,?,?,?,?,?,?,?,sysdate())`

            
            let data = [
                pro_id,
                req.body.name || '',
                req.body.price || 0,
                req.body.discount || 0,
                detailExistValue,
                req.body.quan || 0,
                req.body.status || '',
                req.body.benefit || '',
                writeId
            ]
            // console.log(sql);
            // console.log(data);

            
            const [ret] = await conn.execute(sql,data);

            // 파일 정보 삽입
            const fileSql = `INSERT INTO file_manage(id, turn, org_name, new_name) VALUES (?, ?, ?, ?)`;
            if (result.upMultiFiles && Array.isArray(result.upMultiFiles)) {
                for (let i = 0; i < result.upMultiFiles.length; i++) {
                    const fileData = [
                        pro_id,
                        i + 1,
                        result.upMultiFiles[i].originalname,
                        result.upMultiFiles[i].filename
                    ];
                    await conn.execute(fileSql, fileData);
                }
            }
    
            // 업로드된 단일 파일에 대해 저장 (첫 번째 파일만 저장)
            if (result.upfile && Array.isArray(result.upfile) && result.upfile.length > 0) {
                const fileData = [
                    pro_id,
                    0,  // 첫 번째 파일
                    result.upfile[0].originalname,
                    result.upfile[0].filename
                ];
                await conn.execute(fileSql, fileData);
            }


            // 옵션 + 키워드 등록
            const goodsCode = 1
            const detailCode = 1
            const dtId = "d"+ id_num;
            const dtTurn = 1

            // 옵션 키워드 배열 불러오기
            const optionKeywordSql =   `SELECT * FROM option_keyword WHERE status = true`;

            // 옵션 + 키워드 삽입
            const goodsDetailSql =  `INSERT INTO product_detail (main_code, code, id, turn, type, reg_id) 
                                    VALUES (?, ?, ?, ?, ?, ?)`;
            
            const [rows] = await conn.execute(optionKeywordSql);

            const maxGoodsCodeSql = `SELECT MAX(main_code) AS max_code FROM product_detail` //최대값 뽑아오기
            const [maxCodeResult] = await conn.execute(maxGoodsCodeSql);
            const newGoodsCode = maxCodeResult[0].max_code ? maxCodeResult[0].max_code + 1 : 1;

            const goodsData = rows.map((row, index) => [
                newGoodsCode, // 상품 코드
                row.code, // 옵션/키워드 코드
                dtId, // 고유 ID
                index + 1, // 순번
                row.type, // 옵션/키워드 타입
                reg_id
            ])

            //데이터 배열 삽입
            await Promise.all(
                goodsData.map(data => conn.execute(goodsDetailSql, data))
            )
            res.status(200).json({ message: '상품 등록 완료' })

        } catch (err) {
            console.error('상품 파일 업로드 오류:', err);
            res.status(500).send(`product DB 오류: ${err}`); // 에러 발생 시 에러 메시지 반환
        }

    })

    

    module.exports = router;