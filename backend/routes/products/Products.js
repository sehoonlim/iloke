const express = require('express');
const {fieldsFile} = require("../../utils/uploadUtil");
const conn = require('../../utils/dbUtil')
const router = express.Router();
const bodyParser = require('body-parser');
const app = express();

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
        // const id_num = new Date().getTime().toString().slice(-8); //getTime 뒤 10자리(랜덤숫자)
        const id_num = `${Date.now()}`; //getTime 뒤 10자리(랜덤숫자)
        const pro_id = `K${Date.now()}`;
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

            //파일 불러오고나서 json설정 해줘야 body 읽어올수있음...
            app.use(bodyParser.json())
            app.use(bodyParser.urlencoded({ extended: true }))//드디어찾았다야바류ㅠㅠ
            
            const { details = [], ...productData } = req.body;
            // console.log('Received product data:', productData);  // 제품 데이터 확인가능
            // console.log('req.body')
            // console.log(req.body)

            const parsedDetails = details.map(detail => JSON.parse(detail))
            const dtId = "d"+ id_num;

            const insertDetailsQuery = `
                INSERT INTO product_detail (main_code, code, id, turn, type, reg_id)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            let turnCounter = 1;
            // 세부 정보 삽입
            const insertDetailsValues = parsedDetails.map((detail) => [
                detail.main_code,//상위 옵션/키워드 코드
                detail.code,//값 고유 코드
                pro_id,// 상품고유 ID
                turnCounter++,// 순서
                detail.type,//'옵션or키워드 구분
                'admin'
                ]);
            // console.log('insertDetailsValues:', insertDetailsQuery,insertDetailsValues);
            // console.log('details:', details);
            // console.log('parsedDetails:', parsedDetails);

            for (let i = 0; i < insertDetailsValues.length; i++) {
                await conn.execute(insertDetailsQuery, insertDetailsValues[i]);
            }
            //flat() : 여러 레코드를 하나의 배열로 합쳐서 전달
            res.status(200).json({ message: '상품 등록 완료' })

        } catch (err) {
            console.error('상품 파일 업로드 오류:', err);
            res.status(500).send(`product DB 오류: ${err}`); // 에러 발생 시 에러 메시지 반환
        }

    })


    router.put('/modify/:id',async(req,res)=>{
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
        // console.log(data)

    })

    

    module.exports = router;