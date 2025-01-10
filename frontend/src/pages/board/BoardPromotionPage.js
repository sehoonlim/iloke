import { useState, useEffect } from "react";
import PaginationControls from "../pagination/PaginationControls";
import "./BoardPromotionPage.scss";

const backendBaseURL = process.env.REACT_APP_BACK_URL;

function BoardPromotionPage() {
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [ingyn, setIngyn] = useState("YN");
  const [selectedCode, setSelectedCode] = useState("ns"); // 선택된 코드

  useEffect(() => {
    // 초기 동작
    searchPromotion();
  }, []);

  const searchPromotion = (event) => {
    if (event) {
      event.preventDefault();
    }

    const formData = new FormData(document.myFrm);
    const myData = Object.fromEntries(formData);

    // API 호출 로직 추가 (예: selectBoardAnswer(myData));
    // console.log("Search Data:", myData);
  };

  // 더미 데이터는 실제 API 호출로 대체할 수 있습니다.
  const items = [
    {
      title: "팝업 행사1",
      date: "24.09.13 ~ 24.10.02",
      image: "room-1336497_1280.jpg",
    },
    {
      title: "프로모션1",
      date: "24.09.01 ~ 24.09.30",
      image: "room-1336497_1280.jpg",
    },
    {
      title: "팝업 행사2",
      date: "24.05.21 ~ 24.11.24",
      image: "room-1336497_1280.jpg",
    },
    { title: "프로모션2", date: "상시 운영", image: "room-1336497_1280.jpg" },
    {
      title: "리뉴얼 오픈1",
      date: "24.03.05 ~",
      image: "room-1336497_1280.jpg",
    },
    {
      title: "프로모션3",
      date: "24.09.01 ~ 24.09.30",
      image: "room-1336497_1280.jpg",
    },
    {
      title: "팝업 행사3",
      date: "24.05.21 ~ 24.11.24",
      image: "room-1336497_1280.jpg",
    },
    { title: "프로모션4", date: "상시 운영", image: "room-1336497_1280.jpg" },
    {
      title: "리뉴얼 오픈2",
      date: "24.03.05 ~",
      image: "room-1336497_1280.jpg",
    },
    {
      title: "프로모션5",
      date: "24.09.01 ~ 24.09.30",
      image: "room-1336497_1280.jpg",
    },
    {
      title: "팝업 행사4",
      date: "24.05.21 ~ 24.11.24",
      image: "room-1336497_1280.jpg",
    },
    { title: "프로모션6", date: "상시 운영", image: "room-1336497_1280.jpg" },
    {
      title: "리뉴얼 오픈3",
      date: "24.03.05 ~",
      image: "room-1336497_1280.jpg",
    },
    {
      title: "프로모션7",
      date: "24.09.01 ~ 24.09.30",
      image: "room-1336497_1280.jpg",
    },
    {
      title: "팝업 행사5",
      date: "24.05.21 ~ 24.11.24",
      image: "room-1336497_1280.jpg",
    },
    { title: "프로모션8", date: "상시 운영", image: "room-1336497_1280.jpg" },
    {
      title: "리뉴얼 오픈4",
      date: "24.03.05 ~",
      image: "room-1336497_1280.jpg",
    },
    {
      title: "프로모션9",
      date: "24.09.01 ~ 24.09.30",
      image: "room-1336497_1280.jpg",
    },
    {
      title: "팝업 행사6",
      date: "24.05.21 ~ 24.11.24",
      image: "room-1336497_1280.jpg",
    },
    { title: "프로모션10", date: "상시 운영", image: "room-1336497_1280.jpg" },
    {
      title: "리뉴얼 오픈5",
      date: "24.03.05 ~",
      image: "room-1336497_1280.jpg",
    },
    {
      title: "프로모션11",
      date: "24.09.01 ~ 24.09.30",
      image: "room-1336497_1280.jpg",
    },
    {
      title: "팝업 행사7",
      date: "24.05.21 ~ 24.11.24",
      image: "room-1336497_1280.jpg",
    },
    { title: "프로모션12", date: "상시 운영", image: "room-1336497_1280.jpg" },
    {
      title: "리뉴얼 오픈6",
      date: "24.03.05 ~",
      image: "room-1336497_1280.jpg",
    },
  ];

  const itemsPerPage = 12; // 한 페이지당 항목 수
  const totalPages = Math.ceil(items.length / itemsPerPage); // 전체 페이지 수

  // 현재 페이지 데이터 슬라이싱
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  // 페이지 변경 처리
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <div className="filter-header">
        <h1>게시판 답변 관리</h1>
        <form name="myFrm">
          <div className="promotion-date-check">
            <div>
              <span className="promotion-period-text">구분</span>
              <select
                name="code"
                value={selectedCode}
                onChange={(e) => setSelectedCode(e.target.value)}
              >
                <option value="ns">온라인 공식몰</option>
                <option value="fs">오프라인 쇼룸</option>
              </select>
            </div>
            <div>
              <span className="promotion-period-text">진행 여부</span>
              <select
                name="ingyn"
                value={ingyn}
                onChange={(e) => setIngyn(e.target.value)}
              >
                <option value="">전체</option>
                <option value="Y">진행중</option>
                <option value="N">종료된</option>
              </select>
            </div>
            <div>
              <span className="promotion-period-text">제목</span>
              <input type="text" name="title" />
            </div>
            <div>
              <span className="promotion-period-text">작성자</span>
              <input type="text" name="reg_id" />
            </div>
            <div className="promotion-date-search">
              <button
                className="promotion-date-search-btn"
                type="button"
                onClick={searchPromotion}
              >
                조회
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="gallery">
        {currentItems.map((item, index) => (
          <div key={index} className="gallery-item">
            <div className="image-center">
              <img
                src={`${backendBaseURL}/image/${item.image}`}
                alt={item.title}
                className="item-image"
              />
            </div>
            <div className="item-content">
              <h3>{item.title}</h3>
              <p>{item.date}</p>
              <p className="status">{item.status}</p>
            </div>
          </div>
        ))}
      </div>
      <div>
        <button
          type="button"
          className="write-btn"
          onClick={() => handleRowClick(null, null, null, selectedCode)}
        >
          신규 등록
        </button>
      </div>
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default BoardPromotionPage;
