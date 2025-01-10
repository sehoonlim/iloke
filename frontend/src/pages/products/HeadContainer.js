import React, { useState, useEffect } from "react";
import PaginationControls from "../pagination/PaginationControls";
import {
  insertOption,
  selectOption,
  selectOptionVal,
} from "../../services/api";

// import "./HeadContainer.css";
import styles from "./HeadContainer.module.css";

const HeadContainer = ({
  options,
  searchOptions,
  setOptionValues,
  setOptions,
  setSelectedHeadCode,
}) => {
  const [newOptionRow, setNewOptionRow] = useState(null); // 신규 옵션 행 추가 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const [updatedItems, setUpdatedItems] = useState([]); // 변경된 항목들을 추적

  useEffect(() => {
    if (updatedItems.length > 0) {
      console.log("변경된 항목들:", updatedItems);
    }
  }, [updatedItems]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSaveAll = () => {
    if (updatedItems.length === 0 && !newOptionRow) {
      alert("저장할 데이터가 없습니다.");
      return;
    } else if (newOptionRow && newOptionRow.name.trim() === "") {
      alert("저장할 데이터를 확인해주세요.");
      return;
    }

    const savePromises = [];

    if (newOptionRow) {
      savePromises.push(insertOption(newOptionRow));
    }

    updatedItems.forEach((item) => {
      savePromises.push(insertOption(item));
    });

    Promise.all(savePromises)
      .then(() => {
        alert("변경 사항이 저장되었습니다.");
        searchOptions(); // 업데이트 후 옵션 목록 재조회
        setUpdatedItems([]);
        setNewOptionRow(null);
      })
      .catch((err) => {
        console.error("옵션 저장 실패:", err);
      });
  };

  const handleAddOptionRow = () => {
    setOptions([]); // 페이지를 초기화
    setNewOptionRow({ code: "", name: "", req: "0", status: "1" });
    setSelectedHeadCode(null);
    searchOptionValues(-1); // 빈값을 하위(디테일)에 전달
  };

  const getRowClassName = (index) => {
    return selectedRow === index ? styles.selected_row : "";
  };

  const handleRowClick = (code, index) => {
    setSelectedHeadCode(code);
    searchOptionValues(code);
    setSelectedRow(index);
  };

  const searchOptionValues = (code) => {
    // 재조회시 하위행 초기화
    // setNewValueRow(null);
    selectOptionVal(code)
      .then((res) => {
        setOptionValues(res.data);
      })
      .catch((err) => {
        console.error("옵션 리스트 불러오기 실패", err);
      });
  };

  const handleReqChange = (e, item, field) => {
    const newValue = e.target.value;

    // 해당 항목만 업데이트
    const updatedItem = { ...item, [field]: newValue };

    // updatedItems와 options를 동시에 업데이트
    setUpdatedItems((prevItems) => {
      const itemIndex = prevItems.findIndex((i) => i.code === item.code);
      if (itemIndex !== -1) {
        // 항목이 이미 배열에 있으면 업데이트
        const updatedList = [...prevItems];
        updatedList[itemIndex] = updatedItem;
        return updatedList;
      } else {
        // 항목이 배열에 없으면 새로 추가
        return [...prevItems, updatedItem];
      }
    });

    setOptions((prevOptions) => {
      // options에서 해당 항목을 찾고, 업데이트된 항목으로 변경
      return prevOptions.map((option) =>
        option.code === item.code ? updatedItem : option,
      );
    });
  };

  const delNewRow = () => {
    setNewOptionRow(null); // 행추가 로우 삭제

    selectOption() // 검색할 데이터 추가 (필터링 옵션)
      .then((res) => {
        setOptions(res.data);
      })
      .catch((err) => {
        console.error("옵션 리스트 불러오기 실패", err);
      });
  };

  const itemsPerPage = 5;
  const totalPages = Math.ceil(options.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = options.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <div className={styles.table_buttons}>
        <button onClick={handleAddOptionRow}>행 추가</button>
        <button onClick={handleSaveAll}>저장</button>
      </div>
      <div className={styles.option_table}>
        <table>
          <thead>
            <tr>
              <th style={{ width: "10%" }}>번호</th>
              <th style={{ width: "30%" }}>옵션명</th>
              <th style={{ width: "20%" }}>필수선택</th>
              <th style={{ width: "20%" }}>사용여부</th>
            </tr>
          </thead>
          <tbody id="optionBody">
            {currentItems && currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <tr
                  key={index}
                  onClick={() => handleRowClick(item.code, index)}
                  className={getRowClassName(index)}
                >
                  <td>{item.code}</td>
                  <td>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleReqChange(e, item, "name")}
                      required
                      placeholder="옵션 명"
                    />
                  </td>
                  <td>
                    <select
                      value={item.req}
                      onChange={(e) => handleReqChange(e, item, "req")}
                    >
                      <option value="0">필수X</option>
                      <option value="1">필수O</option>
                    </select>
                  </td>
                  <td>
                    <select
                      value={item.status}
                      onChange={(e) => handleReqChange(e, item, "status")}
                    >
                      <option value="0">미사용</option>
                      <option value="1">사용</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <></>
            )}
            {newOptionRow && (
              <tr>
                <td>신규</td>
                <td>
                  <input
                    type="text"
                    value={newOptionRow.name}
                    onChange={(e) =>
                      setNewOptionRow({ ...newOptionRow, name: e.target.value })
                    }
                    required
                    placeholder="옵션 명"
                  />
                </td>
                <td>
                  <select
                    value={newOptionRow.req}
                    onChange={(e) =>
                      setNewOptionRow({ ...newOptionRow, req: e.target.value })
                    }
                  >
                    <option value="0">필수X</option>
                    <option value="1">필수O</option>
                  </select>
                </td>
                <td>
                  <button onClick={delNewRow}>취소</button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <PaginationControls
        className={styles.pagination}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default HeadContainer;
