import React, { useState } from 'react';

export default function ActionPlan({ actions }) {
  const [completedItems, setCompletedItems] = useState({});

  const handleToggle = (id) => {
    setCompletedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCheckAll = () => {
    const all = {};
    [...actions.high, ...actions.medium, ...actions.strategic].forEach((item, idx) => {
      all[`item-${idx}-${item.title}`] = true;
    });
    setCompletedItems(all);
  };

  const handleUncheckAll = () => {
    setCompletedItems({});
  };

  const allList = [...actions.high, ...actions.medium, ...actions.strategic];
  const total = allList.length;
  const count = Object.values(completedItems).filter(Boolean).length;
  const pct = total > 0 ? (count / total) * 100 : 0;

  const renderList = (items, categoryKey) => {
    return items.map((item, idx) => {
      const itemId = `item-${categoryKey}-${idx}-${item.title}`;
      const isDone = !!completedItems[itemId];

      return (
        <div className={`action-item ${isDone ? 'completed' : ''}`} key={itemId}>
          <input 
            type="checkbox" 
            className="action-checkbox" 
            checked={isDone} 
            onChange={() => handleToggle(itemId)} 
          />
          <div className="action-content">
            <div className="action-title">{item.title}</div>
            <div className="action-desc">{item.desc}</div>
            <div className="action-meta">{item.meta}</div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="tab-panel">
      <div className="actions-header-card">
        <div>
          <h2>Plano de Ação Personalizado para Restauração & Escala</h2>
          <p>Ações organizadas por prazo de impacto para estancar perdas e recuperar faturamento.</p>
        </div>
        <div className="actions-progress-box">
          <div className="actions-buttons-row">
            <button className="btn btn-outline btn-sm" onClick={handleCheckAll}>Marcar Todas</button>
            <button className="btn btn-outline btn-sm" onClick={handleUncheckAll}>Desmarcar</button>
          </div>
          <div className="progress-outer" style={{ marginTop: '0.3rem' }}>
            <div className="progress-inner" style={{ width: `${pct}%` }}></div>
          </div>
          <span className="progress-text">{count} de {total} concluídas ({pct.toFixed(0)}%)</span>
        </div>
      </div>

      <div className="action-category category-high">
        <div className="category-header">
          <div className="badge badge-danger">PRIORIDADE ALTA</div>
          <h3>Ações Emergenciais (Próximas 24 - 48h)</h3>
          <span className="category-subtitle">Objetivo: Estancar a sangria de vendas e proteger reputação/SLAs imediatamente</span>
        </div>
        <div className="action-list">
          {renderList(actions.high, 'high')}
        </div>
      </div>

      <div className="action-category category-medium">
        <div className="category-header">
          <div className="badge badge-warning">PRIORIDADE MÉDIA</div>
          <h3>Otimização Tática (3 a 7 dias)</h3>
          <span className="category-subtitle">Objetivo: Otimizar conversão, SEO, cupons e gestão de tráfego pago</span>
        </div>
        <div className="action-list">
          {renderList(actions.medium, 'med')}
        </div>
      </div>

      <div className="action-category category-strategic">
        <div className="category-header">
          <div className="badge badge-info">PRIORIDADE ESTRATÉGICA</div>
          <h3>Escala & Longo Prazo (Escala de Margem & Retenção)</h3>
          <span className="category-subtitle">Objetivo: Expansão da curva A, programa de afiliados, lives e recorrência</span>
        </div>
        <div className="action-list">
          {renderList(actions.strategic, 'strat')}
        </div>
      </div>
    </div>
  );
}
