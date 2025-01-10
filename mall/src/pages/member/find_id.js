import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { findId } from '../../services/api';
import styles from './find_id.module.css';

const FindId = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleFindId = async () => {
    try {
      const response = await findId(name, email);
      navigate(`/findId2/${response.data.id}`); // find_id2.js로 이동하며 데이터 전달
    } catch (error) {
      alert(error.response?.data?.message || '서버 오류');
    }
  };

  return (
    <section>
      <div className={styles.findIdContainer}>
        <div className={styles.findIdTitle}>아이디 찾기</div>

        <div className={styles.findMsgDiv}>
          {/*<i id="mypage_i" className={`fa-regular fa-user fa-2xl ${styles.mypageI}`}></i>*/}
          <p>가입 시 입력한 정보를 정확히 입력해 주시기 바랍니다.</p>
        </div>

        <div className={styles.findIdInputDiv}>
          <input
            type="text"
            className={styles.nameInput}
            placeholder="이름"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles.findIdInputDiv}>
          <div className={styles.emailDiv}>
          <input
            type="text"
            className={styles.emailInput}
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <select
            className={styles.emailDomain}
            onChange={(e) => setEmail((prevEmail) => `${prevEmail.split('@')[0]}@${e.target.value}`)} 
          >
            <option value="">직접입력</option>
            <option value="naver.com">naver.com</option>
            <option value="daum.net">daum.net</option>
            <option value="nate.com">nate.com</option>
            <option value="hotmail.com">hotmail.com</option>
            <option value="gmail.com">gmail.com</option>
          </select>
          </div>
        </div>

        <div className={styles.findBtnDiv}>
          <button type="button" className={styles.findBtn} onClick={handleFindId}>
            아이디 찾기
          </button>
        </div>

        <div className={styles.pwLoginDiv}>
        <button type="button" className={styles.findPwBtn} onClick={() => navigate('/findPw')}>
            비밀번호 찾기
          </button>
          <button type="button" className={styles.loginBtn} onClick={() => navigate('/login')}>
            로그인하기
          </button>
        </div>
      </div>
    </section>
  );
};

export default FindId;