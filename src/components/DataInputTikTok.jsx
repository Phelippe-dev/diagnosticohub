import React from 'react';
import { Video } from 'lucide-react';
import DateRangeSelector from './DateRangeSelector';
import FormattedInput from './FormattedInput';

export default function DataInputTikTok({ tikTokData, setTikTokData, onSubmitTikTok }) {
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setTikTokData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div id="form-container-tiktok" className="form-container">
      <div className="card" style={{ borderTop: '3px solid var(--tiktok-cyan)' }}>
        <div className="card-header">
          <span className="badge badge-tiktok">TIKTOK SHOP BRASIL PERFORMANCE HUB</span>
          <h2 style={{ marginTop: '0.3rem' }}>Painel de Inserção de Dados do TikTok Shop</h2>
          <p>Diagnóstico alinhado às diretrizes oficiais do TikTok Shop Seller Center Brasil (Shop Performance Score, SLA de Despacho 48h, Affiliate Center e GMV Max Ads).</p>
        </div>

        <form onSubmit={onSubmitTikTok}>
          {/* 1. SELETOR DE PERÍODOS ESTILO MARKETPLACE */}
          <DateRangeSelector 
            periodoAtual={tikTokData.tiktok_periodo_atual}
            periodoAnterior={tikTokData.tiktok_periodo_anterior}
            onPeriodChange={(atual, ant) => setTikTokData(prev => ({
              ...prev,
              tiktok_periodo_atual: atual,
              tiktok_periodo_anterior: ant
            }))}
            accentColor="var(--tiktok-cyan)"
          />

          {/* 2. MÉTRICAS GERAIS DE VENDAS */}
          <div className="form-section">
            <h3 className="section-title">
              <span className="step-num">2</span> Métricas Financeiras e GMV TikTok Shop
            </h3>
            <div className="form-grid quad-col">
              <div className="form-group">
                <label>Faturamento Total (GMV R$)</label>
                <div className="input-pair">
                  <FormattedInput type="currency" id="tiktok_fat_atual" value={tikTokData.tiktok_fat_atual} onChange={handleChange} placeholder="Atual (R$)" required />
                  <FormattedInput type="currency" id="tiktok_fat_anterior" value={tikTokData.tiktok_fat_anterior} onChange={handleChange} placeholder="Anterior (R$)" required />
                </div>
                <span className="field-hint">📌 Localize em: Seller Center &gt; Analytics &gt; Sales</span>
              </div>
              <div className="form-group">
                <label>Pedidos Concluídos (Unidades)</label>
                <div className="input-pair">
                  <FormattedInput type="integer" id="tiktok_vendas_atual" value={tikTokData.tiktok_vendas_atual} onChange={handleChange} placeholder="Atual" required />
                  <FormattedInput type="integer" id="tiktok_vendas_anterior" value={tikTokData.tiktok_vendas_anterior} onChange={handleChange} placeholder="Anterior" required />
                </div>
              </div>
              <div className="form-group">
                <label>Visualizações de Produto (Impressões/Visitas)</label>
                <div className="input-pair">
                  <FormattedInput type="integer" id="tiktok_visitas_atual" value={tikTokData.tiktok_visitas_atual} onChange={handleChange} placeholder="Atual" required />
                  <FormattedInput type="integer" id="tiktok_visitas_anterior" value={tikTokData.tiktok_visitas_anterior} onChange={handleChange} placeholder="Anterior" required />
                </div>
                <span className="field-hint">📌 Tráfego vindo de Vídeos, Lives e Product Cards.</span>
              </div>
              <div className="form-group">
                <label>Ticket Médio TikTok (R$)</label>
                <div className="input-pair">
                  <FormattedInput type="currency" id="tiktok_ticket_atual" value={tikTokData.tiktok_ticket_atual} onChange={handleChange} placeholder="Atual (R$)" />
                  <FormattedInput type="currency" id="tiktok_ticket_anterior" value={tikTokData.tiktok_ticket_anterior} onChange={handleChange} placeholder="Anterior (R$)" />
                </div>
              </div>
              <div className="form-group">
                <label>Taxa de Conversão Geral (%)</label>
                <div className="input-pair">
                  <FormattedInput type="decimal" id="tiktok_conv_atual" value={tikTokData.tiktok_conv_atual} onChange={handleChange} placeholder="Atual %" />
                  <FormattedInput type="decimal" id="tiktok_conv_anterior" value={tikTokData.tiktok_conv_anterior} onChange={handleChange} placeholder="Anterior %" />
                </div>
              </div>
            </div>
          </div>

          {/* 3. SAÚDE DA LOJA & SLAS OFICIAIS TIKTOK */}
          <div className="form-section">
            <h3 className="section-title">
              <span className="step-num">3</span> Saúde da Loja e SLAs de Operação (Seller Center &gt; Health)
            </h3>
            <div className="form-grid triple-col">
              <div className="form-group">
                <label htmlFor="tiktok_shop_score">Shop Performance Score (0.0 a 5.0)</label>
                <FormattedInput type="decimal" id="tiktok_shop_score" value={tikTokData.tiktok_shop_score} onChange={handleChange} placeholder="Ex: 4,8" />
                <span className="field-hint">📌 Média geral de avaliações, entrega e atendimento do TikTok.</span>
              </div>
              <div className="form-group">
                <label htmlFor="tiktok_late_dispatch">Taxa de Envio Atrasado (SLA 48h)</label>
                <FormattedInput type="decimal" id="tiktok_late_dispatch" value={tikTokData.tiktok_late_dispatch} onChange={handleChange} placeholder="Meta menor que 2,0%" />
                <span className="field-hint">📌 Pedidos despachados após 48 horas da confirmação.</span>
              </div>
              <div className="form-group">
                <label htmlFor="tiktok_seller_cancellation">Taxa de Cancelamento pelo Vendedor</label>
                <FormattedInput type="decimal" id="tiktok_seller_cancellation" value={tikTokData.tiktok_seller_cancellation} onChange={handleChange} placeholder="Meta menor que 1,5%" />
                <span className="field-hint">📌 Cancelamentos por ruptura de estoque ou falha de expedição.</span>
              </div>
              <div className="form-group">
                <label htmlFor="tiktok_violation_points">Pontos de Violação (Violation Points 0 a 48)</label>
                <FormattedInput type="integer" id="tiktok_violation_points" value={tikTokData.tiktok_violation_points} onChange={handleChange} placeholder="Ideal é 0 pontos" />
                <span className="field-hint">📌 Violações de política desativam anúncios e bloqueiam lives.</span>
              </div>
            </div>
          </div>

          {/* 4. TIKTOK ADS, AFILIADOS & MARKETING */}
          <div className="form-section">
            <h3 className="section-title">
              <span className="step-num">4</span> Affiliate Center, Mídia Ads &amp; Live Commerce
            </h3>
            <div className="form-grid quad-col">
              <div className="form-group">
                <label htmlFor="tiktok_ads_ativo">GMV Max Ads Ativo?</label>
                <select id="tiktok_ads_ativo" value={tikTokData.tiktok_ads_ativo} onChange={handleChange} className="select-input">
                  <option value="Sim">Sim (GMV Max / Product Shopping Ads)</option>
                  <option value="Não">Não</option>
                </select>
              </div>
              <div className="form-group">
                <label>ROAS / ROI de Mídia Ads (Atual vs Ant.)</label>
                <div className="input-pair">
                  <FormattedInput type="decimal" id="tiktok_roas_atual" value={tikTokData.tiktok_roas_atual} onChange={handleChange} placeholder="ROAS Atual" />
                  <FormattedInput type="decimal" id="tiktok_roas_anterior" value={tikTokData.tiktok_roas_anterior} onChange={handleChange} placeholder="ROAS Ant." />
                </div>
              </div>
              <div className="form-group">
                <label>GMV Gerado por Mídia Ads (R$)</label>
                <div className="input-pair">
                  <FormattedInput type="currency" id="tiktok_ads_fat_atual" value={tikTokData.tiktok_ads_fat_atual} onChange={handleChange} placeholder="Atual (R$)" />
                  <FormattedInput type="currency" id="tiktok_ads_fat_anterior" value={tikTokData.tiktok_ads_fat_anterior} onChange={handleChange} placeholder="Anterior (R$)" />
                </div>
              </div>
              <div className="form-group">
                <label>Comissão Média de Afiliados (%)</label>
                <FormattedInput type="decimal" id="tiktok_affiliate_commission" value={tikTokData.tiktok_affiliate_commission || 12.0} onChange={handleChange} placeholder="Ex: 12,0%" />
                <span className="field-hint">📌 Oferecida em Seller Center &gt; Affiliate &gt; Open Plan.</span>
              </div>
              <div className="form-group">
                <label>Estratégias Nativas Ativas</label>
                <div className="checkbox-group">
                  <label><input type="checkbox" id="tiktok_tool_affiliate" checked={tikTokData.tiktok_tool_affiliate} onChange={handleChange} /> Programa de Afiliados (Open Plan / Targeted)</label>
                  <label><input type="checkbox" id="tiktok_tool_live" checked={tikTokData.tiktok_tool_live} onChange={handleChange} /> Transmissões LIVE Shopping Semanais</label>
                  <label><input type="checkbox" id="tiktok_tool_samples" checked={tikTokData.tiktok_tool_samples} onChange={handleChange} /> Envio de Amostras Grátis (Samples)</label>
                  <label><input type="checkbox" id="tiktok_tool_flash" checked={tikTokData.tiktok_tool_flash} onChange={handleChange} /> Flash Sale em Live Stream</label>
                  <label><input type="checkbox" id="tiktok_tool_freeshipping" checked={tikTokData.tiktok_tool_freeshipping ?? true} onChange={handleChange} /> Frete Grátis Coparticipado TikTok (6%)</label>
                </div>
              </div>
            </div>
          </div>

          {/* 5. TOP PRODUTOS CAMPEÕES */}
          <div className="form-section">
            <h3 className="section-title">
              <span className="step-num">5</span> Produtos Campeões no TikTok Shop (Content &amp; Catalog)
            </h3>
            <div className="form-grid dual-col">
              <div className="form-group">
                <label>Produto Curva A (Maior Volume TikTok)</label>
                <input type="text" id="tiktok_prod_a_nome" value={tikTokData.tiktok_prod_a_nome} onChange={handleChange} placeholder="Ex: Escova Alisadora Multifuncional" />
                <div className="input-pair" style={{ marginTop: '0.4rem' }}>
                  <FormattedInput type="integer" id="tiktok_prod_a_atual" value={tikTokData.tiktok_prod_a_atual} onChange={handleChange} placeholder="Unidades Atual" />
                  <FormattedInput type="integer" id="tiktok_prod_a_anterior" value={tikTokData.tiktok_prod_a_anterior} onChange={handleChange} placeholder="Unidades Anterior" />
                </div>
              </div>
              <div className="form-group">
                <label>Produto Curva B (Segundo Maior TikTok)</label>
                <input type="text" id="tiktok_prod_b_nome" value={tikTokData.tiktok_prod_b_nome} onChange={handleChange} placeholder="Ex: Sérum Facial Clareador Vitamina C" />
                <div className="input-pair" style={{ marginTop: '0.4rem' }}>
                  <FormattedInput type="integer" id="tiktok_prod_b_atual" value={tikTokData.tiktok_prod_b_atual} onChange={handleChange} placeholder="Unidades Atual" />
                  <FormattedInput type="integer" id="tiktok_prod_b_anterior" value={tikTokData.tiktok_prod_b_anterior} onChange={handleChange} placeholder="Unidades Anterior" />
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-tiktok btn-large" style={{ width: '100%' }}>
            <Video size={18} />
            Gerar Diagnóstico TikTok Shop, Causa Raiz e Plano 5W2H
          </button>
        </form>
      </div>
    </div>
  );
}
