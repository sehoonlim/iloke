import { useState } from "react";
import { memJoin, checkIdDup, checkNickDup } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import styles from './join.module.css'

// ksh

function Join(){
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        id: "",
        pw: "",
        pw2: "",
        name: "",
        nick: "",
        email: "",
        phone_num: "",
        addr: "",
        birth_date: "",
      });

      const [idMsg, setIdMsg] = useState("");                     // 아이디 메시지 상태
      const [idDuplicate, setIdDuplicate] = useState(false);      // 중복 여부
      const [idValid, setIdValid] = useState(false);              // 아이디 유효성 상태
      const [pwMsg, setPwMsg] = useState("");                     // 비밀번호 메시지 상태
      const [pwValid, setPwValid] = useState(false);              // 비밀번호 유효성 상태
      const [pwMatchMsg, setPwMatchMsg] = useState("");          // 비밀번호 일치 메시지 상태
      const [nameValid, setNameValid] = useState(false);          // 이름 유효성 상태
      const [nickDuplicate, setNickDuplicate] = useState(false);  // 닉네임 중복 여부
      const [nickMsg, setNickMsg] = useState("");                 // 닉네임 메시지 상태
      const [emailValid, setEmailValid] = useState(false); // 이메일 유효성 상태
      const [emailMsg, setEmailMsg] = useState(""); // 이메일 메시지 상태
      const [phoneNumValid, setPhoneNumValid] = useState(false);  // 휴대전화 유효성 상태
      const [addrValid, setAddrValid] = useState(false);          // 주소 유효성 상태
    
      // 아이디 유효성 검사 함수
      const validId = (id) => {
        const idRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{4,12}$/; // 숫자,대문자,소문자 조합, 최소 4자~12자 이하
        if (!idRegex.test(id)) {
          setIdMsg("아이디는 숫자와 영문 소문자 포함 최소 4자 이상 12자 이하이어야 합니다.");
          setIdValid(false);
          return false;
        }
        setIdMsg("유효한 형식의 아이디입니다.");
        setIdValid(true);
        return true;
      };
    

      // 아이디 중복 확인 함수
      const checkIdDuplicate = async (id) => {
        if (!id) {
          setIdMsg("");
          setIdDuplicate(false);
          return;
        }

        // 유효성 검사 실패 시 중복 확인 생략
        if (!validId(id)) {
          return;
        }
      
        try {
          const response = await checkIdDup(id);
          if (response.data.isDuplicate) {
            setIdMsg("이미 사용 중인 아이디입니다.");
            setIdDuplicate(true);
          } else {
            setIdMsg("사용 가능한 아이디입니다.");
            setIdDuplicate(false);
          }
        } catch (error) {
          setIdMsg("아이디 중복 확인 중 오류가 발생했습니다.");
          setIdDuplicate(true);
        }
      };

       // 비밀번호 유효성 검사 함수
        const checkPwValid = (password) => {
          const pwPattern = /^(?!.*\s)(?=.*[a-zA-Z])(?=.*\d|.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{10,}$/; // 영문 대/소문자, 숫자, 특수문자 중 2가지 이상 조합 10자 이상
          if (!pwPattern.test(password)) {
              setPwMsg("비밀번호는 영문 대/소문자, 숫자, 특수문자 중 2가지 이상 조합으로 10자 이상이어야 합니다.");
              setPwValid(false);
              return false;
          }
          setPwMsg("비밀번호가 유효합니다.");
          setPwValid(true);
          return true;
        };

        const checkPwMatch = (password, confirmPassword) => {
          if (!password && !confirmPassword) {
            setPwMatchMsg(""); // 둘 다 비어 있으면 메시지를 지움
            return false;
          }
          if (password !== confirmPassword) {
              setPwMatchMsg("비밀번호가 일치하지 않습니다.");
              return false;
          }
  
          setPwMatchMsg("비밀번호가 일치합니다.");
          return true;
        };

        // 이름 유효성 검사 함수
        const validName = (name) => {
          const nameRegex = /^[가-힣]{2,6}$/;  // 한글 2~6자
          if (!nameRegex.test(name)) {
            setNameValid(false);
            return false;
          }
          setNameValid(true);
          return true;
        };

        const validNick = (nick) => {
          if (!nick) return true;

          const nickRegex = /^[가-힣A-Za-z0-9]{2,10}$/; // 닉네임 유효성 조건
          if (!nickRegex.test(nick)) {
              setNickMsg("닉네임은 한글, 영문, 숫자 포함 2자 이상 10자 이하로 입력해주세요.");
              setNickDuplicate(true); // 유효하지 않으면 중복처럼 처리
              return false;
          }
          return true;
      };
      
        // 닉네임 중복 확인 함수
        const checkNickDuplicate = async (nick) => {
          if (!nick) { 
            setNickMsg("");  // 닉네임이 비어 있으면 메시지 지우기
            setNickDuplicate(false); // 닉네임이 비어있으면 중복으로 처리하지 않음
            return;  // 닉네임이 비어있으면 중복 확인 하지 않음
          }

          if (!validNick(nick)) {
            return;
        }
        
          try {
            const response = await checkNickDup(nick);
            setNickDuplicate(response.data.isDuplicate);
            setNickMsg(response.data.isDuplicate ? "이미 사용 중인 닉네임입니다." : "사용 가능한 닉네임입니다.");
          } catch (error) {
            setNickDuplicate(true);  // 서버 오류시 중복으로 처리
          }
        };

        // 이메일 유효성 검사 함수
        const validEmail = (email) => {
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
          if (!emailRegex.test(email)) {
            setEmailMsg("유효한 이메일 형식이 아닙니다.");
            setEmailValid(false);
            return false;
          }
          setEmailMsg("유효한 이메일 형식입니다.");
          setEmailValid(true);
          return true;
        };

         // 휴대전화 유효성 검사 함수
        const validPhoneNum = (phoneNum) => {
          const phoneRegex = /^\d{3}-\d{4}-\d{4}$/; // xxx-xxxx-xxxx 형식
          if (!phoneRegex.test(phoneNum)) {
              setPhoneNumValid(false);
              return false;
          }
          setPhoneNumValid(true);
          return true;
        };


        // 주소 유효성 검사 함수
        const validAddr = (addr) => {
          const addrRegex = /^[A-Za-z0-9가-힣\s-]{8,}$/; // 한글, 숫자, 영문자, 공백, 특수문자 '-'만 허용, 최소 8자 이상
          if (!addrRegex.test(addr)) {
              setAddrValid(false);
              return false;
          }
          setAddrValid(true);
          return true;
        };

        const handleChange = (e) => {
          const { name, value } = e.target;
  
          setFormData({ ...formData, [name]: value });

        if (name === "pw") {
            checkPwValid(value);
            checkPwMatch(value, formData.pw2);
        } else if (name === "pw2") {
            checkPwMatch(formData.pw, value);
        } else if (name === "id") {
            checkIdDuplicate(value);
        } else if (name === "name") {
            validName(value);
        } else if (name === "nick") {
            checkNickDuplicate(value);
        } else if (name === "email") {
            validEmail(value);
        } else if (name === "emailDomain") {
            const updatedEmail = `${formData.email.split("@")[0]}@${value}`;
            setFormData({ ...formData, email: updatedEmail });
            validEmail(updatedEmail);
        } else if (name === "phone_num") {
            validPhoneNum(value);
        } else if (name === "addr") {
            validAddr(value);
        }
    };
    
        const handleSubmit = async (e) => {
          e.preventDefault();

        // 아이디 유효성 검사 실패 시 제출 방지
        if (!idValid) {
          alert("아이디가 유효하지 않습니다. 조건을 충족하는 아이디를 입력해주세요.");
          return;
        }

        // 아이디 중복 확인 로직
        if (idDuplicate) {
          alert("이미 사용 중인 아이디입니다. 다른 아이디를 입력해주세요.");
          return;
        }

        // 비밀번호 확인 로직
        if (formData.pw !== formData.pw2) {
          alert("비밀번호가 일치하지 않습니다.");
          return;
        }

        // 비밀번호 유효성 검사
        if (!pwValid) {
          alert("비밀번호가 유효하지 않습니다. 조건을 충족하는 비밀번호를 입력해주세요.");
          return;
        }

        // 이름 유효성 검사
        if (!nameValid) {
          alert("이름이 유효하지 않습니다.");
          return;
        }

        // 닉네임 중복 확인
        if (formData.nick && nickDuplicate) {
          alert("닉네임이 유효하지 않습니다.");
          return;
        }

        if (formData.nick && !validNick(formData.nick)) {
            alert("닉네임이 유효하지 않습니다.");
            return;
        }

        // 이메일 유효성 검사
        if (!emailValid) {
          alert("이메일 형식이 유효하지 않습니다.");
          return;
        }

        // 휴대전화 유효성 검사
        if (!phoneNumValid) {
          alert("휴대전화 번호 형식이 유효하지 않습니다. xxx-xxxx-xxxx 형태로 입력해주세요.");
          return;
        }

        // 주소 유효성 검사
        if (!addrValid) {
          alert("주소는 한글, 숫자, 영문자, '-'만 허용하며, 최소 8자 이상이어야 합니다.");
          return;
        }

      
        // 서버로 보낼 데이터 준비 (pw2 제외)
        const dataToSend = {
        id: formData.id,
        pw: formData.pw,
        name: formData.name,
        nick: formData.nick,
        email: formData.email,
        phone_num: formData.phone_num,
        addr: formData.addr,
        birth_date: formData.birth_date,
        };
    
        try {
          const response = await memJoin(dataToSend);
          if (response.data.success) {
            alert("회원가입 성공!");
            navigate(`/joinFin?name=${encodeURIComponent(formData.name)}`); // 회원가입 완료 페이지로 이동 및 이름 전달
  
          } else {
            alert("회원가입 실패: " + response.data.message);
          }
        } catch (error) {
          alert("회원가입 중 오류가 발생했습니다.");
        }
      };

    return(
      <section>
      <div className={styles.join_base_section}>
        <div className={styles.join_base_wrap}>
          <div className={styles.filterHeader}>
            <h2>회원가입</h2>
          </div>
          <br/>

          {/* Tabs Navigation */}
          <div className={styles.tabs}>
              <div className={styles.tab}>약관동의</div>
              <div className={`${styles.tab} ${styles.active}`}>정보입력</div>
              <div className={styles.tab}>가입완료</div>
          </div>
          <br />
          <form onSubmit={handleSubmit}>
          <table className={styles.table}>
            <tr className={styles.tableRow}>
              <td className={styles.inputHead}>
                <i
                    className="fa-solid fa-square fa-2xs esse"
                    style={{
                        color: "#F294B2",
                        fontSize: "6px",
                        position: "relative",
                        bottom: "2px",
                        marginRight: "11px",
                    }}
                ></i>
                아이디
                </td>
              <td>
                <input type="text" id="id" name="id" className={styles.textInput} oninput="validateInput(this)" value={formData.id} onChange={handleChange}/>
                <p className={`${styles.idMessage} ${idValid && !idDuplicate ? styles.success : styles.error}`}>
                  {idMsg}
                </p>
              </td>
            </tr>
            <tr className={styles.tableRow}>
              <td className={styles.inputHead}>
                <i
                    className={`fa-solid fa-square fa-2xs ${styles.esse}`}
                    style={{
                        color: "#F294B2",
                        fontSize: "6px",
                        position: "relative",
                        bottom: "2px",
                        marginRight: "11px",
                    }}
                ></i>비밀번호
                </td>
              <td>
                <input type="password" name="pw" id="pw" className={styles.textInput} value={formData.pw} onChange={handleChange}/>
                <p className={`${styles.pwMessage} ${pwValid ? styles.success : styles.error}`}>
                  {pwMsg}
                </p>
              </td>
            </tr>
            <tr className={styles.tableRow}> 
              <td className={styles.inputHead}>
                <i
                    className={`fa-solid fa-square fa-2xs ${styles.esse}`}
                    style={{
                        color: "#F294B2",
                        fontSize: "6px",
                        position: "relative",
                        bottom: "2px",
                        marginRight: "11px",
                    }}
                ></i>
                비밀번호 확인
              </td>
              <td>
                <input type="password" name="pw2" id="pw2" className={styles.textInput} value={formData.pw2} onChange={handleChange}/>
                {pwMatchMsg && (<p className={formData.pw === formData.pw2 ? styles.success : styles.error}>
                  {pwMatchMsg}
                </p>
                )}
              </td>
            </tr>
            <tr className={styles.tableRow}>
              <td className={styles.inputHead}>
                <i
                    className={`fa-solid fa-square fa-2xs ${styles.esse}`}
                    style={{
                        color: "#F294B2",
                        fontSize: "6px",
                        position: "relative",
                        bottom: "2px",
                        marginRight: "11px",
                    }}
                ></i>이름</td>
              <td>
                <input type="text" name="name" id="name" className={styles.textInput} 
                oninput="validateInputK(this)" value={formData.name} onChange={handleChange}/>
              </td>
            </tr>
            <tr>
              <td className={styles.inputHead}>닉네임</td>
              <td>
                <input type="text" name="nick" id="nick" className={styles.textInput} value={formData.nick} 
                  onBlur={() => checkNickDuplicate(formData.nick)}onChange={handleChange}/>
                   <p className={nickDuplicate ? styles.error : styles.success}>
                    {nickMsg}  {/* 닉네임 메시지 상태에 따라 출력 */}
                  </p>
              </td>
            </tr>
            <tr>
              <td className={styles.inputHead}>
                <i
                    className={`fa-solid fa-square fa-2xs ${styles.esse}`}
                    style={{
                        color: "#F294B2",
                        fontSize: "6px",
                        position: "relative",
                        bottom: "2px",
                        marginRight: "11px",
                    }}
                ></i>이메일</td>
              <td>
              <div className={styles.emailContainer}>
                <label className={styles.checkboxLabel}>
                <input
                    type="text"
                    name="email"
                    placeholder="이메일 입력"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <select
                    name="emailDomain"
                    onChange={handleChange}
                  >
                    <option value="">직접 입력</option>
                    <option value="naver.com">naver.com</option>
                    <option value="gmail.com">gmail.com</option>
                    <option value="daum.net">daum.net</option>
                    <option value="nate.com">nate.com</option>
                    <option value="hotmail.com">hotmail.com</option>
                  </select>
                </label>
                <p className={emailValid ? styles.success : styles.error}>{emailMsg}</p>
                </div>
                <p>
                    <i
                     className={`fa-solid fa-square fa-2xs ${styles.esse}`}
                        style={{
                            color: "#F294B2",
                            fontSize: "6px",
                            position: "relative",
                            bottom: "2px",
                            marginRight: "11px",
                        }}
                    ></i>
                  아이디/비밀번호 찾기에 활용되므로 정확하게 입력해주세요
                </p>
                <label className={styles.checkboxLabel}>
                  <p><input type="checkbox" id="maillingFllabel" /> 정보/이벤트 메일 수신에 동의합니다.</p>
                </label>
              </td>
            </tr>
            <tr>
              <td className={styles.inputHead}><i
                    className={`fa-solid fa-square fa-2xs ${styles.esse}`}
                    style={{
                        color: "#F294B2",
                        fontSize: "6px",
                        position: "relative",
                        bottom: "2px",
                        marginRight: "11px",
                    }}
                ></i>휴대전화</td>
              <td>
                <input
                  type="text"
                  name="phone_num"
                  id="phone_num"
                  className={styles.textInput}
                  oninput="validateInputN(this)" 
                  placeholder=" - 포함하여 입력하세요"
                  value={formData.phone_num}
                  onChange={handleChange}
                />
                <p>
                <i
                    className={`fa-solid fa-square fa-2xs ${styles.esse}`}
                    style={{
                        color: "#F294B2",
                        fontSize: "6px",
                        position: "relative",
                        bottom: "2px",
                        marginRight: "11px",
                    }}
                ></i>
                  상품 구매 시 해피콜 등 고객님과 연락에 꼭 필요한 정보임으로
                    정확히 입력해주세요.
                </p>
                <label className={styles.checkboxLabel}>
                  <p><input type="checkbox" id="smsFllabel" /> 정보/이벤트 SMS 수신에 동의합니다.</p>
                </label>
              </td>
            </tr>
            <tr>
              <td className={styles.inputHead}
                ><i
                    className={`fa-solid fa-square fa-2xs ${styles.esse}`}
                    style={{
                        color: "#F294B2",
                        fontSize: "6px",
                        position: "relative",
                        bottom: "2px",
                        marginRight: "11px",
                    }}
                ></i>주소</td>
              <td>
                <input type="text" name="addr" id="addr" className={styles.textInput} oninput="validateInputA(this)" value={formData.addr} onChange={handleChange}/>
              </td>
            </tr>
            <tr>
              <td className={styles.inputHead}>
                생년월일</td>
              <td>
                <label className={styles.checkboxLabel}>
                  <div className="datepicker-container">
                    <input type="date" id="birth_date" name="birth_date" value={formData.birth} onChange={handleChange}/>
                  </div>
                </label>
              </td>
            </tr>
          </table>
          <br />
          <div className={styles.buttonBox}>
          <Link to="/">
            <button id="btnCancel" className={styles.btn_member_cancel}>취소</button>
          </Link>
            <button id="submit" className={styles.btn_comfirm}>회원가입</button>
          </div>
          </form>
        </div>
      </div>
    </section>
    )
}

export default Join;