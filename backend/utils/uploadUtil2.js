const multer = require('multer');
const path = require('path');
const conn = require('./dbUtil');  // DB 연결 유틸

// 파일 저장 위치 및 파일명 설정
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'image/'); // 파일 저장 위치
        },
        filename: (req, file, cb) => {
            const orgFName = file.originalname;
            const ext = path.extname(orgFName);
            const fName = path.basename(orgFName, ext) + Date.now() + ext;
            const newFName = Buffer.from(fName, 'latin1').toString('utf8'); // 한글 파일명 인코딩 처리
            cb(null, newFName);
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 } // 파일 크기 제한 (5MB)
});

// 파일 업로드 후 데이터베이스에 저장 (Promise 반환)
const singleFile = (req, res, id, turn, api_url, dsct, reg_id, upt_id) => {
    return new Promise((resolve, reject) => {
        // console.log("id : "+id);        // 여기에는 중복되지 않을 id를 넣어주면 된다
        // 파일 업로드 미들웨어 호출
        upload.single('upfile')(req, res, (err) => {
            if (err) {
                console.log(err);
                reject('파일 업로드 실패'); // 업로드 실패 시
            } else if (!req.file) {
                reject('파일이 없습니다'); // 파일이 없을 경우
            } else {
                const file = req.file;
                const orgFName = file.originalname; // 원본 파일명
                const newFName = file.filename; // 새 파일명 (변경된 파일명)
                const ext = path.extname(orgFName); // 파일 확장자
                const size = file.size; // 파일 크기
                const save_path = 'image'; // 파일 저장 경로

                // 데이터베이스에 파일 정보 삽입
                const query = `
                    INSERT INTO file_manage (
                        id, 
                        turn, 
                        api_url, 
                        org_name, 
                        new_name, 
                        ext, 
                        path, 
                        size, 
                        dsct, 
                        reg_id, 
                        reg_date, 
                        upt_id, 
                        upt_date
                    ) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, NOW())
                `;
                const params = [id, turn, api_url, orgFName, newFName, ext, save_path, size, dsct, reg_id, upt_id];

                
                // 데이터베이스에 파일 정보 저장
                conn.execute(query, params).then((ret)=>{
                    resolve('파일 업로드 및 데이터베이스 저장 성공',ret); // 성공적으로 처리된 경우
                }).catch((err)=>{
                    reject('파일 데이터 입력 실패'); // DB 입력 실패 시
                })
            }
        });

        
    })
};

const multiFile = async(req, res, id, api_url, dsct, reg_id, upt_id) => {
    return new Promise((resolve, reject) => {
        //멀티파일 작업중
        upload.array('upMultiFiles',10)(req, res, async (err) => {
            if (err) {
                console.log(err);
                reject('파일 업로드 실패'); // 업로드 실패 시
            } else if (!req.files) {
                reject('파일이 없습니다'); // 파일이 없을 경우
            } else {
                const files = req.files;

                // file_manage 테이블 에서 가장 큰 turn 값을 max_turn 이름으로 가져오는 쿼리
                const maxTurn = 'select MAX(turn) as max_turn from file_manage';

                try{
                    const [rows] = await conn.execute(maxTurn);

                    //max_turn 값에 1 더해주기, 기본 turn 값 1(null 방지)
                    let turn = (rows[0].max_turn || 0) + 1;

                    // 배열 가져와서 하나씩 등록
                    console.log(files)
                    for (const file of files) {
                        console.log(file)
                        const orgFName = file.originalname; // 원본 파일명
                        const newFName = file.filename; // 새 파일명 (변경된 파일명)
                        const ext = path.extname(orgFName); // 파일 확장자
                        const size = file.size; // 파일 크기
                        const save_path = 'image'; // 파일 저장 경로

                        // 데이터베이스에 파일 정보 삽입
                        const query = `
                            INSERT INTO file_manage (
                                id, 
                                turn, 
                                api_url, 
                                org_name, 
                                new_name, 
                                ext, 
                                path, 
                                size, 
                                dsct, 
                                reg_id, 
                                reg_date, 
                                upt_id, 
                                upt_date
                            ) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, NOW())
                        `;
                        const params = [id, turn, api_url, orgFName, newFName, ext, save_path, size, dsct, reg_id, upt_id];

                        await conn.execute(query, params);//await형식으로 풀기
                        turn++;
                        console.log(`${orgFName} 멀티 파일 업로드 성공`);
                    }
                    resolve('멀티 파일 업로드 및 데이터베이스 저장 성공');
                }
                catch(error){
                    console.error('멀티파일 업로드 에러', error)
                    reject('멀티 파일 데이터 입력 실패'); // 멀티파일 DB 입력 실패
                }
                
                
            }
        });
    })
}

const fieldsFile = async (req, res, id, api_url, dsct, reg_id, upt_id) => {
    return new Promise((resolve, reject) => {
        // 파일 업로드 미들웨어 호출
        const dynamicUpload = upload.fields([
            { name: 'upfile' }, 
            { name: 'upMultiFiles' }   
        ]);

        dynamicUpload(req, res, async (err) => {
            if (err) {
                console.log(err);
                return reject('파일 업로드 실패'); // 업로드 실패 시
            }

            if (!req.files || Object.keys(req.files).length === 0) {
                return reject('업로드된 파일이 없습니다'); // 파일이 없을 경우
            }

            try {
                // 업로드된 파일 객체 가져오기
                const files = req.files; 
                console.log('업로드된 파일 목록:', files);

                // 각 필드의 파일 처리
                let turn = 1; // Turn 값 초기화 (DB에서 가장 큰 값 + 1로 설정 필요 시 추가 로직 필요)
                
                for (const fieldName in files) {
                    for (const file of files[fieldName]) {
                        const orgFName = file.originalname; // 원본 파일명
                        const newFName = file.filename; // 새 파일명 (변경된 파일명)
                        const ext = path.extname(orgFName); // 파일 확장자
                        const size = file.size; // 파일 크기
                        const save_path = 'image'; // 파일 저장 경로

                        // 데이터베이스에 파일 정보 삽입
                        const query = `
                            INSERT INTO file_manage (
                                id, 
                                turn, 
                                api_url, 
                                org_name, 
                                new_name, 
                                ext, 
                                path, 
                                size, 
                                dsct, 
                                reg_id, 
                                reg_date, 
                                upt_id, 
                                upt_date
                            ) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, NOW())
                        `;
                        const params = [id, turn, api_url, orgFName, newFName, ext, save_path, size, dsct, reg_id, upt_id];

                        // 데이터베이스에 파일 정보 저장
                        await conn.execute(query, params);
                        console.log(`${orgFName} 파일 업로드 및 DB 저장 성공`);
                        turn++; // 다음 turn 값 증가
                    }
                }

                resolve('모든 파일 업로드 및 데이터베이스 저장 성공');
            } catch (error) {
                console.error('파일 업로드 및 DB 저장 중 에러:', error);
                reject('파일 데이터 입력 실패');
            }
        });
    });
};

module.exports = { singleFile, multiFile, fieldsFile };