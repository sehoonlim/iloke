import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import ItemWrite from './pages/notice/ItemWrite';
import ItemDetail from './pages/notice/ItemDetail'; // 새로 추가한 컴포넌트

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/write" element={<ItemWrite />} />
                <Route path="/detail/:id" element={<ItemDetail />} /> {/* 상세 페이지 라우트 추가 */}
                <Route path="/*" element={<MainPage />} />
            </Routes>
        </Router>
    );
}

export default App;
