import { useState, useEffect } from "react";
import { fetchData, checkNickDup, updateUser } from "../../services/api";
import { useNavigate } from "react-router-dom";
import styles from "./memModify2.module.css";

function MemModify() {
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

  const [showPwFields, setShowPwFields] = useState(false);
  const [nickMsg, setNickMsg] = useState("");
  const [isNickDuplicate, setIsNickDuplicate] = useState(false);
  const [ogNick, setOgNick] = useState(""); // 기존 닉네임 상태 추가
  const [pwMsg, setPwMsg] = useState(""); // 비밀번호 유효성 메시지
  const [pwMatchMsg, setPwMatchMsg] = useState(""); // 비밀번호 확인 메시지
  const [pwValid, setPwValid] = useState(false); // 비밀번호 유효 여부
  const [emailMsg, setEmailMsg] = useState(""); // 이메일 유효성 메시지
  const [emailValid, setEmailValid] = useState(false); // 이메일 유효 여부

  // 세션 스토리지에서 아이디 가져오기
  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    if (storedUserId) {
      fetchUserData(storedUserId);
    } else {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  }, [navigate]);

  // 사용자 정보 불러오기
  const fetchUserData = async (userId) => {
    try {
      const response = await fetchData(userId);
      if (response.data.success) {
        setFormData(response.data.userData);
        setOgNick(response.data.userData.nick); // 기존 닉네임 저장
      } else {
        alert("사용자 정보를 불러오는데 실패했습니다.");
      }
    } catch (error) {
      alert("사용자 정보를 불러오는 중 오류가 발생했습니다.");
    }
  };

  // 비밀번호 입력 필드 토글
  const togglePwFields = () => {
    setShowPwFields(!showPwFields);
    if (!showPwFields) {
      setFormData({ ...formData, pw: "", pw2: "" }); // 비밀번호 필드 초기화
    }
  };

  // 비밀번호 유효성 검사 함수
  const checkPwValid = (pw) => {
    const pwRegex = /^(?!.*\s)(?=.*[a-zA-Z])(?=.*\d|.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{10,}$/;
    if (!pwRegex.test(pw)) {
      setPwMsg("비밀번호는 영문 대/소문자, 숫자, 특수문자 중 2가지 이상 조합으로 10자 이상이어야 합니다.");
      setPwValid(false);
      return false;
    }
    setPwMsg("사용 가능한 비밀번호입니다.");
    setPwValid(true);
    return true;
  };

  const checkPwMatch = (pw, pw2) => {
    if (!pw && !pw2) {
      setPwMatchMsg("");
      return false;
    }

    if (pw !== pw2) {
      setPwMatchMsg("비밀번호가 일치하지 않습니다.");
      return false;
    }

    setPwMatchMsg("비밀번호가 일치합니다.");
    return true;
  };


  // 닉네임 유효성 검사 함수
  const validNick = (nick) => {
    if (!nick) return true;   // 닉네임 비어있으면 유효성 검사 생략
    const nickRegex = /^[가-힣A-Za-z0-9]{2,10}$/;
    return nickRegex.test(nick);
  };

  // 이메일 유효성 검사 함수
  const validEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setEmailMsg("이메일 형식이 올바르지 않습니다.");
      setEmailValid(false);
      return false;
    }
    setEmailMsg("사용 가능한 이메일입니다.");
    setEmailValid(true);
    return true;
  };

  // 휴대전화 유효성 검사 함수
  const validPhoneNum = (phone) => {
    const phoneRegex = /^\d{3}-\d{4}-\d{4}$/;
    return phoneRegex.test(phone);
  };

  // 닉네임 중복 확인 함수
  const checkNickDuplicate = async (nick) => {
    // 현재 닉네임과 같으면 중복 체크를 하지 않음
    if (nick === ogNick) {
      setNickMsg("");
      setIsNickDuplicate(false);
      return;
    }

    if (!validNick(nick)) {
      setNickMsg("닉네임은 한글, 영문, 숫자 포함 2자 이상 10자 이하이어야 합니다.");
      setIsNickDuplicate(true);
      return;
    }

    try {
      const response = await checkNickDup(nick);
      if (response.data.isDuplicate) {
        setNickMsg("중복되는 닉네임입니다.");
        setIsNickDuplicate(true)
      } else {
        setNickMsg("사용가능한 닉네임입니다.");
        setIsNickDuplicate(false);
      }
    } catch (error) {
      setNickMsg("닉네임 중복 확인 중 오류가 발생했습니다.");
      setIsNickDuplicate(true);
    }
  };

  // 입력 값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "pw") {
      checkPwValid(value);
      checkPwMatch(value, formData.pw2);
    } else if (name === "pw2") {
      checkPwMatch(formData.pw, value);
    } else if (name === "nick") {
      checkNickDuplicate(value);
    } else if (name === "email") {
      validEmail(value);
    }
  };

  const handleEmailDomain = (domain) => {
    const emailId = formData.email.split("@")[0];
    const updatedEmail = `${emailId}@${domain}`;
    setFormData({ ...formData, email: updatedEmail });
    validEmail(updatedEmail);
  };

  // 폼 제출 시 정보 수정
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (showPwFields) {
      if (!checkPwValid(formData.pw)) {
        alert("비밀번호는 영문 대/소문자, 숫자, 특수문자 중 2가지 이상 조합으로 10자 이상이어야 합니다.");
        return;
      }
  
      if (formData.pw !== formData.pw2) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }
    }

    if (isNickDuplicate) {
      alert("닉네임이 유효하지 않습니다.");
      return;
    }

    if (!validEmail(formData.email)) {
      alert("이메일은 한글과 공백 없이 올바른 형식으로 입력해주세요.");
      return;
    }

    if (!validPhoneNum(formData.phone_num)) {
      alert("휴대전화 번호는 xxx-xxxx-xxxx 형식으로 입력해주세요.");
      return;
    }

    const dataToSend = {
      userId: formData.id,
      pw: showPwFields ? formData.pw : undefined, // 비밀번호 필드가 보일 때만 새 비밀번호 전송
      name: formData.name,
      nick: formData.nick,
      email: formData.email,
      phone_num: formData.phone_num,
      addr: formData.addr,
      birth_date: formData.birth_date,
    };

    try {
      const response = await updateUser(dataToSend);
      if (response.data.success) {
        alert("회원정보가 성공적으로 수정되었습니다.");
        navigate("/");
      } else {
        alert("회원정보 수정 실패: " + response.data.message);
      }
    } catch (error) {
      alert("회원정보 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <section className={styles.modifySection}>
      <div className={styles.modifyWrap}>
        <h2>회원정보 수정</h2>
        <form onSubmit={handleSubmit} className={styles.modifyForm}>
          <div className={styles.formGroup}>
            <div className={styles.sectionDivider}></div>
            <div className={styles.inputGroup}>
              <p>아이디</p>
              <input type="text" name="id" value={formData.id} disabled />
            </div>
  
            <div className={styles.sectionDivider}></div>
  
            <div className={styles.passwordToggle}>
              <button type="button" className={styles.btnToggle} onClick={togglePwFields}>
                {showPwFields ? "비밀번호 수정 취소" : "비밀번호 수정"}
              </button>
            </div>
  
            {showPwFields && (
              <>
                <div className={styles.inputGroup}>
                  <p>새 비밀번호</p>
                  <div className={styles.pwInputWrapper}>
                  <input type="password" name="pw" value={formData.pw} onChange={handleChange} />
                  {pwMsg && (
                    <p className={`${styles.pwMsg} ${pwValid ? styles.success : styles.error}`}>
                    {pwMsg}
                    </p>
                    )}
                </div>
                </div>
                <div className={styles.inputGroup}>
                  <p>새 비밀번호 확인</p>
                  <div className={styles.pwInputWrapper}>
                  <input type="password" name="pw2" value={formData.pw2} onChange={handleChange} />
                  {pwMatchMsg && (
                    <p className={`${styles.pwMatchMsg} ${formData.pw === formData.pw2 ? styles.success : styles.error}`}>
                    {pwMatchMsg}
                  </p>
                )}
                </div>
                </div>
              </>
            )}
  
            <div className={styles.sectionDivider}></div>
  
            <div className={styles.inputGroup}>
              <p>이름</p>
              <input type="text" name="name" value={formData.name} onChange={handleChange} disabled />
            </div>
  
            <div className={styles.sectionDivider}></div>
  
            <div className={styles.inputGroup}>
              <p>닉네임</p>
              <div className={styles.nicknameWrapper}>
              <input type="text" name="nick" value={formData.nick} 
              onChange={(e) => {
                  handleChange(e);            // 입력 값 변경 핸들러
                  checkNickDuplicate(e.target.value); // 중복 체크 함수 호출
                }} />
                <p className={`${styles.nicknameMessage} ${isNickDuplicate ? styles.error : styles.success}`}>
                  {nickMsg}
                </p>
            </div>
            </div>

                <div className={styles.sectionDivider}></div>

            <div>
              <p className={styles.emailPhone}>이메일</p>
              <div className={styles.inputWrapper}>
                <div className={styles.emailInput}>
                  <input
                    type="email"
                    name="email"
                    placeholder="이메일 입력"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <select
                    name="emailDomain"
                    onChange={(e) => handleEmailDomain(e.target.value)}
                  >
                    <option value="">직접 입력</option>
                    <option value="naver.com">naver.com</option>
                    <option value="gmail.com">gmail.com</option>
                    <option value="daum.net">daum.net</option>
                    <option value="nate.com">nate.com</option>
                    <option value="hotmail.com">hotmail.com</option>
                  </select>
                </div>
                <p className={`${styles.emailMsg} ${emailValid ? styles.success : styles.error}`}>
                  {emailMsg}
                </p>
                <p className={styles.infoText}>아이디/비밀번호 찾기에 활용되므로 정확하게 입력해주세요.</p>
                <label className={styles.checkboxContainer}>
                  <input type="checkbox" name="emailConsent" /> 정보/이벤트 메일 수신에 동의합니다.
                </label>
              </div>
            </div>
                
            <div className={styles.sectionDivider}></div>
                
            <div>
              <p className={styles.emailPhone}>휴대전화</p>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  name="phone_num"
                  placeholder="휴대전화 번호 입력"
                  value={formData.phone_num}
                  onChange={handleChange}
                />
                <p className={styles.infoText}>고객님과 연락에 꼭 필요한 정보이므로 정확하게 입력해주세요.<br/> xxx-xxxx-xxxx 형태로 입력해주시기 바랍니다.</p>
                <label className={styles.checkboxContainer}>
                  <input type="checkbox" name="smsConsent" /> 정보/이벤트 SMS 수신에 동의합니다.
                </label>
              </div>
            </div>

          <div className={styles.sectionDivider}></div>

          <div className={styles.inputGroup}>
            <p>주소</p>
            <input type="text" name="addr" value={formData.addr} onChange={handleChange} />
          </div>

          <div className={styles.sectionDivider}></div>

          <div className={styles.inputGroup}>
            <p>생년월일</p>
            <input type="date" name="birth_date" value={formData.birth_date || ""} onChange={handleChange} />
          </div>
        </div>

        <div className={styles.buttonBox}>
          <button type="button" className={styles.btnCancel} onClick={() => navigate("/")}>
            취소
          </button>
          <button type="submit" className={styles.btnConfirm}>
            수정하기
          </button>
        </div>
      </form>
    </div>
  </section>
);
}

export default MemModify;