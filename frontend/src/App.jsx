import { useEffect, useRef, useState } from 'react';
import { askQuestionApi, uploadPdfApi } from './services/api';
import HomePage from './pages/HomePage';
import ToastStack from './components/ToastStack';

function App() {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [isTyping, setIsTyping] = useState(false);
  const [status, setStatus] = useState('Upload a PDF to get started.');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [activeDocument, setActiveDocument] = useState(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Upload a PDF in the sidebar, then ask a question and I will answer from the document only.',
    },
  ]);

  const validatePdf = (candidateFile) => {
    if (!candidateFile) return false;
    const isPdfMime = candidateFile.type === 'application/pdf';
    const isPdfExt = candidateFile.name.toLowerCase().endsWith('.pdf');
    const withinLimit = candidateFile.size <= 30 * 1024 * 1024;

    // Some drag-and-drop sources can omit MIME type, so extension is the fallback.
    if (!isPdfMime && !isPdfExt) {
      setError('Please upload a valid PDF file.');
      setSuccess('');
      return false;
    }

    if (!withinLimit) {
      setError('PDF is too large. Maximum size is 30 MB.');
      setSuccess('');
      return false;
    }

    setError('');
    return true;
  };

  const setSelectedFile = (candidateFile) => {
    if (!candidateFile) {
      setFile(null);
      setProgress(0);
      setError('');
      setSuccess('');
      return;
    }

    if (validatePdf(candidateFile)) {
      setFile(candidateFile);
      if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl(URL.createObjectURL(candidateFile));
      setSuccess(`Selected ${candidateFile.name}`);
      setStatus('Ready to upload PDF.');
    }
  };

  const onFileChange = (event) => {
    setSelectedFile(event.target.files?.[0] || null);
  };

  const onBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const onClearFile = () => {
    setFile(null);
    setProgress(0);
    setSuccess('');
    setError('');
    if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
    setPdfPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) setSelectedFile(droppedFile);
  };

  const addToast = (message, type = 'info') => {
    const toast = { id: Date.now() + Math.random(), message, type };
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== toast.id));
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const onUpload = async () => {
    if (!file) {
      setStatus('Please choose a PDF file first.');
      return;
    }

    setLoading(true);
    setProgress(0);
    setError('');
    setSuccess('');
    setStatus('Uploading and indexing PDF...');

    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const data = await uploadPdfApi(formData, (event) => {
        if (event.total) {
          setProgress(Math.round((event.loaded * 100) / event.total));
        }
      });
      setActiveDocument(data.document);
      setProgress(100);
      setSuccess(`Uploaded ${data.document.name} successfully.`);
      addToast(`Uploaded ${data.document.name} successfully.`, 'success');
      setMessages((prev) => [
        ...prev,
        {
          role: 'system',
          text: `Loaded ${data.document.name}. ${data.document.chunks} chunks are ready.`,
        },
      ]);
      setStatus('PDF indexed successfully. Ask a question now.');
      setMobileMenuOpen(false);
    } catch (error) {
      const message = error.message || 'Upload failed.';
      setError(message);
      setStatus(message);
      addToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const onSendQuestion = async (event) => {
    event.preventDefault();

    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;

    setMessages((prev) => [...prev, { role: 'user', text: trimmedQuestion }]);
    setQuestion('');
    setLoading(true);
    setIsTyping(true);
    setStatus('Thinking and retrieving relevant chunks...');

    try {
      const data = await askQuestionApi(trimmedQuestion);
      await new Promise((resolve) => setTimeout(resolve, 350));
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: data.answer || 'I could not generate an answer from the document.',
        },
      ]);
      setStatus('Answer ready. Ask another question or upload a new PDF.');
      addToast('Answer generated successfully.', 'success');
    } catch (error) {
      const message = error.message || 'Could not get an answer.';
      setStatus(message);
      addToast(message, 'error');
    } finally {
      setIsTyping(false);
      setLoading(false);
    }
  };

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const onToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <>
      <ToastStack toasts={toasts} onClose={removeToast} />
      <HomePage
        inputRef={fileInputRef}
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
        isTyping={isTyping}
        activeDocument={activeDocument}
        pdfPreviewUrl={pdfPreviewUrl}
        theme={theme}
        onToggleTheme={onToggleTheme}
        messages={messages}
        question={question}
        setQuestion={setQuestion}
        onSendQuestion={onSendQuestion}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={toggleMobileMenu}
      />
    </>
  );
}

export default App;
