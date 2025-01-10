import React from "react";
import { Link } from 'react-router-dom';
import styles from './join_method.module.css';

function BenefitsSection() {
    return (
      <div className={styles.benefitsSection}>
        <h2>이로케 회원만의 혜택</h2>
        <p>회원가입 후 이로케에서 드리는 특별한 혜택을 놓치지 마세요!</p>
        <div className={styles.benefitsContainer}>
          <div className={styles.benefitBox}>
            <div className={styles.icon}>
              <i className="fa-solid fa-gift"></i>
            </div>
            <h3>신규 회원<br/>가입 시</h3>
            <p>M 10,000점 지급</p>
          </div>
  
          <div className={styles.benefitBox}>
            <div className={styles.icon}>
              <i className="fa-solid fa-envelope-open-text"></i>
            </div>
            <h3>이메일/SMS<br/>수신 동의 시</h3>
            <p>M 최대 10,000점 지급</p>
          </div>
        </div>
  
        <p className={styles.note}>
          ※ 마일리지는 최초 회원가입 시 수신 동의하셔야 지급 됩니다.
          <br/>
          ※ 마일리지는 장바구니의 결제 금액이 500,000원 이상일 경우, 결제 건별로
          1회 결제 시 최대 40,000점을 사용 가능합니다.
        </p>
      </div>
    );
  }
  
  function JoinBaseWrap() {
    const loadContent = (url) => {
      window.location.href = url; // 페이지 이동 처리
    };
  
    return (
      <div className={styles.joinBaseWrap}>
        <button className={styles.btnJoin} onClick={() => loadContent("/joinAgreement")}>
          쇼핑몰 회원가입
        </button>
        <br/>
        <p>
          이미 쇼핑몰 회원이세요?{" "}
          <Link className={styles.underline} onClick={() => loadContent("/login")}>
            로그인
          </Link>
        </p>
      </div>
    );
  }
  
  function JoinMethod() {
    return (
      <section>
        <div>
          <BenefitsSection />
          <JoinBaseWrap />
        </div>
      </section>
    );
  }
  
  export default JoinMethod;
  