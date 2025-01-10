import React from 'react';

function Footer(props) {
    return (
        <footer>
            <div className="f-wrap">
                <div className="ft-top">
                    <div className="ft-t-left">
                        {/* 이미지 경로 재설정 필요 */}
                    <img src={`http://localhost:5500/content/img/main/logo_fff.png`} alt="footer logo" />
                    </div>
                    <ul className="ft-t-right">
                    <li><strong>고객센터</strong></li>
                    <li className="f-num">
                        <a href="tel:01012341234">01012341234</a>
                    </li>
                    <li><strong>평일</strong> 09:00 ~ 17:30 (주말 및 공휴일 휴무)</li>
                    <li><strong>점심</strong> 12:00 ~ 13:00</li>
                    </ul>
                </div>
                <div className="ft-btm">
                    <ul className="ft-b-left">
                    <li>(주)이로케</li>
                    <li>대표 : 간첩</li>
                    <li>서울 서초구 서초대로78길 48 송림빌딩</li>
                    <li>사업자등록번호 : 123-456-789 사업자정보확인</li>
                    <li>통신판매업신고번호 : 2024-배고프다-0920</li>
                    <li>개인정보보호책임자 : 우수정</li>
                    <li>팩스번호 : 123-456-789</li>
                    <li>이메일 : abcde@abcde.co.kr</li>
                    </ul>
                    <div className="ft-b-right">
                    <ul className="sns">
                        <li>
                        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                            <i className="fa-brands fa-square-instagram"></i>
                        </a>
                        </li>
                        <li>
                        <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
                            <i className="fa-brands fa-square-youtube"></i>
                        </a>
                        </li>
                        <li>
                        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                            <i className="fa-brands fa-square-facebook"></i>
                        </a>
                        </li>
                        <li>
                        <a href="https://line.me/ko/" target="_blank" rel="noopener noreferrer">
                            <i className="fa-brands fa-line"></i>
                        </a>
                        </li>
                    </ul>
                    <p className="copy">Copyright 2024. ILOKE All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;