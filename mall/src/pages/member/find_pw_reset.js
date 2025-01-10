import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { findPwReset } from '../../services/api';
import InputForm from './component/inputForm';
import styles from './find_pw_reset.module.css';


const FindPwReset = ({ userId }) => {
  //const { userId } = useParams(); // URL 파라미터에서 userId 가져오기
  const [userPw, setUserPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    // 비밀번호 유효성 검사 (영문 대/소문자, 숫자, 특수문자 중 2가지 이상 조합 10자 이상)
    const pwRegex = /^(?!.*\s)(?=.*[a-zA-Z])(?=.*\d|.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{10,}$/; // 영문 대/소문자, 숫자, 특수문자 중 2가지 이상 조합 10자 이상

    if (!pwRegex.test(userPw)) {
      setErrorMsg('비밀번호는 영문 대/소문자, 숫자, 특수문자 중 2가지 이상 조합으로 10자 이상이어야 합니다.');
      return;
    }

    if (userPw !== confirmPw) {
      setErrorMsg('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      // 백엔드에 비밀번호 변경 요청
      const response = await findPwReset(userId, userPw);
      if (response.data.success) {
        alert('비밀번호가 성공적으로 변경되었습니다.');
        navigate('/findPwComplete'); // 성공 시 완료 페이지로 이동
      } else {
        setErrorMsg(response.data.message || '비밀번호 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('비밀번호 변경 실패:', error.response?.data?.message || '서버 오류');
      setErrorMsg(error.response?.data?.message || '서버 오류');
    }
  };

  const fields = [
    { type: 'password', id: 'pw_input', placeholder: '새 비밀번호 입력', value: userPw, onChange: (e) => setUserPw(e.target.value), required: true },
    { type: 'password', id: 'pw_input_chk', placeholder: '새 비밀번호 확인', value: confirmPw, onChange: (e) => setConfirmPw(e.target.value), required: true },
  ];

  return (
    <section>
      <div className={styles.resetContainer}>
        <div className={styles.resetTitle}>비밀번호 재설정</div>

        <div className={styles.resetPwMsg}>
          <i id="mypage_i" className={`fa-regular fa-user ${styles.mypageIcon}`} style={{ color: '#F294B2' }}></i>
          <p>새로운 비밀번호를 등록해 주세요.</p>
        </div>

        <InputForm
          fields={fields}
          errorMessage={errorMsg}
          buttonText="확인"
          onSubmit={handleSubmit}
        />
      </div>
    </section>
  );
};

export default FindPwReset;