import React, { useState, useEffect } from "react";
import { selectKeyword } from "../../services/api";
import KHeadContainer from "./KHeadContainer";
import KDetailContainer from "./KDetailContainer";
// import "./KeywordPage.css";
import styles from "./KeywordPage.module.css";

const KeywordPage = () => {
  const [selectedReq, setSelectedReq] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [keywordValues, setKeywordValues] = useState([]);
  const [selectedHeadCode, setSelectedHeadCode] = useState("");

  useEffect(() => {
    searchKeywords();
  }, []);

  const searchKeywords = (event) => {
    if (event) {
      event.preventDefault();
    }

    const frmData = new FormData(document.myFrm);
    const myData = Object.fromEntries(frmData);

    selectKeyword(myData) // 검색할 데이터 추가 (필터링 키워드)
      .then((res) => {
        setKeywords(res.data);
      })
      .catch((err) => {
        console.error("키워드 리스트 불러오기 실패", err);
      });
  };

  return (
    <div className="inquiry-section">
      <div className="filter-header">
        <h1>키워드 관리</h1>
      </div>
      <form name="myFrm">
        <div className="mypage-date-check">
          <div>
            <span className="mypage-period-text">필수여부</span>
            <select
              name="reqe"
              className="color-option"
              value={selectedReq}
              onChange={(e) => setSelectedReq(e.target.value)}
            >
              <option value="">전체</option>
              <option value="1">필수O</option>
              <option value="0">필수X</option>
            </select>
          </div>
          <div>
            <span className="mypage-period-text">사용여부</span>
            <select
              name="status"
              className="color-option"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">전체</option>
              <option value="1">사용</option>
              <option value="0">미사용</option>
            </select>
          </div>
          <div>
            <span className="mypage-period-text">키워드명</span>
            <input type="text" name="name" />
          </div>
          <div className="mypage-date-search">
            <button className="mypage-date-search-btn" onClick={searchKeywords}>
              조회
            </button>
          </div>
        </div>
      </form>

      <div className={styles.table_container}>
        <div className={styles.head_container}>
          <KHeadContainer
            keywords={keywords}
            searchKeywords={searchKeywords}
            setKeywordValues={setKeywordValues}
            setKeywords={setKeywords}
            setSelectedHeadCode={setSelectedHeadCode}
          />
        </div>
        <div className={styles.detail_container}>
          <KDetailContainer
            keywordValues={keywordValues}
            setKeywordValues={setKeywordValues}
            selectedHeadCode={selectedHeadCode}
          />
        </div>
      </div>
    </div>
  );
};

export default KeywordPage;
