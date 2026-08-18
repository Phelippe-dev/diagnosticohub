import React, { useState } from 'react';
import { 
  ArrowRight, 
  Eye, 
  ShoppingCart, 
  Truck, 
  DollarSign, 
  Zap,
  ShoppingBag,
  Video,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Sparkles,
  Save
} from 'lucide-react';
import { saveDiagnosisSnapshot } from '../utils/diagnosisHistory';

export default function DiagnosisEngine({ 
  diagnosis, 
  metrics, 
  currentMarketplace, 
  mlData, 
  shopeeData, 
  tikTokData,
  onGoTo5W2H
}) {
  const [saveSuccess, setSaveSuccess] = useState(false);
  const isShopee = currentMarketplace === 'shopee';
  const isTikTok = currentMarketplace === 'tiktok';

  const channelName = isTikTok ? 'TikTok Shop' : (isShopee ? 'Shopee Brasil' : 'Mercado Livre');
  const channelIcon = isTikTok ? <Video size={18} /> : (isShopee ? <ShoppingBag size={18} /> : <Zap size={18} />);
  const accentColor = isTikTok ? 'var(--tiktok-cyan)' : (isShopee ? 'var(--shopee-orange)' : 'var(--ml-yellow)');

  const handleQuickSave = () => {
    const activeFormData = isShopee ? shopeeData : (isTikTok ? tikTokData : mlData);
    saveDiagnosisSnapshot(`Auditoria ${channelName} - ${new Date().toLocaleDateString('pt-BR')}`, currentMarketplace, metrics, diagnosis, activeFormData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const formatBRL = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);
  const formatPct = (val) => `${val > 0 ? '+' : ''}${val.toFixed(1)}%`;

  // Cálculos matemáticos exatos do impacto financeiro
  const fatDeltaR$ = metrics.fatAtual - metrics.fatAnterior;
  const vendasDeltaUnits = metrics.vendasAtual - metrics.vendasAnterior;
  const visitasDeltaUnits = metrics.visitasAtual - metrics.visitasAnterior;

  // Impacto isolado da queda de conversão em R$
  const lostSalesFromConv = metrics.convDelta < 0 ? Math.round(metrics.visitasAtual * (Math.abs(metrics.convDelta) / 100)) : 0;
  const lostFatFromConv = lostSalesFromConv * metrics.ticketAtual;

  // Impacto isolado da queda de tráfego em R$
  const lostVisits = metrics.visitasDelta < 0 ? Math.abs(visitasDeltaUnits) : 0;
  const lostFatFromVisits = Math.round(lostVisits * (metrics.convAnterior / 100) * metrics.ticketAnterior);

  return (
    <div id="tab-diagnosis" className="tab-panel">
      {/* 1. HERO DIAGNÓSTICO PRINCIPAL COM AUDITORIA MATEMÁTICA */}
      <div className="card diagnosis-hero-card" style={{ borderLeft: `6px solid ${diagnosis.statusLevel === 'danger' ? 'var(--danger)' : (diagnosis.statusLevel === 'warning' ? 'var(--warning)' : 'var(--success)')}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span className={`diagnosis-status-badge ${diagnosis.statusLevel === 'danger' ? 'badge-danger' : (diagnosis.statusLevel === 'warning' ? 'badge-warning' : 'badge-success')}`}>
                {diagnosis.statusLevel === 'danger' ? '🚨 DIAGNÓSTICO DE RISCO FINANCEIRO' : (diagnosis.statusLevel === 'warning' ? '⚠️ ATENÇÃO OPERACIONAL' : '🚀 DESEMPENHO EM ESCALA')}
              </span>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: '0.75rem', gap: '4px' }}>
                {channelIcon} {channelName}
              </span>
            </div>
            <h2>{diagnosis.mainPainPoint}</h2>
            <p className="diagnosis-desc" style={{ marginTop: '0.5rem', lineHeight: '1.65' }}>{diagnosis.mainDesc}</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '200px' }}>
            <button 
              className="btn btn-large" 
              onClick={onGoTo5W2H} 
              style={{ 
                width: '100%', 
                marginTop: 0, 
                background: accentColor, 
                color: isTikTok || isShopee ? '#fff' : '#0b0e14',
                fontWeight: '800'
              }}
            >
              Executar Plano 5W2H <ArrowRight size={16} />
            </button>

            <button 
              className="btn btn-outline" 
              onClick={handleQuickSave}
              style={{ 
                width: '100%', 
                fontWeight: '700',
                gap: '6px',
                borderColor: saveSuccess ? 'var(--success)' : 'rgba(255,255,255,0.2)',
                color: saveSuccess ? 'var(--success)' : '#fff'
              }}
            >
              {saveSuccess ? <CheckCircle2 size={16} color="var(--success)" /> : <Save size={16} />} 
              {saveSuccess ? 'Salvo no Histórico!' : 'Salvar Auditoria'}
            </button>
          </div>
      </div>
      </div>

      {/* INSIGHTS ESTRATÉGICOS DO DIAGNÓSTICO */}
      {diagnosis.insights && diagnosis.insights.length > 0 && (
        <div style={{ margin: '1.5rem 0', background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius)', border: `1px solid ${accentColor}40` }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Sparkles size={20} color={accentColor} /> Resumo Estratégico do Diagnóstico ({diagnosis.insights.length} Insights)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {diagnosis.insights.map((insight, idx) => (
              <div key={idx} style={{ 
                padding: '1rem', 
                borderRadius: 'var(--radius-sm)', 
                background: 'rgba(0,0,0,0.2)', 
                borderLeft: `4px solid var(--${insight.type})` 
              }}>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#fff', marginBottom: '6px' }}>{insight.title}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{insight.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ margin: '1.5rem 0 1rem 0' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fff' }}>
          🔍 Diagnóstico de Causa Raiz &amp; Cura Cirúrgica ({channelName})
        </h3>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
          Entenda exatamente o porquê de cada número e siga o passo a passo de clique direto no portal oficial.
        </p>
      </div>

      {/* 2. GRID DE ANÁLISES CONCRETAS E CURAS NO SITE */}
      <div className="diagnosis-grid">
        
        {/* CARD 1: VISIBILIDADE E TRÁFEGO ORGÂNICO */}
        <div className="card diag-detail-card" style={{ borderColor: metrics.visitasDelta < 0 ? 'rgba(239, 68, 68, 0.3)' : 'var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="card-icon" style={{ background: 'rgba(59, 130, 246, 0.12)', color: 'var(--blue-accent)' }}>
              <Eye size={20} />
            </div>
            <span className={`metric-badge ${metrics.visitasDelta >= 0 ? 'badge-up' : 'badge-down'}`}>
              {formatPct(metrics.visitasDelta)}
            </span>
          </div>

          <h3>1. Tráfego e Algoritmo de Busca</h3>

          <div style={{ background: 'var(--bg-input)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Métrica de Impressões/Visitas:</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>
              {metrics.visitasAtual.toLocaleString('pt-BR')} visitas
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Período Anterior: {metrics.visitasAnterior.toLocaleString('pt-BR')} visitas ({formatPct(metrics.visitasDelta)})
            </div>
          </div>

          <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: '1.55' }}>
            {isTikTok ? (
              metrics.visitasDelta < 0
                ? `O TikTok Shop registrou perda de ${Math.abs(visitasDeltaUnits).toLocaleString('pt-BR')} visualizações. Isso gerou um prejuízo direto estimado em ${formatBRL(lostFatFromVisits)}. Causa no TikTok: o algoritmo reduz a entrega de vídeos curtos quando a retenção nos 3 primeiros segundos cai ou o produto não tem o 'Product Card' ativo em lives de criadores.`
                : `O TikTok Shop gerou ${metrics.visitasAtual.toLocaleString('pt-BR')} visualizações. A distribuição algorítmica de conteúdo e catálogo está ativa e performando bem.`
            ) : isShopee ? (
              metrics.visitasDelta < 0 
                ? `A Shopee registrou perda de ${Math.abs(visitasDeltaUnits).toLocaleString('pt-BR')} visitas na loja. Isso custou cerca de ${formatBRL(lostFatFromVisits)} em faturamento não realizado. Causa na Shopee: queda no ranking de busca orgânica decorrente de anúncios com títulos sem palavras-chave de cauda longa ou lances defasados no Shopee Ads.`
                : `A loja na Shopee atraiu ${metrics.visitasAtual.toLocaleString('pt-BR')} acessos. O alcance orgânico do algoritmo está saudável.`
            ) : (
              metrics.visitasDelta < 0 
                ? `O Mercado Livre registrou perda de ${Math.abs(visitasDeltaUnits).toLocaleString('pt-BR')} visitas. Impacto financeiro: ${formatBRL(lostFatFromVisits)} em vendas perdidas. Causa no ML: o algoritmo de buscas rebaixou os anúncios por falta de preenchimento dos atributos obrigatórios da Ficha Técnica e tempo de resposta de ${mlData.tempo_resp_atual} min.`
                : `Volume de tráfego forte de ${metrics.visitasAtual.toLocaleString('pt-BR')} visitas mantido no Mercado Livre.`
            )}
          </p>

          {/* BOX CURA CIRÚRGICA */}
          <div style={{ marginTop: 'auto', background: 'rgba(59, 130, 246, 0.08)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(59, 130, 246, 0.25)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--blue-accent)', textTransform: 'uppercase', marginBottom: '4px' }}>
              🎯 Passo a Passo de Cura no Próprio Portal:
            </div>
            <div style={{ fontSize: '0.8rem', color: '#fff', lineHeight: '1.45' }}>
              {isTikTok ? (
                <><strong>1. Acesse:</strong> <em>TikTok Seller Center &gt; Affiliate &gt; Open Plan</em>.<br/><strong>2. Ação:</strong> Configure comissão de 12% a 15% e envie 15 amostras grátis para criadores com mais de 10k seguidores da sua categoria para reativar o tráfego nos vídeos.</>
              ) : isShopee ? (
                <><strong>1. Acesse:</strong> <em>Central do Vendedor &gt; Meus Produtos &gt; Editar em Lote</em>.<br/><strong>2. Ação:</strong> Reescreva os títulos dos top 5 produtos no padrão [Produto Principal + Marca + Atributo + Benefício] para subir o posicionamento na busca da Shopee.</>
              ) : (
                <><strong>1. Acesse:</strong> <em>Mercado Livre &gt; Anúncios &gt; Modificar Ficha Técnica</em>.<br/><strong>2. Ação:</strong> Preencha 100% dos atributos cinzas/obrigatórios (EAN, Marca, Modelo, Dimensões) e garanta foto 1 em 1200x1200px com fundo 100% branco puro.</>
              )}
            </div>
          </div>
        </div>

        {/* CARD 2: CONVERSÃO E ATRATIVIDADE DA OFERTA */}
        <div className="card diag-detail-card" style={{ borderColor: metrics.convDelta < 0 ? 'rgba(239, 68, 68, 0.3)' : 'var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="card-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--success)' }}>
              <ShoppingCart size={20} />
            </div>
            <span className={`metric-badge ${metrics.convDelta >= 0 ? 'badge-up' : 'badge-down'}`}>
              {formatPct(metrics.convDelta)}
            </span>
          </div>

          <h3>2. Conversão e Atratividade da Oferta</h3>

          <div style={{ background: 'var(--bg-input)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Taxa de Conversão Real:</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>
              {metrics.convAtual.toFixed(2)}% de conversão
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Anterior: {metrics.convAnterior.toFixed(2)}% | Vendas Frustradas: {lostSalesFromConv} unidades ({formatBRL(lostFatFromConv)})
            </div>
          </div>

          <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: '1.55' }}>
            {isTikTok ? (
              metrics.convDelta < 0
                ? `De cada 100 pessoas que visualizaram seus produtos no TikTok Shop, apenas ${metrics.convAtual.toFixed(2)} compraram. A perda de conversão causou um prejuízo de ${formatBRL(lostFatFromConv)} (${lostSalesFromConv} pedidos não finalizados). Motivo no TikTok: falta de transmissão LIVE Shopping e ausência do selo de Frete Grátis Coparticipado.`
                : `Excelente taxa de conversão de ${metrics.convAtual.toFixed(2)}% mantida no TikTok Shop.`
            ) : isShopee ? (
              metrics.convDelta < 0
                ? `A conversão da Shopee recuou para ${metrics.convAtual.toFixed(2)}%, deixando de gerar ${lostSalesFromConv} vendas (${formatBRL(lostFatFromConv)} em faturamento). Motivo na Shopee: ausência de Vouchers de 5% da Loja e ofertas de Combo 'Leve Mais por Menos' no carrinho.`
                : `Conversão saudável de ${metrics.convAtual.toFixed(2)}% gerando bom aproveitamento do tráfego na Shopee.`
            ) : (
              metrics.convDelta < 0
                ? `A conversão no Mercado Livre caiu de ${metrics.convAnterior.toFixed(2)}% para ${metrics.convAtual.toFixed(2)}%. Isso gerou a perda de ${lostSalesFromConv} vendas (${formatBRL(lostFatFromConv)} em faturamento). Motivo no ML: apenas ${mlData.pct_full}% das vendas estão no Envios Full (perda da tag 'Chegará Amanhã') e frete caro para o comprador.`
                : `Ótima taxa de conversão de ${metrics.convAtual.toFixed(2)}% mantida nos anúncios do Mercado Livre.`
            )}
          </p>

          {/* BOX CURA CIRÚRGICA */}
          <div style={{ marginTop: 'auto', background: 'rgba(16, 185, 129, 0.08)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--success)', textTransform: 'uppercase', marginBottom: '4px' }}>
              🎯 Passo a Passo de Cura no Próprio Portal:
            </div>
            <div style={{ fontSize: '0.8rem', color: '#fff', lineHeight: '1.45' }}>
              {isTikTok ? (
                <><strong>1. Acesse:</strong> <em>Seller Center &gt; Promotions &gt; LIVE Flash Sale</em>.<br/><strong>2. Ação:</strong> Inscreva o produto na campanha de desconto relâmpago in-LIVE e marque a caixa do Frete Grátis Coparticipado (6%) no carrinho.</>
              ) : isShopee ? (
                <><strong>1. Acesse:</strong> <em>Central do Vendedor &gt; Central de Marketing &gt; Vouchers da Loja</em>.<br/><strong>2. Ação:</strong> Crie um Cupom de 5% OFF (mínimo de compra R$ 50) + adicione o produto no módulo 'Combo Leve 2 com 8% OFF'.</>
              ) : (
                <><strong>1. Acesse:</strong> <em>Mercado Livre &gt; Gestão de Estoque Full &gt; Agendar Envio</em>.<br/><strong>2. Ação:</strong> Agende o envio do lote do produto campeão para o centro de distribuição Full para liberar a entrega expressa 'Chegará Amanhã'.</>
              )}
            </div>
          </div>
        </div>

        {/* CARD 3: SAÚDE OPERACIONAL E SLAS */}
        <div className="card diag-detail-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="card-icon" style={{ background: 'rgba(245, 158, 11, 0.12)', color: 'var(--warning)' }}>
              <Truck size={20} />
            </div>
            <span className="metric-badge badge-neutral">
              {isTikTok 
                ? `Shop Score: ${tikTokData.tiktok_shop_score}`
                : isShopee 
                  ? `${shopeeData.shopee_penalidades} pts penalização` 
                  : mlData.reputacao}
            </span>
          </div>

          <h3>3. Operação, SLAs e Risco de Penalização</h3>

          <div style={{ background: 'var(--bg-input)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Métricas Oficiais de Saúde Nativas:</div>
            {isTikTok ? (
              <div style={{ fontSize: '0.82rem', color: '#fff', fontWeight: '700', marginTop: '2px' }}>
                Atraso 48h: {tikTokData.tiktok_late_dispatch}% | Cancelamento: {tikTokData.tiktok_seller_cancellation}% | Violações: {tikTokData.tiktok_violation_points} pts
              </div>
            ) : isShopee ? (
              <div style={{ fontSize: '0.82rem', color: '#fff', fontWeight: '700', marginTop: '2px' }}>
                Chat CRR: {shopeeData.shopee_chat_response}% | Não Envio NFR: {shopeeData.shopee_taxa_cancelamento}% | Atraso LSR: {shopeeData.shopee_taxa_atraso}%
              </div>
            ) : (
              <div style={{ fontSize: '0.82rem', color: '#fff', fontWeight: '700', marginTop: '2px' }}>
                Reclamações: {mlData.pct_reclamacoes}% | Atrasos: {mlData.pct_atrasos}% | Cancelamentos: {mlData.pct_cancelamentos}%
              </div>
            )}
          </div>

          <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: '1.55' }}>
            {isTikTok ? (
              tikTokData.tiktok_late_dispatch > 2.0 || tikTokData.tiktok_violation_points > 0
                ? `Alerta no TikTok Shop: Taxa de envio atrasado em ${tikTokData.tiktok_late_dispatch}% (meta <2,0%) e ${tikTokData.tiktok_violation_points} pontos de violação. Descumprir o SLA de 48h congela o catálogo e desativa anúncios nas vitrines dos criadores.`
                : `Sua conta no TikTok Shop atende aos requisitos operacionais e ao SLA de envio de 48 horas.`
            ) : isShopee ? (
              shopeeData.shopee_penalidades > 0 || shopeeData.shopee_chat_response < 85
                ? `Alerta na Shopee: A conta possui ${shopeeData.shopee_penalidades} ponto(s) de penalização e Chat CRR em ${shopeeData.shopee_chat_response}% (meta >85%). Isso causou a remoção do selo Vendedor Indicado e reduziu as vendas.`
                : `Sua conta na Shopee mantém excelente saúde operacional e atendimento rápido via chat.`
            ) : (
              mlData.pct_reclamacoes > 2.0 || mlData.pct_atrasos > 6.0
                ? `Alerta no Mercado Livre: Reclamações em ${mlData.pct_reclamacoes}% (meta <2,0%) ou atrasos em ${mlData.pct_atrasos}% (meta <6,0%) colocam o termômetro Verde Escuro em risco de amarelamento.`
                : `Excelente reputação Verde Escuro mantida com entregas dentro do prazo no Mercado Livre.`
            )}
          </p>

          {/* BOX CURA CIRÚRGICA */}
          <div style={{ marginTop: 'auto', background: 'rgba(245, 158, 11, 0.08)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--warning)', textTransform: 'uppercase', marginBottom: '4px' }}>
              🎯 Passo a Passo de Cura no Próprio Portal:
            </div>
            <div style={{ fontSize: '0.8rem', color: '#fff', lineHeight: '1.45' }}>
              {isTikTok ? (
                <><strong>1. Acesse:</strong> <em>TikTok Seller Center &gt; Orders &gt; Shipping</em>.<br/><strong>2. Ação:</strong> Imprima etiquetas e bipe todos os pacotes em menos de 24h da aprovação para zerar a taxa de atraso no SLA de 48h.</>
              ) : isShopee ? (
                <><strong>1. Acesse:</strong> <em>Central do Vendedor &gt; Web Chat Shopee</em>.<br/><strong>2. Ação:</strong> Responda todas as mensagens pendentes em menos de 12h para recuperar a taxa CRR acima de 85% e solicitar o selo Vendedor Indicado.</>
              ) : (
                <><strong>1. Acesse:</strong> <em>Mercado Livre &gt; Vendas &gt; Reclamações &amp; Mediações</em>.<br/><strong>2. Ação:</strong> Faça mutirão para encerrar mediações abertas em menos de 48 horas oferecendo troca/reembolso direto para salvar o termômetro.</>
              )}
            </div>
          </div>
        </div>

        {/* CARD 4: MÍDIA ADS E RENTABILIDADE */}
        <div className="card diag-detail-card" style={{ borderColor: metrics.acosDelta > 0 ? 'rgba(239, 68, 68, 0.3)' : 'var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="card-icon" style={{ background: 'rgba(239, 68, 68, 0.12)', color: 'var(--danger)' }}>
              <DollarSign size={20} />
            </div>
            <span className={`metric-badge ${metrics.acosDelta <= 0 ? 'badge-up' : 'badge-down'}`}>
              {isTikTok ? `ROAS: ${metrics.acosAtual}x` : `ACOS/CIR: ${metrics.acosAtual}%`}
            </span>
          </div>

          <h3>4. Publicidade Pago, Ads e Rentabilidade</h3>

          <div style={{ background: 'var(--bg-input)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {isTikTok ? 'Retorno sobre Investimento (ROAS Ads):' : 'Custo de Publicidade (ACOS / CIR):'}
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>
              {isTikTok ? `${metrics.acosAtual}x de retorno` : `${metrics.acosAtual}% das vendas em Ads`}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Anterior: {isTikTok ? `${metrics.acosAnterior}x` : `${metrics.acosAnterior}%`} | Faturamento Ads: {formatBRL(isTikTok ? tikTokData.tiktok_ads_fat_atual : isShopee ? shopeeData.shopee_ads_fat_atual : mlData.ads_fat_atual)}
            </div>
          </div>

          <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: '1.55' }}>
            {isTikTok ? (
              metrics.acosAtual < 4.0
                ? `O ROAS das campanhas GMV Max no TikTok recuou para ${metrics.acosAtual}x (meta >5.0x). O investimento em anúncios está encarecendo o Custo de Aquisição (CAC) e corroendo o lucro.`
                : `As campanhas de GMV Max no TikTok Shop apresentam retorno positivo de ${metrics.acosAtual}x.`
            ) : isShopee ? (
              metrics.acosAtual > 20
                ? `O CIR do Shopee Ads subiu para ${metrics.acosAtual}%. Você gastou ${formatBRL((shopeeData.shopee_ads_fat_atual * metrics.acosAtual) / 100)} em mídia paga, mas o faturamento geral caiu.`
                : `Custo de mídia do Shopee Ads dentro dos parâmetros saudáveis de rentabilidade.`
            ) : (
              metrics.acosAtual > 20
                ? `O ACOS do Mercado Ads subiu para ${metrics.acosAtual}%. Você está gastando R$ ${metrics.acosAtual.toFixed(2)} em publicidade a cada R$ 100,00 vendidos, queimando a margem de lucro.`
                : `ACOS do Mercado Ads em nível rentável (${metrics.acosAtual}%).`
            )}
          </p>

          {/* BOX CURA CIRÚRGICA */}
          <div style={{ marginTop: 'auto', background: 'rgba(239, 68, 68, 0.08)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--danger)', textTransform: 'uppercase', marginBottom: '4px' }}>
              🎯 Passo a Passo de Cura no Próprio Portal:
            </div>
            <div style={{ fontSize: '0.8rem', color: '#fff', lineHeight: '1.45' }}>
              {isTikTok ? (
                <><strong>1. Acesse:</strong> <em>TikTok Ads Manager &gt; Campaign &gt; GMV Max Settings</em>.<br/><strong>2. Ação:</strong> Ajuste o Target ROAS para 5.5x e silencie criativos com CTR menor que 1.2% nos últimos 7 dias.</>
              ) : isShopee ? (
                <><strong>1. Acesse:</strong> <em>Central do Vendedor &gt; Shopee Ads &gt; Anúncios de Busca</em>.<br/><strong>2. Ação:</strong> Mude de Seleção Automática para Seleção Manual, escolha correspondência exata e reduza os lances por clique para R$ 0,35.</>
              ) : (
                <><strong>1. Acesse:</strong> <em>Mercado Livre &gt; Publicidade (Mercado Ads) &gt; Campanhas</em>.<br/><strong>2. Ação:</strong> Mude o objetivo da campanha para 'Modo Rentabilidade', negative palavras desnecessárias e pause anúncios com ACOS &gt; 25%.</>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
