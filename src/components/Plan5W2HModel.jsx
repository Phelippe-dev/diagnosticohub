import React from 'react';
import { Printer, Zap, ShoppingBag, Video } from 'lucide-react';

export default function Plan5W2HModel({ diagnosis, metrics, mlData, shopeeData, tikTokData, currentMarketplace, handlePrint }) {
  const isShopee = currentMarketplace === 'shopee';
  const isTikTok = currentMarketplace === 'tiktok';

  const channelName = isTikTok ? 'TikTok Shop' : (isShopee ? 'Shopee Brasil' : 'Mercado Livre');
  const accentColor = isTikTok ? 'var(--tiktok-cyan)' : (isShopee ? 'var(--shopee-orange)' : 'var(--ml-yellow)');

  const prodAName = isTikTok 
    ? (tikTokData.tiktok_prod_a_nome || 'Escova Alisadora Multifuncional')
    : isShopee 
      ? (shopeeData.shopee_prod_a_nome || 'Kit Capas de Almofada 40x40') 
      : (mlData.prod_a_nome || 'Kit Ferramentas Pro 110 Peças');

  const prodBName = isTikTok
    ? (tikTokData.tiktok_prod_b_nome || 'Sérum Facial Clareador Vitamina C')
    : isShopee
      ? (shopeeData.shopee_prod_b_nome || 'Jogo de Lençol Casal 4 Peças')
      : (mlData.prod_b_nome || 'Parafusadeira Sem Fio 18V');

  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  const targetConv = (metrics.convAtual * 1.35).toFixed(2);
  const acosLabel = isTikTok ? 'ROAS GMV Max' : (isShopee ? 'CIR Shopee Ads' : 'ACOS Mercado Ads');
  const acosVal = isTikTok ? `${metrics.acosAtual}x` : `${metrics.acosAtual.toFixed(1)}%`;

  return (
    <div className="tab-panel">
      <div className="card" style={{ marginBottom: '1.25rem', borderLeft: `4px solid ${accentColor}` }}>
        <div className="card-header flex-header">
          <div>
            <h2>Matriz 5W2H Personalizada — {channelName}</h2>
            <p>Plano tático gerado dinamicamente com base nos dados reais, pesquisa de concorrência, SEO de palavras-chave e cálculo de precificação.</p>
          </div>
          <button className="btn" onClick={handlePrint} style={{ background: accentColor, color: isTikTok || isShopee ? '#fff' : '#0b0e14', fontWeight: '800' }}>
            <Printer size={15} /> Imprimir Plano 5W2H ({channelName})
          </button>
        </div>
      </div>

      <div className="alignment-grid">
        {/* Meta SMART */}
        <div className="card">
          <div className="card-header">
            <span className="w2h-badge" style={{ background: accentColor, color: isTikTok || isShopee ? '#fff' : '#0b0e14' }}>1. META SMART ({channelName})</span>
            <h3 style={{ marginTop: '0.4rem' }}>
              Elevar Conversão de {metrics.convAtual.toFixed(2)}% para {targetConv}% no {channelName} em 15 Dias
            </h3>
          </div>
          <p>Plano cirúrgico desenhado para reverter a queda de {formatCurrency(Math.abs(metrics.fatAnterior - metrics.fatAtual))} no faturamento.</p>
          
          <div className="smart-box">
            <div className="smart-title">Meta SMART Baseada nos Dados Reais</div>
            <ul className="smart-list">
              <li><strong>S (Específica):</strong> Restauração das vendas do produto campeão '{prodAName}' (atualmente com {isTikTok ? tikTokData.tiktok_prod_a_atual : isShopee ? shopeeData.shopee_prod_a_atual : mlData.prod_a_atual} unidades vendidas).</li>
              <li><strong>M (Mensurável):</strong> Aumentar a conversão de {metrics.convAtual.toFixed(2)}% para {targetConv}% e estabilizar o {acosLabel} em {acosVal}.</li>
              <li><strong>A (Atingível):</strong> Pesquisa de preço da concorrência, SEO de palavras-chave, atração de cupons/afiliados e otimização dos anúncios pagos.</li>
              <li><strong>R (Relevante):</strong> Recuperar {formatCurrency(Math.abs(metrics.fatAnterior - metrics.fatAtual))} em vendas perdidas no {channelName}.</li>
              <li><strong>T (Temporal):</strong> Cronograma rigoroso de 15 dias com checagem operacional diária.</li>
            </ul>
          </div>
        </div>

        {/* OKRs */}
        <div className="card">
          <div className="card-header">
            <span className="w2h-badge" style={{ background: 'var(--blue-accent)', color: '#fff' }}>2. OKRs ESTRATÉGICOS ({channelName})</span>
            <h3 style={{ marginTop: '0.4rem' }}>Objetivos &amp; Resultados-Chave</h3>
          </div>
          <p>Alinhamento de metas da equipe comercial e operacional.</p>

          <div className="smart-box" style={{ borderColor: isTikTok ? 'var(--tiktok-cyan-border)' : (isShopee ? 'var(--shopee-orange-border)' : 'var(--ml-yellow-border)') }}>
            <div className="smart-title" style={{ color: accentColor }}>
              🎯 Objetivo: Restabelecer a Liderança Comercia no {channelName}
            </div>
            <ul className="smart-list" style={{ marginTop: '0.5rem' }}>
              <li><strong>KR 1:</strong> Elevar a conversão para {targetConv}% otimizando anúncios de '{prodAName}' e '{prodBName}'.</li>
              <li><strong>KR 2:</strong> Ajustar o {acosLabel} para a faixa ideal ({isTikTok ? '>= 5.0x' : '<= 18%'}) eliminando palavras irrelevantes.</li>
              <li><strong>KR 3:</strong> Garantir 100% de conformidade operacional ({isTikTok ? `SLA 48h Late Dispatch ${tikTokData.tiktok_late_dispatch}%` : isShopee ? `Chat CRR ${shopeeData.shopee_chat_response}%` : `Envios Full ${mlData.pct_full}%`}).</li>
            </ul>
          </div>
        </div>

        {/* KPIs */}
        <div className="card">
          <div className="card-header">
            <span className="w2h-badge" style={{ background: 'var(--success)', color: '#0b0e14' }}>3. PAINEL DE CONTROL KPIs</span>
            <h3 style={{ marginTop: '0.4rem' }}>Indicadores de Acompanhamento Diário</h3>
          </div>
          <p>Métricas essenciais para controle da execução.</p>

          <div className="smart-box" style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
            <div className="smart-title" style={{ color: 'var(--success)' }}>
              📊 KPIs de Performance ({channelName})
            </div>
            <ul className="smart-list" style={{ marginTop: '0.5rem' }}>
              <li><strong>Taxa de Conversão Real:</strong> Meta {targetConv}% (atual {metrics.convAtual.toFixed(2)}%).</li>
              <li><strong>Volume Tráfego/Visitas:</strong> Atual {metrics.visitasAtual.toLocaleString('pt-BR')} acessos.</li>
              <li><strong>{acosLabel}:</strong> Nível atual de {acosVal}.</li>
              <li><strong>Vendas Diárias '{prodAName}':</strong> Meta de recuperar unidades anteriores.</li>
              <li><strong>Taxa de Execução 5W2H:</strong> Cumprimento das metas de 24h a 15 dias.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tabela 5W2H */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="card-header">
          <h3>Matriz Operacional 5W2H Personalizada ({channelName})</h3>
          <p>Detalhamento dinâmico baseado nos dados reais inseridos e nas ferramentas oficiais da plataforma.</p>
        </div>

        <div className="table-responsive">
          <table className="w2h-table">
            <thead>
              <tr>
                <th>Metodologia 5W2H</th>
                <th>Pergunta</th>
                <th>Aplicação Prática no {channelName}</th>
                <th>Detalhamento da Execução Baseada nos Dados Reais</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="w2h-badge">1. O que fazer (What)</span></td>
                <td>O que será feito?</td>
                <td><strong>Reestruturação Completa da Oferta do '{prodAName}'</strong></td>
                <td>Auditoria de SEO nos títulos com termos de busca, benchmarking dos 5 principais concorrentes diretos, calibração do preço de venda na calculadora de margem e ajuste nas campanhas de publicidade.</td>
              </tr>
              <tr>
                <td><span className="w2h-badge">2. Por que fazer (Why)</span></td>
                <td>Por que será feito?</td>
                <td><strong>Recuperar Faturamento Perdido de {formatCurrency(Math.abs(metrics.fatAnterior - metrics.fatAtual))}</strong></td>
                <td>Porque a conversão atual de {metrics.convAtual.toFixed(2)}% causou a perda de vendas no '{prodAName}', gerando acúmulo de tráfego sem fechamento e erosão da margem em mídia pago ({acosLabel}: {acosVal}).</td>
              </tr>
              <tr>
                <td><span className="w2h-badge">3. Onde aplicar (Where)</span></td>
                <td>Onde será aplicado?</td>
                <td><strong>{isTikTok ? 'TikTok Seller Center (seller-br.tiktok.com)' : isShopee ? 'Shopee Central do Vendedor (seller.shopee.com.br)' : 'Mercado Livre Painel de Vendas (mercadolivre.com.br)'}</strong></td>
                <td>
                  {isTikTok ? (
                    <>Módulos <strong>Seller Center &gt; Affiliate (Open Plan) &gt; Products ({prodAName}) &gt; GMV Max Ads</strong>.</>
                  ) : isShopee ? (
                    <>Módulos <strong>Central do Vendedor &gt; Meus Produtos &gt; Central de Marketing (Vouchers/Combos) &gt; Shopee Ads</strong>.</>
                  ) : (
                    <>Módulos <strong>Mercado Livre &gt; Meus Anúncios &gt; Ficha Técnica &gt; Envios Full &gt; Mercado Ads</strong>.</>
                  )}
                </td>
              </tr>
              <tr>
                <td><span className="w2h-badge">4. Quando e Prazo (When)</span></td>
                <td>Quando será feito?</td>
                <td><strong>Imediato (24h) com Ciclo de 15 Dias</strong></td>
                <td>Ações emergenciais de reputação/SLA e Ads em 24h; pesquisa de concorrência e SEO em 48h; cupons e estoque em 5 dias; programa de afiliados em 14 dias.</td>
              </tr>
              <tr>
                <td><span className="w2h-badge">5. Quem executa (Who)</span></td>
                <td>Quem é o responsável?</td>
                <td><strong>Equipe Multidisciplinar de E-commerce</strong></td>
                <td>Especialista em Tráfego Pago/Ads (gestão do {acosLabel}), Analista de SEO &amp; Catalog (Ficha Técnica/Títulos), Operador de Logística (SLA/Full) e Gerente de Atendimento.</td>
              </tr>
              <tr>
                <td><span className="w2h-badge">6. Como executar (How)</span></td>
                <td>Como será feito?</td>
                <td><strong>Execução Técnica Passo a Passo Nociva</strong></td>
                <td>
                  {isTikTok ? (
                    <>1) Bipar expedição em &lt;24h para baixar atrasos em {tikTokData.tiktok_late_dispatch}%. 2) Recrutar criadores no Affiliate Open Plan (12-15% comissão) e enviar 15 amostras do '{prodAName}'. 3) Subir Target ROAS para 5.5x.</>
                  ) : isShopee ? (
                    <>1) Responder chats em &lt;12h para recuperar CRR de {shopeeData.shopee_chat_response}%. 2) Cadastrar Voucher de 5% OFF e Combo 'Leve 2'. 3) Mudar Shopee Ads para correspondência exata das 10 principais palavras-chave.</>
                  ) : (
                    <>1) Resolver mediações em &lt;24h. 2) Reabastecer o Envios Full com lote do '{prodAName}'. 3) Mudar Mercado Ads para Modo Rentabilidade e negativar termos com ACOS &gt; 25%.</>
                  )}
                </td>
              </tr>
              <tr>
                <td><span className="w2h-badge">7. Quanto custa (How Much)</span></td>
                <td>Quanto custa / exige?</td>
                <td><strong>Reinvestimento da Margem Existente</strong></td>
                <td>Ações operacionais, SEO e imagens: R$ 0,00. Cupons/Descontos: 5% a 8% do ticket (já previstos na calculadora). Reajuste de Ads: Redistribuição da verba existente sem aporte extra.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
