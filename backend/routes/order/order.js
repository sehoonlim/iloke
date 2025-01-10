const express = require('express');
const router = express.Router();
const db = require('../../utils/dbUtil'); // 데이터베이스 연결 파일

// 📘 주문 데이터 가져오기 API
router.get('/', async (req, res) => {
  const {
    status = "전체",
    payMethod = "전체",
    confirmation = "전체",
    search = "",
    startDate = "",
    endDate = "",
    page = 1,
    limit = 5,
  } = req.query;

  const offset = (page - 1) * limit;
  const queryParams = [];
  let whereClause = "WHERE d.order_status IN ('배송준비', '배송중', '배송완료')"; // 배송준비, 배송중, 배송완료만 조회

  //  주문 상태 필터 추가
  if (status !== "전체") {
    whereClause += " AND d.order_status = ?";
    queryParams.push(status);
  }

  //  결제 수단 필터 추가
  if (payMethod !== "전체") {
    whereClause += " AND o.pay_method = ?";
    queryParams.push(payMethod);
  }

  //  구매 확정 여부 필터 추가
  if (confirmation !== "전체") {
    whereClause += " AND o.is_confirmed = ? ";
    queryParams.push(confirmation === "구매확정" ? "Y" : "N");
  }

  //  검색어 필터 추가 (회원 ID, 이름, 이메일)
  if (search) {
    whereClause += ` AND (m.id LIKE ? OR m.name LIKE ? OR m.email LIKE ?)`;
    queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  //  시작일 필터 추가
  if (startDate) {
    whereClause += " AND o.order_date >= ?";
    queryParams.push(startDate);
  }

  //  종료일 필터 추가
  if (endDate) {
    whereClause += " AND o.order_date <= ?";
    queryParams.push(endDate);
  }

  try {
    //  전체 주문 개수 조회 쿼리
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM \`order\` o
      INNER JOIN deliveries d ON o.order_id = d.order_id
      INNER JOIN mem_info m ON o.member_id = m.id
     
      ${whereClause}
    `;
    const [[{ total }]] = await db.query(countQuery, queryParams);

    //  주문 데이터 조회 쿼리
    const dataQuery = `
      SELECT 
        o.order_id,
        o.member_id,
        m.name AS member_name,
        o.order_date,
        o.pay_method AS payMethod,
        o.is_confirmed AS isConfirmed,
        o.total_price AS total,
        d.order_status AS status
      FROM \`order\` o
      INNER JOIN deliveries d ON o.order_id = d.order_id
      INNER JOIN mem_info m ON o.member_id = m.id
      ${whereClause}
      ORDER BY o.order_date DESC
      LIMIT ? OFFSET ?
    `;
    queryParams.push(parseInt(limit), parseInt(offset));

    const [rows] = await db.query(dataQuery, queryParams);

    res.status(200).json({
      success: true,
      total,
      orders: rows,
    });
  } catch (error) {
    console.error(' 주문 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders. Please try again later.",
    });
  }
});

//  주문 상태 변경 API
router.patch('/status', async (req, res) => {
  const { orderId, newStatus } = req.body;

  if ( !orderId || !['배송중', '배송완료'].includes(newStatus)) {
    return res.status(400).json({ success: false, message: '올바르지 않은 요청입니다.' });
  }

  try {
    let updateQuery = '';
    if (newStatus === '배송중') {
      updateQuery = `
      UPDATE deliveries 
      SET order_status = ?, start_date = NOW() 
      WHERE order_id = ? 
      `;
    } else if (newStatus === '배송완료') {
      updateQuery = `
        UPDATE deliveries 
      SET order_status = ?, done_date = NOW() 
      WHERE order_id = ? 
      `;
    }

    await db.query(updateQuery, [newStatus, orderId]);

    res.status(200).json({ success: true, message: `상태가 ${newStatus}으로 변경되었습니다.` });
  } catch (error) {
    console.error(' 상태 변경 오류:', error);
    res.status(500).json({ success: false, message: '상태 변경에 실패했습니다.' });
  }
});

module.exports = router;