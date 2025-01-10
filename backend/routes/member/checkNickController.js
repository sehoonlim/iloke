const express = require("express");
const router = express.Router();
const conn = require("../../utils/dbUtil"); // 데이터베이스 연결 파일

// 닉네임 중복 확인
router.post("/", async (req, res) => {
    const { nick } = req.body;
  
    try {
      const [results] = await conn.query("SELECT COUNT(*) AS count FROM mem_info WHERE nick = ?", [nick]);
      const isDuplicate = results[0].count > 0;
      res.json({ isDuplicate });
    } catch (error) {
      res.status(500).json({ isDuplicate: false, message: "서버 오류 발생" });
    }
  });
  
  module.exports = router;