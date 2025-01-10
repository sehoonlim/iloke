import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Quill from 'quill'; 
import 'quill/dist/quill.snow.css'; 
import { insertBoardContentImage } from '../../services/api';
import styles from './ItemWrite.module.css';

function ItemWrite(props) {
    const location = useLocation();
    const { code, previousPage } = location.state || {};
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [contents, setContents] = useState('');
    const userName = sessionStorage.getItem('userName');
    const userId = sessionStorage.getItem('userId');
    const quillRef = useRef(null);

    useEffect(() => {
        const toolbarOptions = [
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
        ];

        if (quillRef.current) {
            const quill = new Quill(quillRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: toolbarOptions
                }
            });

            quill.on('text-change', () => {
                const html = quill.root.innerHTML; // Quill 에디터의 HTML 콘텐츠를 추출
                setContents(html);
            });
        }
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!title.trim()) {
            alert("제목을 입력하세요!");
            return;
        }

        if (!contents.trim()) {
            alert("내용을 입력하세요!");
            return;
        }

        const frmData = new FormData();
        frmData.append('upfile', file); 
        frmData.append('title', title);
        frmData.append('contents', contents); // HTML 콘텐츠를 포함
        frmData.append('code', code);
        frmData.append('userId', userId);
    
        insertBoardContentImage(frmData)
            .then((res) => {
                alert("파일 업로드 성공!");
                window.location.href = previousPage;
            })
            .catch((error) => {
                console.error("Error uploading file:", error);
                alert("파일 업로드 실패!");
            });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.filter_header}>
                <h2>글쓰기</h2>
                <span>{code == "rv" ? "전체후기" : (code == "pr" ? "포토후기" : (code == "pq" ? "상품문의" : (code == "fq"? "FAQ" : (code == "nt" ? "공지사항" : "1:1문의"))))}</span>
            </div>
            <form name='myFrm' onSubmit={handleSubmit}>
                <table border="" className={styles.write_table}>
                    <tbody>
                        <tr>
                            <th>작성자</th>
                            <td>
  {sessionStorage.getItem('userType') === 'kakao'
    ? sessionStorage.getItem('nickname') || '알 수 없는 사용자' // 카카오 닉네임 표시
    : userName || '알 수 없는 사용자' // 일반 사용자 이름 표시
  }
</td>
                        </tr>
                        <tr>
                            <th>제목</th>
                            <td>

                                
                                <label className={styles.title_label} htmlFor="name_title">
                                    <input 
                                        type="text" 
                                        placeholder="제목을 입력해주세요." 
                                        name="title" 
                                        value={title} 
                                        onChange={handleTitleChange} 
                                    />
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <th>본문</th>
                            <td>
                                <div ref={quillRef} id="editor" className={styles.textfield}></div> {/* quillRef를 추가 */}
                            </td>
                        </tr>
                        {code === 'pr' ? (
                            <tr>
                                <th>첨부파일</th>
                                <td>
                                    <input className={styles.file_upload} type="file" name="upfile" onChange={handleFileChange} />
                                </td>
                            </tr>
                        ) : null}
                    </tbody>
                </table>

                <div className={styles.btn_container}>
                    <button type="button" className={styles.btn_before} onClick={() => window.location.href = previousPage}>
                        <strong className={styles.itone}>목록으로</strong>
                    </button>
                    <input className={styles.btn_write} style={{ margin: "5px" }} type="submit" value="저장" />
                </div>
            </form>
        </div>
    );
}

export default ItemWrite;
