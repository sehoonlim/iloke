import { useEffect, useState } from "react";
import { selectOption, selectOptionVal } from "../../services/api";

function OptionSelect({
  myData,
  selectedOptions,
  setSelectedOptions,
  handleOpValChange,
}) {
  //selectedOptions, setSelectedOptions > 선택된 하위 옵션들
  //옵션설정
  const [option01, setOption01] = useState([]); //옵션 목록(배열)
  const [option02, setOption02] = useState(""); //상위 옵션 선택
  const [opVal, setOpVal] = useState([]); // 하위 옵션 값

  //옵션 목록 불러오기
  useEffect(() => {
    selectOption(myData)
      .then((res) => {
        setOption01(res.data);
      })
      .catch((err) => {
        console.error("옵션 리스트 백엔드 연결 실패", err);
      });
  }, [myData]);

  //옵션값 불러오기
  useEffect(() => {
    if (option02) {
      // 상위 옵션이 선택된 경우에만 실행
      // 옵션 리스트에서 선택된 option02의 code 값을 찾아서 전달
      const selectedOption = option01.find(function (opt) {
        // option02와 일치하는 name 찾기
        return opt.name === option02;
      });
      if (selectedOption) {
        const { code } = selectedOption; // 선택된 옵션의 code 값 추출
        // console.log(code)
        selectOptionVal(code)
          .then((res) => {
            setOpVal(res.data); // 옵션값 저장
          })
          .catch((err) => {
            console.error("옵션값 불러오기 실패", err);
          });
      }
    }
  }, [option02, option01, setOpVal]);

  //옵션 선택하면
  // const optionClick = (e) => {
  //     setOption02(e.target.value); // 선택 옵션 저장
  //     // setOpVal([]); // 하위 옵션값 초기화
  // }
  const optionClick = (e) => {
    setOption02(e.target.value); // 선택 옵션 저장
    // setOpVal([]); // 하위 옵션값 초기화
  };

  //옵션값 불러오기
  const checkClick = (e) => {
    const { value, checked } = e.target;
    setSelectedOptions((prevOptions) => {
      if (checked) {
        // 체크된 값이 배열에 없다면 추가
        return [...(prevOptions || []), value];
      } else {
        // 체크 해제된 값 배열에서 제거
        return (prevOptions || []).filter((v) => v !== value);
      }
    });
  };

  return (
    <>
      <tr>
        <td className="inputHead">옵션</td>
        <td>
          <select onChange={optionClick}>
            <option value="none">옵션을 선택하세요</option>
            {option01.map((st, i) => (
              // console.log(st.name)
              <option key={i} value={st.name}>
                {st.name}
              </option>
            ))}
          </select>
        </td>
      </tr>
      {option02 && ( // 선택된 상위 옵션이 있을 경우에만 실행
        <tr>
          <td className="inputHead">하위 옵션</td>
          <td>
            {opVal.length > 0 ? ( //하위 옵션 배열이 1이상일 경우 = 존재할 경우
              opVal.map((st, i) => (
                <label key={i}>
                  <input
                    type="checkbox"
                    name="option"
                    value={st.name}
                    checked={
                      selectedOptions && selectedOptions.includes(st.name)
                    }
                    onChange={checkClick}
                  />
                  {st.name}
                </label>
              ))
            ) : (
              <span>하위 옵션값이 없습니다.</span> //옵션값 없을때
            )}
          </td>
        </tr>
      )}
    </>
  );
}

export default OptionSelect;
