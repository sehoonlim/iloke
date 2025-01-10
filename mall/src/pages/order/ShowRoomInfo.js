import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ShowRoomInfo.css';

const ShowRoomInfo = ({ onSelectShowroom, mode = 'page' }) => { // 기본 모드를 "page"로 설정
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [allShowrooms, setAllShowrooms] = useState([]);
  const [filteredShowrooms, setFilteredShowrooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedShowroom, setSelectedShowroom] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      '//dapi.kakao.com/v2/maps/sdk.js?appkey=e207779030ab91ab36823aa2027266a6&libraries=services&autoload=false';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
          level: 3,
        };
        const kakaoMap = new window.kakao.maps.Map(container, options);
        setMap(kakaoMap);

        fetchShowrooms(kakaoMap);
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const fetchShowrooms = async (kakaoMap) => {
    try {
      const response = await axios.get('http://localhost:5000/api/showrooms');
      const { showrooms } = response.data;
      setAllShowrooms(showrooms);
      setFilteredShowrooms(showrooms);

      const showroomMarkers = showrooms.map((showroom) => {
        const position = new window.kakao.maps.LatLng(showroom.lat, showroom.lng);
        const marker = new window.kakao.maps.Marker({
          position,
          map: kakaoMap,
        });
      
        const infoWindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:5px;z-index:1;">${showroom.name}</div>`,
        });
      
        // 마우스 오버 시 InfoWindow 표시
        window.kakao.maps.event.addListener(marker, 'mouseover', () => {
          infoWindow.open(kakaoMap, marker);
        });
      
        // 마우스 아웃 시 InfoWindow 닫기
        window.kakao.maps.event.addListener(marker, 'mouseout', () => {
          infoWindow.close();
        });
      
        // 마커 클릭 시 예/아니오 창 표시
        marker.addListener('click', () => {
          setSelectedShowroom(showroom);
        });
      
        return marker;
      });



      setMarkers(showroomMarkers);
    } catch (error) {
      console.error('쇼룸 데이터 가져오기 오류:', error);
    }
  };

  const handleListClick = (showroom) => {
    const position = new window.kakao.maps.LatLng(showroom.lat, showroom.lng);
    map.setCenter(position); // 지도 중심 이동
  };

  const handleSearch = () => {
    const cleanedKeyword = keyword.trim().toLowerCase();
    const filtered = allShowrooms.filter((showroom) =>
      showroom.name.toLowerCase().includes(cleanedKeyword) ||
      showroom.address.toLowerCase().includes(cleanedKeyword)
    );
    setFilteredShowrooms(filtered);
    setCurrentPage(1); // 검색 시 첫 페이지로 초기화
  };


  const handleReset = () => {
    setFilteredShowrooms(allShowrooms); // 필터링 초기화
    setKeyword(''); // 검색창 값 초기화
    setCurrentPage(1); // 현재 페이지 초기화
    setSelectedShowroom(null); // 선택된 쇼룸 초기화
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;

// 현재 페이지에 표시할 데이터 계산
const currentItems = filteredShowrooms.slice(indexOfFirstItem, indexOfLastItem);

// 디버깅용
console.log("Current Items:", currentItems);
console.log("Filtered Showrooms:", filteredShowrooms);
console.log("All Showrooms:", allShowrooms);

  return (
    <div className="wrapper">
      <div className="title_container">
        <h2>브랜드 쇼룸 안내</h2>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button onClick={handleSearch}>검색</button>
        <button onClick={handleReset}>초기화</button>
      </div>
      <div className="map-container">
        <div id="map" style={{ width: '70%', height: '500px', display: 'inline-block' }}></div>
        <div
          className="list-container"
          style={{
            width: '28%',
            height: '500px',
            overflowY: 'auto',
            display: 'inline-block',
          }}
        >
          {selectedShowroom ? (
  <div className="showroom-details">
    <h3>{selectedShowroom.name}</h3>
    <p>주소: {selectedShowroom.address}</p>
    <p>전화번호: {selectedShowroom.phone}</p>

    {/* 예/아니오 버튼은 "modal" 모드일 때만 표시 */}
    {mode === 'modal' ? (
  <div>
    <button
      onClick={() => {
        onSelectShowroom(selectedShowroom);
        alert(`${selectedShowroom.name}을 배송지역으로 설정합니다.`);
        setSelectedShowroom(null);
      }}
    >
      예
    </button>
    <button onClick={() => setSelectedShowroom(null)}>아니오</button>
  </div>
) : (
  <button onClick={() => setSelectedShowroom(null)}>뒤로가기</button>
)}
  </div>
) : (
  <ul>
    {currentItems.map((showroom) => (
      <li
        key={showroom.id}
        className="list-item"
        onClick={() => {
          handleListClick(showroom); // 지도 중심 이동
          setSelectedShowroom(showroom); // 마커 클릭과 동일한 동작
        }}
      >
        {showroom.name}
      </li>
    ))}
  </ul>
)}
          {!selectedShowroom && (
            <div className="pagination">
              {Array.from(
                { length: Math.ceil(filteredShowrooms.length / itemsPerPage) },
                (_, i) => i + 1
              ).map((number) => (
                <button
                  key={number}
                  className={`page-button ${number === currentPage ? 'active' : ''}`}
                  onClick={() => handlePageChange(number)}
                >
                  {number}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowRoomInfo;