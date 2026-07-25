import React from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

export default function ExecutiveDashboard({ metrics, currentMarketplace }) {
  // Formatadores PT-BR padronizados com separador de milhar (.) e decimal (,)
  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  const formatNumber = (val) => new Intl.NumberFormat('pt-BR').format(Math.round(val || 0));
  const formatPercentVal = (val) => (val || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';
  const formatDeltaPercent = (val) => {
    const formatted = Math.abs(val || 0).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%';
    return (val || 0) >= 0 ? `+${formatted}` : `-${formatted}`;
  };

  const getBadgeClass = (delta) => {
    if (delta > 0) return 'metric-badge badge-up';
    if (delta < 0) return 'metric-badge badge-down';
    return 'metric-badge badge-neutral';
  };

  const acosBadgeClass = metrics.acosDelta > 0 
    ? 'metric-badge badge-down' 
    : (metrics.acosDelta < 0 ? 'metric-badge badge-up' : 'metric-badge badge-neutral');

  const acosBadgeText = metrics.acosDelta > 0 
    ? `+${metrics.acosDelta.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}% (Piorou)` 
    : (metrics.acosDelta < 0 ? `${metrics.acosDelta.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}% (Melhorou)` : 'Estável');

  const comparisonData = [
    { name: 'Faturamento (R$)', Anterior: metrics.fatAnterior, Atual: metrics.fatAtual },
    { name: 'Vendas (Un)', Anterior: metrics.vendasAnterior, Atual: metrics.vendasAtual },
    { name: 'Visitas (x10)', Anterior: Math.round(metrics.visitasAnterior / 10), Atual: Math.round(metrics.visitasAtual / 10) },
  ];

  const funnelData = [
    { name: 'Período Anterior', Conversao: parseFloat(metrics.convAnterior.toFixed(2)) },
    { name: 'Período Atual', Conversao: parseFloat(metrics.convAtual.toFixed(2)) },
  ];

  const primaryColor = currentMarketplace === 'tiktok' ? '#00f2fe' : (currentMarketplace === 'shopee' ? '#ff5722' : '#ffd600');
  const adsTitle = currentMarketplace === 'tiktok' ? 'ROAS GMV Max Ads' : (currentMarketplace === 'shopee' ? 'CIR Shopee Ads (%)' : 'ACOS Mercado Ads (%)');
  const adsUnit = currentMarketplace === 'tiktok' ? 'x' : '%';

  return (
    <div className="tab-panel">
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Faturamento Total</span>
            <span className={getBadgeClass(metrics.fatDelta)}>{formatDeltaPercent(metrics.fatDelta)}</span>
          </div>
          <div className="metric-value">{formatCurrency(metrics.fatAtual)}</div>
          <div className="metric-sub">Anterior: {formatCurrency(metrics.fatAnterior)}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Vendas (Unidades)</span>
            <span className={getBadgeClass(metrics.vendasDelta)}>{formatDeltaPercent(metrics.vendasDelta)}</span>
          </div>
          <div className="metric-value">{formatNumber(metrics.vendasAtual)} un</div>
          <div className="metric-sub">Anterior: {formatNumber(metrics.vendasAnterior)} un</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Visitas Totais</span>
            <span className={getBadgeClass(metrics.visitasDelta)}>{formatDeltaPercent(metrics.visitasDelta)}</span>
          </div>
          <div className="metric-value">{formatNumber(metrics.visitasAtual)}</div>
          <div className="metric-sub">Anterior: {formatNumber(metrics.visitasAnterior)}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Taxa de Conversão</span>
            <span className={getBadgeClass(metrics.convDelta)}>{formatDeltaPercent(metrics.convDelta)}</span>
          </div>
          <div className="metric-value">{formatPercentVal(metrics.convAtual)}</div>
          <div className="metric-sub">Anterior: {formatPercentVal(metrics.convAnterior)}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Ticket Médio</span>
            <span className={getBadgeClass(metrics.ticketDelta)}>{formatDeltaPercent(metrics.ticketDelta)}</span>
          </div>
          <div className="metric-value">{formatCurrency(metrics.ticketAtual)}</div>
          <div className="metric-sub">Anterior: {formatCurrency(metrics.ticketAnterior)}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">{adsTitle}</span>
            <span className={acosBadgeClass}>{acosBadgeText}</span>
          </div>
          <div className="metric-value">{(metrics.acosAtual || 0).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}{adsUnit}</div>
          <div className="metric-sub">Anterior: {(metrics.acosAnterior || 0).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}{adsUnit}</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="card">
          <div className="card-header">
            <h3>Comparativo Geral: Período Atual vs. Anterior</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ background: '#0e121b', borderColor: 'rgba(255,255,255,0.1)', color: '#f8fafc' }}
                  formatter={(value, name) => [typeof value === 'number' ? value.toLocaleString('pt-BR') : value, name]} 
                />
                <Legend wrapperStyle={{ color: '#94a3b8' }} />
                <Bar dataKey="Anterior" fill="rgba(148, 163, 184, 0.4)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Atual" fill={primaryColor} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Funil de Vendas: Visitas vs. Conversão (%)</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={funnelData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ background: '#0e121b', borderColor: 'rgba(255,255,255,0.1)', color: '#f8fafc' }}
                  formatter={(value) => [`${(value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`, 'Taxa de Conversão']}
                />
                <Legend wrapperStyle={{ color: '#94a3b8' }} />
                <Line type="monotone" dataKey="Conversao" name="Taxa de Conversão (%)" stroke={primaryColor} strokeWidth={3} dot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
