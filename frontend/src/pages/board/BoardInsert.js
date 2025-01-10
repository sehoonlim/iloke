import { useState, useEffect } from "react";
import { deleteBoardAnswer, insertBoardRegistration } from "../../services/api";

import "./BoardInsert.css";

const backendBaseURL = process.env.REACT_APP_BACK_URL;

const BoardInsert = ({ id, title, onClose, contents, code, onSearch }) => {
  const [contentsValue, setContentsValue] = useState(contents || "");
  const [titleValue, setTitleValue] = useState(title || "");

  const user = sessionStorage.getItem("user");

  useEffect(() => {
    // Logic for image load can be implemented here if needed
  }, []);

  const handleInputChange = (event) => {
    setContentsValue(event.target.value);
  };

  const handleTitleChange = (event) => {
    setTitleValue(event.target.value);
  };

  const contentSubmit = (event) => {
    event.preventDefault();

    if (!titleValue.trim()) {
      alert("제목을 입력하세요!");
      return;
    }

    if (!contentsValue.trim()) {
      alert("내용을 입력하세요!");
      return;
    }

    const formData = new FormData();
    formData.append("id", id);
    formData.append("title", titleValue);
    formData.append("contents", contentsValue);
    formData.append("userId", user);
    formData.append("code", code);

    insertBoardRegistration(Object.fromEntries(formData))
      .then(() => {
        alert("답변이 성공적으로 제출되었습니다.");
        onSearch?.();
      })
      .catch((error) => {
        console.error("Error submitting the answer:", error);
      });
  };

  const delBoard = () => {
    deleteBoardAnswer(id)
      .then(() => {
        alert(`${id}번 게시판 활성화 상태가 변경 되었습니다.`);
        onSearch?.();
        onClose();
      })
      .catch((error) => {
        console.error("Error deleting the board:", error);
      });
  };

  return (
    <div className="board-detail">
      <h3>{code === "nt" ? "공지사항" : "FAQ"}</h3>
      <p className="content-head">제목</p>
      <input type="text" value={titleValue} onChange={handleTitleChange} />
      <br />
      <p className="content-head">내용</p>
      <textarea
        style={{ width: "100%", height: "400px" }}
        value={contentsValue}
        onChange={handleInputChange}
      />
      <hr />
      <button onClick={contentSubmit}>등록</button>
      <button onClick={delBoard}>삭제 전환</button>
      <button onClick={onClose}>닫기</button>
    </div>
  );
};

export default BoardInsert;
