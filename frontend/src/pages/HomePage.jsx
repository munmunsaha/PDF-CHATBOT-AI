import Sidebar from '../components/Sidebar';
import ChatContainer from '../components/ChatContainer';
import PdfPreview from '../components/PdfPreview';

function HomePage({
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
  isTyping,
  activeDocument,
  pdfPreviewUrl,
  theme,
  onToggleTheme,
  messages,
  question,
  setQuestion,
  onSendQuestion,
  mobileMenuOpen,
  onToggleMobileMenu,
}) {
  return (
    <div className="app-shell">
      <div className={`app-sidebar-overlay ${mobileMenuOpen ? 'show' : ''}`} onClick={onToggleMobileMenu} />
        <Sidebar
          inputRef={inputRef}
          file={file}
        status={status}
        progress={progress}
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
        loading={loading}
        activeDocument={activeDocument}
        theme={theme}
        onToggleTheme={onToggleTheme}
        onToggleMobileMenu={onToggleMobileMenu}
      />
      <main className="app-main">
        <button type="button" className="btn btn-outline-light mobile-menu-btn d-lg-none" onClick={onToggleMobileMenu}>
          Menu
        </button>
        <div className="app-main-inner">
          <PdfPreview pdfPreviewUrl={pdfPreviewUrl} activeDocument={activeDocument} loading={loading} />
          <ChatContainer
            messages={messages}
            question={question}
            setQuestion={setQuestion}
            onSendQuestion={onSendQuestion}
            loading={loading}
            isTyping={isTyping}
          />
        </div>
      </main>
    </div>
  );
}

export default HomePage;
