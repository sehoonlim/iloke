import {
  insertProduct,
  selectOption,
  selectOptionVal,
  selectKeyword,
  selectKeywordVal,
} from "../../services/api"; // API 호출 함수
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// import OptionSelect from './OptionSelect';
// import KeywordSelect from './KeywordSelect';
import "./ProductsAddPage.css";

function ProductsAddPage({ myData }) {
  const navigator = useNavigate();
  //파일등록 state
  const [detailFile, setDTFile] = useState(null); //상세정보 이미지 초기화
  const [proFile, setFile] = useState([]); //상품사진 초기화

  //상품상세 선택이미지 저장
  const upDTFile = (e) => {
    let pickDTFiles = e.target.files[0];
    setDTFile(pickDTFiles);
  };

  //상품 선택이미지 저장
  const upMultiFiles = (e) => {
    let selectFiles = e.target.files;
    setFile(selectFiles);
  };

  //가격 state
  const [orPrice, setOrPrice] = useState(0); //원가
  const [disV, setDisV] = useState(0); //할인율
  const [fnPrice, setFnPrice] = useState(0); //최종가

  //최종가격 계산+유효성
  function fnPriceChange() {
    //소수점 제거
    let newFnPrice = Math.round(orPrice - orPrice * (disV / 100));
    //1원단위 남지 않게 10으로 나눠서 소수점 올림 후 다시 10 곱하기
    newFnPrice = Math.round(newFnPrice / 10) * 10;

    if (orPrice && disV > 0) {
      //원가 할인율 둘 다 있을 시
      setFnPrice(newFnPrice); //계산된 가격
      if (newFnPrice < 0 || disV > 100) {
        //최종가가 마이너스거나 할인율이 100퍼 넘을 때
        alert("할인율을 다시 입력하세요.");
        return setDisV(0);
      } else if (disV == 100) {
        //할인율 100퍼 맞는지 체크
        let checConfirm = confirm("할인율 100%를 입력하신게 맞나요?");
        if (!checConfirm) {
          return setDisV(0);
        }
      }
    } else if (!disV || disV == 0) {
      //할인율 없거나 0일 시
      let newOrPrice = Math.ceil(orPrice / 10) * 10;
      if (orPrice % 10 <= 4) {
        newOrPrice = Math.round(orPrice / 10) * 10;
      }
      setFnPrice(newOrPrice); //원가 가격
    }
  }

  // 원가, 할인율 입력값 변경 시
  const orPriceChange = (e) => {
    //원가
    const newPrice = e.target.value; //입력된 값을 불러오기
    setOrPrice(newPrice); //초기화 값에 입력값 넣기
  };
  const disVChange = (e) => {
    //할인율
    const newDisV = e.target.value;
    setDisV(newDisV);
  };


  //바뀐 원가, 할인율값 fnPriceChange로 들고가서 실시간 계산
  useEffect(() => {
    fnPriceChange();
  }, [orPrice, disV]);

  // 옵션시작(시간날때 분리)
  //옵션+키워드
  const [option01, setOption01] = useState([]); //옵션 목록(배열)
  const [option02, setOption02] = useState(""); //상위 옵션 선택
  const [keyword01, setKeyword01] = useState([]); //키워드 목록(배열)
  const [keyword02, setKeyword02] = useState(""); //상위 키워드 선택
  const [opVal, setOpVal] = useState([]); // 하위 옵션 값
  const [keyVal, setKeyVal] = useState([]); // 하위 키워드 값
  const [selectedOption, setselectedOption] = useState([]);
  const [selectedKeyword, setselectedKeyword] = useState([]);

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
      }else{
        setselectedOption([]);
      }
    }
  }, [option02, option01]);

  console.log(selectedOption,'selectedOption')//체크 키워드값//선택한거 다 저장됨
  // console.log(option01,'option01')//옵션리스트
  // console.log(option02,'selectedOption')//키워드값
  
  const optionClick = (e) => {
    setOption02(e.target.value); // 선택 옵션 저장
  };

  //옵션값 불러오기
  const checkClick = (e) => {
    const { value, checked } = e.target;
    if (checked) {
        setselectedOption((prevOptions) => {
          if(prevOptions && !prevOptions.includes(value)){
            // 체크된 값이 배열에 없다면 추가
            return [...prevOptions, value];
          }
          return prevOptions;
        });
      } else {
        // 체크 해제된 값 배열에서 제거
        setselectedOption((prevOptions) =>{
          return prevOptions.filter((v) => v !== value);
        })
      }
  };
  useEffect(()=>{
    setselectedOption([]);
  }, [option02])

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
      }else{
        setselectedKeyword([]);
      }
    }
  }, [keyword02, keyword01]);

  //키워드 선택하면
  const keywordClick = (e) => {
    setKeyword02(e.target.value); // 선택 키워드 저장
  };
  //키워드값 불러오기

  const checkClick02 = (e) => {
    const { value, checked } = e.target;
    setselectedKeyword((prevKeywords) => {
      if (checked) {
        // 체크된 값이 배열에 없다면 추가(배열 아니면 빈배열 처리)
        return [...(prevKeywords || []), value];
      } else {
        // 체크 해제된 값 배열에서 제거
        return (prevKeywords || []).filter((v) => v !== value);
      }
    });
  };
  // console.log(selectedKeyword)//키워드값

  function getSelectedDetails() {
    const optionDetails = selectedOption
      .map((option) => {
        const optionData = opVal.find((opt) => opt.name === option);
        if (optionData) {
          return {
            main_code: optionData.main_code, // 상위 옵션 코드
            code: optionData.code, // 하위 옵션값 코드
            type: 1, // 옵션 표시
            price: optionData.price, // 옵션가격
            status: optionData.status, // 사용 여부
          };
        }
      })
      .filter((option) => option !== null); // null 제거

    const keywordDetails = selectedKeyword
      .map((keyword) => {
        const keywordData = keyVal.find((kw) => kw.name === keyword);
        return {
          main_code: keywordData.main_code, // 상위 키워드 코드
          code: keywordData.code, // 하위 키워드ㄱ값 코드
          type: 0, // 키워드 표시
          price: keywordData.price, // 키워드 가격
          status: keywordData.status, // 사용 여부
        };
      })
      .filter((keyword) => keyword !== null); // null 제거

    return [...optionDetails, ...keywordDetails]; // 옵션배열+키워드배열
  }
  function proSubmit(e) {
    e.preventDefault();
    // 옵션과 키워드가 선택되지 않았을 경우 알림
    if (selectedOption.length === 0) {
      alert("하위 옵션을 선택해주세요.");
      return; // 등록 중지
    }
    if (selectedKeyword.length === 0) {
      alert("하위 키워드를 선택해주세요.");
      return; // 등록 중지
    }

    const frmData = new FormData(document.proFrm);
    // 상품상세 인풋에 이미지 데이터 넣기
    if (detailFile) {
      frmData.append("upfile", detailFile);
    }

    // 상품사진 인풋에 차례대로 이미지 데이터 넣기
    Array.from(proFile).forEach((file) => {
      frmData.append("upMultiFiles", file);
    });

    // 선택된 옵션과 키워드의 상세 정보 추가
    const selectedDetails = getSelectedDetails();
    selectedDetails.forEach((detail) => {
      if (detail) {
        // detail이 null이 아닐 경우에만 추가
        frmData.append("details", JSON.stringify(detail)); // JSON 문자열로 저장
      }
    });

    insertProduct(frmData)
      .then((res) => {
        console.log("상품등록완료", res.data);
        alert("상품등록되었습니다.");
        navigator(`/products`); // 목록으로 이동
      })
      .catch((err) => {
        console.log("상품등록오류 : ", err.res ? err.res.data : err.message);
        alert("상품등록실패");
      });
  }
  function goList() {
    navigator(`/products/`);
  }
  function goHome() {
    navigator("/");
  }

  return (
    <div>
      <form name="proFrm" className="proFrm" onSubmit={proSubmit}>
        <div className="join_base_section memberList">
          <div className="join_base_wrap">
            <div className="filter-header">
              <h1>상품등록</h1>
            </div>
            <br />
            <table>
              <tbody>
                <tr>
                  <td className="inputHead">
                    <i className="fa-solid fa-square fa-2xs" />
                    상품명
                  </td>
                  <td>
                    <input type="text" name="name" required />
                  </td>
                </tr>
                <tr>
                  <td className="inputHead">
                    <i className="fa-solid fa-square fa-2xs" />
                    사진
                  </td>
                  <td>
                    <input
                      type="file"
                      name="upMultiFiles"
                      onChange={upMultiFiles}
                      multiple
                    />
                  </td>
                </tr>
                <tr>
                  <td className="inputHead">상세이미지</td>
                  <td>
                    <input type="file" name="upfile" onChange={upDTFile} />
                  </td>
                </tr>
                <tr>
                  <td className="inputHead">
                    <i className="fa-solid fa-square fa-2xs" />
                    등록 재고 수량
                  </td>
                  <td className="hasUnit">
                    <input type="number" name="quan" required />
                    <span>개</span>
                  </td>
                </tr>
                <tr>
                  <td className="inputHead">옵션</td>
                  <td>
                    <select onChange={optionClick}>
                      {/* <select onChange={checkClick} value={setOption}> */}
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
                              checked={selectedOption.includes(st.name)}
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
                <tr>
                  <td className="inputHead">상세정보 키워드 설정</td>
                  <td>
                    <select onChange={keywordClick}>
                      <option value="none">옵션을 선택하세요</option>
                      {keyword01.map((st, i) => (
                        // console.log(st.name)
                        <option key={i} value={st.name}>
                          {st.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
                {keyword02 && ( // 선택된 상위 키워드가 있을 경우에만 실행
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
                              checked={selectedKeyword.includes(st.name)}
                              onChange={checkClick02}
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
                <tr>
                  <td className="inputHead">
                    <i className="fa-solid fa-square fa-2xs" />
                    사용 여부
                  </td>
                  <td className="hasRadio">
                    <label>
                      <input
                        type="radio"
                        name="status"
                        defaultChecked
                        value={1}
                      />
                      ON
                    </label>
                    <label>
                      <input type="radio" name="status" value={0} />
                      OFF
                    </label>
                  </td>
                </tr>
                <tr>
                  <td className="inputHead">혜택</td>
                  <td>
                    <textarea name="benefit" />
                  </td>
                </tr>
                <tr>
                  <td className="inputHead">
                    <i className="fa-solid fa-square fa-2xs" />
                    상품 가격
                  </td>
                  <td className="hasUnit">
                    <input
                      type="number"
                      name="price"
                      value={orPrice}
                      onChange={orPriceChange}
                      required
                    />
                    <span>원</span>
                  </td>
                </tr>
                <tr>
                  <td className="inputHead">할인율</td>
                  <td className="hasUnit">
                    <input
                      type="number"
                      name="discount"
                      value={disV}
                      onChange={disVChange}
                    />
                    <span>%</span>
                  </td>
                </tr>
                <tr>
                  <td className="inputHead">
                    <i className="fa-solid fa-square fa-2xs" />
                    최종 가격
                  </td>
                  <td className="hasUnit">
                    <input type="number" readOnly value={fnPrice || "0"} />
                    <span>원</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <input type="submit" className="submit-btn" value="등록" />
            <div className="btn-wrap">
              <button type="button" className="write-btn" onClick={goList}>
                상품목록
              </button>
              <button type="button" className="home-btn" onClick={goHome}>
                홈
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ProductsAddPage;
