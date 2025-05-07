import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/SignUp';
// import DocumentEditor from './components/DocumentEditor';
import Dashboard from './components/Dashboard'; // Import the Dashboard component
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './Pages/Home';
// import QuillNewEditor from './components/QuillNewEditor';
import DocumentDetails from './components/DocumentDetails';
// import MarkdownTest from './components/MarkdownTest';
// import MarkdownEditor from './components/MarkdownEditor';
import DocumentEditorWrapper from './components/DocumentEditorWrapper';
import CodeEditor from './components/CodeEditorDocument';
//import CodeEditor from './components/CodeEditorTest';
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
          <Route path="documents/:id/edit" element={<DocumentEditorWrapper />} />
          <Route path='/code-editor' element={<CodeEditor />} />
          {/* <Route path='/markdown-doc' element={<MarkdownEditor />} /> */}
        </Routes>
        <Footer />
        {/* <TiptapEditor /> */}
        {/* <QuillNewEditor /> */}
    </>
  );
}

export default App;