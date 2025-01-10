import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { findPw } from '../../services/api';
import InputForm from './component/inputForm';
import styles from './find_pw.module.css';


const FindPw = () => {
  const [userName, setUserName] = useState('')
  const [userId, setUserId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleNextClick = async () => {
    try {
      const response = await findPw(userId, userName);
      navigate(`/findPwReset/${userId}`); // find_pw_reset.js로 이동
    } catch (error) {
      setErrorMessage(error.response?.data?.message || '서버 오류');
    }
  };

  const fields = [
    { type: 'text', id: 'name_input', placeholder: '이름 입력', value: userName, onChange: (e) => setUserName(e.target.value), required: true },
    { type: 'text', id: 'id_input', placeholder: '아이디 입력', value: userId, onChange: (e) => setUserId(e.target.value), required: true },
  ];

  return (
    <section>
      <div className={styles.findPwContainer}>
        <div className={styles.findPwTitle}>비밀번호 찾기</div>

        <div className={styles.findMsgDiv}>
          <i id="mypage_i" className={`fa-regular fa-user ${styles.mypageIcon}`} style={{ color: '#F294B2' }}></i>
          <p>회원님의 이름과 아이디를 입력해 주세요.</p>
        </div>

        <InputForm
          fields={fields}
          errorMessage={errorMessage}
          buttonText="다음"
          onSubmit={handleNextClick}
        />

          <p>
            아이디를 모르시나요?{' '}
            <Link to="/findId">아이디 찾기</Link>
          </p>
        </div>        
    </section>
  );
};

export default FindPw;