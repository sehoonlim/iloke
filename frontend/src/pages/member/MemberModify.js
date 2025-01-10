import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { detailMem } from "../../services/api";
import { modifyMem } from "../../services/api";
import axios from "axios";
import "./MemberModify.css";

function MemberModify({ id, setShowModify, fetchMembers }) {

    const navigate = useNavigate()
    //const {id} = useParams();
    const [st, setSt] = useState(null)

    useEffect(()=>{
        if(!id){
            return
        }

        detailMem(id)
            .then(res=>{
                setSt(res.data[0])
            })
            .catch(err=>{
                console.log("정보받기 실패", err)
            })
    },[id])

    if(!st){
        return <div>id 없음</div>
    }

  function stChange(kk, event) {
    setSt({ ...st, [kk]: event.value });
  }

    function submitGo(e){
        e.preventDefault()
        const frmData = new FormData(document.myFrm)
        const myData = Object.fromEntries(frmData)

        modifyMem(myData)
        .then(res=>{
            alert('수정되었습니다')
            fetchMembers(); // 목록 갱신
            setShowModify(false); // 수정 화면 비활성화
        })
        .catch(err=>{
            console.log("수정 실패",err)
        })
    }

  function back() {
    setShowModify(false); // 수정 화면 비활성화
  }

  return (
    <div className="member-modify">
      <h1 className="title">회원 정보 수정</h1>
      <form name="myFrm" onSubmit={submitGo} className="modify-form">
        <div className="form-group">
          <label>아이디:</label>
          <input type="text" name="id" value={st.id} readOnly />
        </div>
        <div className="form-group">
          <label>비밀번호:</label>
          <input
            type="password"
            name="pw"
            defaultValue={st.pw}
            onChange={(e) => stChange("pw", e.target)}
          />
        </div>
        <div className="form-group">
          <label>이름:</label>
          <input
            type="text"
            name="name"
            defaultValue={st.name}
            onChange={(e) => stChange("name", e.target)}
          />
        </div>
        <div className="form-group">
          <label>닉네임:</label>
          <input
            type="text"
            name="nick"
            defaultValue={st.nick}
            onChange={(e) => stChange("nick", e.target)}
          />
        </div>
        <div className="form-group">
          <label>생년월일:</label>
          <input
            type="date"
            name="birth_date"
            defaultValue={st.birth_date}
            onChange={(e) => stChange("birth_date", e.target)}
          />
        </div>
        <div className="form-group">
          <label>휴대전화:</label>
          <input
            type="text"
            name="phone_num"
            defaultValue={st.phone_num}
            onChange={(e) => stChange("phone_num", e.target)}
          />
        </div>
        <div className="form-group">
          <label>이메일:</label>
          <input
            type="email"
            name="email"
            defaultValue={st.email}
            onChange={(e) => stChange("email", e.target)}
          />
        </div>
        <div className="form-group">
          <label>주소:</label>
          <input
            type="text"
            name="addr"
            defaultValue={st.addr}
            onChange={(e) => stChange("addr", e.target)}
          />
        </div>
        <div className="form-group">
          <label>접근권한:</label>
          <select
            name="role"
            value={st.role}
            onChange={(e) => stChange("role", e.target)}
          >
            <option value="회원">회원</option>
            <option value="관리자">관리자</option>
            <option value="비회원">비회원</option>
          </select>
        </div>
        <div className="form-group">
          <label>회원구분:</label>
          <select
            name="type"
            value={st.type}
            onChange={(e) => stChange("type", e.target)}
          >
            <option value="일반">일반</option>
            <option value="블랙리스트">블랙리스트</option>
            <option value="휴면">휴면</option>
          </select>
        </div>
        <div className="form-group">
          <label>회원등급:</label>
          <select
            name="level"
            value={st.level}
            onChange={(e) => stChange("level", e.target)}
          >
            <option value="브론즈">브론즈</option>
            <option value="실버">실버</option>
            <option value="골드">골드</option>
            <option value="VIP">VIP</option>
          </select>
        </div>
        <div className="form-group">
          <label>수정자:</label>
          <input
            type="text"
            name="upt_id"
            defaultValue={st.upt_id}
            onChange={(e) => stChange("upt_id", e.target)}
          />
        </div>
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={back}>
            뒤로
          </button>
          <button type="submit" className="submit-btn">
            수정
          </button>
        </div>
      </form>
    </div>
  );
}

export default MemberModify;
