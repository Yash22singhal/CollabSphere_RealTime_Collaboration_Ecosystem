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
import ErrorPage from './Errors/ErrorPage';
import Loading from './Loading';

const DocumentEditorWrapper = () => {

    const {id} = useParams();
    const [doc, setDoc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {url, token, isAuthenticated} = useContext(AppContext);


    useEffect(() => {
        if (!token || !isAuthenticated()){
          setLoading(false);
          setError('Unauthorized');
          return;
        }; // Wait until token is available

        setLoading(true);
        setError(null);
      
        fetch(`${url}/api/documents/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => {
            if (!res.ok){
              if (res.status === 401 ) throw new Error('Unauthorized');
              throw new Error('Fetch error');
            } 
            return res.json();
          })
          .then((data) => setDoc(data))
          .catch((err) => {
            console.error(err);
            setError(error.message);
          })
          .finally(() => setLoading(false));
      }, [id, token]);
      
    
    if (loading) return <Loading message='loading document...'/>
    if (error === 'Unauthorized') return <Unauthorised />
    if (error)  return <ErrorPage code='Error' message={error} />
    if (!doc) return <ErrorPage code="404" message='Document Not Found.' />
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