import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBoardContent } from '../../services/api';
import DOMPurify from 'dompurify'; // dompurify 임포트

function ItemDetail() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [contents, setContents] = useState('');

    useEffect(() => {
        if (id) {
            getBoardContent(id).then((res) => {
                setTitle(res.title);
                setContents(res.contents); // HTML 콘텐츠를 설정
            });
        }
    }, [id]);

    // DOMPurify를 사용하여 HTML 콘텐츠를 안전하게 렌더링
    const sanitizedContent = DOMPurify.sanitize(contents);

    return (
        <div>
            <h2>{title}</h2>
            <div dangerouslySetInnerHTML={{ __html: sanitizedContent }}></div>
        </div>
    );
}

export default ItemDetail;
