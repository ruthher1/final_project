import logo from './logo.svg';
import './App.css';
import Login from './conponents/Login';
import SignUp from './conponents/SignUp';
import { Routes, Route, Link, useNavigate, Router } from 'react-router-dom'
import Organizers from './conponents/Organizers';
// import R from './components/R';
function App() {
  return (
    <>
      {/* <div className="App">
      </div> */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/organizer/:userid" element={<Organizers/>} />
          {/* <Route path="/receiver/:userid" element={<R/>} />   */}
        </Routes>
    </>

  );
}

export default App;
