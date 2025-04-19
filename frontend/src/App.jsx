import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/SignUp';
// import DocumentEditor from './components/DocumentEditor';
import Dashboard from './components/Dashboard'; // Import the Dashboard component
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import QuillNewEditor from './components/QuillNewEditor';
import DocumentDetails from './components/DocumentDetails';
//import TiptapEditor from './components/TipTapEditor';


function App() {
  return (
    <>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/documents/:id" element={<DocumentDetails />} />
          <Route path="documents/:id/edit" element={<QuillNewEditor />} />
        </Routes>
        <Footer />
        {/* <TiptapEditor /> */}
        {/* <QuillNewEditor /> */}
    </>
  );
}

export default App;