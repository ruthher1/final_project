import logo from './logo.svg';
import './App.css';
import Login from './conponents/Login';
import SignUp from './conponents/SignUp';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Site from './conponents/Manager/Site';
import SiteClient from './conponents/Client/SiteClient';


function App() {
  return (
    <>      
      <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
         <Route path="/manager/:id" element={<Site />} />
         <Route path="/manager/:id/addUser" element={<Site />} />
         <Route path="/manager/:id/editClient" element={<Site />} />
         <Route path="/manager/:id/details/:id" element={<Site />} />
         <Route path="/manager/:id/settings" element={<Site />} />
         <Route path="/manager/:id/help" element={<Site />} />
         <Route path="/client/:id" element={<SiteClient/>} />
         <Route path="/manager/:id/analytics" element={<Site />} />


       </Routes>


    </>

  );
}

export default App;
