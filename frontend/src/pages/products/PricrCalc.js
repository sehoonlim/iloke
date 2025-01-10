import { useState, useEffect } from "react";
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

function PricrCalc(orPrice, disV, fnPrice) {
  return (
    <>
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
    </>
  );
}

export default PricrCalc;
