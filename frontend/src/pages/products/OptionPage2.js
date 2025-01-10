import { selectOption, insertOption } from '../../services/api';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function OptionPage() {
    const navigator = useNavigate();
    const [opList, setOpList] = useState([]);
    const [isOption, setIsOption] = useState(false); // For adding a new option
    const [isEditing, setIsEditing] = useState(null); // Current editing option
    const [editData, setEditData] = useState({});
    const [originalData, setOriginalData] = useState({});

    useEffect(() => {
        selectOption()
            .then((res) => {
                setOpList(res.data);
            })
            .catch((err) => {
                console.error('옵션 리스트 불러오기 실패', err);
            });
    }, []);

    const addOption = () => {
        setIsOption(true);
        setEditData({ name: '', req: 1, status: 1 });
        setIsEditing(null);
    };

    const handleEdit = (option, index) => {
        // console.log(option, index)
        setIsOption(false); // Clear new option state when starting to edit
        setIsEditing(option.code);
        setOriginalData({ ...option, index });
        setEditData({ ...option });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => {
            const updatedData = {
                ...prev,
                [name]: name === 'req' || name === 'status' ? parseInt(value, 10) : value,
            };
            
            return updatedData;
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();

        if (!editData.name || editData.req === undefined || editData.status === undefined) {
            alert('옵션 정보를 입력해주세요.');
            return;
        }
    
        insertOption(editData)
            .then((res) => {
                console.log('옵션 추가/수정 완료', res.data);
                if (isOption) {
                    // If adding a new option, update opList with the new option
                    setOpList((prevList) => [...prevList, res.data]);
                    setIsOption(false); // Reset the add option state
                } else {
                    // If editing, update the existing option in opList
                    setOpList((prevList) =>
                        prevList.map((item) =>
                            item.code === editData.code ? { ...item, ...editData } : item
                        )
                    );
                }
                alert(isOption ? '옵션이 등록되었습니다.' : '옵션이 수정되었습니다.');
                if(isOption){
                    selectOption()
                    .then((res) => {
                        setOpList(res.data);
                    })
                    .catch((err) => {
                        console.error('옵션 리스트 불러오기 실패', err);
                    });
                }else{
                    cancle();
                }
            })
            .catch((err) => {
                console.error('옵션 추가/수정 실패', err);
            });
    };    

    const cancle = () => {
        if (isOption) {
            setIsOption(false);
        }
        setEditData({});
        setOriginalData({});
        setIsEditing(null);
    };

    return (
        <div className="memberList p-list">
            <form name="opFrm">
                <div className="inquiry-section op_detail">
                    <h1>옵션 관리</h1>
                    <table className="opTbl">
                        <thead>
                            <tr>
                                <th style={{ width: "10%" }}>
                                    <input type="checkbox" />
                                </th>
                                <th style={{ width: "10%" }}>번호</th>
                                <th style={{ width: "20%" }}>옵션명</th>
                                <th style={{ width: "20%" }}>필수선택</th>
                                <th style={{ width: "20%" }}>상태</th>
                                <th colSpan={2} style={{ width: "30%" }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {opList.map((st, i) => {
                                let status = st.status === 1 ? 'ON' : 'OFF';
                                let req = st.req === 1 ? 'O' : 'X';

                                const goDetail = () => {
                                    navigator(`/option/value/${st.code}`);
                                };

                                return (
                                    <tr key={st.code}>
                                        <td>
                                            <input type="checkbox" />
                                        </td>
                                        <td>
                                            {isEditing === st.code ? (
                                                <input
                                                    type="text"
                                                    value={i + 1}
                                                    readOnly
                                                    disabled
                                                />
                                            ) : (
                                                i + 1
                                            )}
                                        </td>
                                        <td>
                                            {isEditing === st.code ? (
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={editData.name || ''}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            ) : (
                                                st.name
                                            )}
                                        </td>
                                        <td>
                                            {isEditing === st.code ? (
                                                <div className="hasRadio addList">
                                                    <label>
                                                        <input
                                                            type="radio"
                                                            name="req"
                                                            value={1}
                                                            checked={editData.req === 1}
                                                            onChange={handleChange}
                                                        /> 필수O
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="radio"
                                                            name="req"
                                                            value={0}
                                                            checked={editData.req === 0}
                                                            onChange={handleChange}
                                                        /> 필수X
                                                    </label>
                                                </div>
                                            ) : (
                                                req
                                            )}
                                        </td>
                                        <td>
                                            {isEditing === st.code ? (
                                                <div className="hasRadio addList">
                                                    <label>
                                                        <input
                                                            type="radio"
                                                            name="status"
                                                            value={1}
                                                            checked={editData.status === 1}
                                                            onChange={handleChange}
                                                        /> ON
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="radio"
                                                            name="status"
                                                            value={0}
                                                            checked={editData.status === 0}
                                                            onChange={handleChange}
                                                        /> OFF
                                                    </label>
                                                </div>
                                            ) : (
                                                status
                                            )}
                                        </td>
                                        <td>
                                            {isEditing === st.code ? (
                                                <>
                                                    <button type="button" className="submit-btn" onClick={handleUpdate}>
                                                        수정 완료
                                                    </button>
                                                    <button type="button" className="submit-btn" onClick={cancle}>
                                                        취소
                                                    </button>
                                                </>
                                            ) : (
                                                <button type="button" className="write-btn" onClick={() => handleEdit(st, i + 1)}>
                                                    옵션 수정
                                                </button>
                                            )}
                                        </td>
                                        <td>
                                            <button type="button" className="write-btn" onClick={goDetail}>
                                                옵션값 보기
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {isOption && (
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        <input
                                            type="text"
                                            name="name"
                                            value={editData.name || ''}
                                            onChange={handleChange}
                                            required
                                            placeholder="옵션명"
                                        />
                                    </td>
                                    <td className="hasRadio addList">
                                        <label>
                                            <input
                                                type="radio"
                                                name="req"
                                                value={1}
                                                checked={editData.req === 1}
                                                onChange={handleChange}
                                            /> 필수O
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="req"
                                                value={0}
                                                checked={editData.req === 0}
                                                onChange={handleChange}
                                            /> 필수X
                                        </label>
                                    </td>
                                    <td className="hasRadio addList">
                                        <label>
                                            <input
                                                type="radio"
                                                name="status"
                                                value={1}
                                                checked={editData.status === 1}
                                                onChange={handleChange}
                                            /> ON
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="status"
                                                value={0}
                                                checked={editData.status === 0}
                                                onChange={handleChange}
                                            /> OFF
                                        </label>
                                    </td>
                                    <td></td>
                                    <td>
                                        <button type="button" className="submit-btn" onClick={handleUpdate}>
                                            등록
                                        </button>
                                        <button type="button" className="submit-btn" onClick={cancle}>
                                            취소
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <button type="button" className="write-btn" onClick={addOption}>
                        옵션 추가
                    </button>
                </div>
            </form>
        </div>
    );
}

export default OptionPage;
