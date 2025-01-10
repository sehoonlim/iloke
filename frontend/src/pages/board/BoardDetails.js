import { useState, useEffect } from "react";
import {
  deleteBoardAnswer,
  insertBoardAnswer,
  selectImageLoad,
} from "../../services/api";

import styles from "./BoardDetails.module.css";

const backendBaseURL = process.env.REACT_APP_BACK_URL;

const BoardDetails = ({ id, onClose, contents, code, comments, onSearch }) => {
  const [answerValue, setAnswerValue] = useState(comments || "");
  const [imageSrc, setImageSrc] = useState(null);
  const user = sessionStorage.getItem("user");

  useEffect(() => {
    if (code !== "rv") {
      imageLoad();
    }
  }, []);

  function commentSubmit(event) {
    event.preventDefault();
    if (!answerValue.trim()) {
      alert("답변 내용을 입력하세요!");
      return;
    }

    const frmData = new FormData();
    frmData.append("id", id);
    frmData.append("contents", answerValue);
    frmData.append("user", user);

    insertBoardAnswer(Object.fromEntries(frmData))
      .then(() => {
        alert("답변이 성공적으로 제출되었습니다.");
        onSearch?.();
      })
      .catch((error) => {
        console.error("Error submitting the answer:", error);
      });
  }

  function delBoard() {
    deleteBoardAnswer(id)
      .then(() => {
        alert(`${id}번 게시판 활성화 상태가 변경 되었습니다.`);
        onSearch?.();
        onClose();
      })
      .catch((error) => {
        console.error("Error deleting the board:", error);
      });
  }

  function imageLoad() {
    selectImageLoad(id)
      .then((res) => {
        // console.log(Array.isArray(res.data));
        if (Array.isArray(res.data)) {
          const imageUrls = res.data.map(
            (item) => `${backendBaseURL}/image/${item.new_name}`,
          );
          // console.log(imageUrls);
          setImageSrc(imageUrls); // 배열로 설정
        }
      })
      .catch((error) => {
        console.error("Error fetching image:", error);
      });
  }

  function handleInputChange(event) {
    setAnswerValue(event.target.value);
  }

  return (
    <div className={styles.board_detail}>
      <h3>
        <h3>
          {code == "rv"
            ? "전체후기"
            : code == "pr"
              ? "포토후기"
              : code == "pq"
                ? "상품문의"
                : "1:1문의"}
        </h3>
      </h3>
      <p className={styles.content_head}>본문</p>
      <textarea
        style={{ width: "100%", height: "150px" }}
        value={contents || ""}
        disabled
      />
      {/* {imageSrc && <img src={imageSrc} alt="Uploaded" />} */}
      {Array.isArray(imageSrc) &&
        imageSrc.length > 0 &&
        imageSrc.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Uploaded ${index}`}
            className={styles.custom_image}
          />
        ))}
      {code === "pq" || code === "ui" ? (
        <>
          <p className={styles.content_head}>답변</p>
          <textarea
            style={{ width: "100%", height: "150px" }}
            name="contents"
            placeholder="답변을 입력하세요"
            value={answerValue}
            onChange={handleInputChange}
          />
        </>
      ) : null}
      <hr />
      {code === "pq" || code === "ui" ? (
        <button onClick={commentSubmit}>확인</button>
      ) : (
        <button onClick={delBoard}>삭제 전환</button>
      )}
      <button onClick={onClose}>닫기</button>
    </div>
  );
};

export default BoardDetails;
