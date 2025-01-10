const express = require('express');
const router = express.Router();
const db = require('../../utils/dbUtil'); // MySQL 연결 유틸리티

// 쇼룸 목록 조회 API
router.get('/', async (req, res) => {
  const { search = '', page = 1, limit = 10 } = req.query;

  const offset = (page - 1) * limit;
  const queryParams = [];
  let whereClause = 'WHERE 1=1'; // 기본 조건

  // 검색 필터 추가
  if (search) {
    whereClause += ' AND (name LIKE ? OR address LIKE ?)';
    queryParams.push(`%${search}%`, `%${search}%`);
  }

  try {
    // 총 데이터 수 조회
    const countQuery = `SELECT COUNT(*) AS total FROM showrooms ${whereClause}`;
    const [[{ total }]] = await db.query(countQuery, queryParams);

    // 페이징 데이터 조회
    const dataQuery = `
      SELECT id, name, address, phone, hours, image, lat, lng
      FROM showrooms
      ${whereClause}
     
    `;
    queryParams.push(parseInt(limit), parseInt(offset));

    const [rows] = await db.query(dataQuery, queryParams);

    res.status(200).json({
      success: true,
      total,
      pages: Math.ceil(total / limit), // 전체 페이지 수 계산
      showrooms: rows,
    });
  } catch (error) {
    console.error('쇼룸 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '쇼룸 데이터를 가져오는 데 실패했습니다.',
    });
  }
});

module.exports = router;

// LIMIT ? OFFSET ?