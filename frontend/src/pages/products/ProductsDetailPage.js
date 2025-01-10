import {
  selectProductDetail,
  selectImageLoad,
  selectDetail,
  selectOption,
  selectDetailInfo,
  selectOptionVal,
  selectKeyword,
  selectKeywordVal,
} from "../../services/api";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./ProductsDetailPage.css";

function ProductsDetailPage({ id, myData, code }) {
  //pageFunction productId 에서 들고옴
  const { main_code } = useParams();
  const navigator = useNavigate();

  // 로딩 화면(처음에 값 바로 안블러와서 설정)
  const [loading, setLoading] = useState(true);
  const [proList, setProlist] = useState({}); //초기값
  const [dtList, setDtList] = useState([]); //상품디테일 들고오기
  const [opList, setOpList] = useState([]); //옵션목록 들고오기
  const [keyList, setKeyList] = useState([]); //키워드목록 들고오기
  const [keyValList, setKeyvalList] = useState([]); //키워드값 들고오기

  const [mainCode, setmainCode] = useState([]); //선택옵션
  const [dtcode, setdtcode] = useState([]); //선택옵션값
  const [dtBack, setDtBack] = useState({ mainCode: [], dtCode: [] }); // 상품 상세 정보


  //첫 데이터 불러오기
  useEffect(() => {
    if (!id) {
      // console.log("id 없음");
      return;
    }
    setLoading(true); //데이터 로딩

    //상품상세 정보 들고오기
    selectProductDetail(id)
      .then((res) => {
        setProlist(res.data);
        // setLoading(false)//로딩완료
      })
      .catch((err) => {
        console.error("상품 리스트 백엔드 연결 실패", err);
        // setLoading(false)//디비 연결 실패해도 로딩완료
      });

    //상품 디테일 들고오기
    selectDetail(main_code)
      .then((res) => {setDtList(res.data || []);})
      .catch((err) => {console.error("상품 상세 백엔드 연결 실패", err);});

    //옵션목록 들고오기
    selectOption(myData)
      .then((res) => {setOpList(res.data || []);})
      .catch((err) => {console.error("옵션목록 백엔드 연결 실패", err);});

    //옵션값 들고오기
    selectOptionVal(code)
      .then((res) => {
         if (res.data) {
          setOpVal(res.data); // 정상적으로 데이터가 오면 상태 업데이트
        } else {
          console.error("옵션값 데이터가 비어 있습니다.");
        }
      })
      .catch((err) => {console.error("옵션값 API 호출 실패:", err)});

    //키워드 목록 들고오기
    selectKeyword(myData)
      .then((res) => {setKeyList(res.data || [])})
      .catch((err) => {console.error("키워드 목록 백엔드 연결 실패", err)});

    //키워드값 들고오기
    selectKeywordVal(code)
      .then((res) => {setKeyvalList(res.data || [])})
      .catch((err) => {console.error("키워드값 백엔드 연결 실패", err)});

    // 디테일 백 불러오기
    selectDetailInfo(main_code, id)
      .then((res) => {
        setmainCode(res.data.main_code);
        setdtcode(res.data.code);
        setDtBack({
          mainCode: res.data.main_code,
          dtCode: res.data.code,
          name: res.data.name,
        });
      })
      .catch((err) => {console.error("옵션목록 백엔드 연결 실패", err)});
    setLoading(false); // 로딩 완료
  }, [id, main_code, code, myData]);

  //옵션설정
  const [option01, setOption01] = useState([]); //옵션 목록(배열)
  const [option02, setOption02] = useState(""); //상위 옵션 선택
  const [opVal, setOpVal] = useState([]); // 하위 옵션 값
  const [selectedOptions, setSelectedOptions] = useState([]); // 선택된 하위 옵션들

  //옵션 목록 불러오기
  useEffect(() => {
    selectOption(myData)
      .then((res) => {setOption01(res.data)})
      .catch((err) => {console.error("옵션 리스트 백엔드 연결 실패", err)});
  }, [myData]);

  //옵션값 불러오기
  useEffect(() => {
    if (myData) {
      // 선택된 옵션의 code 값 추출
      const selectedOption = dtcode;
      selectOptionVal(selectedOption)
        .then((res) => {
          setOpVal(res.data); // 옵션값 저장
        })
        .catch((err) => {
          console.error("옵션값 불러오기 실패", err);
        });
    }
  }, [option02, option01]);

  //데이터 안불러와졌을때 방지
  if (loading) {
    //false일 때
    return <div>데이터 로딩 중</div>;
  }
  if (!proList.ret) {
    //데이터 없다면 (proList.ret = false)
    return <div>데이터가 없습니다</div>;
  }

  //상세 데이터 담기
  const proData = proList.ret;

  /////////////계산
  let orPrice = proData.price || 0;
  let disV = proData.discount || 0;
  let fnPrice = 0;
  // console.log({id})

  if (disV) {
    // let newFnPrice = Math.round(orPrice - orPrice * (disV / 100));
    // fnPrice = newFnPrice;
    fnPrice = Math.round(orPrice - orPrice * (disV / 100));
    // }else if(disV == 0 || disV == null){
  } else {
    disV = 0;
    fnPrice = orPrice;
  }

  //////////////활성화 상태
  function statusChange() {
    if (proData.status === 1) {
      return (
        <td className="hasRadio">
          <label className="active">
            <input
              type="radio"
              name="status"
              value={1 || ""}
              disabled
              checked
            />
            ON
          </label>
          <label>
            <input type="radio" name="status" value={0 || ""} disabled />
            OFF
          </label>
        </td>
      );
    } else if (proData.status === 0) {
      return (
        <td className="hasRadio">
          <label>
            <input type="radio" name="status" value={0 || ""} disabled />
            ON
          </label>
          <label className="active">
            <input
              type="radio"
              name="status"
              value={1 || ""}
              disabled
              checked
            />
            OFF
          </label>
        </td>
      );
    } else if (proData.status === null) {
      return (
        <td className="hasRadio">
          <label>
            <input type="radio" name="status" value={0 || ""} disabled />
            ON
          </label>
          <label>
            <input type="radio" name="status" value={1 || ""} disabled />
            OFF
          </label>
        </td>
      );
    }
  }

  ///////////링크이동
  function goModify() {
    navigator(`/products/modify/${id}`);
  }
  function goList() {
    navigator("/products");
  }

  function goHome() {
    navigator("/");
  }

  return (
    <div className="pro_detail memberList">
      <form name="proFrm" className="proFrm">
        <div className="join_base_section">
          <div className="join_base_wrap">
            <div className="filter-header">
              <h1>{proData.name} 상세정보</h1>
            </div>
            <br />
            <table>
              <tbody>
                <tr>
                  <td className="inputHead">상품명</td>
                  <td>
                    <input
                      type="text"
                      name="name"
                      value={proData.name || ""}
                      disabled
                    />
                  </td>
                </tr>
                <tr>
                  <td className="inputHead">사진</td>
                  <td>
                    <input type="file" name="upfile" readOnly disabled />
                  </td>
                </tr>
                <tr>
                  <td className="inputHead">상세이미지</td>
                  <td>
                    <input type="file" name="DTfile" readOnly disabled />
                  </td>
                </tr>
                <tr>
                  <td className="inputHead">등록 재고 수량</td>
                  <td className="hasUnit">
                    <input
                      type="number"
                      name="quan"
                      value={proData.quan || ""}
                      readOnly
                      disabled
                    />
                    <span>개</span>
                  </td>
                </tr>
                {
                  opList.length > 0 && mainCode.length > 0 &&
                     mainCode.map((st, i) => {
                        //무슨짓을해도 key에러가 사라지지않는 매직
                        // console.log(dtList,'++dtList',[i])//디테일 정보 다들고옴
                        // console.log(mainCode,'++mainCode')//옵션/키워드 코드번호
                        // console.log(dtList[i]?.code,'++dtList')//선택 하위 값 코드번호
                        // console.log(opList,'++opList')//옵션테이블 정보 들고오기
                        // console.log(keyList,'++keyList')//키워드 테이블 정보 들고오기
                        // console.log(dtcode,'++dtcode')//하위값 코드번호 들고오기
                        

                        // mainCode[i]와 일치하는 옵션번호 찾기
                        const matchingOp = opList.find(
                          (op) => op.code == mainCode[i],
                        );
                        // mainCode[i]와 일치하는 키워드 번호 찾기
                        const matchingKey = keyList.find(
                          (key) => key.code == mainCode[i],
                        );
                        
                        const opchildCodeArr = dtList.filter(item => item.type === "1").map(item => item.code);
                        const keychildCodeArr = dtList.filter(item => item.type === "0").map(item => item.code);
                        const opchildCode = [...new Set(opchildCodeArr)]
                        const keychildCode = [...new Set(keychildCodeArr)]
                        // console.log(opchildCode);//옵션하위선택코드
                        // console.log(keychildCode);//키워드하위선택코드

                        let max = Math.max(...dtBack.name.map((arr) => arr.length)) - 1;

                        // 하위값 배열에 넣어서 나열 후 뒤에 공백
                        let childList01 = [];
                        let childList02 = [];
                        for (let i = 0; i < opchildCode.length; i++){
                          childList01[i] = (dtBack.name[0][opchildCode[i] - 1] || '');
                        }
                        for (let i = 0; i < keychildCode.length; i++){
                          childList02[i] = (dtBack.name[1][keychildCode[i] - 1] || '');
                        }

                        // 여러개 체크시 opchildCode[i] - 체크숫자 뽑아냄
                        // console.log(dtBack.name[0][opchildCode[i]])
                        // console.log(childList01.length)
                        // console.log(opchildCode.length)
                        console.log(keychildCode)

                        return (
                          <>
                            <tr key={`value-${i}`}>
                              <td className="inputHead">
                                {/* 조건에 맞게 표시 */}
                                {(matchingOp && matchingOp?.type == 0
                                  ? "옵션"
                                  : "") +
                                  (matchingKey && matchingKey?.type == 1
                                    ? " 키워드"
                                    : "") || null}
                              </td>
                              <td>
                                {(matchingOp && matchingOp?.type == 0
                                  ? `${matchingOp.name}`
                                  : "") +
                                  (matchingKey && matchingKey?.type == 1
                                    ? `${matchingKey.name}`
                                    : "") || null}
                              </td>
                            </tr>
                            <tr key={`option-${i}`}>
                              <td className="inputHead">
                                {(matchingOp && matchingOp?.type == 0
                                  ? "옵션값"
                                  : "") +
                                  (matchingKey && matchingKey?.type == 1
                                    ? " 키워드값"
                                    : "") || null}
                              </td>
                              <td>

                                {
                                  (
                                    matchingOp && matchingOp?.type == 0//옵션일경우
                                    ? (childList01) : "")

                                    +

                                    (matchingKey && matchingKey?.type == 1//키워드일경우
                                      ? (childList02) : "")
                                    }
                              </td>
                            </tr>
                          </>
                        );
                      })
                    // : null //옵션,키워드 있을때만 보여짐
                }
                <tr>
                  <td className="inputHead">사용 여부</td>
                  {statusChange()}
                </tr>
                <tr>
                  <td className="inputHead">혜택</td>
                  <td>
                    <textarea
                      name="benefit"
                      value={proData.benefit || ""}
                      readOnly
                      disabled
                    />
                  </td>
                </tr>
                <tr>
                  <td className="inputHead">상품 가격</td>
                  <td className="hasUnit">
                    <input
                      type="number"
                      name="price"
                      value={orPrice || 0}
                      readOnly
                      disabled
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
                      value={disV || 0}
                      readOnly
                      disabled
                    />
                    <span>%</span>
                  </td>
                </tr>
                <tr>
                  <td className="inputHead">최종 가격</td>
                  <td className="hasUnit">
                    <input
                      type="number"
                      value={fnPrice || 0}
                      readOnly
                      disabled
                    />
                    <span>원</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="btn-wrap">
              {/* <button type="button" className="write-btn" onClick={goModify}>
                수정하기
              </button> */}
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

export default ProductsDetailPage;
