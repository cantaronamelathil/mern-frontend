import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
 import Signup from './pages/Signup';
 import Home from './pages/Home';
// import ProjectView from './pages/ProjectView';
import './App.css';

function App() {
  return (
    <Router>
      <div className="flex flex-col items-center justify-center min-h-screen bg-blue-200 text-black">
        <Routes>
           <Route path="/" element={<Home />} /> 
          <Route path="/login" element={<Login />} />
           <Route path="/signup" element={<Signup />} />
          {/* <Route path="/project/:id" element={<ProjectView />} />  */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
