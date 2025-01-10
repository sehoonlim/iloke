import "./MemberDetail.css";

function MemberMileage({ mileageData }) {
  if (!mileageData || mileageData.length === 0) {
    return (
      <div className="mileage-section no-data">마일리지 내역이 없습니다.</div>
    );
  }

  return (
    <div className="mileage-section horizontal-layout">
      <h1>마일리지 내역</h1>
      <div className="header">
        <div className="headercell">순서</div>
        <div className="headercell">적립 날짜</div>
        <div className="headercell">적립 내용</div>
        <div className="headercell">유효 날짜</div>
        <div className="headercell">변동 내역</div>
      </div>
      <div className="main">
        {mileageData.map((mileage, index) => (
          <div className="datarow" key={index}>
            <div className="datacell">{mileage.turn}</div>
            <div className="datacell">{mileage.earn_date}</div>
            <div className="datacell">{mileage.description}</div>
            <div className="datacell">{mileage.valid_date}</div>
            <div className="datacell">{mileage.change_val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MemberMileage;
