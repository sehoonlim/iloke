const express = require('express');
const router = express.Router();
const conn = require('../../utils/dbUtil');

// 마일리지 내역과 잔여 마일리지 조회
router.get('/mileageHistory/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // 잔여 마일리지 조회
    const [memberInfo] = await conn.query(
      'SELECT m_remain FROM mem_info WHERE id = ?',
      [id]
    );

    // 마일리지 내역 조회
    const [mileageHistory] = await conn.query(
      `SELECT earn_date, description, valid_date, change_val
       FROM mileage
       WHERE id = ?
       ORDER BY earn_date DESC`,
      [id]
    );

    res.json({
      success: true,
      m_remain: memberInfo[0]?.m_remain || 0,
      mileageHistory: mileageHistory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '서버 오류 발생' });
  }
});

module.exports = router;