import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/SignUp';
import Dashboard from './components/Dashboard'; // Import the Dashboard component
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './Pages/Home';
import DocumentDetails from './components/DocumentDetails';
import DocumentEditorWrapper from './components/DocumentEditorWrapper';
import CodeEditor from './components/CodeEditorDocument';
function App() {
  return (
    <>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/documents/:id" element={<DocumentDetails />} />
          <Route path="documents/:id/edit" element={<DocumentEditorWrapper />} />
          <Route path='/code-editor' element={<CodeEditor />} />
        </Routes>
        <Footer />
    </>
  );
}
export default App;