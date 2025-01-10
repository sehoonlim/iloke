import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import {
  fetchRefunds,
  updateRefundStatus,
  updateRefundReason,
} from "../../services/api"; // API 함수 가져오기
import "./OrderPage.css";

Modal.setAppElement("#root");

function RefundPage() {
  const [refundData, setRefundData] = useState([]);
  const [totalRefunds, setTotalRefunds] = useState(0);

  const [selectedStatus, setSelectedStatus] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [startDate, setStartDate] = useState(""); // 시작일
  const [endDate, setEndDate] = useState(""); // 종료일
  const [filters, setFilters] = useState(null); // 필터 저장

  const [modalIsOpen, setModalIsOpen] = useState(false); // 모달 상태
  const [selectedRefundId, setSelectedRefundId] = useState(null); // 선택한 환불 ID
  const [rejectionReason, setRejectionReason] = useState(""); // 거절 사유
  const [rejectedRefunds, setRejectedRefunds] = useState({}); // 거절된 환불 저장

  const itemsPerPage = 5; // 한 페이지당 데이터 개수
  const statuses = ["전체", "취소요청", "취소완료", "반품요청", "반품완료"];
  const rejectionReasons = ["재고 부족", "상품 손상", "기타"];

  // 환불 데이터 가져오기
  const fetchRefundData = async () => {
    if (!filters) return; // 필터가 설정되지 않으면 요청하지 않음
    try {
      const params = {
        ...filters,
        page: currentPage,
        limit: itemsPerPage,
      };

      const response = await fetchRefunds(params);
      setRefundData(response.data.refunds || []);
      setTotalRefunds(response.data.total || 0);
    } catch (error) {
      console.error("Error fetching refund data:", error);
    }
  };

  useEffect(() => {
    fetchRefundData();
  }, [filters, currentPage]);

  const handleSearch = () => {

    let adjustedEndDate = "";
  if (endDate) {
    const dateObj = new Date(endDate);
    dateObj.setDate(dateObj.getDate() + 1); // 하루 추가
    adjustedEndDate = dateObj.toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 변환
  }

  setFilters({
    status: selectedStatus,
    startDate,
    endDate: adjustedEndDate, // 조정된 endDate를 전달
  });
  setCurrentPage(1); // 검색 시 페이지를 초기화
};

  const handleReset = () => {
    setSelectedStatus("전체");
    setStartDate("");
    setEndDate("");
    setFilters(null); // 필터 초기화
    setRefundData([]); // 데이터 초기화
    setTotalRefunds(0);
    setCurrentPage(1); // 페이지 초기화
  };

  const handleOpenModal = (refundId) => {
    setSelectedRefundId(refundId);
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    setRejectionReason("");
  };

  const handleConfirmReject = async () => {
    try {
      await updateRefundReason(selectedRefundId, rejectionReason); // API 호출
      setRejectedRefunds((prev) => ({
        ...prev,
        [selectedRefundId]: rejectionReason,
      }));
      alert("거절 사유가 저장되었습니다.");
      fetchRefundData();
    } catch (error) {
      console.error("Error updating rejection reason:", error);
      alert("거절 처리에 실패했습니다.");
    } finally {
      handleCloseModal();
    }
  };

  const handleStatusChange = async (refundId, currentStatus) => {
    try {
      await updateRefundStatus(refundId, currentStatus); // 상태 그대로 보냄
      alert("승인 요청이 전송되었습니다.");
      fetchRefundData(); // 데이터 갱신
    } catch (error) {
      console.error("Error updating status:", error);
      alert("승인 요청 처리에 실패했습니다.");
    }
  };

  const totalPages = Math.ceil(totalRefunds / itemsPerPage); // 총 페이지 수 계산

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="inquiry-section">
      <div className="filter-header">
        <h1>환불 관리 페이지</h1>
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
          <label>
            상태:
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
        </div>

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
        {refundData.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>환불 ID</th>
                <th>회원 ID</th>
                <th>상태</th>
                <th>금액</th>
                <th>날짜</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {refundData.map((refund) => (
                <tr key={refund.refund_id}>
                  <td>{refund.refund_id}</td>
                  <td>{refund.member_id}</td>
                  <td>{refund.status}</td>
                  <td>{refund.amount.toLocaleString()}원</td>
                  <td>{refund.date}</td>
                  <td>
                    {rejectedRefunds[refund.refund_id] ? (
                      <>
                        <span style={{ color: "red" }}>거절됨</span>
                        <br />
                        <span>사유: {rejectedRefunds[refund.refund_id]}</span>
                      </>
                    ) : refund.status === "취소요청" ||
                      refund.status === "반품요청" ? (
                      <>
                        <button
                          onClick={() =>
                            handleStatusChange(refund.refund_id, refund.status)
                          }
                        >
                          승인
                        </button>
                        <button
                          onClick={() => handleOpenModal(refund.refund_id)}
                        >
                          거절
                        </button>
                      </>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-orders-message">
            조건에 맞는 환불 데이터가 없습니다.
          </p>
        )}
      </div>

      <div className="pagination-container">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={`page-${index + 1}`}
            className={currentPage === index + 1 ? "current" : ""}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        style={{
          content: {
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "300px",
          },
        }}
      >
        <h2>거절 사유 선택</h2>
        <select
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
        >
          <option value="">사유를 선택하세요</option>
          {rejectionReasons.map((reason) => (
            <option key={reason} value={reason}>
              {reason}
            </option>
          ))}
        </select>
        <button onClick={handleConfirmReject} disabled={!rejectionReason}>
          확인
        </button>
        <button onClick={handleCloseModal}>취소</button>
      </Modal>
    </div>
  );
}

export default RefundPage;
