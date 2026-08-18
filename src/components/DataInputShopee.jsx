import React from 'react';
import { ShoppingBag, FileSpreadsheet } from 'lucide-react';
import DateRangeSelector from './DateRangeSelector';
import FormattedInput from './FormattedInput';

export default function DataInputShopee({ shopeeData, setShopeeData, onSubmitShopee, onOpenImport }) {
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setShopeeData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div id="form-container-shopee" className="form-container">
      <div className="card" style={{ borderTop: '3px solid var(--shopee-orange)' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-shopee">SHOPEE PERFORMANCE HUB</span>
            <h2 style={{ marginTop: '0.3rem' }}>Painel de Inserção de Dados da Shopee</h2>
            <p>Insira os dados da sua loja ou importe via planilha CSV para comparar dois períodos.</p>
          </div>
          {onOpenImport && (
            <button 
              type="button" 
              className="btn btn-outline btn-sm"
              onClick={onOpenImport}
              style={{ gap: '6px', borderColor: 'var(--shopee-orange)', color: 'var(--shopee-orange)' }}
            >
              <FileSpreadsheet size={15} /> Importar Planilha CSV
            </button>
          )}
        </div>

        <form onSubmit={onSubmitShopee}>
          {/* 1. SELETOR DE PERÍODOS ESTILO MARKETPLACE */}
          <DateRangeSelector 
            periodoAtual={shopeeData.shopee_periodo_atual}
            periodoAnterior={shopeeData.shopee_periodo_anterior}
            onPeriodChange={(atual, ant) => setShopeeData(prev => ({
              ...prev,
              shopee_periodo_atual: atual,
              shopee_periodo_anterior: ant
            }))}
            accentColor="var(--shopee-orange)"
          />

          {/* 2. MÉTRICAS GERAIS */}
          <div className="form-section">
            <h3 className="section-title">
              <span className="step-num">2</span> Métricas Financeiras e Vendas Shopee
            </h3>
            <div className="form-grid quad-col">
              <div className="form-group">
                <label>Faturamento Total Shopee (GMV R$)</label>
                <div className="input-pair">
                  <FormattedInput type="currency" id="shopee_fat_atual" value={shopeeData.shopee_fat_atual} onChange={handleChange} placeholder="Atual (R$)" required />
                  <FormattedInput type="currency" id="shopee_fat_anterior" value={shopeeData.shopee_fat_anterior} onChange={handleChange} placeholder="Anterior (R$)" required />
                </div>
              </div>
              <div className="form-group">
                <label>Pedidos / Unidades Concluídas</label>
                <div className="input-pair">
                  <FormattedInput type="integer" id="shopee_vendas_atual" value={shopeeData.shopee_vendas_atual} onChange={handleChange} placeholder="Atual" required />
                  <FormattedInput type="integer" id="shopee_vendas_anterior" value={shopeeData.shopee_vendas_anterior} onChange={handleChange} placeholder="Anterior" required />
                </div>
              </div>
              <div className="form-group">
                <label>Visitas Totais da Loja</label>
                <div className="input-pair">
                  <FormattedInput type="integer" id="shopee_visitas_atual" value={shopeeData.shopee_visitas_atual} onChange={handleChange} placeholder="Atual" required />
                  <FormattedInput type="integer" id="shopee_visitas_anterior" value={shopeeData.shopee_visitas_anterior} onChange={handleChange} placeholder="Anterior" required />
                </div>
              </div>
              <div className="form-group">
                <label>Ticket Médio Shopee (R$)</label>
                <div className="input-pair">
                  <FormattedInput type="currency" id="shopee_ticket_atual" value={shopeeData.shopee_ticket_atual} onChange={handleChange} placeholder="Atual (R$)" />
                  <FormattedInput type="currency" id="shopee_ticket_anterior" value={shopeeData.shopee_ticket_anterior} onChange={handleChange} placeholder="Anterior (R$)" />
                </div>
              </div>
              <div className="form-group">
                <label>Taxa de Conversão Shopee (em porcentagem)</label>
                <div className="input-pair">
                  <FormattedInput type="decimal" id="shopee_conv_atual" value={shopeeData.shopee_conv_atual} onChange={handleChange} placeholder="Atual %" />
                  <FormattedInput type="decimal" id="shopee_conv_anterior" value={shopeeData.shopee_conv_anterior} onChange={handleChange} placeholder="Anterior %" />
                </div>
              </div>
            </div>
          </div>

          {/* 3. SAÚDE OPERACIONAL */}
          <div className="form-section">
            <h3 className="section-title">
              <span className="step-num">3</span> Saúde Operacional e SLAs Oficiais (Central do Vendedor)
            </h3>
            <div className="form-grid triple-col">
              <div className="form-group">
                <label htmlFor="shopee_penalidades">Pontos de Penalização (0 a 15)</label>
                <FormattedInput type="integer" id="shopee_penalidades" value={shopeeData.shopee_penalidades} onChange={handleChange} placeholder="Ex: 0" />
                <span className="field-hint">📌 2 pontos ou mais remove o selo Vendedor Indicado. 15 congela a conta.</span>
              </div>
              <div className="form-group">
                <label htmlFor="shopee_taxa_cancelamento">Taxa de Não Envio NFR</label>
                <FormattedInput type="decimal" id="shopee_taxa_cancelamento" value={shopeeData.shopee_taxa_cancelamento} onChange={handleChange} placeholder="Meta menor que 2,0%" />
                <span className="field-hint">📌 Mede pedidos cancelados por falta de estoque ou atraso.</span>
              </div>
              <div className="form-group">
                <label htmlFor="shopee_taxa_atraso">Taxa de Envio Atrasado LSR</label>
                <FormattedInput type="decimal" id="shopee_taxa_atraso" value={shopeeData.shopee_taxa_atraso} onChange={handleChange} placeholder="Meta menor que 2,0%" />
                <span className="field-hint">📌 Mede expedidos após o prazo D+1 ou D+2.</span>
              </div>
              <div className="form-group">
                <label htmlFor="shopee_chat_response">Taxa de Resposta do Chat CRR</label>
                <FormattedInput type="decimal" id="shopee_chat_response" value={shopeeData.shopee_chat_response} onChange={handleChange} placeholder="Meta maior que 85,0%" />
                <span className="field-hint">📌 Mensagens respondidas em até 12 horas.</span>
              </div>
              <div className="form-group">
                <label htmlFor="shopee_loja_rating">Avaliação Média da Loja (Estrelas)</label>
                <FormattedInput type="decimal" id="shopee_loja_rating" value={shopeeData.shopee_loja_rating} onChange={handleChange} placeholder="Meta maior ou igual a 4,60" />
                <span className="field-hint">📌 Média das avaliações dos compradores.</span>
              </div>
              <div className="form-group">
                <label htmlFor="shopee_modal_envio">Modal de Expedição / Logística</label>
                <select id="shopee_modal_envio" value={shopeeData.shopee_modal_envio} onChange={handleChange} className="select-input">
                  <option value="shopee_xpress">Shopee Xpress (Coleta Nativa Oficial)</option>
                  <option value="pegaki">Pegaki / Pontos de Drop-off</option>
                  <option value="correios">Correios Direct</option>
                </select>
              </div>
            </div>
          </div>

          {/* 4. SHOPEE ADS & MARKETING */}
          <div className="form-section">
            <h3 className="section-title">
              <span className="step-num">4</span> Shopee Ads e Mídia Pago
            </h3>
            <div className="form-grid quad-col">
              <div className="form-group">
                <label htmlFor="shopee_ads_ativo">Shopee Ads Ativo?</label>
                <select id="shopee_ads_ativo" value={shopeeData.shopee_ads_ativo} onChange={handleChange} className="select-input">
                  <option value="Sim">Sim (Busca e Descoberta)</option>
                  <option value="Não">Não</option>
                </select>
              </div>
              <div className="form-group">
                <label>CIR / ACOS Shopee Ads (Atual vs Ant.)</label>
                <div className="input-pair">
                  <FormattedInput type="decimal" id="shopee_cir_atual" value={shopeeData.shopee_cir_atual} onChange={handleChange} placeholder="Atual %" />
                  <FormattedInput type="decimal" id="shopee_cir_anterior" value={shopeeData.shopee_cir_anterior} onChange={handleChange} placeholder="Anterior %" />
                </div>
              </div>
              <div className="form-group">
                <label>GMV Gerado por Shopee Ads (R$)</label>
                <div className="input-pair">
                  <FormattedInput type="currency" id="shopee_ads_fat_atual" value={shopeeData.shopee_ads_fat_atual} onChange={handleChange} placeholder="Atual (R$)" />
                  <FormattedInput type="currency" id="shopee_ads_fat_anterior" value={shopeeData.shopee_ads_fat_anterior} onChange={handleChange} placeholder="Anterior (R$)" />
                </div>
              </div>
              <div className="form-group">
                <label>Ferramentas de Marketing Ativas</label>
                <div className="checkbox-group">
                  <label><input type="checkbox" id="shopee_tool_vouchers" checked={shopeeData.shopee_tool_vouchers} onChange={handleChange} /> Vouchers da Loja (Cupons)</label>
                  <label><input type="checkbox" id="shopee_tool_combo" checked={shopeeData.shopee_tool_combo} onChange={handleChange} /> Combo (Leve Mais por Menos)</label>
                  <label><input type="checkbox" id="shopee_tool_flash" checked={shopeeData.shopee_tool_flash} onChange={handleChange} /> Oferta Relâmpago (Flash Sale)</label>
                  <label><input type="checkbox" id="shopee_tool_video" checked={shopeeData.shopee_tool_video} onChange={handleChange} /> Shopee Vídeo / Live Stream</label>
                  <label><input type="checkbox" id="shopee_tool_afiliados" checked={shopeeData.shopee_tool_afiliados} onChange={handleChange} /> Programa de Afiliados Shopee</label>
                </div>
              </div>
            </div>
          </div>

          {/* 5. CURVA A SHOPEE */}
          <div className="form-section">
            <h3 className="section-title">
              <span className="step-num">5</span> Top Produtos Campeões na Shopee (Curva A)
            </h3>
            <div className="form-grid dual-col">
              <div className="form-group">
                <label>Produto Curva A (Maior Volume Shopee)</label>
                <input type="text" id="shopee_prod_a_nome" value={shopeeData.shopee_prod_a_nome} onChange={handleChange} placeholder="Ex: Kit Capas de Almofada 40x40" />
                <div className="input-pair" style={{ marginTop: '0.4rem' }}>
                  <FormattedInput type="integer" id="shopee_prod_a_atual" value={shopeeData.shopee_prod_a_atual} onChange={handleChange} placeholder="Unidades Atual" />
                  <FormattedInput type="integer" id="shopee_prod_a_anterior" value={shopeeData.shopee_prod_a_anterior} onChange={handleChange} placeholder="Unidades Anterior" />
                </div>
              </div>
              <div className="form-group">
                <label>Produto Curva B (Segundo Maior Shopee)</label>
                <input type="text" id="shopee_prod_b_nome" value={shopeeData.shopee_prod_b_nome} onChange={handleChange} placeholder="Ex: Jogo de Lençol 4 Peças" />
                <div className="input-pair" style={{ marginTop: '0.4rem' }}>
                  <FormattedInput type="integer" id="shopee_prod_b_atual" value={shopeeData.shopee_prod_b_atual} onChange={handleChange} placeholder="Unidades Atual" />
                  <FormattedInput type="integer" id="shopee_prod_b_anterior" value={shopeeData.shopee_prod_b_anterior} onChange={handleChange} placeholder="Unidades Anterior" />
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-shopee btn-large">
            <ShoppingBag size={18} />
            Gerar Diagnóstico Shopee, Causa Raiz e Plano 5W2H
          </button>
        </form>
      </div>
    </div>
  );
}
