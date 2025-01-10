import React, { useState, useEffect } from "react";
import { selectOption } from "../../services/api";
import HeadContainer from "./HeadContainer";
import DetailContainer from "./DetailContainer";
import styles from "./OptionPage.module.css";

const OptionPage = () => {
  const [selectedReq, setSelectedReq] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [options, setOptions] = useState([]);
  const [optionValues, setOptionValues] = useState([]);
  const [selectedHeadCode, setSelectedHeadCode] = useState("");

  useEffect(() => {
    searchOptions();
  }, []);

  const searchOptions = (event) => {
    if (event) {
      event.preventDefault();
    }

    const frmData = new FormData(document.myFrm);
    const myData = Object.fromEntries(frmData);

    selectOption(myData) // 검색할 데이터 추가 (필터링 옵션)
      .then((res) => {
        setOptions(res.data);
      })
      .catch((err) => {
        console.error("옵션 리스트 불러오기 실패", err);
      });
  };

  return (
    <div className="inquiry-section">
      <div className="filter-header">
        <h1>옵션 관리</h1>
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
            <span className="mypage-period-text">옵션명</span>
            <input type="text" name="name" />
          </div>
          <div className="mypage-date-search">
            <button className="mypage-date-search-btn" onClick={searchOptions}>
              조회
            </button>
          </div>
        </div>
      </form>

      <div className={styles.table_container}>
        <div className={styles.head_container}>
          <HeadContainer
            options={options}
            searchOptions={searchOptions}
            setOptionValues={setOptionValues}
            setOptions={setOptions}
            setSelectedHeadCode={setSelectedHeadCode}
          />
        </div>
        <div className={styles.detail_container}>
          <DetailContainer
            optionValues={optionValues}
            setOptionValues={setOptionValues}
            selectedHeadCode={selectedHeadCode}
          />
        </div>
      </div>
    </div>
  );
};

export default OptionPage;
