const express = require('express');
const router = express.Router();
const db = require('../../utils/dbUtil'); // 데이터베이스 연결 파일

//  장바구니 데이터 가져오기
router.get('/:userId', async (req, res) => {
  const memberId = req.params.userId; 

  // const { cartItems } = req.body;

  if (!memberId) {
    console.error(' 사용자 ID가 없습니다.');
    return res.status(400).json({
      success: false,
      message: '사용자 ID가 필요합니다.'
    });
  }

  const query = `
   SELECT 
    cart.cart_id, 
    cart.product_id, 
    cart.quantity, 
    cart.options, -- 🔥 추가된 options 컬럼
    cart.option_unit_price,
    products.name AS product_name, 
    products.price, 
    products.discount
  FROM cart 
  INNER JOIN products ON cart.product_id = products.id
  WHERE cart.member_id = ?
`;

  try {
    const [results] = await db.query(query, [memberId]);

    // console.log("cart 내역",memberId, results)


     // 클라이언트에서 계산한 final_price를 요청으로 받을 수 있는 경우
    //  const clientFinalPrice = req.body.finalPrice;
    // console.log('clientFinalPrice',clientFinalPrice)
    
    // 상품의 최종 가격 계산 및 옵션 문자열화
    const cartItems = results.map((item) => ({
      ...item,
      options: JSON.stringify(item.options), // 항상 문자열로 반환
       final_price: item.option_unit_price, // 
    }));

    // console.log("cartItems 데이터:", cartItems);
    res.status(200).json({
      success: true,
      cartItems,
    });
  } catch (error) {
    console.error("DB에서 장바구니 데이터를 가져오는 중 오류 발생:", error.message);
    res.status(500).json({
      success: false,
      message: "장바구니 데이터를 가져오는 중 오류가 발생했습니다.",
    });
  }
});



//  변경 후 - 요청 경로에 userId 추가하고 memberId를 params에서 받음
router.post('/:userId', async (req, res) => {
  const memberId = req.params.userId; //  URL 경로에서 userId 추출
  const { cartItems } = req.body; //  여러 상품 추가 가능 (배열로 받음)



  let connection; //  추가된 부분

  try {
    connection = await db.getConnection(); //  getConnection()으로 커넥션 가져오기
    await connection.beginTransaction(); //  트랜잭션 시작
  
    for (const item of cartItems) {
      const { productId, quantity, options , final_price } = item; 
  
     

      const optionsJson = typeof options === 'string' ? options : JSON.stringify(options || {});


  // 🔍 디버깅 코드 추가
  // console.log("저장 전 options 데이터:", options);
  // console.log("JSON.stringify 후 optionsJson 데이터:", optionsJson);

  const insertCartQuery = `
  INSERT INTO cart (member_id, product_id, quantity, options, reg_id, option_unit_price) 
  VALUES (?, ?, ?, ?, ?,?)
`;

      const [cartResult] = await connection.query(insertCartQuery, [memberId, productId, quantity,optionsJson, memberId, final_price]);
  
      const productDetailInsertQuery = `
        INSERT INTO product_detail (main_code, code, id, turn, type, reg_id) 
  VALUES (?, ?, ?, ?, ?, ?)
      `;
  
      const optionData = [
        { type: 'C', value: options.color }, 
        { type: 'L', value: options.leather }, 
        { type: 'S', value: options.stool } 
      ];
  
      for (const [index, option] of optionData.entries()) {
        if (option.value) {
          await connection.query(productDetailInsertQuery, [cartResult.insertId, index + 1, option.value, index + 1, option.type, memberId]);
        }
      }
    }
  
    await connection.commit(); //  커밋 (모두 성공 시에만)
    res.status(201).json({ success: true, message: '장바구니에 상품이 추가되었습니다.' });
  } catch (error) {
    if (connection) {
      await connection.rollback(); //  롤백 (오류 발생 시)
    }
    console.error('장바구니 추가 중 오류:', error);
    res.status(500).json({ success: false, message: '장바구니에 상품을 추가하는 중 오류가 발생했습니다.' });
  } finally {
    if (connection) {
      connection.release(); //  커넥션 반환
    }
  }
});

//  장바구니 데이터 삭제하기
router.delete('/:cartId', async (req, res) => {
  const { cartId } = req.params;

  const query = "DELETE FROM cart WHERE cart_id = ?";

  try {
    const [results] = await db.query(query, [cartId]);

    if (results.affectedRows > 0) {
      res.status(200).json({
        success: true,
        message: "장바구니에서 상품이 삭제되었습니다.",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "삭제할 상품을 찾을 수 없습니다.",
      });
    }
  } catch (error) {
    console.error("DB 삭제 실패:", error.message);
    res.status(500).json({
      success: false,
      message: "장바구니 상품 삭제 중 오류가 발생했습니다.",
    });
  }
});

module.exports = router;