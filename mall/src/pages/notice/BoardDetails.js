import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { deleteBoardAnswer, insertBoardContent, selectImageLoad } from '../../services/api';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

import styles from './BoardDetails.module.css';

const backendBaseURL = process.env.REACT_APP_BACK_URL;

const BoardDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id, title, contents, comment, code, previousPage, reg_id } = location.state || {};

  const [content, setContent] = useState(contents || '');
  const [answerValue, setAnswerValue] = useState(comment || '');
  const [imageSrc, setImageSrc] = useState(null);
  const quillRef = useRef(null);

  const userId = sessionStorage.getItem('userId');

  useEffect(() => {
    if (code !== 'rv') {
      imageLoad();
    }
    
    if (quillRef.current) {
      const quill = new Quill(quillRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            ['link', 'image', 'video', 'formula'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['clean']
          ]
        }
      });

      quill.on('text-change', () => {
        const html = quill.root.innerHTML;
        setContent(html);
      });

      quill.root.innerHTML = contents;
    }
  }, [code, contents]);

  function commentSubmit(event) {
    event.preventDefault();

    if (reg_id !== userId) {
      alert("작성자만 수정할 수 있습니다.");
      return;
    }

    if (!content.trim()) {
      alert("내용을 입력하세요!");
      return;
    }

    const frmData = {
      id: id,
      code: code,
      title: title,
      contents: content,
      userId: userId
    };

    insertBoardContent(frmData)
      .then((res) => {
        alert("내용이 수정되었습니다.");
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        alert("내용 수정 실패!");
      });
  }

  function delBoard() {
    if (reg_id !== userId) {
      alert("작성자만 삭제할 수 있습니다.");
      return;
    }

    const isConfirmed = window.confirm('삭제하면 되돌릴 수 없습니다. 삭제하시겠습니까?');

    if (isConfirmed) {
      deleteBoardAnswer(id)
        .then(() => {
          alert(`${id}번 게시판이 삭제 되었습니다.`);
          window.location.href = previousPage;
        })
        .catch((error) => {
          console.error("Error deleting the board:", error);
        });
    }
  }

  function imageLoad() {
    selectImageLoad(id)
      .then((res) => {
        if (Array.isArray(res.data)) {
          const imageUrls = res.data.map(item => `${backendBaseURL}/image/${item.new_name}`);
          setImageSrc(imageUrls);
        }
      })
      .catch((error) => {
        console.error('Error fetching image:', error);
      });
  }

  return (
    <div className={styles.board_detail}>
      <h3>{code == "rv" ? "전체후기" : (code == "pr" ? "포토후기" : (code == "pq" ? "상품문의" : (code == "fq"? "FAQ" : (code == "nt" ? "공지사항" : "1:1문의"))))}</h3>
      <p className={styles.content_head}>본문</p>

      <div ref={quillRef} className={styles.content_detail}></div> {/* Quill 에디터 추가 */}

      {Array.isArray(imageSrc) && imageSrc.length > 0 && (
        imageSrc.map((src, index) => (
          <img key={index} src={src} alt={`Uploaded ${index}`} className={styles.custom_image} />
        ))
      )}

      {code === 'pq' || code === 'ui'? (
        <>
          <p className={styles.content_head}>답변</p>
          <textarea
            style={{ width: '100%', height: '150px' }}
            name="contents"
            placeholder="답변 대기중..."
            value={answerValue}
            onChange={(e) => setAnswerValue(e.target.value)}
            disabled 
          />
        </>
      ) : null}
      <hr />
      {code === 'pq'|| code === 'ui'|| code ==='pr' || code ==='rv' ? (
        <button onClick={commentSubmit} className={styles.board_btn1}>수정</button>
      ) : null}
      {code === 'pq' || code === 'ui'|| code ==='pr' || code ==='rv' ? (
        <button onClick={delBoard}className={styles.board_btn2}>삭제</button>
      ) : null}
      <button onClick={() => navigate(previousPage)} className={styles.board_btn3}>목록으로</button>
    </div>
  );
};

export default BoardDetails;
