const express = require('express');
const router = express.Router();
const db = require('../../utils/dbUtil');



// 📘 회원 정보 조회 API
router.get('/userinfo', async (req, res) => {
  const memberId = req.headers['user-id']; // 🔥 헤더로 회원 ID 가져오기

  if (!memberId) {
    return res.status(400).json({ success: false, message: '회원 ID가 누락되었습니다.' });
  }

  try {
    const query = `SELECT name, m_remain, type FROM mem_info WHERE id = ?`;
    const [results] = await db.query(query, [memberId]);

    if (results.length > 0) {
      res.status(200).json({ success: true, userInfo: results[0] });
    } else {
      res.status(404).json({ success: false, message: '회원 정보를 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.error(' 사용자 정보 조회 오류:', error.message);
    res.status(500).json({ success: false, message: '사용자 정보 조회에 실패했습니다.' });
  }
});


// 📘 주문 목록 가져오기 (페이징 추가)
router.get('/', async (req, res) => {

  const memberId = req.headers['user-id'];

  if (!memberId) {
    return res.status(400).json({ success: false, message: '회원 ID가 누락되었습니다.' });
  }
  
  const { startDate = '', endDate = '', page = 1 } = req.query;

  const limit = 10; // 한 페이지에 보여줄 데이터 개수
  const offset = (page - 1) * limit; // 페이지에 따른 오프셋 계산

  const queryParams = [memberId]; //  수정 (기존 member_id -> memberId로 변경)
  let whereClause = "WHERE o.member_id = ?";

  if (startDate) {
    whereClause += " AND o.order_date >= ?";
    queryParams.push(startDate);
  }

  // 변경된 코드
if (endDate) {
  whereClause += " AND o.order_date < DATE_ADD(?, INTERVAL 1 DAY)";
  queryParams.push(endDate);
}

  try {
    //  총 주문 수 가져오기
    const countQuery = `
      SELECT COUNT(DISTINCT o.order_id) AS totalOrders 
      FROM \`order\` o 
      ${whereClause}
    `;
    const [countResult] = await db.query(countQuery, queryParams);
    const totalOrders = countResult[0].totalOrders;

    //  최근 주문 목록 가져오기 (LIMIT, OFFSET 추가)
    const recentOrdersQuery = `
      SELECT 
        o.order_id AS id, 
        DATE_FORMAT(o.order_date, '%Y/%m/%d') AS date, 
        GROUP_CONCAT(DISTINCT COALESCE(p.name, '상품 정보 없음') ORDER BY p.name SEPARATOR ', ') AS product_names, 
        COUNT(op.product_id) AS product_count, 
        o.total_price AS total_price, 
        MIN(d.order_status) AS status,
        ANY_VALUE(d.req_reasons) AS req_reasons,
        o.is_confirmed
      FROM \`order\` o 
      LEFT JOIN deliveries d ON o.order_id = d.order_id 
      LEFT JOIN order_product op ON o.order_id = op.order_id 
      LEFT JOIN products p ON op.product_id = p.id 
      ${whereClause} 
      GROUP BY o.order_id 
      ORDER BY o.order_date DESC 
      LIMIT ? OFFSET ?
    `;

    queryParams.push(limit, offset); // LIMIT과 OFFSET 추가

    const [recentOrders] = await db.query(recentOrdersQuery, queryParams);

    res.status(200).json({
      success: true,
      recentOrders: recentOrders,
      totalOrders: totalOrders //  총 주문 수 추가
    });
  } catch (error) {
    console.error('오류 발생:', error.message);
    res.status(500).json({ success: false, message: '데이터 조회 실패' });
  }
});


//  주문 상태별 카운트 API
router.get('/order-counts', async (req, res) => {
 const memberId = req.headers['user-id'];

if (!memberId) {
  return res.status(400).json({ success: false, message: '회원 ID가 누락되었습니다.' });
}

  try {
    const query = `
      SELECT 
        SUM(CASE WHEN d.order_status = '배송준비' THEN 1 ELSE 0 END) AS 배송준비,
        SUM(CASE WHEN d.order_status = '배송중' THEN 1 ELSE 0 END) AS 배송중,
        SUM(CASE WHEN d.order_status = '배송완료' THEN 1 ELSE 0 END) AS 배송완료,
        SUM(CASE WHEN o.is_confirmed = 'Y' THEN 1 ELSE 0 END) AS 구매확정,
        SUM(CASE WHEN d.order_status = '취소요청' THEN 1 ELSE 0 END) AS 취소,
        SUM(CASE WHEN d.order_status = '반품요청' THEN 1 ELSE 0 END) AS 반품
      FROM \`order\` o 
      LEFT JOIN deliveries d ON o.order_id = d.order_id
      WHERE o.member_id = ?
    `;

    const [results] = await db.query(query, [memberId]);

    res.status(200).json({ success: true, counts: results[0] });
  } catch (error) {
    console.error(' 상태별 카운트 가져오기 오류:', error.message);
    res.status(500).json({ success: false, messa6ge: '상태별 카운트 가져오기 실패' });
  }
});


// 구매확정 api

router.patch('/confirm', async (req, res) => {
  
  const { orderId, memberId, totalPrice } = req.body;

  

  if (!orderId || !memberId || !totalPrice) {
    return res.status(400).json({ 
      success: false, 
      message: '필수 데이터가 누락되었습니다.', 
      receivedData: req.body 
    });
  }

  try {
    await db.query(`
      UPDATE \`order\`
      SET is_confirmed = 'Y'
      WHERE order_id = ?
    `, [orderId]);

    const mileageAmount = Math.floor(totalPrice * 0.1);
    await db.query(`
      UPDATE mem_info
      SET m_remain = m_remain + ?
      WHERE id = ?
    `, [mileageAmount, memberId]);

    await db.query(`
      INSERT INTO mileage (\`id\`, \`change_val\`, \`description\`, \`earn_date\`, \`valid_date\`, \`reg_id\`)
      VALUES (?, ?, ?,NOW(),NOW(), ?)
    `, [memberId, mileageAmount, '구매확정 마일리지 적립', memberId]);

    res.status(200).json({ success: true, message: '구매확정이 완료되었습니다.', mileageAmount });
  } catch (error) {
    console.error('구매확정 오류 발생:', error.message);
    res.status(500).json({ success: false, message: '구매확정 처리에 실패했습니다.' });
  }
});

//  취소/반품 요청 API
router.patch('/request', async (req, res) => {

  const memberId = req.headers['user-id'];
if (!memberId) {
  return res.status(400).json({ success: false, message: '회원 ID가 누락되었습니다.' });
}

  const { orderId, reason, requestType } = req.body;

  //  디버깅: 요청 데이터 확인
  // console.log('🔍 요청 바디 데이터:', req.body);

  if (!orderId || !reason || !requestType) {
    return res.status(400).json({ 
      success: false, 
      message: '필수 데이터가 누락되었습니다.', 
      receivedData: req.body 
    });
  }

  try {
    const statusMap = {
      '취소': { status: '취소요청', dateColumn: 'cancel_req_date' },
      '반품': { status: '반품요청', dateColumn: 'return_req_date' }
    };

    if (!statusMap[requestType]) {
      return res.status(400).json({ success: false, message: '올바르지 않은 요청 유형입니다.' });
    }

    const { status, dateColumn } = statusMap[requestType];

    const updateQuery = `
      UPDATE deliveries 
      SET order_status = ?, ${dateColumn} = NOW(), req_reasons = ? 
      WHERE order_id = ?
    `;

    await db.query(updateQuery, [status, reason, orderId]);

    res.status(200).json({ success: true, message: `${requestType} 요청이 완료되었습니다.` });
  } catch (error) {
    console.error(' 요청 오류:', error);
    res.status(500).json({ success: false, message: `${requestType} 요청 처리에 실패했습니다.` });
  }
});

module.exports = router;