import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import GeneratorAndResult from './features/generatorAndResult/GeneratorAndResult'
import Login from './features/login/Login';
import Categories from './features/categories/Categories';


function App() {

  return (
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Categories" element={<Categories />} />
          <Route path="/GeneratorAndResult" element={<GeneratorAndResult />} />
        </Routes>
      </Router>
    </React.StrictMode>
  )
}

export default App
