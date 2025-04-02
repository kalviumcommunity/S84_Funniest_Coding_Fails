import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./Pages/Homepage";
import AddEntity from "./Pages/AddEntity";
import UpdateEntity from "./Pages/UpdateEntity";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddEntity />} />
        <Route path="/update/:id" element={<UpdateEntity />} />
        
      </Routes>
    </Router>
  );
}

export default App;