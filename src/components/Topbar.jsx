import React, { useState } from 'react';
import { Sparkles, ShoppingBag, Video, FileText, Printer, ChevronDown, ChevronUp, Bot } from 'lucide-react';

export default function Topbar({ 
  currentMarketplace, 
  loadDemoML, 
  loadDemoShopee, 
  loadDemoTikTok,
  loadDemo5W2H, 
  handlePrint,
  onOpenGeminiAI
}) {
  const [actionsOpen, setActionsOpen] = useState(false);

  const getDotClass = () => {
    if (currentMarketplace === 'shopee') return 'dot-shopee';
    if (currentMarketplace === 'tiktok') return 'dot-tiktok';
    return 'dot-ml';
  };

  const getBadgeLabel = () => {
    if (currentMarketplace === 'shopee') return 'Shopee Performance Hub';
    if (currentMarketplace === 'tiktok') return 'TikTok Shop Performance Hub';
    return 'Mercado Livre Performance Hub';
  };

  return (
    <header className="app-topbar">
      <div className="topbar-title-wrap">
        <div className="topbar-badge">
          <span className={`dot-indicator ${getDotClass()}`}></span>
          {getBadgeLabel()}
        </div>
        <h1 style={{ marginTop: '0.35rem' }}>Diagnóstico Operacional e Growth Hub</h1>
        <p className="topbar-subtitle">Central de Análise, Precificação e Plano 5W2H</p>
      </div>

      {/* Desktop actions */}
      <div className="topbar-actions topbar-actions-desktop">
        <button 
          className="btn btn-sm" 
          onClick={onOpenGeminiAI}
          style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', color: '#fff', border: 'none' }}
          title="Abrir o Copilot de Inteligência Artificial Gemini"
        >
          <Bot size={15} />
          Copilot IA
        </button>

        <button className="btn btn-yellow btn-sm" onClick={loadDemoML} title="Carregar simulação do Mercado Livre">
          <Sparkles size={14} />
          Exemplo ML
        </button>
        <button className="btn btn-shopee btn-sm" onClick={loadDemoShopee} title="Carregar simulação da Shopee">
          <ShoppingBag size={14} />
          Exemplo Shopee
        </button>
        <button className="btn btn-tiktok btn-sm" onClick={loadDemoTikTok} title="Carregar simulação do TikTok Shop">
          <Video size={14} />
          Exemplo TikTok
        </button>
        <button className="btn btn-outline btn-sm" onClick={loadDemo5W2H} title="Carregar modelo PDF 5W2H">
          <FileText size={14} />
          Modelo 5W2H
        </button>
        <button className="btn btn-primary btn-sm" onClick={handlePrint} title="Exportar relatório em PDF">
          <Printer size={14} />
          PDF
        </button>
      </div>

      {/* Mobile actions — collapsible */}
      <div className="topbar-actions-mobile">
        <button 
          className="btn btn-outline btn-sm" 
          style={{ width: '100%', justifyContent: 'space-between' }}
          onClick={() => setActionsOpen(v => !v)}
        >
          <span>Ações Rápidas</span>
          {actionsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {actionsOpen && (
          <div className="topbar-actions-dropdown">
            <button className="btn btn-sm" style={{ flex: 1, background: '#6366f1', color: '#fff' }} onClick={() => { onOpenGeminiAI(); setActionsOpen(false); }}>
              <Bot size={14} /> Copilot IA
            </button>
            <button className="btn btn-yellow btn-sm" style={{ flex: 1 }} onClick={() => { loadDemoML(); setActionsOpen(false); }}>
              <Sparkles size={14} /> ML
            </button>
            <button className="btn btn-shopee btn-sm" style={{ flex: 1 }} onClick={() => { loadDemoShopee(); setActionsOpen(false); }}>
              <ShoppingBag size={14} /> Shopee
            </button>
            <button className="btn btn-tiktok btn-sm" style={{ flex: 1 }} onClick={() => { loadDemoTikTok(); setActionsOpen(false); }}>
              <Video size={14} /> TikTok
            </button>
            <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => { loadDemo5W2H(); setActionsOpen(false); }}>
              <FileText size={14} /> 5W2H
            </button>
            <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => { handlePrint(); setActionsOpen(false); }}>
              <Printer size={14} /> PDF
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
