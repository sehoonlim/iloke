const express = require("express");
const router = express.Router();
const conn = require("../../utils/dbUtil");

// 아이디 중복 확인 라우터
router.post("/", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "아이디를 입력해주세요." });
  }

  try {
    const [results] = await conn.query("SELECT COUNT(*) AS count FROM mem_info WHERE id = ?", [id]);
    const isDuplicate = results[0].count > 0;

    res.json({ isDuplicate });
  } catch (error) {
    res.status(500).json({ message: "서버 오류 발생" });
  }
});

module.exports = router;