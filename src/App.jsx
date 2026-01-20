import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";

import AdminConsultations from "./pages/AdminConsultations";
import AdminGallery from "./pages/AdminGallery";



function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
         
        
      
          <Route path="/consultations" element={<Layout><AdminConsultations /></Layout>} />
          <Route path="/gallery" element={<Layout><AdminGallery /></Layout>} /> 

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      {/* Move ToastContainer **outside Router** so it always exists */}
      
    </>
  );
}

export default App;
