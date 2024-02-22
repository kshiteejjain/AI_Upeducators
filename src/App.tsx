import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import GeneratorAndResult from './features/generatorAndResult/GeneratorAndResult';
import Login from './features/login/Login';
import Categories from './features/categories/Categories';
import UploadUsersCSV from './features/uploadUsersCSV/UploadUsersCSV';
import ContactUs from './features/contactUs/ContactUs';
import FreeTrial from './features/freeTrial/FreeTrial';
import ForgotPassword from './features/forgotPassword/ForgotPassword';
import Dashboard from './features/admin/dashboard/Dashboard';
import Register from './features/register/Register';
import Profile from './features/profile/Profile';

import './App.css';

type Props = {
  isLoggedIn: boolean
};
const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') || 'true');
function App() {
  return (
    <React.StrictMode>
      <Router>
      <Routes>
          <Route path="/FreeTrial" element={<FreeTrial />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/*" element={<MainApp isLoggedIn={isLoggedIn} />} />
        </Routes>
      </Router>
    </React.StrictMode>
  );
}
function MainApp({ isLoggedIn }: Props) {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.length <= 0 || localStorage.getItem('isLoggedIn') === null || localStorage.getItem('isLoggedIn') === undefined) {
      navigate('/');
    }
  }, [navigate]);
  return (
    <Routes>
      {isLoggedIn ? (
        <>
          <Route path="/" element={<Login />} />
          <Route path="/Categories" element={<Categories />} />
          <Route path="/GeneratorAndResult" element={<GeneratorAndResult />} />
          <Route path="/UploadUsersCSV" element={<UploadUsersCSV />} />
          <Route path="/ContactUs" element={<ContactUs />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Profile" element={<Profile />} />
        </>
      ) : (
        <>
          <Route path="/" element={<Login />} />
        </>
      )}
    </Routes>
  );
}
export default App;
