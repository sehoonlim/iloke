import { useState, useEffect } from "react";
//import { Link } from 'react-router-dom';
import MemberDetail from "./MemberDetail"; // MemberDetail 컴포넌트 임포트
import MemberJoin from "./MemberJoin"; // MemberJoin 컴포넌트 임포트
import MemberModify from "./MemberModify"; // MemberModify 컴포넌트 임포트
import { fetchMem } from "../../services/api"; // API 호출 함수
import "./MemberPage.css";

function MemberPage(props) {
  const [arr, setArr] = useState([]); // 회원 목록
  const [selectedId, setSelectedId] = useState(null); // 선택된 회원 ID
  const [showJoin, setShowJoin] = useState(false); // 회원등록 화면 표시 여부
  const [showModify, setShowModify] = useState(false); // 회원 수정 화면 표시 여부

  const [totalMembers, setTotalMembers] = useState(0); // 전체 회원 수

  // 필터 상태
  const [idFilter, setIdFilter] = useState(""); // 회원 ID 필터
  const [nameFilter, setNameFilter] = useState(""); // 회원 이름 필터
  const [typeFilter, setTypeFilter] = useState("전체"); // 회원 구분 필터
  const [levelFilter, setLevelFilter] = useState("전체"); // 회원 등급 필터
  const [startDate, setStartDate] = useState(""); // 가입 시작일 필터
  const [endDate, setEndDate] = useState(""); // 가입 종료일 필터

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const itemsPerPage = 10; // 페이지당 항목 수

  // 필터 목록
  const types = ["전체", "일반", "블랙리스트", "휴면계정"];
  const levels = ["전체", "브론즈", "실버", "골드", "VIP"];

    // 회원 목록 가져오기
    const fetchMembers = () => {
        // 종료일을 포함하기 위해 endDate를 하루 추가
        const addEndDate = endDate
            ? new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)).toISOString().split("T")[0]
            : "";

        const params = new URLSearchParams({
            id: idFilter,
            name: nameFilter,
            type: typeFilter,
            level: levelFilter,
            startDate,
            endDate: addEndDate,
            page: currentPage,
            limit: itemsPerPage,
        });

    fetchMem(params)
      .then((res) => {
        setArr(res.data.members);
        setTotalMembers(res.data.total);
      })
      .catch((err) => {
        console.error("에러발생 : ", err);
      });
  };

  useEffect(() => {
    fetchMembers();
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchMembers();
  };

  const handleReset = () => {
    setIdFilter("");
    setNameFilter("");
    setTypeFilter("전체");
    setLevelFilter("전체");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
    setArr([]);
    fetchMembers();
  };

  const totalPages = Math.ceil(totalMembers / itemsPerPage);

  const handleJoinClick = () => {
    setShowJoin(true); // 회원등록 화면 활성화
    setSelectedId(null); // 상세 정보 비활성화
    setShowModify(false); // 회원 수정 화면 비활성화
  };

  /* 회원 목록 화면 */
  return (
    <div className="memberPage">
      <div
        className={`memberList ${selectedId || showJoin || showModify ? "half-width" : "full-width"}`}
      >
        {/* 선택된 ID, 회원 등록, 수정 화면이 열려 있으면 목록이 절반 너비로 축소 */}

        <h1>관리자 페이지 회원목록</h1>

        {/* 필터 */}
        <div className="filterBox">
          <div className="filterRow">
            <label className="filterItem">
              회원 ID:
              <input
                type="text"
                value={idFilter}
                onChange={(e) => setIdFilter(e.target.value)}
              />
            </label>
            <label className="filterItem">
              회원 이름:
              <input
                type="text"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
              />
            </label>
            <label className="filterItem">
              회원 구분:
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
            <label className="filterItem">
              회원 등급:
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
              >
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="filterRow">
            <label className="filterItem">
              가입 시작일:
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>
            <label className="filterItem">
              ~
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>
            <div className="filterButtons">
              <button className="filterBtn" onClick={handleSearch}>
                조회
              </button>
              <button className="filterBtn" onClick={handleReset}>
                초기화
              </button>
            </div>
          </div>
        </div>

        <div className="header">
          <div className="headercell">아이디</div>
          <div className="headercell">회원명</div>
          <div className="headercell">핸드폰번호</div>
          <div className="headercell">회원구분</div>
          <div className="headercell">회원등급</div>
          <div className="headercell">가입일시</div>
        </div>

        <div className="main">
          {/* 회원 목록 데이터 렌더링 */}
          {arr.map((st, i) => (
            <div
              className="datarow"
              key={i}
              onClick={() => {
                setSelectedId(st.id); // 행 클릭 시 선택된 ID 설정
                setShowJoin(false); // 회원등록 화면 비활성화
                setShowModify(false); // 회원 수정 화면 비활성화
              }}
            >
              <div className="datacell">{st.id}</div>
              <div className="datacell">{st.name}</div>
              <div className="datacell">{st.phone_num}</div>
              <div className="datacell">{st.type}</div>
              <div className="datacell">{st.level}</div>
              <div className="datacell">{st.join_date}</div>
            </div>
          ))}
          <div className="postButtons">
            <button className="button-primary" onClick={handleJoinClick}>
              회원등록
            </button>
          </div>
        </div>

        {/* 페이지네이션 */}
        <div className="pagination-container">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={`page-${index + 1}`}
              className={`pagination-link ${currentPage === index + 1 ? "active" : ""}`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* 오른쪽에 회원 상세 정보, 수정 화면, 또는 등록 화면 출력 */}
      <div
        className={`memberDetail ${selectedId || showJoin || showModify ? "visible" : "hidden"}`}
      >
        {/* 선택된 ID가 있고 수정 화면이 아닐 경우, 회원 상세 정보 출력 */}
        {selectedId && !showModify && (
          <MemberDetail
            id={selectedId}
            fetchMembers={fetchMembers}
            setSelectedId={setSelectedId}
            setShowModify={setShowModify}
          />
        )}

        {/* 회원 수정 화면 출력 */}
        {showModify && (
          <MemberModify
            id={selectedId}
            setShowModify={setShowModify}
            fetchMembers={fetchMembers}
          />
        )}

        {/* 회원 등록 화면 출력 */}
        {showJoin && (
          <MemberJoin fetchMembers={fetchMembers} setShowJoin={setShowJoin} />
        )}
      </div>
    </div>
  );
}

export default MemberPage;
