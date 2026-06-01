import React, { useState, useCallback } from 'react';
import { uploadPdf } from '../services/api';

const PdfUploader = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
      // Pass the file up for immediate preview if desired
      if (onUploadSuccess) onUploadSuccess(null, selectedFile);
    } else {
      setError('Please select a valid PDF file.');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setProgress(0);

    // Mock progress for visual effect
    const interval = setInterval(() => {
      setProgress(prev => (prev < 90 ? prev + 10 : prev));
    }, 200);

    try {
      const data = await uploadPdf(file);
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        onUploadSuccess(data, file);
        setLoading(false);
      }, 500);
    } catch (err) {
      clearInterval(interval);
      setError(err.response?.data?.error || 'Failed to upload PDF.');
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <div 
        className="dropzone"
        onClick={() => document.getElementById('fileInput').click()}
      >
        <div className="upload-icon-wrapper">
          <span className="fw-bold text-white">PDF</span>
        </div>
        <p className="mb-1 fw-bold">{file ? file.name : 'Drag and drop your PDF'}</p>
        <p className="text-muted small mb-0">or click to browse your files</p>
        <p className="text-muted mt-3" style={{fontSize: '0.65rem'}}>Only .pdf files up to 30 MB are allowed.</p>
        <input 
          id="fileInput"
          type="file" 
          accept=".pdf" 
          onChange={handleFileChange} 
          className="d-none"
        />
      </div>

      <div className="d-flex gap-2 mt-4">
        <button 
          className="btn btn-docchat btn-primary-docchat flex-grow-1"
          onClick={handleUpload}
          disabled={!file || loading}
        >
          {loading ? 'Uploading...' : 'Upload PDF'}
        </button>
        <button 
          className="btn btn-docchat btn-outline-docchat"
          onClick={() => document.getElementById('fileInput').click()}
        >
          Browse
        </button>
      </div>

      {loading && (
        <div className="mt-3">
          <div className="d-flex justify-content-between small mb-1">
            <span className="text-muted">Upload progress</span>
            <span>{progress}%</span>
          </div>
          <div className="progress" style={{height: '6px', backgroundColor: 'rgba(255,255,255,0.05)'}}>
            <div 
              className="progress-bar bg-primary" 
              role="progressbar" 
              style={{width: `${progress}%`}}
            ></div>
          </div>
        </div>
      )}

      {error && <div className="text-danger small mt-2">{error}</div>}
    </div>
  );
};

export default PdfUploader;
