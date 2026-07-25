import React, { useState } from 'react';
import { 
  TrendingUp, 
  Edit3, 
  LayoutDashboard, 
  AlertTriangle, 
  CheckSquare, 
  FileSpreadsheet, 
  UserPlus, 
  Calculator,
  Menu,
  X,
  Zap,
  ShoppingBag,
  Video
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'tab-input',       icon: Edit3,           label: '1. Inserção de Dados' },
  { id: 'tab-dashboard',   icon: LayoutDashboard, label: '2. Métricas' },
  { id: 'tab-diagnosis',   icon: AlertTriangle,   label: '3. Diagnóstico' },
  { id: 'tab-actions',     icon: CheckSquare,     label: '4. Plano de Ação' },
  { id: 'tab-alignment',   icon: FileSpreadsheet, label: '5. Modelo 5W2H' },
  { id: 'tab-new-account', icon: UserPlus,        label: '6. Conta do Zero' },
  { id: 'tab-calculator',  icon: Calculator,      label: '7. Precificação' },
];

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  currentMarketplace, 
  setMarketplace, 
  isCollapsed, 
  toggleSidebar 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  const isShopee = currentMarketplace === 'shopee';
  const isTikTok = currentMarketplace === 'tiktok';

  const channelLabel = isTikTok ? 'TikTok Shop' : (isShopee ? 'Shopee Brasil' : 'Mercado Livre');

  return (
    <>
      {/* =============================================
          MOBILE HEADER BAR (top strip on small screens)
      ============================================= */}
      <div className="mobile-header">
        <div className="mobile-header-brand">
          <div className="brand-logo-icon" style={{ width: 32, height: 32 }}>
            <TrendingUp size={16} />
          </div>
          <div>
            <div className="brand-app-name" style={{ fontSize: '0.88rem' }}>Growth Hub</div>
            <div className="brand-channel-tag" style={{ fontSize: '0.65rem' }}>
              {channelLabel}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Marketplace quick switch on mobile header */}
          <div className="segmented-control" style={{ maxWidth: 210 }}>
            <button 
              type="button"
              className={`seg-btn ${currentMarketplace === 'ml' ? 'active' : ''}`}
              data-mp="ml"
              onClick={() => setMarketplace('ml')}
            >
              <Zap size={12} />
              <span style={{ fontSize: '0.68rem' }}>ML</span>
            </button>
            <button 
              type="button"
              className={`seg-btn ${currentMarketplace === 'shopee' ? 'active' : ''}`}
              data-mp="shopee"
              onClick={() => setMarketplace('shopee')}
            >
              <ShoppingBag size={12} />
              <span style={{ fontSize: '0.68rem' }}>Shopee</span>
            </button>
            <button 
              type="button"
              className={`seg-btn ${currentMarketplace === 'tiktok' ? 'active' : ''}`}
              data-mp="tiktok"
              onClick={() => setMarketplace('tiktok')}
            >
              <Video size={12} />
              <span style={{ fontSize: '0.68rem' }}>TikTok</span>
            </button>
          </div>

          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(v => !v)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile full-screen slide-down menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <nav className="mobile-drawer-nav">
            {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                className={`mobile-nav-item ${activeTab === id ? 'active' : ''}`}
                onClick={() => handleNavClick(id)}
              >
                <Icon size={20} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* =============================================
          DESKTOP SIDEBAR (hidden on mobile)
      ============================================= */}
      <aside className="sidebar" id="app-sidebar">
        <div className="sidebar-brand-box">
          <div className="brand-logo-icon">
            <TrendingUp size={20} />
          </div>
          <div className="brand-title-wrap">
            <span className="brand-app-name">Growth Hub</span>
            <span className="brand-channel-tag">
              {channelLabel}
            </span>
          </div>
          <button className="sidebar-collapse-trigger" onClick={toggleSidebar} title="Recolher / Expandir Menu">
            {isCollapsed ? '›' : '‹'}
          </button>
        </div>

        <div className="marketplace-segmented-box">
          <span className="segmented-label">Canal Selecionado</span>
          <div className="segmented-control">
            <button 
              className={`seg-btn ${currentMarketplace === 'ml' ? 'active' : ''}`}
              data-mp="ml"
              onClick={() => setMarketplace('ml')}
            >
              <span className="dot-indicator dot-ml"></span>
              <span className="nav-text">ML</span>
            </button>
            <button 
              className={`seg-btn ${currentMarketplace === 'shopee' ? 'active' : ''}`}
              data-mp="shopee"
              onClick={() => setMarketplace('shopee')}
            >
              <span className="dot-indicator dot-shopee"></span>
              <span className="nav-text">Shopee</span>
            </button>
            <button 
              className={`seg-btn ${currentMarketplace === 'tiktok' ? 'active' : ''}`}
              data-mp="tiktok"
              onClick={() => setMarketplace('tiktok')}
            >
              <span className="dot-indicator dot-tiktok"></span>
              <span className="nav-text">TikTok</span>
            </button>
          </div>
        </div>

        <nav className="sidebar-nav-container">
          <div className="nav-group-title">DIAGNÓSTICO E AÇÕES</div>
          {NAV_ITEMS.slice(0, 4).map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              className={`nav-tab ${activeTab === id ? 'active' : ''}`}
              onClick={() => setActiveTab(id)}
              title={label}
            >
              <Icon size={18} />
              <span className="nav-text">{label}</span>
            </button>
          ))}

          <div className="nav-group-title">FERRAMENTAS E MODELOS</div>
          {NAV_ITEMS.slice(4).map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              className={`nav-tab ${activeTab === id ? 'active' : ''}`}
              onClick={() => setActiveTab(id)}
              title={label}
            >
              <Icon size={18} />
              <span className="nav-text">{label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* =============================================
          MOBILE BOTTOM TAB BAR (5 most used items)
      ============================================= */}
      <nav className="mobile-bottom-nav">
        {NAV_ITEMS.slice(0, 5).map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            className={`mobile-bottom-tab ${activeTab === id ? 'active' : ''}`}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={20} />
            <span>{label.replace(/^\d+\. /, '')}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
