import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from './join_fin.module.scss';

function Join_fin() {
    const [searchParams] = useSearchParams();
    const name = searchParams.get('name') || '회원'; // 쿼리 파라미터에서 이름 가져오기

    const loadContent = (url) => {
        // 페이지 이동 처리 로직
        window.location.href = url;
      };

    return (
        <div className={styles.finContainer}>
            
            <div className={styles.finHeader}>
                <h2>회원가입완료</h2>
            </div>
            
            
            <div className={styles.finTabs}>
                <div className={styles.finTab}>약관동의</div>
                <div className={styles.finTab}>정보입력</div>
                <div className={`${styles.finTab} ${styles.active}`}>가입완료</div>
            </div>

            <div className={styles.finStatusIcon}>
                🎉
            </div>

            <p className={styles.finMainText}>
                회원가입이 <strong>완료</strong>되었습니다.
            </p>
            
            <p className={styles.finSubText}>
                <strong>{name}</strong>님의 회원가입을 축하합니다.<br/>
                알차고 실속있는 서비스를 찾아뵙겠습니다.
            </p>

            <hr/>

            <div className={styles.finButtons}>
                <button className={styles.finHome}  onClick={() => loadContent('/')}>
                    홈으로
                </button>
                <button className={styles.finLogin} onClick={() => loadContent('/login')}>
                    로그인
                </button>
            </div>
        </div>
    );
}

export default Join_fin;