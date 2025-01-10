const express = require('express') 
const router = express.Router() 
const conn = require('../../utils/dbUtil')  
const fs =  require('fs')      


module.exports = (upload)=>{

    router.get('/', async (req, res) => {
        const {
            id = "",
            name = "",
            type = "전체",
            level = "전체",
            startDate = "",
            endDate = "",
            page = 1,
            limit = 5,
        } = req.query;
    
        const offset = (page - 1) * limit;
        const queryParams = [];
        let whereClause = "WHERE 1=1"; // 기본 조건
    
        console.log("====== 요청받은 필터 값 ======");
        console.log("id:", id);
        console.log("name:", name);
        console.log("type:", type);
        console.log("level:", level);
        console.log("startDate:", startDate);
        console.log("endDate:", endDate);
        console.log("page:", page);
        console.log("limit:", limit);
        console.log("=============================");
    
        // 회원 ID 필터
        if (id) {
            whereClause += " AND id LIKE ?";
            queryParams.push(`%${id}%`);
        }
    
        // 회원 이름 필터
        if (name) {
            whereClause += " AND name LIKE ?";
            queryParams.push(`%${name}%`);
        }
    
        // 회원 구분 필터
        if (type !== "전체") {
            whereClause += " AND type = ?";
            queryParams.push(type);
        }
    
        // 회원 등급 필터
        if (level !== "전체") {
            whereClause += " AND level = ?";
            queryParams.push(level);
        }
    
        // 가입 날짜 필터
        if (startDate) {
            whereClause += " AND join_date >= ?";
            queryParams.push(startDate);
        }
        if (endDate) {
            whereClause += " AND join_date <= ?";
            queryParams.push(endDate);
        }
    
        console.log("====== 최종 Where 조건 ======");
        console.log(whereClause);
        console.log("Where 조건 매개변수:", queryParams);
        console.log("=============================");
    
        try {
            // 전체 데이터 개수 조회
            const countQuery = `
                SELECT COUNT(*) AS total
                FROM mem_info
                ${whereClause}
            `;
            
            const [[{ total }]] = await conn.execute(countQuery, queryParams);
    
            // 회원 데이터 조회
            const dataQuery = `
                SELECT id, name, phone_num, type, level, 
                DATE_FORMAT(join_date, '%Y-%m-%d %H:%i:%s') AS join_date, 
                DATE_FORMAT(last_date, '%Y-%m-%d %H:%i:%s') AS last_date
                FROM mem_info
                ${whereClause}
                ORDER BY join_date DESC
                 
            `;
            queryParams.push(Number(limit), Number(offset));


            // LIMIT ? OFFSET ?
    
            
    
            const [rows] = await conn.execute(dataQuery, queryParams);
    
            // 클라이언트로 응답
            res.status(200).json({
                success: true,
                total,
                members: rows,
            });
        } catch (error) {
            console.error("Error fetching members:", error.message);
            res.status(500).json({
                success: false,
                message: "Failed to fetch members. Please try again later.",
            });
        }
    });


    /* 회원 상세 정보 파트 */
    router.get('/detail/:id', async (req, res) => {
        console.log('member detail 진입');
    
        try {
            // 최근 접속일 업데이트 쿼리
        const updateLastDateSql = `UPDATE mem_info SET last_date = CURRENT_TIMESTAMP WHERE id = ?`;
        await conn.execute(updateLastDateSql, [req.params.id]);
        
            const sql = `
                SELECT 
                    m.id,
                    m.pw,
                    m.name,
                    m.nick,
                    DATE_FORMAT(m.birth_date, '%Y-%m-%d') AS birth_date,
                    m.phone_num, 
                    m.email,
                    m.addr,
                    m.role,
                    m.type,
                    m.level,
                    DATE_FORMAT(m.join_date, '%Y-%m-%d %H:%i:%s') AS join_date, 
                    DATE_FORMAT(m.last_date, '%Y-%m-%d %H:%i:%s') AS last_date,
                    m.m_remain, 
                    mi.turn,
                    DATE_FORMAT(mi.earn_date, '%Y-%m-%d %H:%i:%s') AS earn_date, 
                    mi.description,
                    DATE_FORMAT(mi.valid_date, '%Y-%m-%d %H:%i:%s') AS valid_date, 
                    mi.change_val
                FROM 
                    mem_info m
                LEFT JOIN 
                    mileage mi
                ON 
                    m.id = mi.id
                WHERE 
                    m.id = ?`;
    
            const [ret] = await conn.execute(sql, [req.params.id]);
    
            res.json(ret); // ret은 배열 형태로 반환됩니다.
        } catch (error) {
            console.log('sql 실패 : ', error.message)
            res.status(500).send('db 오류')
        }
    })
    
    
    

    /* 회원 등록 파트 */
    router.post('/join', async (req,res)=>{
        
        console.log('폼 데이터 확인:', req.body)

        let sql = 'insert into mem_info (id,pw,name,nick,birth_date,phone_num,email,addr, role, type, level, reg_id)'
            sql +=' values (?,?,?,?,?,?,?,?,?,?,?,?)'

        //한글인코딩
        // let newFName = Buffer.from(req.file.originalname,'latin1').toString('utf8');

        let data = [
            req.body.id,
            req.body.pw,
            req.body.name,
            req.body.nick || null, // NULL 허용
            req.body.birth_date || null, // NULL 허용
            req.body.phone_num || null, // NULL 허용
            req.body.email || null, // NULL 허용
            req.body.addr || null, // NULL 허용
            req.body.role || '회원',       // 기본값 '회원'
            req.body.type || '일반',       // 기본값 '일반'
            req.body.level || '브론즈',    // 기본값 '브론즈'
            req.body.reg_id                      
        ]  

        // console.log(data)

        try {
            const[ret] = await conn.execute(sql,data)   
            res.json(ret[0])

        } catch (error) {
            console.log('sql 실패 : ', error.message)
            res.status(500).send('db 오류')
        }
    })


    /* 회원정보 삭제 파트 */
    router.delete('/delete/:id',async(req,res)=>{

      console.log('삭제 진입:'+req.params.id)
                
    //   console.log(req.body)

      // 데이터베이스 삭제
          try {
            const [ret] = await conn.execute(
                'delete from mem_info where id = ?',  // mem_info 테이블에서 특정 ID를 가진 회원 데이터를 삭제
                [req.params.id])    // 삭제할 회원 ID

                res.send('삭제 성공 : '+req.params.id)  // 삭제 성공 시 클라이언트에 메시지 전송

        } catch (error) {     // SQL 실행 실패 시 에러 메시지를 출력하고 클라이언트에 오류 상태 전송
            console.log('sql 실패 : ', error.message)
            res.status(500).send('db 오류')
        }

    })


     /* 회원정보 수정 파트 */
     router.put('/modify',async(req,res)=>{
        
        let data = [        // 요청 데이터를 data 배열에 담음
                
                req.body.pw,
                req.body.name,
                req.body.nick || null,
                req.body.birth_date || null,
                req.body.phone_num || null,
                req.body.email || null,
                req.body.addr || null,
                req.body.role,
                req.body.type,
                req.body.level,
                req.body.upt_id,
                req.body.id
        ]

        // console.log(req.data)

        try{
            const [ret] = await conn.execute('update mem_info set pw=?, name=?, nick=?, birth_date=?, phone_num=?, email=?, addr=?, role=?, type=?, level=?, upt_id=? where id = ?',
                data)
            // 데이터베이스 연결 객체(conn)를 통해 SQL 쿼리를 실행
            // UPDATE 문 : member 테이블에서 특정 id를 가진 행의 데이터를 수정.
            // 각 ?는 data 배열의 요소로 대체.
        
            // console.log('수정완료',ret)
            res.send('수정성공')
        
        } catch (err) {
            console.log('sql 실패 : ', err.message)
            res.status(500).send('db 오류')
        }
        })

    return router;
}
