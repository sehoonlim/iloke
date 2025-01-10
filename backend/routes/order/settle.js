const express = require('express');
const router = express.Router();
const db = require('../../utils/dbUtil'); // 데이터베이스 연결 파일

// 매출 데이터 API
router.get('/', async (req, res) => {
    const { type = 'daily' } = req.query;

    let query = '';

    //  쿼리 작성 (테이블명 수정 및 GROUP BY 최적화)
    if (type === 'daily') {
        query = `
            SELECT 
                DATE_FORMAT(o.order_date, '%Y-%m-%d') AS date, 
                SUM(op.quantity * op.unit_price) AS sales
            FROM \`order\` o
            JOIN order_product op ON o.order_id = op.order_id
            GROUP BY DATE_FORMAT(o.order_date, '%Y-%m-%d')
            ORDER BY date ASC;
        `;
    } else if (type === 'monthly') {
        query = `
            SELECT 
                DATE_FORMAT(o.order_date, '%Y-%m') AS date, 
                SUM(op.quantity * op.unit_price) AS sales
            FROM \`order\` o
            JOIN order_product op ON o.order_id = op.order_id
            GROUP BY DATE_FORMAT(o.order_date, '%Y-%m')
            ORDER BY date ASC;
        `;
    } else if (type === 'yearly') {
        query = `
            SELECT 
                YEAR(o.order_date) AS date, 
                SUM(op.quantity * op.unit_price) AS sales
            FROM \`order\` o
            JOIN order_product op ON o.order_id = op.order_id
            GROUP BY YEAR(o.order_date)
            ORDER BY date ASC;
        `;
    } else if (type === 'product') {
        query = `
            SELECT 
                p.name AS product_name, 
                SUM(op.quantity) AS total_quantity, 
                SUM(op.quantity * op.unit_price) AS sales
            FROM order_product op
            JOIN products p ON op.product_id = p.id
            GROUP BY p.name
            ORDER BY total_quantity DESC;
        `;
    } else {
        // 유효하지 않은 type 처리
        return res.status(400).json({ message: 'Invalid type' });
    }

    // 쿼리 실행
    try {
        console.log('Executing Query:', query); // 디버깅 로그
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        console.error(' Error fetching sales data:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;