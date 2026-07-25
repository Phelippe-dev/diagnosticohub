import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, X, Lightbulb, CheckCircle, AlertTriangle, ArrowRight, Globe, RefreshCw } from 'lucide-react';
import { generateAccountDiagnosis } from '../services/geminiService';

export default function GeminiCopilotModal({ 
  isOpen, 
  onClose, 
  metrics, 
  diagnosis, 
  currentMarketplace, 
  mlData, 
  shopeeData,
  tikTokData,
  onApplyPlan 
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isShopee = currentMarketplace === 'shopee';
  const isTikTok = currentMarketplace === 'tiktok';
  const channelName = isShopee ? 'Shopee' : (isTikTok ? 'TikTok Shop' : 'Mercado Livre');
  const accentColor = isShopee ? 'var(--shopee-orange)' : (isTikTok ? '#ff0050' : 'var(--ml-yellow)');

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    setLoadingStep('Conectando à IA Gemini e pesquisando fontes web de confiança...');

    try {
      setTimeout(() => setLoadingStep(`Analisando métricas de ACOS/Conversão e comparando com Seller Center ${channelName}...`), 1200);
      setTimeout(() => setLoadingStep('Sintetizando recomendações táticas para o Plano 5W2H...'), 2500);

      const result = await generateAccountDiagnosis({
        metrics,
        currentMarketplace,
        mlData,
        shopeeData,
        tikTokData
      });

      setAiAnalysis(result);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Falha ao consultar a IA Gemini. Verifique a conexão com a API.');
    } finally {
      setIsGenerating(false);
      setLoadingStep('');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="card" style={{ maxWidth: '720px', width: '100%', borderTop: `4px solid ${accentColor}`, maxHeight: '92vh', overflowY: 'auto' }}>
        
        {/* CABEÇALHO */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: accentColor, color: '#0b0e14', padding: '8px', borderRadius: '8px', display: 'flex' }}>
              <Bot size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Gemini IA Copilot - Diagnóstico de Alta Precisão ({channelName})</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Inteligência Artificial conectada às bases web e benchmarks oficiais</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.82rem' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {!aiAnalysis ? (
          <div style={{ padding: '1.25rem 0', textAlign: 'center' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.6' }}>
              A IA Gemini irá ler individualmente cada dado da sua conta no <strong style={{ color: '#fff' }}>{channelName}</strong> (faturamento, conversão, ACOS/CIR, ticket médio e atrasos) e buscar o diagnóstico exato cruzando com benchmarks de mercado e documentações oficiais da web.
            </p>

            <button 
              className={`btn ${isShopee ? 'btn-shopee' : 'btn-yellow'} btn-large`}
              onClick={handleGenerateAI}
              disabled={isGenerating}
              style={{ margin: '0 auto', maxWidth: '380px' }}
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={18} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Gerando Diagnóstico em Tempo Real...</span>
                </>
              ) : (
                <><Sparkles size={18} /> Gerar Diagnóstico com IA & Web Search</>
              )}
            </button>

            {isGenerating && (
              <p style={{ fontSize: '0.78rem', color: accentColor, marginTop: '0.75rem', fontStyle: 'italic' }}>
                {loadingStep}
              </p>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* BOX DIAGNÓSTICO EXECUTIVO */}
            <div className="smart-box" style={{ background: isShopee ? 'var(--shopee-orange-bg)' : 'var(--ml-yellow-bg)', borderColor: isShopee ? 'var(--shopee-orange-border)' : 'var(--ml-yellow-border)' }}>
              <div className="smart-title" style={{ color: accentColor, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} /> Diagnóstico Executivo da IA Gemini
              </div>
              <p style={{ fontSize: '0.88rem', color: '#fff', marginTop: '0.4rem', lineHeight: '1.6' }}>
                {aiAnalysis.summaryText}
              </p>

              {aiAnalysis.marketBenchmark && (
                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed rgba(255,255,255,0.15)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  📊 <strong style={{ color: '#fff' }}>Benchmark de Mercado:</strong> {aiAnalysis.marketBenchmark}
                </div>
              )}
            </div>

            {/* CAUSAS RAIZ */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={16} color="var(--warning)" /> Gargalos Principais Identificados pela IA:
              </h4>
              <ul className="smart-list" style={{ paddingLeft: '0.5rem' }}>
                {aiAnalysis.keyCauses?.map((cause, idx) => (
                  <li key={idx} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--warning)' }}>•</span> <span>{cause}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* AÇÕES TÁTICAS PRIORITÁRIAS */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lightbulb size={16} color={accentColor} /> Recomendações Táticas da IA:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {aiAnalysis.smartActions?.map((action, idx) => (
                  <div key={idx} style={{ padding: '0.6rem 0.85rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.84rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={16} color="var(--success)" style={{ flexShrink: 0 }} />
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FONTES E DOCUMENTAÇÕES WEB CONSULTADAS */}
            {aiAnalysis.webSources && aiAnalysis.webSources.length > 0 && (
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Globe size={14} color={accentColor} /> Fontes Web Confiáveis e Benchmarks Consultados:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {aiAnalysis.webSources.map((src, idx) => (
                    <span key={idx} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '3px 8px', borderRadius: '12px', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      🌐 {src}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* BOTÕES DE AÇÃO */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '0.75rem' }}>
              <button className="btn btn-outline" onClick={() => setAiAnalysis(null)}>Reanalisar</button>
              <button className={`btn ${isShopee ? 'btn-shopee' : 'btn-yellow'}`} onClick={() => { onApplyPlan(); onClose(); }}>
                Aplicar no Plano 5W2H <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
