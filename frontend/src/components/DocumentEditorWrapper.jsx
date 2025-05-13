import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import QuillNewEditor from './QuillNewEditor';
import MarkdownEditor from './MarkdownEditor';
import { AppContext } from '../context/AppContext';
//import CodeEditor from './CodeEditorTest';
//import CodeEditor from './CodeEditorDocument';
import CodeEditor from './CodeEditor';
import Unauthorised from './Errors/Unauthorised';

const DocumentEditorWrapper = () => {

    const {id} = useParams();
    const [doc, setDoc] = useState(null);
    const {url, token} = useContext(AppContext);


    useEffect(() => {
        if (!token) return; // Wait until token is available
      
        fetch(`${url}/api/documents/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => {
            if (!res.ok) throw new Error('Unauthorized');
            return res.json();
          })
          .then((data) => setDoc(data))
          .catch((err) => {
            console.error(err);
            // optionally redirect to login or show error
          });
      }, [id, token]);
      

    if (!doc) return <Unauthorised />

    switch (doc.type) {
        case 'Text':
            return <QuillNewEditor doc={doc} />
        case 'MarkDown':
            return <MarkdownEditor doc={doc} />
        case 'Code Editor':
            return <CodeEditor doc={doc} />
        default:
            return <div>Unsupported document type</div>
    }
};

export default DocumentEditorWrapper