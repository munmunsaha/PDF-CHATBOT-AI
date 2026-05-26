import UploadPanel from './UploadPanel';

function Sidebar({
  inputRef,
  file,
  status,
  progress,
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
  loading,
  activeDocument,
  theme,
  onToggleTheme,
  onToggleMobileMenu,
}) {
  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <div>
          <p className="brand-kicker mb-1">AI PDF Assistant</p>
          <h1 className="brand-title mb-0">DocChat</h1>
        </div>
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-sm btn-outline-light" onClick={onToggleTheme}>
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
          <button type="button" className="btn btn-sm btn-outline-light d-lg-none" onClick={onToggleMobileMenu}>
            Close
          </button>
        </div>
      </div>

      <div className="sidebar-panel">
        <h2 className="panel-title">Upload PDF</h2>
        <p className="panel-subtitle">Index a document, then ask questions grounded in its contents.</p>
        <UploadPanel
          inputRef={inputRef}
          file={file}
          loading={loading}
          progress={progress}
          status={status}
          error={error}
          success={success}
          isDragging={isDragging}
          onFileChange={onFileChange}
          onUpload={onUpload}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onBrowseClick={onBrowseClick}
          onClearFile={onClearFile}
        />
      </div>

      <div className="sidebar-panel">
        <h2 className="panel-title">Current Document</h2>
        {activeDocument ? (
          <div className="document-card">
            <div className="document-name">{activeDocument.name}</div>
            <div className="document-meta">{activeDocument.chunks} chunks indexed</div>
          </div>
        ) : (
          <p className="status-text">No document loaded yet.</p>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
