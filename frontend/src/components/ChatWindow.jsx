import React, { useState, useEffect, useRef } from 'react';
import Message from './Message';
import Loader from './Loader';
import { askQuestion } from '../services/api';

const ChatWindow = ({ isDocumentReady }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Upload a PDF in the sidebar, then ask a question and I will answer from the document only.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !isDocumentReady || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await askQuestion(input);
      const assistantMessage = { role: 'assistant', content: response.answer };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. ' + (err.response?.data?.error || err.message),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container h-100 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex flex-column">
          <span className="text-accent small fw-bold text-uppercase" style={{letterSpacing: '0.05em'}}>AI Assistant</span>
          <h2 className="section-title mb-0">Ask Questions About Your Document</h2>
        </div>
        <div className="d-flex gap-2">
          <span className="badge rounded-pill" style={{backgroundColor: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4', padding: '0.5rem 0.75rem'}}>Top 4 chunks retrieved</span>
        </div>
      </div>

      <div className="chat-messages flex-grow-1">
        {messages.map((msg, index) => (
          <Message key={index} role={msg.role} content={msg.content} isError={msg.isError} />
        ))}
        {loading && <Loader />}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="input-area mt-3">
        <input
          type="text"
          className="chat-input"
          placeholder={isDocumentReady ? "Type your question here..." : "Upload a PDF first to start chatting..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!isDocumentReady || loading}
        />
        <button 
          type="submit" 
          className="btn btn-primary-docchat position-absolute end-0 top-50 translate-middle-y me-2"
          disabled={!isDocumentReady || loading}
          style={{padding: '0.4rem 1rem'}}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
