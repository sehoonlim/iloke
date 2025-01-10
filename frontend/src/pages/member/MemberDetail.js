import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { detailMem } from "../../services/api";
import { deleteMem } from "../../services/api";
import "./MemberDetail.css";

function MemberDetail({ id, fetchMembers, setSelectedId, setShowModify }) {
  // fetchMembers : 회원 목록 갱신 함수
  // setSelectedId : 선택된 회원 ID를 초기화하는 함수
  // setShowModify : 수정 화면 표시 상태 관리 함수
  const [st, setSt] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      detailMem(id)
        .then((res) => {
          setSt(res.data);
        })
        .catch((err) => {
          console.error("에러발생 : ", err);
        });
    }
  }, [id]);

  if (!st) {
    return <div>id 없음</div>;
  }

  function back() {
    setSelectedId(null); // selectedId 초기화
    navigate("/member"); // MemberPage로 이동
  }

  //function fileGo(){
  //    if(st.upSystem){
  //        return <img src={`${bkURL}/fff/${st.upSystem}`}/>
  //    }
  //    return null
  //}

  function delGo() {
    deleteMem(id)
      //{data:{delUPfile : st.upSystem}}

      .then((res) => {
        // console.log("삭제완료", res.data);
        alert("삭제되었습니다.");
        fetchMembers(); // 목록 갱신
        setSelectedId(null); // 상세보기 초기화
        navigate("/member");
      })
      .catch((err) => {
        console.error("삭제오류발생", err);
      });

    console.log("delGO 실행");
  }

  /* 회원 상세 정보 폼 */
  return (
    <div className="mem-detail">
      <h1 className="title">회원 상세 정보</h1>
      <div className="info">
        <div>이름 : {st[0].name}</div>
        <div>아이디 : {st[0].id}</div>
        <div>비밀번호 : {st[0].pw}</div>
        <div>닉네임 : {st[0].nick}</div>
        <div>생년월일 : {st[0].birth_date}</div>
        <div>휴대전화 : {st[0].phone_num}</div>
        <div>이메일 : {st[0].email}</div>
        <div>주소 : {st[0].addr}</div>
        <div>접근권한 : {st[0].role}</div>
        <div>회원구분 : {st[0].type}</div>
        <div>회원등급 : {st[0].level}</div>
        <div>가입일시 : {st[0].join_date}</div>
        <div>최근접속일 : {st[0].last_date}</div>
      </div>

      <div className="actions">
        <button onClick={back} className="list">
          목록으로
        </button>
        <button onClick={() => setShowModify(true)}>수정</button>
        <button onClick={delGo} className="delete">
          삭제
        </button>
      </div>

      {/* 마일리지 내역 폼 */}
      <div className="mileage-section">
        <h1>마일리지 내역</h1>
        <div className="header">
          <div className="headercell">순서</div>
          <div className="headercell">적립 날짜</div>
          <div className="headercell">적립 내용</div>
          <div className="headercell">유효 날짜</div>
          <div className="headercell">변동 내역</div>
        </div>
        <div className="main">
          {st.map((mileage, index) => (
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
    </div>
  );
}

export default MemberDetail;
