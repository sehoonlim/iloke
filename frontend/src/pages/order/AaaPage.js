import React, { useState, useEffect } from "react";
import axios from "axios";

const MileagePage = () => {
  const [members, setMembers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const fetchMembersAndOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/mileage");
      setMembers(response.data.members || []);
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("데이터를 가져오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPurchase = async (orderId) => {
    setUpdatingOrderId(orderId);
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/mileage/confirm",
        { order_id: orderId },
      );
      alert(response.data.message);
      fetchMembersAndOrders();
    } catch (error) {
      console.error("Error confirming purchase:", error);
      alert("구매확정 처리에 실패했습니다.");
    } finally {
      setLoading(false);
      setUpdatingOrderId(null);
    }
  };

  const handleCancelConfirmation = async (orderId) => {
    setUpdatingOrderId(orderId);
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/mileage/cancel-confirmation",
        { order_id: orderId },
      );
      alert(response.data.message);
      fetchMembersAndOrders();
    } catch (error) {
      console.error("Error canceling confirmation:", error);
      alert("구매확정 취소 처리에 실패했습니다.");
    } finally {
      setLoading(false);
      setUpdatingOrderId(null);
    }
  };

  useEffect(() => {
    fetchMembersAndOrders();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>회원 및 주문 정보</h1>
      <h2>회원 목록</h2>
      <table
        border="1"
        style={{ width: "100%", textAlign: "center", marginBottom: "20px" }}
      >
        <thead>
          <tr>
            <th>회원 ID</th>
            <th>회원명</th>
            <th>닉네임</th>
            <th>이메일</th>
            <th>전화번호</th>
            <th>잔여 마일리지</th>
          </tr>
        </thead>
        <tbody>
          {members.length > 0 ? (
            members.map((member) => (
              <tr key={member.id}>
                <td>{member.id}</td>
                <td>{member.name}</td>
                <td>{member.nick || "없음"}</td>
                <td>{member.email}</td>
                <td>{member.phone_num}</td>
                <td>{member.total_mileage}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">회원 정보가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      <h2>주문 목록</h2>
      <table border="1" style={{ width: "100%", textAlign: "center" }}>
        <thead>
          <tr>
            <th>주문 ID</th>
            <th>회원 ID</th>
            <th>총 금액</th>
            <th>배송 상태</th>
            <th>구매확정 여부</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.member_id}</td>
                <td>{order.total_price.toLocaleString()}원</td>
                <td>{order.order_status}</td>
                <td>{order.is_confirmed === "Y" ? "확정됨" : "미확정"}</td>
                <td>
                  {order.is_confirmed === "N" ? (
                    <button
                      onClick={() => handleConfirmPurchase(order.order_id)}
                      disabled={loading && updatingOrderId === order.order_id}
                    >
                      {loading && updatingOrderId === order.order_id
                        ? "처리 중..."
                        : "구매확정"}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleCancelConfirmation(order.order_id)}
                      disabled={loading && updatingOrderId === order.order_id}
                    >
                      {loading && updatingOrderId === order.order_id
                        ? "처리 중..."
                        : "구매확정 취소"}
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">주문 정보가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MileagePage;
