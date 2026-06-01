import React, { useState } from 'react';
import PdfUploader from '../components/PdfUploader';
import ChatWindow from '../components/ChatWindow';

const Home = () => {
  const [docInfo, setDocInfo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleUploadSuccess = (data, file) => {
    if (data) setDocInfo(data);
    if (file) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="docchat-app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="upload-section">
          <h5 className="fw-bold mb-1">Upload PDF</h5>
          <p className="text-muted small mb-4">Index a document, then ask questions grounded in its contents.</p>
          
          <PdfUploader onUploadSuccess={handleUploadSuccess} />

          {docInfo && (
            <div className="mt-4 p-3 rounded-3" style={{backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)'}}>
              <p className="small mb-1 text-primary fw-bold">Document Ready</p>
              <p className="small mb-0 text-truncate">{docInfo.filename}</p>
              <div className="d-flex gap-3 mt-2 text-muted" style={{fontSize: '0.7rem'}}>
                <span>{docInfo.pages} Pages</span>
                <span>{docInfo.chunks} Chunks</span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className={`section-card ${previewUrl ? 'has-preview' : ''}`}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h2 className="section-title mb-0">PDF Preview</h2>
            <span className="text-muted small">{docInfo || previewUrl ? (docInfo?.filename || 'File selected') : 'No file chosen'}</span>
          </div>
          {previewUrl ? (
            <div className="w-100 rounded-3 overflow-hidden" style={{ height: 'calc(100% - 50px)', minHeight: '120px', backgroundColor: '#1e293b' }}>
              <iframe 
                src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`} 
                width="100%" 
                height="100%" 
                style={{ border: 'none' }}
                title="PDF Preview"
              ></iframe>
            </div>
          ) : (
            <div className="d-flex align-items-center justify-content-center" style={{height: '140px'}}>
              <p className="text-muted">Upload a PDF to preview it here.</p>
            </div>
          )}
        </div>

        <div className="flex-grow-1 d-flex flex-column" style={{minHeight: 0, overflow: 'hidden'}}>
          <ChatWindow isDocumentReady={!!docInfo} />
        </div>
      </main>
    </div>
  );
};

export default Home;
