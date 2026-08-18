import React, { useState } from 'react';
import { FileSpreadsheet, Upload, Download, CheckCircle2, AlertCircle, X, FileText } from 'lucide-react';
import { parseCsvText, mapCsvToMarketplaceData, downloadCsvTemplate } from '../utils/csvImporter';

export default function FileImportModal({ isOpen, onClose, onImportData, currentMarketplace }) {
  const [selectedMarketplace, setSelectedMarketplace] = useState(currentMarketplace || 'ml');
  const [pastedText, setPastedText] = useState('');
  const [fileName, setFileName] = useState('');
  const [previewData, setPreviewData] = useState(null);
  const [statusMsg, setStatusMsg] = useState(null);

  if (!isOpen) return null;

  const channelLabel = selectedMarketplace === 'tiktok' ? 'TikTok Shop' : (selectedMarketplace === 'shopee' ? 'Shopee' : 'Mercado Livre');
  const accentColor = selectedMarketplace === 'tiktok' ? 'var(--tiktok-cyan)' : (selectedMarketplace === 'shopee' ? 'var(--shopee-orange)' : 'var(--ml-yellow)');

  const processContent = (text, name = '') => {
    if (!text.trim()) {
      setPreviewData(null);
      setStatusMsg({ type: 'warning', text: 'Nenhum conteúdo detectado para parsing.' });
      return;
    }

    try {
      const parsedMap = parseCsvText(text);
      const mappedResult = mapCsvToMarketplaceData(parsedMap, selectedMarketplace);
      setPreviewData(mappedResult);
      setFileName(name);
      setStatusMsg({ type: 'success', text: 'Planilha lida com sucesso! Confira os dados abaixo antes de importar.' });
    } catch (err) {
      setStatusMsg({ type: 'danger', text: `Erro ao ler planilha: ${err.message}` });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setPastedText(content);
        processContent(content, file.name);
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleTextChange = (e) => {
    const val = e.target.value;
    setPastedText(val);
    if (val.trim()) {
      processContent(val, 'Texto/Tabela Colada');
    } else {
      setPreviewData(null);
      setStatusMsg(null);
    }
  };

  const handleApply = () => {
    if (!previewData) return;
    onImportData(previewData, selectedMarketplace);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(5, 8, 15, 0.85)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="modal-card card" onClick={e => e.stopPropagation()} style={{
        maxWidth: '750px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        borderRadius: 'var(--radius)',
        border: `1px solid ${accentColor}40`,
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
      }}>
        {/* CABEÇALHO */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: `${accentColor}20`, padding: '0.5rem', borderRadius: 'var(--radius-sm)', color: accentColor }}>
              <FileSpreadsheet size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: '#fff' }}>Importação Automática de Planilhas</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>Preencha os dados do {channelLabel} via arquivo CSV/Excel sem digitação manual</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* SELETOR DE CANAL & BOTÃO DOWNLOAD MODELO */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.2rem', background: 'rgba(255,255,255,0.03)', padding: '0.8rem 1rem', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Canal Alvo:</span>
            <div className="segmented-control" style={{ maxWidth: 260 }}>
              <button className={`seg-btn ${selectedMarketplace === 'ml' ? 'active' : ''}`} onClick={() => setSelectedMarketplace('ml')}>ML</button>
              <button className={`seg-btn ${selectedMarketplace === 'shopee' ? 'active' : ''}`} onClick={() => setSelectedMarketplace('shopee')}>Shopee</button>
              <button className={`seg-btn ${selectedMarketplace === 'tiktok' ? 'active' : ''}`} onClick={() => setSelectedMarketplace('tiktok')}>TikTok</button>
            </div>
          </div>

          <button 
            type="button" 
            className="btn btn-outline btn-sm" 
            onClick={() => downloadCsvTemplate(selectedMarketplace)}
            style={{ fontSize: '0.8rem', gap: '5px' }}
          >
            <Download size={14} /> Baixar Modelo CSV ({channelLabel})
          </button>
        </div>

        {/* ÁREA DE UPLOAD / DRAG & DROP */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.2rem' }}>
          {/* UPLOAD DE ARQUIVO */}
          <label style={{
            border: `2px dashed ${accentColor}60`,
            borderRadius: 'var(--radius-sm)',
            padding: '1.2rem',
            textAlign: 'center',
            cursor: 'pointer',
            background: 'rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'border-color 0.2s'
          }}>
            <Upload size={24} color={accentColor} />
            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff' }}>Selecionar Arquivo CSV / TXT</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Arraste ou clique para carregar</span>
            <input type="file" accept=".csv, .txt, .tsv" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>

          {/* COLAR TEXTO */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Ou cole dados copiados do Excel / Bloco de Notas:</label>
            <textarea
              rows={4}
              placeholder="Cole aqui o texto ou linhas da sua planilha..."
              value={pastedText}
              onChange={handleTextChange}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 'var(--radius-sm)',
                color: '#fff',
                padding: '0.6rem',
                fontSize: '0.8rem',
                fontFamily: 'monospace',
                resize: 'none'
              }}
            />
          </div>
        </div>

        {/* MENSAGEM DE STATUS */}
        {statusMsg && (
          <div style={{
            padding: '0.6rem 1rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1rem',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: statusMsg.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${statusMsg.type === 'success' ? 'var(--success)' : 'var(--danger)'}`,
            color: '#fff'
          }}>
            {statusMsg.type === 'success' ? <CheckCircle2 size={16} color="var(--success)" /> : <AlertCircle size={16} color="var(--danger)" />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* PRÉ-VISUALIZAÇÃO TABULAR */}
        {previewData && (
          <div style={{ marginBottom: '1.2rem', background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileText size={15} color={accentColor} /> Dados Identificados ({channelLabel})
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.6rem', maxHeight: '180px', overflowY: 'auto' }}>
              {Object.entries(previewData).map(([key, val]) => (
                val !== '' && (
                  <div key={key} style={{ background: 'rgba(255,255,255,0.04)', padding: '0.4rem 0.6rem', borderRadius: '4px', borderLeft: `2px solid ${accentColor}` }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{key.replace(/^(shopee_|tiktok_)/, '').replace(/_/g, ' ')}</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff' }}>{String(val)}</div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* BOTÕES DE AÇÃO DO MODAL */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', paddingTop: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button className="btn btn-outline" onClick={onClose}>Cancelar</button>
          <button 
            className="btn btn-primary" 
            disabled={!previewData}
            onClick={handleApply}
            style={{ background: accentColor, color: selectedMarketplace === 'ml' ? '#0b0e14' : '#fff', fontWeight: '800' }}
          >
            <CheckCircle2 size={16} /> Confirmar e Preencher Formulário
          </button>
        </div>
      </div>
    </div>
  );
}
