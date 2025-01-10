import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './find_pw_complete.module.css';

const FindPwComplete = () => {
  const navigate = useNavigate();

  return (
    
      <div className={styles.completeContainer}>
        <div className={styles.completeTitle}>비밀번호 변경 완료</div>

        <div className={styles.completePwMsg}>
          <i id="mypage_i" className={`fa-regular fa-user ${styles.mypageIcon}`} style={{ color: '#F294B2' }}></i>
          <p>비밀번호가 성공적으로 변경되었습니다.</p>
        </div>

        <div className={styles.loginBtnDiv}>
          <button type="button" className={styles.loginBtn} onClick={() => navigate('/login')}>
            로그인
          </button>
        </div>
      </div>
    
  );
};

export default FindPwComplete;