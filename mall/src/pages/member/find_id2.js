import { useParams, useNavigate } from 'react-router-dom';
import styles from './find_id2.module.css'


function FindId2({ id }) {
  //const { id } = useParams(); // URL 파라미터에서 아이디 가져오기
  const navigate = useNavigate();

    return (
    <section>
      <div className={styles.findIdContainer2}>
        <div className={styles.findIdTitle2}>아이디 찾기</div>

        <div className={styles.findId2Msg}>
          {/*<i id="mypage_i" className={`fa-regular fa-user fa-2xl ${styles.mypageI}`}></i>*/}
          {id ? (
            <>
              <p>회원님의 아이디는</p>
              <p>
                <strong>{id}</strong> 입니다.
              </p>
            </>
          ) : (
            <p>조회된 아이디가 없습니다.</p>
          )}
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

export default FindId2;