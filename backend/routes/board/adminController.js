const express = require('express');
const uploadFile = require("../../utils/uploadUtil_bak");  // 수정된 uploadFile 유틸
const conn = require('../../db');
const router = express.Router();

// 조회
router.get('/', async (req, res) => {
    try {
        const [ret] = await conn.execute('SELECT * FROM file_manage');
        res.json(ret);
    } catch (err) {
        console.error('SQL 실패:', err.message);
        res.status(500).send('DB 오류');
    }
});

// POST 요청으로 파일 업로드 및 DB 저장
router.post('/', async (req, res) => {

    // 테스트값으로 세팅(난수값으로 변경)
    const id = `K${Date.now()}`;//"bd202411250006";    // id 값은 중복나지않게 바꿔서 테스트 <<
    const turn = 1;

    const api_url = req.originalUrl;
    const dsct = "비고란";
    const tempId = "dc4638";
    const reg_id = tempId;
    const upt_id = tempId;

    try {
        // 파일 업로드 및 DB 저장 처리
        const result = await uploadFile(req, res, id, turn, api_url, dsct, reg_id, upt_id);
        res.status(200).send(result); // 성공적으로 파일 업로드 및 저장된 메시지 반환
    } catch (error) {
        console.error('파일 업로드 오류:', error);
        res.status(500).send(error); // 에러 발생 시 에러 메시지 반환
    }
});

module.exports = router;
