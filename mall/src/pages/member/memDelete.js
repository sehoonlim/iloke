import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { memDel } from '../../services/api';
import styles from './memDelete.module.css';

const MemDelete = () => {
  const [pw, setPw] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleDel = async (e) => {
    e.preventDefault();

    const userId = sessionStorage.getItem('userId');

    const isConfirmed = window.confirm('정말로 탈퇴하시겠습니까? 탈퇴하면 복구할 수 없습니다.');

    if (!isConfirmed) {
      return; // 취소 버튼을 누르면 탈퇴를 중단
    }

    try {
        const response = await memDel(userId, pw);
      
      if (response.data.success) {
        alert('회원탈퇴가 완료되었습니다.');
        sessionStorage.clear(); // 세션 초기화
        window.location.href = '/';
        //navigate('/'); // 탈퇴 후 메인 페이지로 이동
      } else {
        setErrorMessage(response.data.message || '비밀번호가 일치하지 않습니다.');
        setPw(''); // 비밀번호 입력 초기화
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || '서버 오류');
      setPw(''); // 비밀번호 입력 초기화
    }
  };

  return (
    <section className={styles.delSection}>
      <h2>회원탈퇴</h2>
    
      <h3>01. 회원탈퇴 안내</h3>
      <div className={styles.delGuide}>
        <p>
          이로케 탈퇴 안내 <br/>
          회원님께서 회원 탈퇴를 원하신다니 저희 쇼핑몰의 서비스가 많이 부족하고 미흡했나 봅니다. <br/>
          그동안 저희 이로케를 이용해주셔서 감사드립니다. <br/><br/>

          ■ 아울러 회원 탈퇴시의 아래 사항을 숙지하시기 바랍니다. <br/>
          회원 탈퇴를 신청하시면, 보유하신 마일리지 및 회원 정보는 삭제됩니다. <br/>
          탈퇴 신청 후에는 복구가 불가능하므로 신중히 진행해 주시기 바랍니다.
        </p>
      </div>

      <form className={styles.delForm} onSubmit={handleDel}>
        <h3>02. 회원탈퇴 하기</h3>

        <div className={styles.formGroup}>
          <label htmlFor="pw">비밀번호</label>
          <input
            type="password"
            id="pw"
            placeholder="비밀번호 입력"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            required
          />
        </div>

        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

        <div className={styles.buttonGroup}>
          <button type="button" onClick={() => navigate(-1)}>이전으로</button>
          <button type="submit">탈퇴</button>
        </div>
      </form>
    </section>
  );
};

export default MemDelete;