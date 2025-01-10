import React, { useState, useEffect } from "react";
import { selectBoardAnswer } from "../../services/api"; // API 호출 함수
import PaginationControls from "../pagination/PaginationControls";
import BoardDetails from "./BoardDetails";

import "./BoardAnswerPage.css";

const BoardAnswerPage = () => {
  const [boards, setBoards] = useState([]); // 게시판 데이터
  const [selectedCode, setSelectedCode] = useState("rv"); // 선택된 코드
  const [listCode, setListCode] = useState(null); // 선택된 코드
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [selectedId, setSelectedId] = useState(null); // 선택된 ID
  const [selectedContents, setSelectedContents] = useState(null); // 선택된 콘텐츠
  const [selectComments, setSelectedComment] = useState(null); // 선택된 콘텐츠
  const [boardDetails, setBoardDetails] = useState(false); // 상세 페이지 표시 여부

  const itemsPerPage = 10; // 한 페이지당 항목 수
  const totalPages = Math.ceil(boards.length / itemsPerPage); // 전체 페이지 수

  // 게시판 데이터 가져오기
  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);

    const startDate = start.toISOString().split("T")[0]; // yyyy-mm-dd 형식으로 변환
    const endDate = end.toISOString().split("T")[0]; // yyyy-mm-dd 형식으로 변환
    document.getElementById("start-date").value = startDate;
    document.getElementById("end-date").value = endDate;

    searchBoards();
  }, []); // `selectedCode` 변경 시 데이터 재조회

  const searchBoards = (event) => {
    if (event) {
      event.preventDefault();
    }

    // list_code = selectedCode;
    setListCode(selectedCode);

    const frmData = new FormData(document.myFrm);
    frmData.append("code", selectedCode);
    const myData = Object.fromEntries(frmData);

    selectBoardAnswer(myData)
      .then((res) => {
        // if (JSON.stringify(res.data) !== JSON.stringify(boards)) {
        setBoards(res.data);
        setCurrentPage(1); // 새 검색 시 페이지를 첫 페이지로 초기화
        // }
      })
      .catch((error) => {
        console.error("Error fetching boards:", error);
      });
  };

  // 페이지 변경 처리
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // 날짜 값 세팅
  const handleDateButtonClick = (days, event) => {
    if (event) event.preventDefault();

    const today = new Date();

    if (days === 7 || days === 15) {
      today.setDate(today.getDate() - days);
    } else if (days === 30) {
      today.setMonth(today.getMonth() - 1);
    } else if (days === 90) {
      today.setMonth(today.getMonth() - 3);
    } else if (days === 365) {
      today.setFullYear(today.getFullYear() - 1);
    }

    document.getElementById("start-date").value = today
      .toISOString()
      .split("T")[0];
  };

  // 현재 페이지 데이터 슬라이싱
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = boards.slice(indexOfFirstItem, indexOfLastItem);

  const handleRowClick = (id, contents, code, comment) => {
    setSelectedId(id);
    setSelectedContents(contents); // 클릭한 항목의 콘텐츠 설정
    setSelectedComment(comment); // 클릭한 항목의 콘텐츠 설정
    setSelectedCode(code); // 클릭한 항목의 콘텐츠 설정
    setBoardDetails(true); // 상세 페이지 표시
  };

  return (
    <div className="inquiry-section">
      <div className="filter-header">
        <h1>게시판 답변 관리</h1>
      </div>
      <form name="myFrm">
        <div className="mypage-date-check">
          <div className="mypage-date-period">
            <span className="mypage-period-text">조회기간</span>
            <button data-value="0" onClick={(e) => handleDateButtonClick(0, e)}>
              오늘
            </button>
            <button data-value="7" onClick={(e) => handleDateButtonClick(7, e)}>
              7일
            </button>
            <button
              data-value="15"
              onClick={(e) => handleDateButtonClick(15, e)}
            >
              15일
            </button>
            <button
              data-value="30"
              onClick={(e) => handleDateButtonClick(30, e)}
            >
              1개월
            </button>
            <button
              data-value="90"
              onClick={(e) => handleDateButtonClick(90, e)}
            >
              3개월
            </button>
            <button
              data-value="365"
              onClick={(e) => handleDateButtonClick(365, e)}
            >
              1년
            </button>
          </div>
          <div className="mypage-date-box">
            <input
              id="start-date"
              name="start_date"
              type="date"
              className="mypage-first-date"
            />
            &nbsp;-&nbsp;
            <input
              id="end-date"
              name="end_date"
              type="date"
              className="mypage-last-date"
            />
          </div>
          <div>
            <span className="mypage-period-text">구분</span>
            <select
              name="code"
              className="color-option"
              value={selectedCode}
              onChange={(e) => setSelectedCode(e.target.value)}
            >
              <option value="rv">전체후기</option>
              <option value="pr">포토후기</option>
              <option value="pq">상품문의</option>
              <option value="ui">1:1문의</option>
            </select>
          </div>
          <div>
            <span className="mypage-period-text">제목</span>
            <input type="text" name="title" />
          </div>
          <div>
            <span className="mypage-period-text">작성자</span>
            <input type="text" name="reg_id" />
          </div>
          <div className="mypage-date-search">
            <button className="mypage-date-search-btn" onClick={searchBoards}>
              조회
            </button>
          </div>
        </div>
      </form>

      <div className="table_container">
        <table id="boardTable">
          <thead>
            <tr>
              <th style={{ width: "15%" }}>게시판번호</th>
              {listCode === "pq" || listCode === "ui" ? (
                <th style={{ width: "30%" }}>제목</th>
              ) : (
                <th style={{ width: "40%" }}>제목</th>
              )}

              {listCode === "rv" || listCode === "pr" ? (
                <th style={{ width: "8%" }}>별점</th>
              ) : (
                <th style={{ width: "8%" }}>조회수</th>
              )}
              <th style={{ width: "10%" }}>작성자</th>
              <th style={{ width: "20%" }}>등록일자</th>
              {listCode === "pq" || listCode === "ui" ? (
                <th style={{ width: "10%" }}>답변여부</th>
              ) : (
                <th style={{ width: "7%" }}>삭제</th>
              )}
            </tr>
          </thead>
          <tbody id="boardBody">
            {currentItems.map((item) => (
              <tr
                key={item.id}
                onClick={() =>
                  handleRowClick(
                    item.id,
                    item.contents,
                    item.code,
                    item.comment,
                  )
                }
              >
                <td>{item.id}</td>
                <td>{item.title}</td>
                {listCode === "rv" || listCode === "pr" ? (
                  <td>
                    {Array.from({ length: item.score }, (_, i) => "⭐")}
                    {/* {item.score} */}
                  </td>
                ) : (
                  <td>{item.read_no}</td>
                )}
                <td>{item.reg_id}</td>
                <td>{item.reg_date}</td>
                {listCode === "pq" || listCode === "ui" ? (
                  <td
                    style={{
                      color: item.comment_yn === "답변완료" ? "blue" : "red",
                    }}
                  >
                    {item.comment_yn}
                  </td>
                ) : (
                  <td
                    style={{
                      color: item.delete_yn === "활성" ? "blue" : "red",
                    }}
                  >
                    {item.delete_yn}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {boardDetails && (
          <>
            <div
              className="modal-backdrop"
              onClick={() => setBoardDetails(false)}
            ></div>
            <div className="detail-pane">
              <BoardDetails
                id={selectedId}
                contents={selectedContents} // 콘텐츠를 prop으로 전달
                comments={selectComments}
                code={selectedCode}
                onClose={() => setBoardDetails(false)}
                onSearch={searchBoards} // searchBoards 함수 전달
              />
            </div>
          </>
        )}

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default BoardAnswerPage;
