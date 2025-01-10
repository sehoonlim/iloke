import React, { useState, useEffect } from "react";
import "./MyPage.css";
import { rFetchOrderCounts, rFetchUserOrders, rFetchMemberUserInfo, uConfirmPurchase, uRequestCancelOrReturn, rFetchMileageHistory } from '../../services/api';

const MyPage = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [recentOrders, setRecentOrders] = useState([]);
  const [orderCounts, setOrderCounts] = useState({
    배송준비: 0,
    배송중: 0,
    배송완료: 0,
   구매확정:0
  });

  const [returnCancelCounts, setReturnCancelCounts] = useState({
    취소: 0,
    반품: 0,
  });

  const [totalOrders, setTotalOrders] = useState(0); //  총 주문 수 추가
  const [currentPage, setCurrentPage] = useState(1); //  현재 페이지 추가
  const ordersPerPage = 10; //  한 페이지당 10개의 주문

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reason, setReason] = useState('');
  const [requestType, setRequestType] = useState(''); // 취소 or 반품 구분


  const [userInfo, setUserInfo] = useState({ name: '***', m_remain: 0, type: '일반회원등급' });

  const [filterStatus, setFilterStatus] = useState(''); //  주문 상태 필터 추가

  const cancelReasons = ['단순 변심', '상품 불량', '배송 지연', '기타'];
const returnReasons = ['단순 변심', '상품 불량', '사이즈 안 맞음', '기타'];

const [showMileageTable, setShowMileageTable] = useState(false);
const [mileageHistory, setMileageHistory] = useState([]);

const memberId = sessionStorage.getItem('userId') || sessionStorage.getItem('kakaoId');

const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

useEffect(() => {
  if (!memberId) {
    alert('로그인 정보가 없습니다. 다시 로그인 해주세요.');
    window.location.href = '/login';
  } else {
    setIsLoading(false);
  }
}, [memberId]);



//  주문 목록 가져오기 (페이징 추가)

const fetchOrders = async () => {
  try {
    const params = {
      page: currentPage,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      
    };

    
    const response = await rFetchUserOrders(memberId, params);
    setRecentOrders(response.data.recentOrders || []);
    setTotalOrders(response.data.totalOrders);
  } catch (error) {
    console.error(" 데이터 가져오기 오류:", error.message);
  }
};


useEffect(() => {
  fetchOrders();
}, [currentPage]);


//  주문 상태별 카운트 가져오기 함수 추가
const fetchOrderCounts = async () => {
  try {
    const response = await rFetchOrderCounts(memberId);  // API 호출
    // console.log(' 주문 상태 카운트 응답:', response.data);

    //  정확한 상태 매핑 (백엔드 응답에 맞춰 매핑)
    const counts = response.data.counts;
    // 필요한 상태만 설정
    const filteredCounts = {
      배송준비: parseInt(counts.배송준비) || 0,
      배송중: parseInt(counts.배송중) || 0,
      배송완료: parseInt(counts.배송완료) || 0,
      구매확정: parseInt(counts.구매확정) || 0,
    };

    // 취소와 반품 카운트도 별도로 저장 (렌더링에 사용하지 않음)
    setOrderCounts(filteredCounts);
    setReturnCancelCounts({
      취소: parseInt(counts.취소) || 0,
      반품: parseInt(counts.반품) || 0,
    });

  } catch (error) {
    console.error(" 주문 상태 카운트 가져오기 오류:", error.message);
  }
};

//  상단 상태별 카운트 가져오기 (페이지 로딩 시 1회만 실행)
useEffect(() => {
  fetchOrderCounts(); // 페이지 로드 시 상태 카운트를 가져옵니다.
}, []);

// useEffect(() => {
//   fetchOrders();
// }, [startDate, endDate, currentPage]);

//  페이지 네이션 핸들러
const handlePrevPage = () => {
  if (currentPage > 1) setCurrentPage(currentPage - 1);
};

