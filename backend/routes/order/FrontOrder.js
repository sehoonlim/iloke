const express = require('express');
const router = express.Router();
const db = require('../../utils/dbUtil'); // 데이터베이스 연결 파일

router.post('/', async (req, res) => {
 //  수정 후 (order.js POST 라우트 전체)
 const { 
  member_id, 
  pay_method, 
  mileage_used, 
  total_price, 
  receiver_name, //  추가된 수령자 이름
  receiver_phone, //  추가된 수령자 전화번호
  receiver_address, //  추가된 수령자 주소
  orderItems = [] 
} = req.body;

 

  const connection = await db.getConnection();

  try {


    await connection.beginTransaction(); //  트랜잭션 시작

    //  order 테이블에 데이터 삽입**
    const orderQuery = `
    INSERT INTO \`order\` (
      member_id, 
      pay_method, 
      total_price, 
      mileage_used, 
      receiver_name, 
      receiver_phone, 
      receiver_address, 
      reg_id
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
  `;
    //  수정 후 (order.js의 order POST 라우트)
   

if (!Array.isArray(orderItems) || orderItems.length === 0) { // 🔥 cartItems 배열 확인 추가
  throw new Error('cartItems가 존재하지 않거나 빈 배열입니다.');
}

const [orderResult] = await connection.query(orderQuery, [
  member_id, 
  pay_method, 
  total_price, 
  mileage_used || 0, 
  receiver_name, 
  receiver_phone, 
  receiver_address, 
  member_id
]);

    // console.log(' 서버에 저장된 total_price:',  total_price);
    const orderId = orderResult.insertId; // 새로 생성된 order_id 가져오기

//  mem_info 테이블의 m_remain 업데이트 (마일리지 차감)
if (mileage_used > 0) {
  const updateMileageQuery = `
    UPDATE mem_info 
    SET m_remain = m_remain - ? 
    WHERE id = ?;
  `;
  await connection.query(updateMileageQuery, [mileage_used, member_id]);

  //  mileage 테이블에 마일리지 사용 내역 추가
  const mileageHistoryQuery = `
    INSERT INTO mileage (
      id, 
      change_val, 
      description, 
      valid_date, 
      reg_id
    ) 
    VALUES (?, ?, ?, NOW(), ?);
  `;
  await connection.query(mileageHistoryQuery, [
    member_id, 
    -mileage_used, 
    '상품 구매 마일리지 사용', 
    member_id
  ]);
}
    

    // order_product 테이블에 주문 상품 삽입**
    const orderProductQuery = `
    INSERT INTO order_product (
      order_id, 
      product_id, 
      quantity, 
      unit_price, 
      reg_id 
    ) 
    VALUES ?
  `;
   // orderItems 데이터를 기반으로 삽입할 데이터 준비
   const orderProductData = orderItems.map((item) => [
    orderId, 
    item.product_id, 
    item.quantity, 
    item.price, 
    member_id
  ]);
  
  // console.log('orderProductData:', orderProductData);
  
  await connection.query(orderProductQuery, [orderProductData]);



  
  

   

    //  배송 정보 추가 (deliveries 테이블)
    const deliveryQuery = `
      INSERT INTO deliveries (
        order_id, 
        member_id, 
        order_status, 
        reg_id
      ) 
      VALUES (?, ?, ?, ?);
    `;
    await connection.query(deliveryQuery, [
      orderId, 
      member_id, 
      '배송준비', 
      member_id
    ]);


     //  cart 테이블의 데이터 삭제 (회원의 장바구니 비우기)
 const cartDeleteQuery = `DELETE FROM cart WHERE member_id = ?;`;
 await connection.query(cartDeleteQuery, [member_id]);



    await connection.commit(); // 트랜잭션 커밋

    res.status(200).json({ 
      success: true, 
      message: '결제가 완료되었습니다.', 
      orderId 
    });

  }  catch (error) {
    await connection.rollback();
    console.error(' 결제 오류 발생:', error.message);
    res.status(500).json({ 
      success: false, 
      message: error.message //  오류 메시지 추가
    });
  } finally {
    connection.release(); // 연결 해제
  }
});


router.get('/:order_id', async (req, res) => {
  const { order_id } = req.params; // URL 파라미터에서 order_id 가져오기
  const memberId = req.headers['user-id']; // 🔥 userId를 헤더로 받음

  const query = `
  SELECT 
    o.order_id, 
    o.pay_method, 
    o.total_price,
     o.mileage_used,
    IFNULL(DATE_FORMAT(o.order_date, '%Y-%m-%d'), '0000-00-00') AS order_date, 
    o.receiver_name, --  수령자 이름 추가
  o.receiver_phone, --  수령자 전화번호 추가
  o.receiver_address, --  수령자 주소 추가
    ANY_VALUE(m.name) AS orderer_name, 
    ANY_VALUE(m.addr) AS delivery_address, 
    ANY_VALUE(m.phone_num) AS recipient_phone, 
    CONCAT(
  MIN(p.name), 
  IF(
    (SELECT COUNT(*) - 1 
     FROM ( 
       SELECT op2.product_id 
       FROM order_product op2 
       WHERE op2.order_id = o.order_id 
       GROUP BY op2.product_id 
     ) AS subquery
    ) > 0, 
    CONCAT(' 외 ', (SELECT COUNT(*) - 1 FROM (SELECT op2.product_id FROM order_product op2 WHERE op2.order_id = o.order_id GROUP BY op2.product_id) AS subquery), '건'), 
    ''
  )
) AS product_summary, 
    MAX(p.discount) AS product_discount, 
    o.total_price AS total_price, 

    JSON_ARRAYAGG( 
      JSON_OBJECT(
        'product_name', p.name, 
        'quantity', op.quantity, 
        'unit_price', op.unit_price, 
        'options', (
          SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'option_name', ok.name, 
            'option_value', ov.name, 
            'option_price', ov.price
          ))
          FROM product_detail pd
          JOIN opKey_value ov ON pd.code = ov.code 
          JOIN option_keyword ok ON pd.main_code = ok.code 
          WHERE pd.main_code = p.id --  이 부분이 핵심 (products 테이블의 id와 product_detail 연결)
        )
      )
    ) AS products
    
  FROM \`order\` o
  LEFT JOIN mem_info m ON o.member_id = m.id 
  LEFT JOIN order_product op ON o.order_id = op.order_id 
  LEFT JOIN products p ON op.product_id = p.id 
  
  WHERE o.order_id = ? AND o.member_id = ?
  
  GROUP BY o.order_id;
`;


  try {
    const [result] = await db.query(query, [order_id, memberId]); // SQL Injection 방지

    if (result.length) {
      res.status(200).json(result[0]); // 첫 번째 결과만 반환
    } else {
      res.status(404).json({ message: '주문 정보를 찾을 수 없습니다.', order_id }); // 상세 메시지 추가
    }
  } catch (error) {
    console.error(" 주문 정보 가져오기 실패:", error.message);
    console.error(" 에러 스택:", error.stack); // 에러 스택 추가로 더 많은 정보 제공
    res.status(500).json({ 
      message: '서버 에러가 발생했습니다.', 
      error: error.message 
    });
  }
});

module.exports = router;