import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";

import AdminConsultations from "./pages/AdminConsultations";
import AdminGallery from "./pages/AdminGallery";
import ShodhSutraAdmin from "./components/ShodhSutraAdmin";
import AdminAdmissionPartners from "./pages/AdminAdmissionPartners";
import AdminMentors from "./pages/AdminMentors";
import UniversityAdmin from "./pages/UniversityAdmin";



function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
         
        
      
          <Route path="/consultations" element={<Layout><AdminConsultations /></Layout>} />
          <Route path="/gallery" element={<Layout><AdminGallery /></Layout>} /> 
          <Route path="/shodh-student-data" element={<Layout><ShodhSutraAdmin/></Layout>} />
          <Route path="/shodh-admission-partners" element={<Layout><AdminAdmissionPartners/></Layout>} />
           <Route path="/admin-mentors" element={<Layout><AdminMentors /></Layout>} />
           <Route path="/admin-university" element={<Layout><UniversityAdmin /></Layout>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      {/* Move ToastContainer **outside Router** so it always exists */}
      
    </>
  );
}

export default App;
