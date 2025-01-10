import React, { useState, useEffect } from "react";
import { insertKeywordVal, selectKeywordVal } from "../../services/api";

// import "./DetailContainer.css";
import styles from "./DetailContainer.module.css";

const DetailContainer = ({
  keywordValues,
  setKeywordValues,
  selectedHeadCode,
}) => {
  const [newValueRow, setNewValueRow] = useState(null); // 신규 키워드 값 행 추가 상태
  const [selectedRow, setSelectedRow] = useState(null);
  const [updatedItems, setUpdatedItems] = useState([]); // 변경된 항목들을 추적

  /*여기서시작*/

  useEffect(() => {
    if (updatedItems.length > 0) {
      console.log("변경된 항목들:", updatedItems);
    }

    if (!selectedHeadCode) {
      setNewValueRow(null);
    }
  }, [updatedItems, selectedRow, newValueRow, selectedHeadCode]);

  const handleSaveAll = () => {
    // console.log(!newValueRow);
    if (updatedItems.length === 0 && !newValueRow) {
      alert("저장할 데이터가 없습니다.");
      return;
    } else if (
      newValueRow &&
      (newValueRow.name.trim() === "" || newValueRow.opVal_price.trim() === "")
    ) {
      alert("저장할 데이터를 확인해주세요.");
      return;
    }

    const savePromises = [];
    if (newValueRow) {
      const newRowWithMainCode = { ...newValueRow };
      savePromises.push(insertKeywordVal(newRowWithMainCode));
    }

    updatedItems.forEach((item) => {
      const updatedItemWithMainCode = { ...item };
      savePromises.push(insertKeywordVal(updatedItemWithMainCode));
    });

    Promise.all(savePromises)
      .then(() => {
        alert("변경 사항이 저장되었습니다.");
        // searchKeywords(); // 업데이트 후 키워드 목록 재조회
        setUpdatedItems([]);
        setNewValueRow(null);

        selectKeywordVal(selectedHeadCode)
          .then((res) => {
            setKeywordValues(res.data);
          })
          .catch((err) => {
            console.error("키워드 리스트 불러오기 실패", err);
          });
      })
      .catch((err) => {
        console.error("키워드 저장 실패:", err);
      });
  };

  const handleAddKeywordRow = () => {
    if (
      !selectedHeadCode ||
      selectedHeadCode == null ||
      selectedHeadCode == 0 ||
      selectedHeadCode == ""
    ) {
      alert("상위 항목을 먼저 선택해주세요");
    } else {
      setNewValueRow({
        main_code: selectedHeadCode,
        code: "",
        name: "",
        opVal_price: "",
        status: 1,
      });
    }
  };

  const delNewValueRow = () => {
    setNewValueRow(null);
  };

  const handleReqChange = (e, item, field) => {
    const newValue = e.target.value;

    // 해당 항목만 업데이트
    const updatedItem = { ...item, [field]: newValue };

    // updatedItems와 keywords를 동시에 업데이트
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

    setKeywordValues((prevKeywords) => {
      // keywords에서 해당 항목을 찾고, 업데이트된 항목으로 변경
      return prevKeywords.map((keyword) =>
        keyword.code === item.code ? updatedItem : keyword,
      );
    });
  };

  /*여기서종료*/

  return (
    <div>
      <div className={styles.table_buttons}>
        <button onClick={handleAddKeywordRow}>행 추가</button>
        <button onClick={() => handleSaveAll()}>저장</button>
      </div>
      <div className={styles.value_table}>
        <table>
          <thead>
            <tr>
              <th style={{ width: "10%" }}>번호</th>
              <th style={{ width: "20%" }}>키워드값 명</th>
              <th style={{ width: "20%" }}>가격</th>
              <th style={{ width: "10%" }}>사용여부</th>
              <th style={{ width: "20%" }}>수정자</th>
              <th style={{ width: "20%" }}>수정일시</th>
            </tr>
          </thead>
          <tbody id="valueBody">
            {keywordValues.map((item, index) => (
              <tr key={index}>
                <td>{item.code}</td>
                <td>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleReqChange(e, item, "name")}
                    placeholder="키워드값 명"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.opVal_price}
                    onChange={(e) => handleReqChange(e, item, "opVal_price")}
                    placeholder="가격"
                  />
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
                <td>{item.upt_id}</td>
                <td>{item.upt_date}</td>
              </tr>
            ))}
            {newValueRow && (
              <tr>
                <td>{newValueRow.code}</td>
                <td>
                  <input
                    type="text"
                    value={newValueRow.name}
                    onChange={(e) =>
                      setNewValueRow({ ...newValueRow, name: e.target.value })
                    }
                    placeholder="키워드값 명"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={newValueRow.opVal_price}
                    onChange={(e) =>
                      setNewValueRow({
                        ...newValueRow,
                        opVal_price: e.target.value,
                      })
                    }
                    placeholder="가격"
                  />
                </td>
                <td colSpan={3}>
                  <button onClick={delNewValueRow}>취소</button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetailContainer;
