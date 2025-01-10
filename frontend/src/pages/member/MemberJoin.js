import React from "react";
import { useNavigate } from "react-router-dom";
import { joinMem } from "../../services/api";
import "./MemberJoin.css";

function MemberJoin({ fetchMembers, setShowJoin }) {
  // fetchMembers : 회원 목록 갱신 함수
  // setShowJoin : 회원 등록 화면 표시 여부를 제어하는 상태 변경 함수
  const navigate = useNavigate();

  // 회원등록 폼 제출 함수
  function submitGo(event) {
    event.preventDefault();

        // 폼 데이터 수집
        const frmData = new FormData(document.myFrm)
        const data = Object.fromEntries(frmData)

        // 서버에 데이터 전송
        joinMem(data)
        
        .then(res=>{
            alert('회원이 등록되었습니다.')
            fetchMembers(); // 목록 갱신
            setShowJoin(false); // 회원등록 폼 비활성화
        })
        
        .catch(err=>{
            console.log('등록오류 : ',err)
        })
    }
    
     // "목록으로" 버튼 클릭 시 실행되는 함수
    const back = () => {
        setShowJoin(false); // 회원등록 폼 비활성화
        navigate('/member'); // 목록으로 이동
    };
    
    
    /* 회원 등록 폼 */
    return (
        <div className="member-join">
            <h1>회원 등록</h1>
            <form name="myFrm" onSubmit={submitGo} className="join-form">
                
                <div className="jf">
                    <label>아이디:</label>
                    <input type="text" name="id" required />
                </div>
                <div className="jf">
                    <label>비밀번호:</label>
                    <input type="password" name="pw" required />
                </div>
                <div className="jf">
                    <label>이름:</label>
                    <input type="text" name="name" required />
                </div>
                <div className="jf">
                    <label>닉네임:</label>
                    <input type="text" name="nick" />
                </div>
                <div className="jf">
                    <label>생년월일:</label>
                    <input type="date" name="birth_date" />
                </div>
                <div className="jf">
                    <label>휴대전화:</label>
                    <input type="text" name="phone_num" />
                </div>
                <div className="jf">
                    <label>이메일:</label>
                    <input type="email" name="email" />
                </div>
                <div className="jf">
                    <label>주소:</label>
                    <input type="text" name="addr" />
                </div>
                
                <div className="jf">
                    <label>접근 권한:</label>
                    <select name="role">
                        <option value="회원">회원</option>
                        <option value="관리자">관리자</option>
                        <option value="비회원">비회원</option>
                        <option value="탈퇴회원">탈퇴회원</option>
                    </select>
                </div>

        <div className="jf">
          <label>회원 구분:</label>
          <select name="type">
            <option value="일반">일반</option>
            <option value="블랙리스트">블랙리스트</option>
            <option value="휴면계정">휴면계정</option>
          </select>
        </div>

        <div className="jf">
          <label>회원 등급:</label>
          <select name="level">
            <option value="브론즈">브론즈</option>
            <option value="실버">실버</option>
            <option value="골드">골드</option>
            <option value="VIP">VIP</option>
          </select>
        </div>

        <div className="jf">
          <label>작성자:</label>
          <input type="text" name="reg_id" value="관리자" required />
        </div>

        <div className="form-actions">
          <button type="button" onClick={back} className="cancel-btn">
            목록으로
          </button>
          <button type="submit" className="submit-btn">
            등록
          </button>
        </div>
      </form>
    </div>
  );
}

export default MemberJoin;
