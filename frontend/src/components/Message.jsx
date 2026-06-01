import React from 'react';

const Message = ({ role, content, isError }) => {
  const isAssistant = role === 'assistant';

  return (
    <div className={`message-bubble ${isAssistant ? 'message-assistant' : 'message-user'}`}>
      <div className="small fw-bold mb-1" style={{ opacity: 0.7 }}>
        {role}
      </div>
      <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
        {content}
      </div>
    </div>
  );
};

export default Message;
