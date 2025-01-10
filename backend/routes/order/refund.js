const express = require("express");
const router = express.Router();
const db = require("../../utils/dbUtil"); // 데이터베이스 연결 파일

// 환불 데이터 가져오기
router.get("/", async (req, res) => {
  const { status = "전체", search = "", startDate = "", endDate = "", page = 1, limit = 5 } = req.query;

  const offset = (page - 1) * limit;
  let whereConditions = [];
  let params = [];

//  환불 관리 페이지에 노출하고 싶은 상태만 명확히 제한
whereConditions.push(`d.order_status IN ('취소요청', '취소완료', '반품요청', '반품완료')`);

  try {
    if (status !== "전체") {
      whereConditions.push("d.order_status = ?");
      params.push(status);
    }
    if (search) {
      whereConditions.push("o.member_id LIKE ?");
      params.push(`%${search}%`);
    }
    if (startDate) {
      whereConditions.push("o.order_date >= ?");
      params.push(startDate);
    }
    if (endDate) {
      whereConditions.push("o.order_date <= ?");
      params.push(endDate);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

    const dataQuery = `
      SELECT 
        o.order_id AS refund_id,
        o.member_id,
        d.order_status AS status,
        o.total_price AS amount,
        o.order_date AS date
      FROM deliveries d
      JOIN \`order\` o ON d.order_id = o.order_id
      ${whereClause}
      ORDER BY o.order_date DESC
      LIMIT ? OFFSET ?
    `;

    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await db.query(dataQuery, params);

    const countQuery = `
      SELECT COUNT(*) AS total 
      FROM deliveries d
      JOIN \`order\` o ON d.order_id = o.order_id
      ${whereClause}
    `;
    const [countResult] = await db.query(countQuery, params.slice(0, -2));
    const total = countResult[0]?.total || 0;

    res.json({ refunds: rows, total });
  } catch (error) {
    console.error("Error fetching refund data:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// 승인
router.patch("/:refundId/update-status", async (req, res) => {
  const { refundId } = req.params;
  const { status } = req.body; // 현재 상태 ("취소요청" 또는 "반품요청")

 

  let newStatus;
  let dateColumn;
  let mileageReturnDescription;

  // 상태 변환
  if (status === "취소요청") {
    newStatus = "취소완료";
    dateColumn = "cancel_done_date"; //  정상
    mileageReturnDescription = "주문 취소로 인한 마일리지 반환";
  } else if (status === "반품요청") {
    newStatus = "반품완료";
    dateColumn = "return_done_date"; //  오타! ateColumn → dateColumn 으로 변경 필요
    mileageReturnDescription = "주문 반품으로 인한 마일리지 반환";
  }  else {
   
    return res.status(400).json({ message: `알 수 없는 상태입니다: ${status}` });
  }

  

  try {
    // 상태 업데이트
    const updateQuery = `
      UPDATE deliveries
      SET order_status = ?, ${dateColumn} = NOW(), upt_date = NOW()
      WHERE order_id = ?
    `;
    const [updateResult] = await db.query(updateQuery, [newStatus, refundId]);

    if (updateResult.affectedRows === 0) {
      console.error("No rows affected for refundId:", refundId);
      return res.status(404).json({ message: "환불 데이터를 찾을 수 없습니다." });
    }

   

    // 마일리지 반환 처리
    const mileageQuery = `
      SELECT o.member_id, o.mileage_used
      FROM deliveries d
      JOIN \`order\` o ON d.order_id = o.order_id
      WHERE o.order_id = ?
    `;
    const [mileageResults] = await db.query(mileageQuery, [refundId]);

    if (mileageResults.length === 0) {
      console.error("No mileage data found for refundId:", refundId);
      return res.status(404).json({ message: "마일리지 데이터를 찾을 수 없습니다." });
    }

    const { member_id, mileage_used } = mileageResults[0];

    if (mileage_used > 0) {
      // console.log("Processing mileage refund:", { member_id, mileage_used });

      // 마일리지 반환 (+)
      const updateMileageSql = `
        UPDATE mem_info
        SET m_remain = m_remain + ?
        WHERE id = ?
      `;
      await db.query(updateMileageSql, [mileage_used, member_id]);

      // 마일리지 반환 기록
      const insertMileageSql = `
  INSERT INTO mileage (id, earn_date, description, valid_date, change_val, reg_id)
  VALUES (?, NOW(), ?, NOW(), ?, 'system')
`;
await db.query(insertMileageSql, [member_id, mileageReturnDescription, mileage_used]);
    }

    res.status(200).json({ message: "상태 업데이트 및 마일리지 반환 완료!" });
  } catch (error) {
    console.error("Error processing PATCH request:", error.message);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});



// 거절
router.patch("/:refundId/update-reason", async (req, res) => {
  const { refundId } = req.params;
  const { refuseReason } = req.body;

  if (!refuseReason) {
    return res.status(400).json({ message: "거절 사유가 필요합니다." });
  }

  try {
    const query = `
      UPDATE deliveries
      SET refuse_reasons = ?, upt_date = NOW()
      WHERE order_id = ?
    `;
    const [result] = await db.query(query, [refuseReason, refundId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "환불 데이터를 찾을 수 없습니다." });
    }

    res.status(200).json({ message: "거절 사유가 저장되었습니다." });
  } catch (error) {
    console.error("Error updating refusal reason:", error.message);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

module.exports = router;