const handleNextPage = () => {
  if (currentPage < Math.ceil(totalOrders / ordersPerPage)) {
    setCurrentPage(currentPage + 1);
  }
};

const totalPages = Math.ceil(totalOrders / ordersPerPage); // 총 페이지 수 계산


  // 상단 회원이름, 마일리지 가져오기 함수 업데이트
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userType = sessionStorage.getItem('userType');
        if (userType === 'member') {
          const memberId = sessionStorage.getItem('userId');
          console.log('Fetching user info for general member:', memberId);
  
          const response = await rFetchMemberUserInfo(memberId);
          if (response && response.data && response.data.userInfo) {
            setUserInfo(response.data.userInfo);
          } else {
            console.error('Invalid response format:', response);
          }
        } else if (userType === 'kakao') {
          const nickname = sessionStorage.getItem('nickname') || 'Unknown User';
          console.log('Fetching user info for Kakao user:', nickname);
  
          const userInfo = { name: nickname, m_remain: 0, type: '카카오 유저' };
          setUserInfo(userInfo);
        } else {
          console.warn('No userType found in sessionStorage.');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
  
    fetchUserInfo();
  }, []);


// 날짜 필터 기능 시작
   


// 날짜 필터 조건 추가
const handleDateSearch = () => {
 
  
  //  시작일이 종료일보다 이후일 경우 경고 메시지 추가
  if (new Date(startDate) > new Date(endDate)) {
    alert('시작일은 종료일보다 이전이어야 합니다.');
    return;
  }

  fetchOrders(); //  조회 버튼 클릭 시에만 데이터 가져오기
};


//  초기화 버튼 동작 (날짜 빈 값으로 초기화하고 전체 데이터 가져오기)
const handleResetDate = () => {
  setStartDate(''); // 날짜 초기화 (빈 값)
  setEndDate(''); // 날짜 초기화 (빈 값)
  setCurrentPage(1); // 페이지를 1로 초기화
  fetchOrders(); // 모든 데이터를 다시 가져오기
};


//  구매확정 버튼 클릭 후 상태 변경 시 카운트도 새로고침
const handleConfirmPurchase = async (order) => {
  if (!order || !order.id || !order.total_price) {
    console.error(' 주문 정보가 누락되었습니다:', order);
    alert('주문 정보가 올바르지 않습니다.');
    return;
  }

  const requestData = {
    orderId: order.id,
    memberId: memberId,
    totalPrice: order.total_price
  };

 
  try {
    const response = await uConfirmPurchase(requestData);
    // console.log(' API 응답:', response.data);

    if (response.data.success) {
      alert('구매확정이 완료되었습니다.');
      const updatedOrders = recentOrders.map(o => 
        o.id === order.id ? { ...o, is_confirmed: 'Y' } : o
      );
      setRecentOrders(updatedOrders);
      fetchOrderCounts();
    }
  } catch (error) {
    console.error(" 구매확정 오류:", error.message);
  }
};

//  취소/반품 요청 함수
//  취소/반품 요청 함수 (버튼 클릭 시 호출)
//  취소/반품 요청 함수
const handleRequest = (order, type) => {
  if (!order || !type) return; 

  // console.log(' [handleRequest] 취소 요청 - 주문:', order); 
  // console.log(' [handleRequest] 요청 유형:', type); 

  setSelectedOrder(order);
  setRequestType(type);
  
  //  조건부로 강제로 리렌더링을 유도 (false → true로 전환)
  setModalVisible(true); // 먼저 false로 설정하여 React가 변화를 감지
  // console.log(' [After] modalVisible (setTimeout 후):', true);
  // setTimeout(() => {
  //   //setModalVisible(true); // 다시 true로 설정 (1ms 후에 리렌더링 발생)
  //   console.log(' [After] modalVisible (setTimeout 후):', true);
  // }, 10);
};

