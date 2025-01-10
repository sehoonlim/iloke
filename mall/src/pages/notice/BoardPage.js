import React, { useEffect, useState } from 'react';
import { fetchBoards, insertBoards } from '../../services/api';  // API 호출 함수
import { Link } from 'react-router-dom';

function BoardPage() {
    const [boards, setBoards] = useState([]);  // boards 상태 초기화
    const [file, setFile] = useState(null); // 업로드할 파일 상태

    // 게시판 데이터 가져오기
    useEffect(() => {
        fetchBoards()
            .then((res) => {
                setBoards(res.data);  // 서버로부터 받은 데이터를 boards 상태에 설정
            })
            .catch(error => {
                console.error('Error fetching boards:', error); // 에러 처리
            });
    }, []);  // 컴포넌트가 처음 렌더링될 때만 실행

    // 파일 선택 처리
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    // 폼 제출 처리
    const submitGo = (e) => {
        e.preventDefault(); // 이벤트 끄기

        // 지금은 동작안함 알아서 수정해서 쓸것
        if (!file) {
            alert('파일을 선택하세요!');
            return;
        }

        // FormData 객체 생성 및 파일 추가
        const frmData = new FormData();
        frmData.append('upfile', file);

        // 파일 업로드 API 호출
        insertBoards(frmData)
            .then((res) => {
                alert("파일 업로드 성공!");
                setFile(null);  // 파일 상태 초기화
            })
            .catch((error) => {
                console.error("Error uploading file:", error);
                alert("파일 업로드 실패!");
            });
    };

    return (
        <div>
            <h1>보드(참고용)</h1>
            <form name="myFrm" onSubmit={submitGo}>
                <table border="1">
                    <thead>
                        <tr>
                            <td>학기</td>
                            <td>종류</td>
                            <td>학생</td>
                            <td>일자</td>
                        </tr>
                    </thead>
                    <tbody>
                        {boards.map((item, key) => (
                            <tr key={key}>
                                <td>{item.hakgi}</td>
                                <td>{item.name}</td>
                                <td>{item.pid}</td>
                                <td>{item.reg_date}</td>
                            </tr>
                        ))}
                        
                        {/* 파일 업로드 필드 */}
                        <tr>
                            <td>파일</td>
                            <td><input type="file" name="upfile" onChange={handleFileChange} /></td>
                        </tr>
                        <tr>
                            <td colSpan="4">
                                <Link to="#">동작은알아서구현</Link>
                                <input type="submit" value="등록" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    );
}

export default BoardPage;
