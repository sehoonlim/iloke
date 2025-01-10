import { useState, useEffect } from 'react';
import { checkPw } from '../../services/api';
import { useNavigate } from 'react-router-dom'
import styles from './memModify1.module.css';

const MemModify1 = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // 세션 스토리지에서 아이디 가져오기
  useEffect(() => {
    const storedUserId = sessionStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  }, [navigate]);

  // 폼 제출 시 비밀번호 확인
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await checkPw(userId, password);
      navigate('/memModify2');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('비밀번호가 일치하지 않습니다.');
      } else {
        alert('서버 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className={styles.infoChangeContainer}>
      <h2>회원정보 수정</h2>
      <p>회원님의 정보를 안전하게 보호하기 위해 비밀번호를 다시 한번 확인해 주세요.</p>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputContainer}>
          <span>아이디 <strong className={styles.userId}>{userId}</strong></span><br/>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            required
          />
        </div>
        <div className={styles.modifyButtons}>
          <button type="button" onClick={() => navigate('/')}>취소</button>
          <button type="submit">인증하기</button>
        </div>
      </form>
    </div>
  );
}

export default MemModify1;