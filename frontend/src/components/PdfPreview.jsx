function PdfPreview({ pdfPreviewUrl, activeDocument, loading }) {
  return (
    <section className="preview-shell">
      <header className="preview-header">
        <h3 className="mb-0">PDF Preview</h3>
        <span className="preview-meta">{activeDocument?.name || 'No file selected'}</span>
      </header>

      {loading ? (
        <div className="preview-skeleton" />
      ) : pdfPreviewUrl ? (
        <iframe title="PDF Preview" src={pdfPreviewUrl} className="preview-iframe" />
      ) : (
        <div className="preview-empty">Upload a PDF to preview it here.</div>
      )}
    </section>
  );
}

export default PdfPreview;
