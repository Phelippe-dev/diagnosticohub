import React from 'react';
import { CheckCircle2, FileSpreadsheet, Zap } from 'lucide-react';
import DateRangeSelector from './DateRangeSelector';
import FormattedInput from './FormattedInput';

export default function DataInputML({ mlData, setMlData, onSubmitML, onOpenImport }) {
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setMlData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div id="form-container-ml" className="form-container">
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2>Painel de Inserção de Dados do Mercado Livre</h2>
            <p>Insira os dados da sua conta ou importe via planilha CSV para comparar dois períodos.</p>
          </div>
          {onOpenImport && (
            <button 
              type="button" 
              className="btn btn-outline btn-sm"
              onClick={onOpenImport}
              style={{ gap: '6px', borderColor: 'var(--ml-yellow)', color: 'var(--ml-yellow)' }}
            >
              <FileSpreadsheet size={15} /> Importar Planilha CSV
            </button>
          )}
        </div>

        {/* REGRAS OFICIAIS MERCADO LIVRE 2026 */}
        <div style={{
          margin: '1.25rem 0',
          padding: '1.25rem 1.5rem',
          backgroundColor: '#0c1019',
          border: '1px solid #ffd600',
          borderRadius: '10px',
          fontSize: '0.86rem',
          lineHeight: '1.6',
          boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#ffd600', fontWeight: 700, fontSize: '1.05rem' }}>
            <span>⚡ Regras Oficiais Mercado Livre 2026</span>
          </div>

          <ul style={{ listStyleType: 'none', paddingLeft: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem', color: '#e2e8f0' }}>
            <li>• <strong>Anúncios Clássicos vs. Premium:</strong> Os anúncios Clássicos cobram de 10% a 14% dependendo da categoria, sem parcelamento sem juros. Os anúncios Premium cobram de 15% a 19% e permitem parcelamento em até 12x sem juros (custo financeiro ~2.8%).</li>
            <li>• <strong>Produtos abaixo de R$ 79,00:</strong> Isentos do custo total do Frete Grátis, porém é cobrada a tarifa fixa de gestão logística proporcional ao peso (32% do valor da tabela base de frete).</li>
            <li>• <strong>Produtos a partir de R$ 79,00:</strong> O vendedor é OBRIGADO a oferecer Frete Grátis. O custo do frete recebe desconto progressivo conforme o nível de reputação do vendedor (até 70% Off para Platinum/Gold).</li>
            <li>• <strong>Desconto Fulfillment Full:</strong> Vendedores que utilizam os centros de distribuição Mercado Envios Full ganham 8% de desconto adicional no custo do frete grátis.</li>
            <li>• <strong>Programa de Afiliados Mercado Livre:</strong> Vendas originadas por afiliados parceiros possuem comissão adicional de 3% a 7% negociada na plataforma de parceiros ML.</li>
            <li style={{ color: '#ffd600' }}>
              • <strong>Atualização de Taxas &amp; Logística (A partir do dia 24 de Agosto):</strong> O Envios Flex passa a ser calculado dinamicamente considerando peso do produto, dimensões da embalagem e distância da entrega. Ocorreram também reajustes nos custos de envio base (&lt;R$19 e &gt;R$19 / frete rápido ~R$0,90) e a concessão de custos diferenciados no Full Supermercado passa a exigir código EAN do item na Lista Oficial de Produtos Selecionados.
            </li>
          </ul>
        </div>

        <form onSubmit={onSubmitML}>
          {/* 1. SELETOR DE PERÍODOS ESTILO MARKETPLACE */}
          <DateRangeSelector 
            periodoAtual={mlData.periodo_atual}
            periodoAnterior={mlData.periodo_anterior}
            onPeriodChange={(atual, ant) => setMlData(prev => ({
              ...prev,
              periodo_atual: atual,
              periodo_anterior: ant
            }))}
            accentColor="var(--ml-yellow)"
          />

          {/* 2. MÉTRICAS GERAIS */}
          <div className="form-section">
            <h3 className="section-title">
              <span className="step-num">2</span> Métricas Gerais de Venda ML
            </h3>
            <div className="form-grid quad-col">
              <div className="form-group">
                <label>Faturamento Total (R$)</label>
                <div className="input-pair">
                  <FormattedInput type="currency" id="fat_atual" value={mlData.fat_atual} onChange={handleChange} placeholder="Atual (R$)" required />
                  <FormattedInput type="currency" id="fat_anterior" value={mlData.fat_anterior} onChange={handleChange} placeholder="Anterior (R$)" required />
                </div>
              </div>
              <div className="form-group">
                <label>Vendas Concluídas (Unidades)</label>
                <div className="input-pair">
                  <FormattedInput type="integer" id="vendas_atual" value={mlData.vendas_atual} onChange={handleChange} placeholder="Atual" required />
                  <FormattedInput type="integer" id="vendas_anterior" value={mlData.vendas_anterior} onChange={handleChange} placeholder="Anterior" required />
                </div>
              </div>
              <div className="form-group">
                <label>Visitas Totais</label>
                <div className="input-pair">
                  <FormattedInput type="integer" id="visitas_atual" value={mlData.visitas_atual} onChange={handleChange} placeholder="Atual" required />
                  <FormattedInput type="integer" id="visitas_anterior" value={mlData.visitas_anterior} onChange={handleChange} placeholder="Anterior" required />
                </div>
              </div>
              <div className="form-group">
                <label>Ticket Médio (R$)</label>
                <div className="input-pair">
                  <FormattedInput type="currency" id="ticket_atual" value={mlData.ticket_atual} onChange={handleChange} placeholder="Atual (R$)" />
                  <FormattedInput type="currency" id="ticket_anterior" value={mlData.ticket_anterior} onChange={handleChange} placeholder="Anterior (R$)" />
                </div>
              </div>
              <div className="form-group">
                <label>Taxa de Conversão (em porcentagem)</label>
                <div className="input-pair">
                  <FormattedInput type="decimal" id="conv_atual" value={mlData.conv_atual} onChange={handleChange} placeholder="Atual %" />
                  <FormattedInput type="decimal" id="conv_anterior" value={mlData.conv_anterior} onChange={handleChange} placeholder="Anterior %" />
                </div>
              </div>
              <div className="form-group">
                <label>Tempo Médio de Resposta (minutos)</label>
                <div className="input-pair">
                  <FormattedInput type="integer" id="tempo_resp_atual" value={mlData.tempo_resp_atual} onChange={handleChange} placeholder="Atual (min)" />
                  <FormattedInput type="integer" id="tempo_resp_anterior" value={mlData.tempo_resp_anterior} onChange={handleChange} placeholder="Anterior (min)" />
                </div>
              </div>
            </div>
          </div>

          {/* 3. REPUTAÇÃO E MODAIS */}
          <div className="form-section">
            <h3 className="section-title">
              <span className="step-num">3</span> Saúde Operacional e Modais Logísticos ML
            </h3>
            <div className="form-grid triple-col">
              <div className="form-group">
                <label htmlFor="reputacao">Saúde da Reputação (Termômetro ML)</label>
                <select id="reputacao" value={mlData.reputacao} onChange={handleChange} className="select-input">
                  <option value="Verde Escuro">🟢 Verde Escuro (MercadoLíder Platinum / Gold / Silver)</option>
                  <option value="Verde Claro">🌱 Verde Claro (Sem Reclamações Graves)</option>
                  <option value="Amarelo">🟡 Amarelo (Alerta de Queda de Exposição)</option>
                  <option value="Vermelho">🔴 Vermelho (Crítico - Perda de Visibilidade)</option>
                  <option value="OpcaoNula">⚪ Opcional / Não Definida</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="pct_full">Porcentagem de Vendas no Mercado Envios Full</label>
                <FormattedInput type="decimal" id="pct_full" value={mlData.pct_full} onChange={handleChange} placeholder="Ex: 65%" />
              </div>
              <div className="form-group">
                <label>Outros Modais Logísticos Ativos</label>
                <div className="checkbox-group">
                  <label><input type="checkbox" id="modal_flex" checked={mlData.modal_flex} onChange={handleChange} /> Mercado Envios Flex (Mesmo Dia)</label>
                  <label><input type="checkbox" id="modal_coleta" checked={mlData.modal_coleta} onChange={handleChange} /> Coleta Oficial Mercado Livre</label>
                  <label><input type="checkbox" id="modal_agencia" checked={mlData.modal_agencia} onChange={handleChange} /> Agências Mercado Livre</label>
                </div>
              </div>
              <div className="form-group">
                <label>Métricas de Saúde da Conta (Políticas ML)</label>
                <div className="input-pair triple">
                  <FormattedInput type="decimal" id="pct_reclamacoes" value={mlData.pct_reclamacoes} onChange={handleChange} placeholder="Reclamações % (Máx 2.0%)" />
                  <FormattedInput type="decimal" id="pct_cancelamentos" value={mlData.pct_cancelamentos} onChange={handleChange} placeholder="Cancelamentos % (Máx 1.0%)" />
                  <FormattedInput type="decimal" id="pct_atrasos" value={mlData.pct_atrasos} onChange={handleChange} placeholder="Atrasos % (Máx 6.0%)" />
                </div>
              </div>
            </div>
          </div>

          {/* 4. ADS E AFILIADOS */}
          <div className="form-section">
            <h3 className="section-title">
              <span className="step-num">4</span> Mercado Ads e Mídia Pago ML
            </h3>
            <div className="form-grid quad-col">
              <div className="form-group">
                <label htmlFor="ads_ativo">Mercado Ads Ativo?</label>
                <select id="ads_ativo" value={mlData.ads_ativo} onChange={handleChange} className="select-input">
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </select>
              </div>
              <div className="form-group">
                <label>ACOS / Publicidade sobre Vendas (Atual vs Ant.)</label>
                <div className="input-pair">
                  <FormattedInput type="decimal" id="acos_atual" value={mlData.acos_atual} onChange={handleChange} placeholder="Atual %" />
                  <FormattedInput type="decimal" id="acos_anterior" value={mlData.acos_anterior} onChange={handleChange} placeholder="Anterior %" />
                </div>
              </div>
              <div className="form-group">
                <label>Faturamento Vindo de Ads (R$)</label>
                <div className="input-pair">
                  <FormattedInput type="currency" id="ads_fat_atual" value={mlData.ads_fat_atual} onChange={handleChange} placeholder="Atual (R$)" />
                  <FormattedInput type="currency" id="ads_fat_anterior" value={mlData.ads_fat_anterior} onChange={handleChange} placeholder="Anterior (R$)" />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="participa_afiliados">Central de Ofertas / Afiliados</label>
                <select id="participa_afiliados" value={mlData.participa_afiliados} onChange={handleChange} className="select-input">
                  <option value="Sim">Participa de Ofertas e Afiliados</option>
                  <option value="Parcial">Apenas Central de Ofertas</option>
                  <option value="Não">Não Participa</option>
                </select>
              </div>
            </div>
          </div>

          {/* 5. CURVA ABC */}
          <div className="form-section">
            <h3 className="section-title">
              <span className="step-num">5</span> Produtos Campeões (Curva ABC Mercado Livre)
            </h3>
            <div className="form-grid dual-col">
              <div className="form-group">
                <label>Produto Curva A (Maior Faturamento ML)</label>
                <input type="text" id="prod_a_nome" value={mlData.prod_a_nome} onChange={handleChange} placeholder="Nome ou SKU do Produto A" />
                <div className="input-pair" style={{ marginTop: '0.4rem' }}>
                  <FormattedInput type="integer" id="prod_a_atual" value={mlData.prod_a_atual} onChange={handleChange} placeholder="Unidades Atual" />
                  <FormattedInput type="integer" id="prod_a_anterior" value={mlData.prod_a_anterior} onChange={handleChange} placeholder="Unidades Anterior" />
                </div>
              </div>
              <div className="form-group">
                <label>Produto Curva B (Segundo Maior ML)</label>
                <input type="text" id="prod_b_nome" value={mlData.prod_b_nome} onChange={handleChange} placeholder="Nome ou SKU do Produto B" />
                <div className="input-pair" style={{ marginTop: '0.4rem' }}>
                  <FormattedInput type="integer" id="prod_b_atual" value={mlData.prod_b_atual} onChange={handleChange} placeholder="Unidades Atual" />
                  <FormattedInput type="integer" id="prod_b_anterior" value={mlData.prod_b_anterior} onChange={handleChange} placeholder="Unidades Anterior" />
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-yellow btn-large">
            <CheckCircle2 size={18} />
            Gerar Diagnóstico Mercado Livre, Causa Raiz e Plano 5W2H
          </button>
        </form>
      </div>
    </div>
  );
}
