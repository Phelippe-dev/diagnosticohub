import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, HelpCircle, ChevronRight, RefreshCw } from 'lucide-react';
import { askTutorialChatbot } from '../services/geminiService';

export default function AppTutorialChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: '👋 Olá! Sou o **Assistente IA do Diagnóstico de Desempenho**. Posso te ensinar passo a passo como usar cada ferramenta da nossa plataforma! Clique em uma das dúvidas comuns abaixo ou digite sua pergunta.'
    }
  ]);

  const quickQuestions = [
    '📊 Como preencher os dados de Vendas e ACOS?',
    '⚡ Como importar dados via Smart Import / CSV?',
    '🤖 Como usar o Diagnóstico Inteligente Gemini IA?',
    '📝 Como criar e exportar o Plano de Ação 5W2H?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [messages, isOpen]);

  const handleSend = async (customText = null) => {
    const textToSend = customText || inputMsg;
    if (!textToSend || !textToSend.trim() || isLoading) return;

    const userMessage = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    if (!customText) setInputMsg('');
    setIsLoading(true);

    try {
      const botReplyText = await askTutorialChatbot(textToSend);
      setMessages(prev => [...prev, { sender: 'bot', text: botReplyText }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: '⚠️ Desculpe, tive um problema ao consultar o guia. Verifique se a chave da API da IA está ativa ou tente novamente em instantes.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormattedText = (text) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      let formatted = line;
      // Trata negrito **texto**
      const parts = formatted.split(/\*\*(.*?)\*\*/g);
      return (
        <div key={idx} style={{ marginBottom: line.trim() === '' ? '6px' : '3px' }}>
          {parts.map((part, pIdx) => 
            pIdx % 2 === 1 ? <strong key={pIdx} style={{ color: '#fff' }}>{part}</strong> : part
          )}
        </div>
      );
    });
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>
      
      {/* BOTÃO FLUTUANTE DE ABERTURA DO CHAT */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: 'linear-gradient(135deg, var(--ml-yellow) 0%, #f59e0b 100%)',
            color: '#0b0e14',
            border: 'none',
            borderRadius: '30px',
            padding: '12px 20px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4), 0 0 15px rgba(234, 179, 8, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            fontWeight: '800',
            fontSize: '0.9rem',
            transition: 'transform 0.2s, boxShadow 0.2s'
          }}
          className="btn-pulse"
        >
          <div style={{ background: '#0b0e14', color: 'var(--ml-yellow)', padding: '5px', borderRadius: '50%', display: 'flex' }}>
            <Bot size={18} />
          </div>
          <span>Como Usar o App?</span>
        </button>
      )}

      {/* JANELA DO CHATBOT TUTORIAL */}
      {isOpen && (
        <div
          style={{
            width: '380px',
            maxWidth: 'calc(100vw - 32px)',
            height: '540px',
            maxHeight: 'calc(100vh - 100px)',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'fadeIn 0.25s ease-out'
          }}
        >
          {/* CABEÇALHO CHATBOT */}
          <div
            style={{
              padding: '12px 16px',
              background: 'var(--bg-header)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: 'var(--ml-yellow)', color: '#0b0e14', padding: '6px', borderRadius: '8px', display: 'flex' }}>
                <Bot size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: '800', margin: 0, color: '#fff' }}>
                  Guia do Aplicativo IA
                </h4>
                <span style={{ fontSize: '0.72rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  ● Online • IA Gemini Ativa
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* ÁREA DE MENSAGENS */}
          <div style={{ flex: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '10px 14px',
                    borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    background: msg.sender === 'user' ? 'var(--ml-yellow)' : 'var(--bg-input)',
                    color: msg.sender === 'user' ? '#0b0e14' : 'var(--text-secondary)',
                    fontWeight: msg.sender === 'user' ? '600' : 'normal',
                    fontSize: '0.84rem',
                    lineHeight: '1.5',
                    border: msg.sender === 'bot' ? '1px solid var(--border-subtle)' : 'none'
                  }}
                >
                  {msg.sender === 'bot' ? renderFormattedText(msg.text) : msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '8px 14px', borderRadius: '12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <RefreshCw size={14} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Gerando resposta do guia...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* PERGUNTAS RÁPIDAS (ATALHOS) */}
          <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700' }}>Dúvidas frequentes:</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  disabled={isLoading}
                  style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '4px 8px',
                    fontSize: '0.72rem',
                    color: '#fff',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* CAMPO DE ENTRADA DO CHAT */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            style={{
              padding: '10px 12px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              gap: '8px',
              background: 'var(--bg-card)'
            }}
          >
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Pergunte como usar o app..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '8px 12px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.82rem'
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !inputMsg.trim()}
              style={{
                background: 'var(--ml-yellow)',
                color: '#0b0e14',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
