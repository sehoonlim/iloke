const express = require('express');
const router = express.Router();
const db = require('../../utils/dbUtil'); // 데이터베이스 연결 파일

// 회원 정보 및 잔여 마일리지 조회 API
router.get('/', async (req, res) => {
  try {
    const membersSql = `
      SELECT 
        mi.id, 
        mi.name, 
        mi.nick, 
        mi.email, 
        mi.phone_num, 
        mi.m_remain AS total_mileage
      FROM mem_info mi
    `;
    const [members] = await db.query(membersSql);

    const ordersSql = `
      SELECT 
        o.order_id, 
        o.member_id, 
        o.total_price, 
        d.order_status, 
        o.is_confirmed 
      FROM \`order\` o
      INNER JOIN deliveries d ON o.order_id = d.order_id
    `;
    const [orders] = await db.query(ordersSql);

    res.json({ members, orders });
  } catch (err) {
    console.error('Error fetching member or order data:', err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// 구매확정 처리 API
router.post('/confirm', async (req, res) => {
  const { order_id } = req.body;

  try {
    const updateSql = `
      UPDATE \`order\`
      SET is_confirmed = 'Y'
      WHERE order_id = ? AND is_confirmed = 'N'
    `;
    
    const [updateResult] = await db.query(updateSql, [order_id]);

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: '구매확정할 수 없는 주문입니다.' });
    }

    const mileageSql = `
      UPDATE mem_info
      JOIN \`order\` ON mem_info.id = \`order\`.member_id
      SET mem_info.m_remain = mem_info.m_remain + ROUND(\`order\`.total_price * 0.1)
      WHERE \`order\`.order_id = ?
    `;
    await db.query(mileageSql, [order_id]);

    const insertMileageSql = `
      INSERT INTO mileage ( earn_date, description, valid_date, change_val, reg_user_id)
      SELECT 
        
        NOW(),
        CONCAT('주문 번호 ', o.order_id, ' 구매확정에 따른 마일리지 적립'),
        DATE_ADD(NOW(), INTERVAL 1 YEAR),
        ROUND(o.total_price * 0.1),
        'system'
      FROM \`order\` o
      WHERE o.order_id = ?
    `;
    await db.query(insertMileageSql, [order_id]);

    res.json({ message: '구매확정 처리 및 마일리지 적립 완료!' });
  } catch (err) {
    console.error('Error confirming purchase:', err);
    res.status(500).json({ error: 'Failed to confirm purchase' });
  }
});

// 구매확정 취소 처리 API
router.post('/cancel-confirmation', async (req, res) => {
  const { order_id } = req.body;

  try {
    const updateSql = `
      UPDATE \`order\`
      SET is_confirmed = 'N'
      WHERE order_id = ? AND is_confirmed = 'Y'
    `;
    const [updateResult] = await db.query(updateSql, [order_id]);

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: '구매확정을 취소할 수 없는 주문입니다.' });
    }

    const mileageSql = `
      UPDATE mem_info
      JOIN \`order\` ON mem_info.id = \`order\`.member_id
      SET mem_info.m_remain = mem_info.m_remain - ROUND(\`order\`.total_price * 0.1)
      WHERE \`order\`.order_id = ?
    `;
    await db.query(mileageSql, [order_id]);

    const insertMileageSql = `
  INSERT INTO mileage (earn_date, description, valid_date, change_val, reg_user_id)
  SELECT 
    NOW(),
    CONCAT('주문 번호 ', o.order_id, ' 구매확정 취소로 인한 마일리지 반환'),
    NULL,
    -(ROUND(o.total_price * 0.1)),
    'system'
  FROM \`order\` o
  WHERE o.order_id = ?
`;
await db.query(insertMileageSql, [order_id]);

    res.json({ message: '구매확정 취소 처리 및 마일리지 반환 완료!' });
  } catch (err) {
    console.error('Error canceling purchase confirmation:', err);
    res.status(500).json({ error: 'Failed to cancel purchase confirmation' });
  }
});

module.exports = router;