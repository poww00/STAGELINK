import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import ShowDetailPage from "./pages/show/ShowDetailPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shows/:id" element={<ShowDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
