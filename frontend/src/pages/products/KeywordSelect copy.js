import { useEffect, useState } from "react";
import { selectKeyword, selectKeywordVal } from "../../services/api";

function KeywordSelect({ myData, selectedKeywords = [], setSelectedKeywords }) {
  //selectedKeywords, setSelectedKeywords > 선택된 하위 키워드들
  //키워드설정
  const [keyword01, setKeyword01] = useState([]); //키워드 목록(배열)
  const [keyword02, setKeyword02] = useState("none"); //상위 키워드 선택
  const [keyVal, setKeyVal] = useState([]); // 하위 키워드 값

  //키워드 목록 불러오기
  useEffect(() => {
    selectKeyword(myData)
      .then((res) => {
        setKeyword01(res.data);
      })
      .catch((err) => {
        console.error("키워드 리스트 백엔드 연결 실패", err);
      });
  }, [myData]);

  //키워드값 불러오기
  useEffect(() => {
    if (keyword02) {
      // 상위 키워드가 선택된 경우에만 실행
      // 키워드 리스트에서 선택된 keyword02의 code 값을 찾아서 전달
      const selectedKeyword = keyword01.find(function (opt) {
        // keyword02와 일치하는 name 찾기
        return opt.name === keyword02;
      });
      if (selectedKeyword) {
        const { code } = selectedKeyword; // 선택된 키워드의 code 값 추출
        // console.log(code)
        selectKeywordVal(code)
          .then((res) => {
            setKeyVal(res.data); // 키워드값 저장
          })
          .catch((err) => {
            console.error("키워드값 불러오기 실패", err);
          });
      }
    }
  }, [keyword02, keyword01]);

  //키워드 선택하면
  const keywordClick = (e) => {
    setKeyword02(e.target.value); // 선택 키워드 저장
  };

  //키워드값 불러오기
  const checkClick = (e) => {
    const { value, checked } = e.target;
    setSelectedKeywords((prevKeywords) => {
      if (checked) {
        // 체크된 값이 배열에 없다면 추가(배열 아니면 빈배열 처리)
        return [...(prevKeywords || []), value];
      } else {
        // 체크 해제된 값 배열에서 제거
        return (prevKeywords || []).filter((option) => option !== value);
      }
    });
  };

  return (
    <>
      <tr>
        <td className="inputHead">키워드</td>
        <td>
          <select onChange={keywordClick} value={keyword02}>
            <option value="none">키워드을 선택하세요</option>
            {keyword01.map((st, i) => (
              // console.log(st.name)
              <option key={i} value={st.name}>
                {st.name}
              </option>
            ))}
          </select>
        </td>
      </tr>
      {keyword02 && ( // 선택된 상위 키워드이 있을 경우에만 실행
        <tr>
          <td className="inputHead">하위 키워드</td>
          <td>
            {keyVal.length > 0 ? ( //하위 키워드 배열이 1이상일 경우 = 존재할 경우
              keyVal.map((st, i) => (
                <label key={i}>
                  <input
                    type="checkbox"
                    name="keyword"
                    value={st.name}
                    checked={
                      selectedKeywords && selectedKeywords.includes(st.name)
                    }
                    onChange={checkClick}
                  />
                  {st.name}
                </label>
              ))
            ) : (
              <span>하위 키워드값이 없습니다.</span> //키워드값 없을때
            )}
          </td>
        </tr>
      )}
    </>
  );
}

export default KeywordSelect;
