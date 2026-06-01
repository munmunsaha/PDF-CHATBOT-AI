import React from 'react';

const Loader = () => {
  return (
    <div className="d-flex align-items-center gap-2 mb-3 message-bubble message-assistant">
      <div className="spinner-grow spinner-grow-sm text-accent" role="status"></div>
      <div className="spinner-grow spinner-grow-sm text-accent" role="status" style={{animationDelay: '0.2s'}}></div>
      <div className="spinner-grow spinner-grow-sm text-accent" role="status" style={{animationDelay: '0.4s'}}></div>
      <span className="ms-2 small text-muted">DocChat is thinking...</span>
    </div>
  );
};

export default Loader;
