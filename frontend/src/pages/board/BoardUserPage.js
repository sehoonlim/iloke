import React, { useState } from 'react';
import './BoardUserPage.css';

const BoardUserPage = () => {
  const [data] = useState([
    { id: "bd202411270003", title: '관리자가 쓰는 글이 이렇게 생겼나?', reg_id: 'dc4638(정성윤)', reg_date: '2024-11-16' },
    { id: "bd202411270002", title: '테스트할려고 넣는 글이다 봐바라', reg_id: 'llii1436(홍길동)', reg_date: '2024-09-15' },
    { id: "bd202411270001", title: '미정미정미정미정미정미정미정미정미정미정미정미정', reg_id: 'vaexzsv(김철수)', reg_date: '2024-09-15' },
    // 추가 데이터
  ]);

  return (
    <div class="inquiry-section">
        <div class="filter-header">
            <h1>유저 게시판 관리</h1>
        </div>

        <div class="mypage-date-check">
            <div class="mypage-date-period">
                <span class="mypage-period-text">조회기간</span>
                <button data-value="0" onclick="setDateRange(0)">오늘</button>
                <button data-value="7" onclick="setDateRange(7)">7일</button>
                <button data-value="15" onclick="setDateRange(15)">15일</button>
                <button data-value="30" onclick="setDateRange(30)">1개월</button>
                <button data-value="90" onclick="setDateRange(90)">3개월</button>
                <button data-value="365" onclick="setDateRange(365)">1년</button>
            </div>
            <div class="mypage-date-box">
                <input id="start-date" type="date" class="mypage-first-date" />&nbsp;-&nbsp;
                <input id="end-date" type="date" class="mypage-last-date" />
            </div>
            <div class="mypage-date-search">
                <span class="mypage-date-search-btn" onclick="filterPosts()">조회</span>
            </div>
        </div>

        <div class="table_container">
            <table id="boardTable">
                <thead>
                    <tr>
                        <th>선택</th>
                        <th>번호</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>등록일자</th>
                    </tr>
                </thead>
                <tbody id="boardBody">
                {data.map((item, index) => (
                    <tr key={item.id}>
                    <td>
                        <input type="checkbox" />
                    </td>
                    <td>{item.id}</td>
                    <td>{item.title}</td>
                    <td>{item.reg_id}</td>
                    <td>{item.reg_date}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>

        <div class="pagination-container">
            <div class="pagination-controls">
                <ul>
                    <li><a href="#" class="current">1</a></li>
                    <li><a href="#">2</a></li>
                    <li><a href="#">3</a></li>
                    <li><a href="#">4</a></li>
                    <li><a href="#">5</a></li>
                    <li><a href="#">6</a></li>
                    <li><a href="#">7</a></li>
                    <li><a href="#">8</a></li>
                    <li><a href="#">9</a></li>
                    <li><a href="#">10</a></li>
                    <li class="pagination-next"><a href="#">＞</a></li>
                    <li class="pagination-last"><a href="#">≫</a></li>
                </ul>
            </div>
        </div>

        <div>
            <button type="button" class="write-btn" onclick="loadContent('./sub/notice/item_write.html')">글쓰기</button>
        </div>
    </div>
  );
};

export default BoardUserPage;