useEffect(() => {
  //  상태 변경을 감지하고 modalVisible 상태 출력
  console.log(' [useEffect] modalVisible 상태가 변경되었습니다:', modalVisible);
}, [modalVisible]);

// 모달을 닫는 함수
const closeModal = () => {
  // console.log(' [closeModal] 모달이 닫힙니다.');
  setModalVisible(false);
  setSelectedOrder(null);
  setReason('');
};


//  모달 창의 "확인" 버튼 클릭 시 호출
const handleConfirmRequest = async () => {
  if (!selectedOrder || !reason) {
    alert("사유를 선택해주세요.");
    return;
  }

  const requestData = {
    orderId: selectedOrder.id, 
    reason: reason, 
    requestType: requestType
  };

  try {
    const response = await uRequestCancelOrReturn(memberId, requestData); //  API 호출

    if (response.data.success) {
      alert(`${requestType} 요청이 완료되었습니다.`);

      setRecentOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedOrder.id 
            ? { ...order, status: requestType === '취소' ? '취소요청' : '반품요청' } 
            : order
        )
      );

      fetchOrders();
      fetchOrderCounts();
    } else {
      alert(`${requestType} 요청에 실패했습니다.`);
    }
  } catch (error) {
    console.error(' 요청 오류:', error);
    alert('서버 요청 중 오류가 발생했습니다.');
  } finally {
    setModalVisible(false);
    setSelectedOrder(null);
    setReason('');
  }
};
// 주문의 상품정보를 가져올떄 여러가지 상품을 가져올시 노트북,호미,꿀,복숭아 가 아닌 노트북 외 3개 로 가져오는 로직
  const formatProductName = (productNames) => {
    if (!productNames) return '상품 정보 없음'; //  productNames가 null, undefined일 때 기본값 반환
    const products = productNames.split(', ');
    if (products.length > 1) {
      return `${products[0]} 외 ${products.length - 1}건`;
    }
    return products[0];
  };

const [loading, setLoading] = useState(false);

  // 마일리지 내역 가져오기
const fetchMileageHistory = async () => {
  setLoading(true);  // 로딩 시작
  try {
    const response = await rFetchMileageHistory(memberId);
    // console.log("서버 응답:", response.data); // 서버에서 받은 데이터를 확인
    setMileageHistory(response.data.mileageHistory);
    // console.log("마일리지 내역:", response.data.mileageHistory);
    // console.log("남은 마일리지 (m_remain):", response.data.m_remain);

    setShowMileageTable(true);

  } catch (error) {
    console.error(" 마일리지 내역 가져오기 오류:", error.message);
    alert("마일리지 정보를 가져오는 중 오류가 발생했습니다.");
  } finally {
    setLoading(false);  // 로딩 종료
  }
};

useEffect(() => {
  return () => {
    setModalVisible(false);
    setSelectedOrder(null);
    setReason('');
    setShowMileageTable(false);
  };
}, []);

