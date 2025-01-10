import React, { useState, useEffect } from "react";
import "./OrderPage.css";
import { fetchOrders, updateOrderStatus } from "../../services/api"; // 🔥 updateOrderStatus 추가

function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("전체");
  const [selectedPayMethod, setSelectedPayMethod] = useState("전체");
  const [selectedConfirmation, setSelectedConfirmation] = useState("전체");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState(""); // 기본값 없음
  const [endDate, setEndDate] = useState(""); // 기본값 없음
  const [filters, setFilters] = useState(null); // 조회 버튼 눌렀을 때의 필터 저장
  const itemsPerPage = 5;

  const statuses = ["전체", "배송준비", "배송중", "배송완료"];
  const payMethods = ["전체", "휴대폰", "신용카드"];
  const confirmations = ["전체", "구매확정", "구매미확정"];

  const fetchOrderList = async () => {
    if (!filters) return; // 조회 버튼을 누르기 전에는 요청하지 않음
    try {
      const params = {
        ...filters,
        page: currentPage,
        limit: itemsPerPage,
      };

      const response = await fetchOrders(params);
      setOrders(response.data.orders || []);
      setTotalOrders(response.data.total || 0);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrderList();
  }, [currentPage, filters]);

  const handleSearch = () => {
    // endDate가 존재할 경우, 하루를 추가
    let adjustedEndDate = "";
    if (endDate) {
      const dateObj = new Date(endDate);
      dateObj.setDate(dateObj.getDate() + 1); // 하루 추가
      adjustedEndDate = dateObj.toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 변환
    }
  
    setFilters({
      status: selectedStatus,
      payMethod: selectedPayMethod,
      confirmation: selectedConfirmation,
      search: searchTerm,
      startDate, // 그대로 전달
      endDate: adjustedEndDate, // 조정된 endDate 전달
    });
    setCurrentPage(1); // 검색 시 페이지 초기화
  };

  // 배송중,배송완료로 상태변화하는 함수
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await updateOrderStatus(orderId, newStatus); // 🔥 변경: axios 직접 호출 대신 updateOrderStatus 사용
      if (response.data.success) {
        alert(response.data.message);
        fetchOrderList(); // 주문 목록 다시 불러오기
      }
    } catch (error) {
      console.error("❌ 상태 변경 오류:", error);
    }
  };

  const handleReset = () => {
    setSelectedStatus("전체");
    setSelectedPayMethod("전체");
    setSelectedConfirmation("전체");
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setFilters(null); // 필터 초기화
    setOrders([]); // 주문 데이터 초기화
    setTotalOrders(0);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalOrders / itemsPerPage);

  return (
    <div className="inquiry-section">
      <div className="filter-header">
        <h1>주문 관리 페이지</h1>
      </div>

      <div className="mypage-date-check">
        <div className="mypage-date-period">
          <span className="mypage-period-text">기간</span>
        </div>

        <div className="mypage-date-box">
          <input
            type="date"
            className="mypage-first-date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span>~</span>
          <input
            type="date"
            className="mypage-last-date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="filter-container">
          <label style={{ marginLeft: "10px" }}>
            주문 상태:
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="filter-select"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label style={{ marginLeft: "10px" }}>
            결제 방법:
            <select
              value={selectedPayMethod}
              onChange={(e) => setSelectedPayMethod(e.target.value)}
              className="filter-select"
            >
              {payMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </label>

          <label style={{ marginLeft: "10px" }}>
            구매 확정:
            <select
              value={selectedConfirmation}
              onChange={(e) => setSelectedConfirmation(e.target.value)}
              className="filter-select"
            >
              {confirmations.map((confirm) => (
                <option key={confirm} value={confirm}>
                  {confirm}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* 여기 */}
        <div
          className="mypage-date-search"
          style={{ display: "flex", gap: "10px", marginLeft: "10px" }}
        >
          <button
            className="mypage-date-search-btn"
            onClick={handleSearch}
            style={{ flex: "1" }}
          >
            조회
          </button>
          <button
            className="mypage-date-reset-btn"
            onClick={handleReset}
            style={{ flex: "1", backgroundColor: "#ff4d4f", color: "#fff" }}
          >
            초기화
          </button>
        </div>
      </div>

      <div className="table_container">
        {orders.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>주문 ID</th>
                <th>회원 ID</th>
                <th>상태</th>
                <th>결제방법</th>
                <th>구매확정</th>
                <th>총 금액</th>
                <th>날짜</th>
                <th>상태 변경</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.order_id}>
                  <td>{order.order_id || "N/A"}</td>
                  <td>{order.member_id || "N/A"}</td>
                  <td>{order.status || "N/A"}</td>
                  <td>{order.payMethod || "N/A"}</td>
                  <td>{order.isConfirmed || "N/A"}</td>
                  <td>
                    {order.total ? `${order.total.toLocaleString()}원` : "N/A"}
                  </td>
                  <td>{order.order_date || "N/A"}</td>
                  <td>
                    {order.status === "배송준비" && (
                      <button
                        onClick={() =>
                          handleStatusChange(order.order_id, "배송중")
                        }
                      >
                        배송시작
                      </button>
                    )}
                    {order.status === "배송중" && (
                      <button
                        onClick={() =>
                          handleStatusChange(order.order_id, "배송완료")
                        }
                      >
                        배송완료
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-orders-message">조건에 맞는 주문이 없습니다.</p>
        )}
      </div>

      <div className="pagination-container">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={`page-${index + 1}`}
            className={currentPage === index + 1 ? "current" : ""}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default OrderPage;
