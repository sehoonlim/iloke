import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { selectBoardAnswer, updateBoardCount } from '../../services/api'; // API 호출 함수
import PaginationControls from '../pagination/PaginationControls';

// import "./NoticePage.css";
import styles from "./itemInquery.module.css";

function NoticePage(props) {
    const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수

    const [boards, setBoards] = useState([]); // 게시판 데이터
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [selectedCode, setSelectedCode] = useState('nt'); // 선택된 코드
    const [selectedId, setSelectedId] = useState(null); // 선택된 ID
    const [selectComments, setSelectedComment] = useState(null); // 선택된 콘텐츠
    const [selectedContents, setSelectedContents] = useState(null); // 선택된 콘텐츠
    const [startDate, setStartDate] = useState(init(0));
    const [endDate, setEndDate] = useState(init(1));

    // 페이징처리
    const itemsPerPage = 10; // 한 페이지당 항목 수
    const totalPages = Math.ceil(boards.length / itemsPerPage); // 전체 페이지 수

    // 현재 페이지 데이터 슬라이싱
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = boards.slice(indexOfFirstItem, indexOfLastItem);
    
    useEffect(() => {        
        searchBoards();
    }, []);

    // 초기값 시간 정해주는 함수
    function init(t){//t 값이 0일떈 시작값, 1일떈 종료값
        const start = new Date();

        if(!t){
            start.setDate(start.getDate() - 30);
        }

        return start.toISOString().split('T')[0];
    }

    const handleRowClick = (id, title, contents, code, comment, reg_id) => {
        // 조회수 +1
        updateBoardCount(id)
        .then(() => {
            console.log("조회수 +1 성공");
        })
        .catch((error) => {
            console.error("조회수 +1 오류", error);
        });
        
        setSelectedId(id);
        setSelectedContents(contents);
        setSelectedComment(comment);
        setSelectedCode(code);

        navigate(`/notice/itemQueryDetail`, {
            state: { id, title, contents, comment, code, previousPage: '/notice/notice_page', reg_id}
        });
    };

    const searchBoards = (event) => {
        if (event) event.preventDefault();

        if(startDate > endDate){
            alert("시작일이 종료일보다 클 수 없습니다.");
            return;
        }

        const frmData = new FormData(document.myFrm);
        frmData.append("code", selectedCode);
        const myData = Object.fromEntries(frmData);

        selectBoardAnswer(myData)
            .then((res) => {
                setBoards(res.data);
                setCurrentPage(1);
            })
            .catch((error) => console.error('Error fetching boards:', error));
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // 날짜 값 세팅
    const handleDateButtonClick = (days, event) => {
        if (event) event.preventDefault();
        
        const today = new Date();
        setEndDate(today.toISOString().split('T')[0]);

        if (days === 7 || days === 15) {
            today.setDate(today.getDate() - days);
        } else if (days === 30) {
            today.setMonth(today.getMonth() - 1);
        } else if (days === 90) {
            today.setMonth(today.getMonth() - 3);
        } else if (days === 365) {
            today.setFullYear(today.getFullYear() - 1);
        }
        setStartDate(today.toISOString().split('T')[0]);
    };
    
    return (
        <div className={styles.inquiry_section}>
            <div className={styles.filter_header}>
                <h2>고객센터</h2>
                <span>공지사항</span>
            </div>
            <form name='myFrm'>
                <div className={styles.mypage_date_check}>
                    <div className={styles.mypage_date_period}>
                        <span className={styles.mypage_period_text}>조회기간</span>
                        <button data-value="0" onClick={(e) => handleDateButtonClick(0, e)}>오늘</button>
                        <button data-value="7" onClick={(e) => handleDateButtonClick(7, e)}>7일</button>
                        <button data-value="15" onClick={(e) => handleDateButtonClick(15, e)}>15일</button>
                        <button data-value="30" onClick={(e) => handleDateButtonClick(30, e)}>1개월</button>
                        <button data-value="90" onClick={(e) => handleDateButtonClick(90, e)}>3개월</button>
                        <button data-value="365" onClick={(e) => handleDateButtonClick(365, e)}>1년</button>
                    </div>
                    <div className={styles.mypage_date_box}>
                        <input name="start_date" type="date" className={styles.mypage_first_date} onChange={(e) => setStartDate(e.target.value)} value={startDate}/>&nbsp;-&nbsp;
                        <input name="end_date" type="date" className={styles.mypage_last_date} onChange={(e) => setEndDate(e.target.value)} value={endDate}/>
                    </div>
                    <div className={styles.mypage_date_search}>
                        <span className={styles.mypage_date_search_btn} onClick={searchBoards}>조회</span>
                    </div>
                </div>
            </form>

            <div className={styles.table_container}>
                <table id="boardTable">
                    <thead>
                        <tr>                            
                            <th style={{ width: "15%" }}>게시판번호</th>
                            <th style={{ width: "30%" }}>제목</th>
                            <th style={{ width: "8%" }}>조회수</th>
                            <th style={{ width: "10%" }}>작성자</th>
                            <th style={{ width: "20%" }}>등록일자</th>
                        </tr>
                    </thead>
                    <tbody id="boardBody">
                        {currentItems.map((item) => (
                            <tr key={item.id} onClick={() => handleRowClick(item.id, item.title, item.contents, item.code, item.comment, item.reg_id)}>
                                <td>{item.id}</td>
                                <td>{item.title}</td>
                                <td>{item.read_no}</td>
                                <td>{item.reg_id}</td>
                                <td>{item.reg_date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
}

export default NoticePage;
