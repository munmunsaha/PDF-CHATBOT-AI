function UploadPanel({
  inputRef,
  file,
  loading,
  progress,
  status,
  error,
  success,
  isDragging,
  onFileChange,
  onUpload,
  onDrop,
  onDragOver,
  onDragLeave,
  onBrowseClick,
  onClearFile,
}) {
  const progressValue = Math.max(0, Math.min(100, progress || 0));

  return (
    <div className="upload-card">
      <input
        id="pdf-upload-input"
        type="file"
        accept="application/pdf"
        className="d-none"
        ref={inputRef}
        onChange={onFileChange}
      />

      <div
        className={`upload-dropzone ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={onBrowseClick}
        role="button"
        tabIndex={0}
      >
        <div className="dropzone-icon">PDF</div>
        <h3 className="dropzone-title">Drag and drop your PDF</h3>
        <p className="dropzone-subtitle">or click to browse your files</p>
        <div className="dropzone-hint">Only .pdf files up to 30 MB are allowed.</div>

        {file ? (
          <div className="selected-file mt-3">
            <div className="selected-file-label">Selected file</div>
            <div className="selected-file-name">{file.name}</div>
            <button
              type="button"
              className="btn btn-sm btn-outline-light mt-2"
              onClick={(event) => {
                event.stopPropagation();
                onClearFile();
              }}
            >
              Remove
            </button>
          </div>
        ) : null}
      </div>

      <div className="d-flex gap-2 mt-3">
        <button className="btn btn-brand flex-grow-1" type="button" onClick={onUpload} disabled={loading || !file}>
          {loading ? (
            <span className="d-inline-flex align-items-center gap-2">
              <span className="spinner-border spinner-border-sm" aria-hidden="true" />
              Uploading...
            </span>
          ) : (
            'Upload PDF'
          )}
        </button>
        <button type="button" className="btn btn-outline-light" onClick={onBrowseClick} disabled={loading}>
          Browse
        </button>
      </div>

      <div className="upload-progress mt-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="upload-progress-label">Upload progress</span>
          <span className="upload-progress-percent">{progressValue}%</span>
        </div>
        <div className="progress progress-dark">
          <div className="progress-bar" style={{ width: `${progressValue}%` }} />
        </div>
      </div>

      {status ? <div className="alert alert-info mt-3 mb-0 upload-alert">{status}</div> : null}
      {success ? <div className="alert alert-success mt-3 mb-0 upload-alert">{success}</div> : null}
      {error ? <div className="alert alert-danger mt-3 mb-0 upload-alert">{error}</div> : null}
    </div>
  );
}

export default UploadPanel;
