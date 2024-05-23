import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import GeneratorAndResult from './features/generatorAndResult/GeneratorAndResult';
import Login from './features/login/Login';
import Categories from './features/categories/Categories';
import BulkUpload from './features/bulkUpload/Index';
import ContactUs from './features/contactUs/ContactUs';
import FreeTrial from './features/freeTrial/FreeTrial';
import CreatePassword from './features/createPassword/CreatePassword';
import Dashboard from './features/admin/dashboard/Dashboard';
import Register from './features/register/Register';
import Profile from './features/profile/Profile';
import OnBoardingQuestions from './features/OnboardingQuestions/OnboardingQuestions'

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
          <Route path="/CreatePassword" element={<CreatePassword />} />
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
          <Route path="/BulkUpload" element={<BulkUpload />} />
          <Route path="/ContactUs" element={<ContactUs />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/OnBoardingQuestions" element={<OnBoardingQuestions />} />
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
