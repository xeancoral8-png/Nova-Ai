import { useRef, useState } from 'react';
import {
  Bot, ChevronDown, FileText, Image, Mic, Paperclip, Plus, Send, Sparkles, X,
} from 'lucide-react';

type Message = { id: number; role: 'user' | 'assistant'; text: string };

const suggestions = [
  'Help me understand the system',
  'Find information for me',
  'Give me a recommendation',
];

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [value, setValue] = useState('');
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [status, setStatus] = useState('Ready to help');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resizeTextarea = () => {
    const element = textareaRef.current;
    if (!element) return;
    element.style.height = 'auto';
    element.style.height = Math.min(element.scrollHeight, 180) + 'px';
  };

  const submit = (text = value.trim()) => {
    if (!text) return;
    setMessages(current => [...current, { id: Date.now(), role: 'user', text }]);
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setStatus('NOVA is thinking...');
    window.setTimeout(() => {
      setMessages(current => [...current, {
        id: Date.now() + 1,
        role: 'assistant',
        text: 'I received your request. This demo input is ready to connect to your real AI Agent backend.',
      }]);
      setStatus('Ready to help');
    }, 500);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <main className="nova-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark"><Sparkles size={18} /></div>
          <div><strong>NOVA</strong><span>AI Assistant</span></div>
        </div>
        <button className="new-chat" onClick={() => { setMessages([]); setStatus('Ready to help'); }}>
          <Plus size={17} /> New chat
        </button>
      </header>

      <section className="conversation" aria-live="polite">
        {messages.length === 0 ? (
          <div className="welcome">
            <div className="welcome-icon"><Bot size={30} /></div>
            <p className="eyebrow">NOVA AI ASSISTANT</p>
            <h1>How can I help you today?</h1>
            <p className="welcome-copy">Ask a question, request an action, or choose a suggestion to get started.</p>
            <div className="suggestions">
              {suggestions.map(s => (
                <button key={s} onClick={() => submit(s)}>
                  <span>{s}</span><ChevronDown size={15} className="suggestion-arrow" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="messages">
            {messages.map(message => (
              <article key={message.id} className={'message ' + message.role}>
                <div className="message-avatar">{message.role === 'assistant' ? <Sparkles size={15} /> : 'Y'}</div>
                <div>
                  <div className="message-label">{message.role === 'assistant' ? 'NOVA' : 'You'}</div>
                  <p>{message.text}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="composer-area">
        <div className="status-line"><span className="status-dot" /><span>{status}</span></div>
        <div className="composer">
          <div className="attach-wrap">
            <button className="icon-button" aria-label="Open attachments" onClick={() => setAttachmentsOpen(v => !v)}>
              <Plus size={21} />
            </button>
            {attachmentsOpen && (
              <div className="attachment-menu">
                <button onClick={() => setAttachmentsOpen(false)}><Paperclip size={16} /> Attach file</button>
                <button onClick={() => setAttachmentsOpen(false)}><Image size={16} /> Add image</button>
                <button onClick={() => setAttachmentsOpen(false)}><FileText size={16} /> Add document</button>
              </div>
            )}
          </div>

          <textarea
            ref={textareaRef}
            value={value}
            rows={1}
            placeholder="Ask NOVA anything..."
            aria-label="Ask NOVA anything"
            onChange={event => { setValue(event.target.value); resizeTextarea(); }}
            onKeyDown={handleKeyDown}
          />

          <div className="composer-actions">
            <button className={'icon-button voice-button ' + (voiceActive ? 'active' : '')}
              aria-label="Voice input" onClick={() => setVoiceActive(v => !v)}>
              <Mic size={19} />
            </button>
            <button className="send-button" aria-label="Send message" disabled={!value.trim()} onClick={() => submit()}>
              <Send size={18} />
            </button>
          </div>
        </div>
        <p className="composer-hint">Enter to send · Shift + Enter for a new line</p>
      </section>

      <footer>Powered by your system · NOVA is your intelligent assistant</footer>

      {attachmentsOpen && <button className="menu-backdrop" aria-label="Close attachment menu" onClick={() => setAttachmentsOpen(false)} />}
      {voiceActive && (
        <div className="voice-toast">
          <span className="pulse" /> Voice input is ready
          <button onClick={() => setVoiceActive(false)} aria-label="Stop voice input"><X size={15} /></button>
        </div>
      )}
    </main>
  );
}

export default App;