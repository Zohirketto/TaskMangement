import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/sidebar";
import Navbar from "./components/navbar"



const App = () => {
  return (
    <Router>
      <div className="app-container">
      <Sidebar />
      <Navbar/>
        <div className="main-content">
          <Routes>
            {/* Define routes here */}
            <Route path="/" element={<Dashboard/>}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;