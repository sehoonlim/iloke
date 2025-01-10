const express = require('express');
const upload = require('../../config/multerConfig'); // Multer 설정 가져오기

const router = express.Router();

// 파일 업로드 라우트
router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('파일 업로드 실패');
    }
    res.json({
        message: '파일 업로드 성공',
        file: req.file,
    });
});

module.exports = router;