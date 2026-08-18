import React, { useState } from 'react';
import { FileSpreadsheet, Printer, ChevronDown, ChevronUp } from 'lucide-react';

export default function Topbar({ 
  currentMarketplace, 
  loadDemoML, 
  loadDemoShopee, 
  loadDemoTikTok,
  loadDemo5W2H, 
  handlePrint,
  onOpenImport
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
        <p className="topbar-subtitle">Central de Análise, Pesquisa de Mercado e Plano 5W2H</p>
      </div>

      {/* Desktop actions */}
      <div className="topbar-actions topbar-actions-desktop">
        <button 
          className="btn btn-sm" 
          onClick={onOpenImport}
          style={{ background: 'var(--bg-card)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', gap: '6px' }}
          title="Importar dados via Planilha CSV ou Excel"
        >
          <FileSpreadsheet size={15} color="var(--success)" />
          Importar Planilha
        </button>

        <button className="btn btn-outline btn-sm" onClick={handlePrint} title="Imprimir ou Salvar PDF do Diagnóstico">
          <Printer size={14} />
          PDF
        </button>
      </div>

      {/* Mobile actions dropdown */}
      <div className="topbar-actions-mobile">
        <button 
          className="btn btn-outline btn-sm" 
          onClick={() => setActionsOpen(v => !v)}
          style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          Ações Rápidas
          {actionsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {actionsOpen && (
          <div className="mobile-actions-dropdown">
            <button className="mobile-action-item" onClick={() => { onOpenImport(); setActionsOpen(false); }}>
              <FileSpreadsheet size={14} color="var(--success)" /> Importar Planilha
            </button>
            <button className="mobile-action-item" onClick={() => { handlePrint(); setActionsOpen(false); }}>
              <Printer size={14} /> Salvar PDF
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
