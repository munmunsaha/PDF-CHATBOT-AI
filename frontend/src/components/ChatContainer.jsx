import { useEffect, useRef } from 'react';

function ChatContainer({ messages, question, setQuestion, onSendQuestion, loading, isTyping }) {
  const bodyRef = useRef(null);

  useEffect(() => {
    if (!bodyRef.current) return;
    bodyRef.current.scrollTo({
      top: bodyRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isTyping]);

  return (
    <section className="chat-shell">
      <header className="chat-header">
        <div>
          <p className="brand-kicker mb-1">Conversation</p>
          <h2 className="chat-title mb-0">Chat with your PDF</h2>
        </div>
        <div className="chat-chip">Top 4 chunks retrieved</div>
      </header>

      <div className="chat-body" ref={bodyRef}>
        {messages.map((message, index) => (
          <article key={index} className={`message-row ${message.role}`}>
            <div className="message-bubble">
              <div className="message-role">{message.role}</div>
              <div className="message-text">{message.text}</div>
            </div>
          </article>
        ))}
        {isTyping ? (
          <article className="message-row assistant">
            <div className="message-bubble typing-bubble">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </article>
        ) : null}
        {loading && messages.length < 2 ? <div className="chat-skeleton" /> : null}
      </div>

      <footer className="chat-footer">
        <form onSubmit={onSendQuestion} className="chat-form">
          <textarea
            className="form-control chat-input"
            rows="2"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask a question about the uploaded PDF..."
            disabled={loading}
          />
          <div className="chat-actions">
            <button className="btn btn-outline-secondary" type="button" onClick={() => setQuestion('')} disabled={loading}>
              Clear
            </button>
            <button className="btn btn-brand" type="submit" disabled={loading || !question.trim()}>
              {loading ? 'Thinking...' : 'Send'}
            </button>
          </div>
        </form>
      </footer>
    </section>
  );
}

export default ChatContainer;
