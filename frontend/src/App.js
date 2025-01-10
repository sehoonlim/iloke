import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import HomePage from "./pages/HomePage"; // HomePage 임포트

function App() {
  return (
    <Router>
      <Routes>
        {/* / 경로로 HomePage 렌더링 */}
        <Route path="/" element={<HomePage />} />
        <Route path="/*" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