// 로딩 중에는 아무것도 렌더링하지 않음
if (isLoading) {
  return null;
}

  return (
    <div className="wrap">
      <main className="main-content">
        <section className="mypage">
          <article className="mypage-top-wrap">
            <div className="mypage-top-info">
              {/*<span className="mypage-top-text">{userInfo.name}님의</span>*/}
              <p className="mypage-top-grade">
  {userInfo.name && userInfo.type ? (
    <>
      <span>{userInfo.name}</span>님의<br/>
      회원 등급은 <span className="mypage-grade">{userInfo.type}</span> 입니다.
    </>
  ) : (
    <span>회원 정보를 불러오는 중...</span>
  )}
</p>
            </div>
            <div className="mypage-top-wallet">
              <ul className="mypage-top-wallet-wrap">
                <li className="mypage-top-mileage">
                  <img
                    src="/content/img/sample/icon_mileage.png"
                    className="coupon-mileage"
                    alt="마일리지 아이콘"
                  />
                  <b className="coupon-title">마일리지</b>
                  <span className="coupon-count">
                  <a href="#" onClick={(e) => { e.preventDefault(); fetchMileageHistory(); }}>
                    {userInfo.m_remain.toLocaleString()}
                  </a>점
                  </span>
                </li>
                <li className="mypage-top-balance">
                <button 
                    className="memmodiButton" 
                    onClick={() => window.location.href = '/memModify1'}
                  >
                    회원정보수정
                  </button>

                  <button 
                    className="memdelButton" 
                    onClick={() => window.location.href = '/memDelete'}
                  >
                    회원탈퇴
                  </button>
                </li>
              </ul>
            </div>
          </article>

           {/* 마일리지 내역 테이블 또는 진행 중인 주문 정보 표시 */}
           {showMileageTable ? (
            <article className="mileageWrap">
              <h3>마일리지 내역</h3>
              <table className="mileageTable">
                <thead>
                  <tr>
                    <th style={{ width: "20%" }}>적립 날짜</th>
                    <th style={{ width: "30%" }}>적립 내용</th>
                    <th style={{ width: "20%" }}>유효 날짜</th>
                    <th style={{ width: "20%" }}>변동 내역</th>
                  </tr>
                </thead>
                <tbody id="boardBody">
                  {mileageHistory.length > 0 ? (
                    mileageHistory.map((item, index) => (
                      <tr key={index}>
                        <td>{item.earn_date}</td>
                        <td>{item.description}</td>
                        <td>{item.valid_date || "-"}</td>
                        <td>{item.change_val.toLocaleString()}점</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">마일리지 내역이 없습니다.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <button className="backButton" onClick={() => setShowMileageTable(false)}>
                돌아가기
              </button>
            </article>
          ) : (
            <>

          {/* 진행 중인 주문 */}
          <article className="mypage-order-wrap">
            <div className="mypage-order-title">
              <h3>진행 중인 주문</h3>
              <span>최근 30일 내에 진행중인 주문정보입니다.</span>
            </div>
           <div className="mypage-order-list">
           <div className="mypage-order">
  {Object.entries(orderCounts).map(([status, count], index) => (
    <div className="mypage-item" key={index}>
      <span className={`mypage-circle ${count > 0 ? "active" : ""}`}>{count}</span>
      <p>{status}</p>
    </div>
  ))}
</div>
<div className="mypage-order-exchange">
  <dl>
    <dt>취소</dt>
    <dd>{returnCancelCounts["취소"]}건</dd>  {/* returnCancelCounts에서 취소 상태 출력 */}
  </dl>
  <dl>
    <dt>반품</dt>
    <dd>{returnCancelCounts["반품"]}건</dd>  {/* returnCancelCounts에서 반품 상태 출력 */}
  </dl>
</div>
            </div>
          </article>

          <article className="mypage-date-wrap">
            <div className="mypage-date-title">
              <h3>주문목록 / 배송조회</h3>
            </div>
            <div className="mypage-date-check">
              {/* <div className="mypage-date-period">
                <span className="mypage-period-btn">조회기간</span>
                <button onClick={() => setDateRange(0)}>오늘</button>
                <button onClick={() => setDateRange(7)}>7일</button>
                <button onClick={() => setDateRange(15)}>15일</button>
                <button onClick={() => setDateRange(30)}>1개월</button>
                <button onClick={() => setDateRange(90)}>3개월</button>
                <button onClick={() => setDateRange(365)}>1년</button>
              </div> */}
              <div className="mypage-date-box">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                &nbsp;-&nbsp;
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="mypage-date-search">
                
              <div className="button-group1">
  <button
    className="mypage-date-search-btn"
    onClick={handleDateSearch}
  >
    조회
  </button>
  <button className="mypage-date-reset-btn" onClick={handleResetDate} style={{  backgroundColor: '#ff4d4f', color: '#fff', transition: 'background-color 0.3s' , width:'100px' }}>초기화</button>
</div>
              </div>
            </div>
          </article>

          {/* 최근 주문 정보 */}
          <article className="mypage-recent-wrap">
            <div className="mypage-recent-title">
              <h3>최근 주문 정보</h3>
              <span>최근 30일 내에 주문하신 내역입니다.</span>
            </div>
            <table className="order-table">
              <thead>
                <tr className="table-header">
                  <th>날짜/주문번호</th>
                  <th>상품명/옵션</th>
                  <th>상품금액/수량</th>
                  <th>주문상태</th>
                  <th>확인/리뷰</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, index) => (
                  <tr className="order-info" key={index}>
                   <td className="order-details">
  <ul>
    <li className="order-date">{order.date}</li>
    <li style={{ marginTop: '10px' }}>{order.id}</li>
  </ul>
</td>
                    <td className="order-prod">
                      <a href="#" className="order-link">
                        <div className="order-prod-area">
                          <img src={order.image} alt="상품 이미지" />
                          <span className="order-title"> <td>{formatProductName(order.product_names)}</td></span>
                        </div>
                      </a>
                    </td>
                    <td className="order-price">{order.total_price.toLocaleString()}</td>
                    <td className="order-deposit">
                    <td>
  {order.status}
  {order.status === '배송완료' && order.is_confirmed === 'Y' && (
          <div className="confirmed-text">
            구매확정됨
          </div>
        )}
</td>
                    </td>
                    <td className="order-review">
                    
                    {(order.status === '배송준비' || order.status === '배송중') && ( 
  <button 
    className="cancel-button" 
    onClick={() => handleRequest(order, '취소')}
  >
    취소 요청
  </button>
)}
  {order.status === '배송완료' && order.is_confirmed === 'N' && (
    <>
      <div className="button-group1">
  <button 
    className="action-button" 
    onClick={() => handleConfirmPurchase(order)}
  >
    구매확정
  </button>
  <button 
    className="action-button" 
    onClick={() => handleRequest(order, '반품')}
  >
    반품요청
  </button>
</div>

    </>
  )}
{order.status === '배송완료' && order.is_confirmed === 'Y' && (
  <>
    <button 
      className="action-button" 
      onClick={() => window.location.href = '/notice/customer_review'} //  클릭 시 이동
    >
      후기등록
    </button>
    {/* <span className="confirmed-text">구매확정됨</span> */}
  </>
)}

</td>
                  </tr>
                ))}
              </tbody>
            </table>




      {/*  */}

      {
  modalVisible && (
    <div 
      //key={`${selectedOrder?.id}-${requestType}`} // 🔥 매번 key가 다르게 하여 강제로 다시 렌더링
      className="modal-container"
    >
      <div className="modal-overlay" onClick={() => closeModal()}></div>
      <div className="modal">
        <h3>{requestType} 요청 사유 선택</h3>

        <select onChange={(e) => setReason(e.target.value)} value={reason}>
          <option value="">사유를 선택하세요</option>
          {requestType === '취소' && 
            cancelReasons.map((reason, index) => (
              <option key={index} value={reason}>{reason}</option>
            ))
          }
          {requestType === '반품' && 
            returnReasons.map((reason, index) => (
              <option key={index} value={reason}>{reason}</option>
            ))
          }
        </select>

        <button onClick={handleConfirmRequest}>확인</button>
        <button onClick={closeModal}>취소</button>
      </div>
    </div>
  )
}
      {/*  모달창을 반복문에서 빼내어 한번만 랜더링 되게 하였음 */}









 {/* 🔥 페이지 네이션 */}
 <div className="pagination">
              <button 
                onClick={handlePrevPage} 
                disabled={currentPage === 1}
              >
                이전
              </button>
              <span>페이지 {currentPage} / {totalPages}</span>
              <button 
                onClick={handleNextPage} 
                disabled={currentPage >= totalPages}
              >
                다음
              </button>
            </div>
          </article>
          </>
          )}
        </section>
      </main>
    </div>
  );
};

export default MyPage;