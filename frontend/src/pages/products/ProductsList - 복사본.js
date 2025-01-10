import { selectProduct } from '../../services/api';
import { useEffect, useState } from "react";
import {Link, useNavigate} from 'react-router-dom'
import './ProductsList.css'

function ProductsList(props) {
    const [proList, setProlist] = useState([]);//초기값
    const navigator = useNavigate();


    useEffect(()=>{
        selectProduct()
        .then(res =>{
         setProlist(res.data);
        })
        .catch(err => {
            console.error('상품 리스트 백엔드 연결 실패', err)
        })
    },[])


    function goAdd(){
        navigator('./products/add')//상품등록 보내기
    }
    

    return (
        <div className="memberList p-list">
            <div className='inquiry-section pro_detail'>
                <h1>상품목록</h1>
                <form>
                    <table>
                        <thead>
                            <tr>
                                <th><input type='checkbox'/></th>
                                <th>번호</th>
                                {/* <th>이미지</th> */}
                                <th>상품명</th>
                                <th>상태</th>
                                <th>재고</th>
                                <th>등록일자</th>
                            </tr>
                        </thead>
                        <tbody>
                            {proList.map((st, i) =>{

                                let status = 'OFF';
                                // console.log(st.status === 1)
                                if(st.status === 1){
                                    status = 'ON';
                                }
                                // console.log(st.id)
                                function goDetail(){
                                    navigator(`/products/detail/${st.id}`)//디테일 보내기
                                }

                                return <tr key={i}>
                                            <td><input type='checkbox'/></td>
                                            <td onClick={goDetail}>{i+1}</td>
                                            <td onClick={goDetail}>{st.name}</td>
                                            <td onClick={goDetail}>{status}</td>
                                            <td onClick={goDetail}>{st.quan}</td>
                                            <td onClick={goDetail}>{st.reg_date}</td>
                                        </tr>
                                })}
                        </tbody>
                    </table>
                    <button type="button" className="write-btn" onClick={goAdd}>상품등록</button>
                </form>
            </div>
        </div>
    );
}

export default ProductsList;