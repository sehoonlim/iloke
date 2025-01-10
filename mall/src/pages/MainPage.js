import { useContent } from '../hooks/pageFunction';
import Footer from './Footer';
import Header from './Header';

function MainPage(props) {
    const content = useContent(); // useContent 훅 호출
    const isMainPage = location.pathname === '/'; // 메인 페이지 확인

    return (
        <div>
            <Header />
            <div id="cont" className={!isMainPage ? 'content' : ''}>
                {content} {/* 동적으로 렌더링될 컴포넌트 */}
            </div>
            <Footer />
        </div>
    );
}

export default MainPage;
