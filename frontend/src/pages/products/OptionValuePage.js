import { selectOptionVal, insertOptionVal } from '../../services/api';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

function OptionValuePage({ code }) {
    const navigator = useNavigate();
    const [opValList, setOpValList] = useState([]); // 옵션값 데이터
    const [newOptionValues, setNewOptionValues] = useState([]); // 추가할 옵션값 리스트

    if (!code) {
        console.log("id 없음");
        return null; // id가 없는 경우 렌더링 중단
    }

    useEffect(() => {
        // 옵션값 조회
        selectPage();
    }, [code]);

    function selectPage(){
        selectOptionVal(code)
            .then(res => {
                // console.log(res);
                setOpValList(res.data.map(item => ({ ...item, isModified: false })));
            })
            .catch(err => {
                console.error('옵션값 리스트 백엔드 연결 실패', err);
            });
    }

    function goList() {
        navigator('/option');
    }

    function handleSubmit(e) {
        e.preventDefault();
    
        // 새로운 옵션값 데이터 로그
        console.log('Submitting newOptionValues:', newOptionValues);
    
        // 수정된 데이터 추출 및 로그
        const modifiedValues = opValList.filter(item => item.isModified).map(({ isModified, ...rest }) => rest);
        console.log('Modified opValList:', modifiedValues);
    
        // myData 생성
        const myData = [...newOptionValues, ...modifiedValues].map((optionValue, idx) => ({
            ...optionValue,
            index: idx + 1, // 인덱스 값을 명확하게 설정
            code,
        }));        
    
        insertOptionVal(myData)
            .then(response => {
                alert('옵션값이 등록되었습니다.');
                // setOpValList(prev => [...prev.filter(item => !item.isModified), ...response.data]); // 기존 목록에 추가
                selectPage();
                setNewOptionValues([]); // 신규 입력 초기화
            })
            .catch(err => {
                console.error('옵션값 등록 실패', err);
            });
    }

    function handleAddRow() {
        setNewOptionValues(prev => [
            ...prev,
            { name: '', opVal_price: '', index: opValList.length + prev.length + 1 }, // 명확한 인덱스 설정
        ]);
    }

    function handleInputChange(index, field, value, isExisting) {
        if (isExisting) {
            setOpValList(prev => {
                const updated = [...prev];
                updated[index][field] = value;
                if (field !== 'index') {
                    updated[index].isModified = true; // 기존 데이터 변경 표시
                }
                return updated;
            });
        } else {
            setNewOptionValues(prev => {
                const updated = [...prev];
                updated[index][field] = value;
                return updated;
            });
        }
    }    

    return (
        <div className="memberList p-list">
            <div className='inquiry-section op_detail'>
                <h1>옵션값 관리</h1>
                <form onSubmit={handleSubmit}>
                    <table>
                        <thead>
                            <tr>
                                <th><input type="checkbox" /></th>
                                <th>번호</th>
                                <th>옵션값 명</th>
                                <th>가격</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {opValList.length === 0 && newOptionValues.length === 0 && (
                                <tr>
                                    <td colSpan="5">옵션값 데이터가 없습니다.</td>
                                </tr>
                            )}
                            {opValList.map((row, index) => (
                                <tr key={`existing-${index}`}>
                                    <td></td>
                                    <td>
                                        <input
                                            type="number"
                                            onChange={e => handleInputChange(index, 'index', e.target.value, true)}
                                            value={index + 1}
                                            readOnly
                                            disabled
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={row.name}
                                            onChange={e => handleInputChange(index, 'name', e.target.value, true)}
                                            required
                                            placeholder="옵션값 명"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={row.opVal_price}
                                            onChange={e => handleInputChange(index, 'opVal_price', e.target.value, true)}
                                            required
                                            placeholder="가격"
                                        />
                                    </td>
                                    <td></td>
                                </tr>
                            ))}
                            {newOptionValues.map((row, index) => (
                                <tr key={`new-${index}`}>
                                    <td></td>
                                    <td>
                                        <input
                                            type="number"
                                            value={opValList.length + index + 1}
                                            onChange={e => handleInputChange(index, 'index', e.target.value, true)}
                                            readOnly
                                            disabled
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={row.name}
                                            onChange={e => handleInputChange(index, 'name', e.target.value, false)}
                                            required
                                            placeholder="옵션값 명"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={row.opVal_price}
                                            onChange={e => handleInputChange(index, 'opVal_price', e.target.value, false)}
                                            required
                                            placeholder="가격"
                                        />
                                    </td>
                                    <td></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="btn-wrap both">
                        <button type="button" className="write-btn" onClick={goList}>옵션목록</button>
                        <button type="button" className="write-btn" onClick={handleAddRow}>옵션값 추가</button>
                        <button type="submit" className="write-btn">등록 완료</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default OptionValuePage;
