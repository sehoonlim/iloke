import { proAdd } from '../../services/api';  // API 호출 함수
import { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ProductsAddPage.css';

function ProductsAddPage(props) {
    const navigator = useNavigate();

    // 숫자 막기 유효성
    const key = Event.key
    // console.log(key)

    //파일등록 state
    const [proFile, setFile] = useState(null);//상품사진 초기화
    const [detailFile, setDTFile] = useState(null);//상세정보 이미지 초기화
    
    //상품 선택이미지 저장
    const upProFile = (e) =>{
        let pickPDFiles = e.target.files;
        setFile(pickPDFiles);
    }

    //상품상세 선택이미지 저장
    const upDTFile = (e) =>{
        let pickDTFiles = e.target.files;
        setDTFile(pickDTFiles);
    }


    //가격 state
    const [orPrice, setOrPrice] = useState('');//원가
    const [disV, setDisV] = useState('');//할인율
    const [fnPrice, setFnPrice] = useState('');//최종가

    //최종가격 계산+유효성
    function fnPriceChange(){
        let newFnPrice = Math.round(orPrice - (orPrice * (disV / 100)));
        const onePrice = newFnPrice % 10;
        // let empty = '';
        // if(onePrice){
        //     let restPrice = 10 - onePrice
        //     console.log(newFnPrice + restPrice)
        //     // empty = newFnPrice;
        //     // newFnPrice = empty + restPrice
        // }
        if(orPrice && disV > 0){
            //원가 할인율 둘 다 있을 시
            setFnPrice(newFnPrice);//계산된 가격
            if(newFnPrice < 0 || disV > 100){
                //최종가가 마이너스거나 할인율이 100퍼 넘을 때
                alert('할인율을 다시 입력하세요.')
                return setDisV('0');
            }else if(disV == 100){
                //할인율 100퍼 맞는지 체크
                let checConfirm = confirm("할인율 100%를 입력하신게 맞나요?");
                if (!checConfirm) {
                return setDisV('0');
                }
            }
        }else if(!disV ||disV == 0){
            //할인율 없거나 0일 시
            setFnPrice(orPrice);//원가 가격
        }

        //소수점반올림넣기
    }

    // 원가, 할인율 입력값 변경 시
    const orPriceChange = (e) => {//원가
        const newPrice = e.target.value; //입력된 값을 불러오기
        setOrPrice(newPrice); //초기화 값에 입력값 넣기
    };
    const disVChange = (e) => {//할인율
        const newDisV = e.target.value;
        setDisV(newDisV);
    };

    //바뀐 원가, 할인율값 fnPriceChange로 들고가서 실시간 계산
    useEffect(()=>{
        fnPriceChange()
    },[orPrice, disV])



    function proSubmit(e){
        //등록버튼 클릭 후 동작
        e.preventDefault();

        const frmData = new FormData(document.proFrm);

        //상품사진 인풋에 차례대로 이미지 데이터 넣기
        if (proFile) {
            for (let i = 0; i < proFile.length; i++) {
                frmData.append('PDfile', proFile[i]); 
            }
        }
        //상품상세 인풋에 차례대로 이미지 데이터 넣기
        if (detailFile) {
            for (let i = 0; i < detailFile.length; i++) {
                frmData.append('DTfile', detailFile[i]);
            }
        }
        
        // console.log(frmData)

        proAdd(frmData)
        .then(res=>{
            // console.log('상품등록완료');
            alert('상품등록되었습니다.');
            navigator('/products/detail')//목록으로 이동
        }).catch(err=>{
            console.log('상품등록오류 : ',err)
            alert("상품등록실패");
        })
    }

    return (
        <div>
            <form name='proFrm' onSubmit={proSubmit}>
                <div className="join_base_section">
                    <div className="join_base_wrap">
                        <div className="filter-header">
                            <h2>상품등록</h2>
                        </div>
                        <br/>
                        <table>
                            <tbody>
                                <tr>
                                    <td className="inputHead">
                                        <i className="fa-solid fa-square fa-2xs"/>
                                        상품명
                                    </td>
                                    <td>
                                        <input type='text' name='name' required />
                                        {/* <p className="message" style="color:#06ADC3;">사용가능한 상품명입니다.</p> */}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="inputHead">
                                        <i className="fa-solid fa-square fa-2xs"/>
                                        사진
                                    </td>
                                    <td>
                                        <input type='file' name='PDfile' onChange={upProFile} multiple required/>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="inputHead">
                                        상세이미지
                                    </td>
                                    <td>
                                        <input type='file' name='DTfile' onChange={upDTFile} multiple/>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="inputHead">
                                        <i className="fa-solid fa-square fa-2xs"/>
                                        등록 재고 수량
                                    </td>
                                    <td>
                                        <input type='number' name='quan' required/>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="inputHead">
                                        <i className="fa-solid fa-square fa-2xs"/>
                                        사용 여부
                                    </td>
                                    <td className='hasRadio'>
                                        <label>
                                            <input type='radio' name='status' defaultChecked value={1}/>ON
                                        </label>
                                        <label>
                                            <input type='radio' name='status' value={0}/>OFF
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="inputHead">혜택</td>
                                    <td>
                                        <textarea name='benefit'/>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="inputHead">
                                        <i className="fa-solid fa-square fa-2xs"/>
                                        상품 가격
                                    </td>
                                    <td className='hasUnit'>
                                        <input type='number' name='price' value={orPrice} onChange={orPriceChange} required/>
                                        <span>원</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="inputHead">
                                        할인율
                                    </td>
                                    <td className='hasUnit'>
                                        <input type='number' name='discount' value={disV} onChange={disVChange}/>
                                        <span>%</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="inputHead">
                                        <i className="fa-solid fa-square fa-2xs"/>
                                        최종 가격
                                    </td>
                                    <td className='hasUnit'>
                                        <input type='number' readOnly value={fnPrice || '0'}/>
                                        <span>원</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <Link to='/'>돌아가기</Link>
                        <input type='submit' value='등록'/>
                    </div>
                </div>

            </form>
        </div>
    );
}

export default ProductsAddPage;