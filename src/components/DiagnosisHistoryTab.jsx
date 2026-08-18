import React, { useState, useEffect } from 'react';
import { 
  History, 
  Save, 
  Trash2, 
  FolderOutput, 
  ArrowRightLeft, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  ShoppingBag, 
  Video,
  X,
  PlusCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { getSavedDiagnoses, saveDiagnosisSnapshot, deleteDiagnosisSnapshot, clearAllDiagnoses } from '../utils/diagnosisHistory';

export default function DiagnosisHistoryTab({ 
  currentMarketplace, 
  metrics, 
  diagnosis, 
  mlData, 
  shopeeData, 
  tikTokData,
  onLoadSnapshot,
  onGoToDashboard
}) {
  const [history, setHistory] = useState([]);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [compareIdA, setCompareIdA] = useState('');
  const [compareIdB, setCompareIdB] = useState('');
  const [successToast, setSuccessToast] = useState('');

  useEffect(() => {
    setHistory(getSavedDiagnoses());
  }, []);

  const handleSaveCurrent = (e) => {
    e?.preventDefault();
    const activeFormData = currentMarketplace === 'shopee' ? shopeeData : (currentMarketplace === 'tiktok' ? tikTokData : mlData);
    const title = customTitle.trim() || `Diagnóstico ${currentMarketplace.toUpperCase()} - ${new Date().toLocaleDateString('pt-BR')}`;
    
    try {
      saveDiagnosisSnapshot(title, currentMarketplace, metrics, diagnosis, activeFormData);
      setHistory(getSavedDiagnoses());
      setCustomTitle('');
      setSaveModalOpen(false);
      showToast('Diagnóstico salvo no histórico com sucesso!');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir esta auditoria do histórico?')) {
      const updated = deleteDiagnosisSnapshot(id);
      setHistory(updated);
      showToast('Auditoria removida do histórico.');
    }
  };

  const handleClearAll = () => {
    if (confirm('Atenção: Isso irá apagar TODO o histórico de diagnósticos salvos localmente. Confirmar?')) {
      clearAllDiagnoses();
      setHistory([]);
      showToast('Todo o histórico foi limpo.');
    }
  };

  const handleRestore = (item) => {
    onLoadSnapshot(item.formData, item.marketplace);
    showToast(`Diagnóstico "${item.title}" carregado com sucesso!`);
    if (onGoToDashboard) onGoToDashboard();
  };

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const formatBRL = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

  const getChannelBadge = (mp) => {
    if (mp === 'shopee') return <span className="badge badge-shopee"><ShoppingBag size={12} /> Shopee</span>;
    if (mp === 'tiktok') return <span className="badge badge-tiktok"><Video size={12} /> TikTok</span>;
    return <span className="badge badge-ml"><Zap size={12} /> Mercado Livre</span>;
  };

  const itemA = history.find(i => i.id === compareIdA);
  const itemB = history.find(i => i.id === compareIdB);

  return (
    <div id="tab-history" className="tab-panel">
      {/* TOAST DE SUCESSO */}
      {successToast && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: 'var(--success)',
          color: '#000',
          padding: '0.8rem 1.2rem',
          borderRadius: 'var(--radius-sm)',
          fontWeight: '800',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={18} /> {successToast}
        </div>
      )}

      {/* CARD PRINCIPAL */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <History size={24} color="var(--primary)" /> Histórico de Auditorias Salvas
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Gerencie auditorias passadas da sua conta e compare a evolução temporal das métricas.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-primary" 
              onClick={() => setSaveModalOpen(true)}
              style={{ fontWeight: '800', gap: '6px' }}
            >
              <Save size={16} /> Salvar Auditoria Atual
            </button>

            {history.length >= 2 && (
              <button 
                className="btn btn-outline" 
                onClick={() => setCompareModalOpen(true)}
                style={{ gap: '6px' }}
              >
                <ArrowRightLeft size={16} /> Comparar Auditorias
              </button>
            )}

            {history.length > 0 && (
              <button 
                className="btn btn-outline" 
                onClick={handleClearAll}
                style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: 'var(--danger)', gap: '6px' }}
              >
                <Trash2 size={16} /> Limpar Histórico
              </button>
            )}
          </div>
        </div>

        {/* LISTA DE CARDS SALVOS */}
        {history.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem 1.5rem',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: 'var(--radius)',
            border: '2px dashed rgba(255,255,255,0.08)'
          }}>
            <History size={48} color="var(--text-secondary)" style={{ opacity: 0.4, marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '0.5rem' }}>Nenhum diagnóstico salvo ainda</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
              Clique no botão acima para salvar um instantâneo do diagnóstico atual da sua conta e acompanhar a evolução dos seus resultados.
            </p>
            <button className="btn btn-primary" onClick={() => setSaveModalOpen(true)}>
              <PlusCircle size={16} /> Salvar Primeiro Diagnóstico
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '1.2rem' }}>
            {history.map(item => (
              <div key={item.id} className="card" style={{
                background: 'rgba(15, 23, 42, 0.6)',
                borderLeft: `5px solid ${item.diagnosis.statusLevel === 'danger' ? 'var(--danger)' : (item.diagnosis.statusLevel === 'warning' ? 'var(--warning)' : 'var(--success)')}`,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    {getChannelBadge(item.marketplace)}
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} /> {item.dateFormatted}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#fff', marginBottom: '0.4rem' }}>
                    {item.title}
                  </h3>

                  <div style={{ fontSize: '0.82rem', color: item.diagnosis.statusLevel === 'danger' ? 'var(--danger)' : (item.diagnosis.statusLevel === 'warning' ? 'var(--warning)' : 'var(--success)'), fontWeight: '700', marginBottom: '0.8rem' }}>
                    {item.diagnosis.mainPainPoint}
                  </div>

                  {/* RESUMO DAS MÉTRICAS SALVAS */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.6rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Faturamento Atual</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#fff' }}>{formatBRL(item.metrics.fatAtual)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Variação (Δ%)</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '800', color: item.metrics.fatDelta >= 0 ? 'var(--success)' : 'var(--danger)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                        {item.metrics.fatDelta >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {item.metrics.fatDelta >= 0 ? '+' : ''}{item.metrics.fatDelta.toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Conversão</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff' }}>{item.metrics.convAtual.toFixed(2)}%</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Vendas (Unidades)</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff' }}>{item.metrics.vendasAtual} un</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.6rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <button 
                    className="btn btn-sm btn-primary" 
                    onClick={() => handleRestore(item)}
                    style={{ flex: 1, fontSize: '0.8rem', gap: '4px' }}
                  >
                    <FolderOutput size={14} /> Carregar no Painel
                  </button>

                  <button 
                    className="btn btn-sm btn-outline" 
                    onClick={() => handleDelete(item.id)}
                    style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: 'var(--danger)' }}
                    title="Excluir"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL PARA SALVAR DIAGNÓSTICO */}
      {saveModalOpen && (
        <div className="modal-overlay" onClick={() => setSaveModalOpen(false)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(5,8,15,0.85)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
        }}>
          <div className="card" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px', width: '100%', borderRadius: 'var(--radius)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Save size={18} color="var(--primary)" /> Salvar Diagnóstico Atual
              </h3>
              <button onClick={() => setSaveModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCurrent}>
              <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                <label style={{ color: '#fff', fontSize: '0.88rem', fontWeight: '600', marginBottom: '0.4rem', display: 'block' }}>Título do Diagnóstico</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder={`Ex: Auditoria ${currentMarketplace.toUpperCase()} - Agosto`}
                  value={customTitle}
                  onChange={e => setCustomTitle(e.target.value)}
                  autoFocus
                  style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setSaveModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" style={{ fontWeight: '800' }}>Salvar Agora</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE COMPARATIVO DE 2 AUDITORIAS */}
      {compareModalOpen && (
        <div className="modal-overlay" onClick={() => setCompareModalOpen(false)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(5,8,15,0.88)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
        }}>
          <div className="card" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', width: '100%', maxHeight: '90vh', overflowY: 'auto', borderRadius: 'var(--radius)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ArrowRightLeft size={20} color="var(--primary)" /> Comparativo Temporal de Auditorias
              </h3>
              <button onClick={() => setCompareModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* SELETORES DOS DIAGNÓSTICOS PARA COMPARAR */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', display: 'block' }}>Auditoria A (Base):</label>
                <select 
                  className="form-control"
                  value={compareIdA} 
                  onChange={e => setCompareIdA(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 'var(--radius-sm)' }}
                >
                  <option value="">-- Selecione a primeira auditoria --</option>
                  {history.map(h => (
                    <option key={h.id} value={h.id}>{h.title} ({h.dateFormatted})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', display: 'block' }}>Auditoria B (Evolução):</label>
                <select 
                  className="form-control"
                  value={compareIdB} 
                  onChange={e => setCompareIdB(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 'var(--radius-sm)' }}
                >
                  <option value="">-- Selecione a segunda auditoria --</option>
                  {history.map(h => (
                    <option key={h.id} value={h.id}>{h.title} ({h.dateFormatted})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* TABELA COMPARATIVA LADO A LADO */}
            {itemA && itemB ? (
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                      <th style={{ padding: '0.6rem', color: 'var(--text-secondary)' }}>Métrica</th>
                      <th style={{ padding: '0.6rem', color: '#fff' }}>{itemA.title}</th>
                      <th style={{ padding: '0.6rem', color: '#fff' }}>{itemB.title}</th>
                      <th style={{ padding: '0.6rem', color: 'var(--text-secondary)' }}>Evolução (Δ)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '0.6rem', color: 'var(--text-secondary)' }}>Faturamento</td>
                      <td style={{ padding: '0.6rem', fontWeight: '700' }}>{formatBRL(itemA.metrics.fatAtual)}</td>
                      <td style={{ padding: '0.6rem', fontWeight: '700' }}>{formatBRL(itemB.metrics.fatAtual)}</td>
                      <td style={{ padding: '0.6rem', fontWeight: '800', color: itemB.metrics.fatAtual >= itemA.metrics.fatAtual ? 'var(--success)' : 'var(--danger)' }}>
                        {formatBRL(itemB.metrics.fatAtual - itemA.metrics.fatAtual)}
                      </td>
                    </tr>

                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '0.6rem', color: 'var(--text-secondary)' }}>Conversão (%)</td>
                      <td style={{ padding: '0.6rem', fontWeight: '700' }}>{itemA.metrics.convAtual.toFixed(2)}%</td>
                      <td style={{ padding: '0.6rem', fontWeight: '700' }}>{itemB.metrics.convAtual.toFixed(2)}%</td>
                      <td style={{ padding: '0.6rem', fontWeight: '800', color: itemB.metrics.convAtual >= itemA.metrics.convAtual ? 'var(--success)' : 'var(--danger)' }}>
                        {(itemB.metrics.convAtual - itemA.metrics.convAtual).toFixed(2)}%
                      </td>
                    </tr>

                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '0.6rem', color: 'var(--text-secondary)' }}>Vendas (Unidades)</td>
                      <td style={{ padding: '0.6rem', fontWeight: '700' }}>{itemA.metrics.vendasAtual}</td>
                      <td style={{ padding: '0.6rem', fontWeight: '700' }}>{itemB.metrics.vendasAtual}</td>
                      <td style={{ padding: '0.6rem', fontWeight: '800', color: itemB.metrics.vendasAtual >= itemA.metrics.vendasAtual ? 'var(--success)' : 'var(--danger)' }}>
                        {itemB.metrics.vendasAtual - itemA.metrics.vendasAtual} un
                      </td>
                    </tr>

                    <tr>
                      <td style={{ padding: '0.6rem', color: 'var(--text-secondary)' }}>Diagnóstico do Risco</td>
                      <td style={{ padding: '0.6rem', fontSize: '0.8rem', color: itemA.diagnosis.statusLevel === 'danger' ? 'var(--danger)' : 'var(--success)' }}>{itemA.diagnosis.mainPainPoint}</td>
                      <td style={{ padding: '0.6rem', fontSize: '0.8rem', color: itemB.diagnosis.statusLevel === 'danger' ? 'var(--danger)' : 'var(--success)' }}>{itemB.diagnosis.mainPainPoint}</td>
                      <td style={{ padding: '0.6rem', fontSize: '0.8rem' }}>--</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                Selecione duas auditorias nos campos acima para carregar o comparativo.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
