import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./Pages/Homepage";
import AddEntity from "./Pages/AddEntity";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddEntity />} />
      </Routes>
    </Router>
  );
}

export default App;