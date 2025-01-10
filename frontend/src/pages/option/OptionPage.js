import {useState, useEffect} from 'react';
import { OpfetchBoards } from '../../services/api';
import { Link, useNavigate, useParams } from 'react-router-dom';

function OptionPage(props) {
    const [arr, arrSt] = useState([]);
    const navigate = useNavigate();
    
    useEffect(()=>{
        document.title = '옵션관리';
        OpfetchBoards().then((res)=>{
            arrSt(res.data)
        }).catch((err)=>{
            console.log('옵션에러 : ',err)
        })

    })

    return (
        <div>
            <h3>옵션관리</h3>
            <table border={1}>
                <thead>
                    <tr>
                        <th>코드</th>
                        <th>옵션명</th>
                        <th>필수옵션</th>
                        <th>사용여부</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        arr.map((st, i)=>{
                            return  <tr key={i}>
                                        {/* <td>{st.code}</td> */}
                                    </tr>
                        })
                    }
                </tbody>
            </table>
        </div>
    );
}

export default OptionPage;