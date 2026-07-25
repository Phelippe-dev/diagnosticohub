import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import DataInputML from './components/DataInputML';
import DataInputShopee from './components/DataInputShopee';
import DataInputTikTok from './components/DataInputTikTok';
import ExecutiveDashboard from './components/ExecutiveDashboard';
import DiagnosisEngine from './components/DiagnosisEngine';
import ActionPlan from './components/ActionPlan';
import Plan5W2HModel from './components/Plan5W2HModel';
import AccountZeroPlaybook from './components/AccountZeroPlaybook';
import PricingCalculator from './components/PricingCalculator';
import GeminiCopilotModal from './components/GeminiCopilotModal';
import AppTutorialChatbot from './components/AppTutorialChatbot';

export default function App() {
  const [activeTab, setActiveTab] = useState('tab-input');
  const [currentMarketplace, setCurrentMarketplace] = useState('ml');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isGeminiModalOpen, setIsGeminiModalOpen] = useState(false);

  // State Form ML
  const [mlData, setMlData] = useState({
    periodo_atual: '01/06/2026 a 30/06/2026',
    periodo_anterior: '01/05/2026 a 31/05/2026',
    fat_atual: 142500.00,
    fat_anterior: 185000.00,
    vendas_atual: 1250,
    vendas_anterior: 1600,
    visitas_atual: 45000,
    visitas_anterior: 48000,
    ticket_atual: 114.00,
    ticket_anterior: 115.62,
    conv_atual: 2.78,
    conv_anterior: 3.33,
    tempo_resp_atual: 24,
    tempo_resp_anterior: 12,
    reputacao: 'Verde Escuro',
    pct_full: 42.0,
    modal_flex: true,
    modal_coleta: true,
    modal_agencia: true,
    pct_reclamacoes: 1.4,
    pct_cancelamentos: 0.8,
    pct_atrasos: 4.2,
    ads_ativo: 'Sim',
    acos_atual: 28.5,
    acos_anterior: 16.2,
    ads_fat_atual: 42000.00,
    ads_fat_anterior: 55000.00,
    participa_afiliados: 'Sim',
    prod_a_nome: 'Kit Ferramentas Pro 110 Peças',
    prod_a_atual: 380,
    prod_a_anterior: 620,
    prod_b_nome: 'Parafusadeira Sem Fio 18V',
    prod_b_atual: 290,
    prod_b_anterior: 310
  });

  // State Form Shopee
  const [shopeeData, setShopeeData] = useState({
    shopee_periodo_atual: '01/06/2026 a 30/06/2026',
    shopee_periodo_anterior: '01/05/2026 a 31/05/2026',
    shopee_fat_atual: 112000.00,
    shopee_fat_anterior: 158000.00,
    shopee_vendas_atual: 1400,
    shopee_vendas_anterior: 1950,
    shopee_visitas_atual: 52000,
    shopee_visitas_anterior: 55000,
    shopee_ticket_atual: 80.00,
    shopee_ticket_anterior: 81.02,
    shopee_conv_atual: 2.69,
    shopee_conv_anterior: 3.55,
    shopee_penalidades: 4,
    shopee_taxa_cancelamento: 3.8,
    shopee_taxa_atraso: 4.2,
    shopee_chat_response: 74.0,
    shopee_loja_rating: 4.6,
    shopee_modal_envio: 'shopee_xpress',
    shopee_ads_ativo: 'Sim',
    shopee_cir_atual: 24.5,
    shopee_cir_anterior: 12.0,
    shopee_ads_fat_atual: 32000.00,
    shopee_ads_fat_anterior: 48000.00,
    shopee_tool_vouchers: true,
    shopee_tool_combo: false,
    shopee_tool_flash: false,
    shopee_tool_video: false,
    shopee_tool_afiliados: true,
    shopee_prod_a_nome: 'Kit Capas de Almofada 40x40 (4 Unidades)',
    shopee_prod_a_atual: 420,
    shopee_prod_a_anterior: 850,
    shopee_prod_b_nome: 'Jogo de Lençol Casal 4 Peças',
    shopee_prod_b_atual: 310,
    shopee_prod_b_anterior: 390
  });

  // State Form TikTok Shop
  const [tikTokData, setTikTokData] = useState({
    tiktok_periodo_atual: '01/06/2026 a 30/06/2026',
    tiktok_periodo_anterior: '01/05/2026 a 31/05/2026',
    tiktok_fat_atual: 98500.00,
    tiktok_fat_anterior: 145000.00,
    tiktok_vendas_atual: 1150,
    tiktok_vendas_anterior: 1720,
    tiktok_visitas_atual: 68000,
    tiktok_visitas_anterior: 75000,
    tiktok_ticket_atual: 85.65,
    tiktok_ticket_anterior: 84.30,
    tiktok_conv_atual: 1.69,
    tiktok_conv_anterior: 2.29,
    tiktok_shop_score: 4.2,
    tiktok_late_dispatch: 3.4,
    tiktok_seller_cancellation: 2.1,
    tiktok_violation_points: 6,
    tiktok_ads_ativo: 'Sim',
    tiktok_roas_atual: 3.2,
    tiktok_roas_anterior: 5.4,
    tiktok_ads_fat_atual: 28000.00,
    tiktok_ads_fat_anterior: 45000.00,
    tiktok_affiliate_commission: 12.0,
    tiktok_tool_affiliate: true,
    tiktok_tool_live: false,
    tiktok_tool_samples: true,
    tiktok_tool_flash: false,
    tiktok_tool_freeshipping: true,
    tiktok_prod_a_nome: 'Escova Alisadora Multifuncional',
    tiktok_prod_a_atual: 350,
    tiktok_prod_a_anterior: 780,
    tiktok_prod_b_nome: 'Sérum Facial Clareador Vitamina C',
    tiktok_prod_b_atual: 280,
    tiktok_prod_b_anterior: 410
  });

  const calculateMetrics = (d, mp) => {
    let fatAtual = 0, fatAnterior = 0;
    let vendasAtual = 0, vendasAnterior = 0;
    let visitasAtual = 0, visitasAnterior = 0;
    let ticketAtual = 0, ticketAnterior = 0;
    let convAtual = 0, convAnterior = 0;
    let acosAtual = 0, acosAnterior = 0;

    if (mp === 'shopee') {
      fatAtual = parseFloat(d.shopee_fat_atual) || 0;
      fatAnterior = parseFloat(d.shopee_fat_anterior) || 0;
      vendasAtual = parseInt(d.shopee_vendas_atual) || 0;
      vendasAnterior = parseInt(d.shopee_vendas_anterior) || 0;
      visitasAtual = parseInt(d.shopee_visitas_atual) || 0;
      visitasAnterior = parseInt(d.shopee_visitas_anterior) || 0;
      ticketAtual = parseFloat(d.shopee_ticket_atual) || (vendasAtual > 0 ? fatAtual / vendasAtual : 0);
      ticketAnterior = parseFloat(d.shopee_ticket_anterior) || (vendasAnterior > 0 ? fatAnterior / vendasAnterior : 0);
      convAtual = parseFloat(d.shopee_conv_atual) || (visitasAtual > 0 ? (vendasAtual / visitasAtual) * 100 : 0);
      convAnterior = parseFloat(d.shopee_conv_anterior) || (visitasAnterior > 0 ? (vendasAnterior / visitasAnterior) * 100 : 0);
      acosAtual = parseFloat(d.shopee_cir_atual) || 0;
      acosAnterior = parseFloat(d.shopee_cir_anterior) || 0;
    } else if (mp === 'tiktok') {
      fatAtual = parseFloat(d.tiktok_fat_atual) || 0;
      fatAnterior = parseFloat(d.tiktok_fat_anterior) || 0;
      vendasAtual = parseInt(d.tiktok_vendas_atual) || 0;
      vendasAnterior = parseInt(d.tiktok_vendas_anterior) || 0;
      visitasAtual = parseInt(d.tiktok_visitas_atual) || 0;
      visitasAnterior = parseInt(d.tiktok_visitas_anterior) || 0;
      ticketAtual = parseFloat(d.tiktok_ticket_atual) || (vendasAtual > 0 ? fatAtual / vendasAtual : 0);
      ticketAnterior = parseFloat(d.tiktok_ticket_anterior) || (vendasAnterior > 0 ? fatAnterior / vendasAnterior : 0);
      convAtual = parseFloat(d.tiktok_conv_atual) || (visitasAtual > 0 ? (vendasAtual / visitasAtual) * 100 : 0);
      convAnterior = parseFloat(d.tiktok_conv_anterior) || (visitasAnterior > 0 ? (vendasAnterior / visitasAnterior) * 100 : 0);
      acosAtual = parseFloat(d.tiktok_roas_atual) || 0;
      acosAnterior = parseFloat(d.tiktok_roas_anterior) || 0;
    } else {
      fatAtual = parseFloat(d.fat_atual) || 0;
      fatAnterior = parseFloat(d.fat_anterior) || 0;
      vendasAtual = parseInt(d.vendas_atual) || 0;
      vendasAnterior = parseInt(d.vendas_anterior) || 0;
      visitasAtual = parseInt(d.visitas_atual) || 0;
      visitasAnterior = parseInt(d.visitas_anterior) || 0;
      ticketAtual = parseFloat(d.ticket_atual) || (vendasAtual > 0 ? fatAtual / vendasAtual : 0);
      ticketAnterior = parseFloat(d.ticket_anterior) || (vendasAnterior > 0 ? fatAnterior / vendasAnterior : 0);
      convAtual = parseFloat(d.conv_atual) || (visitasAtual > 0 ? (vendasAtual / visitasAtual) * 100 : 0);
      convAnterior = parseFloat(d.conv_anterior) || (visitasAnterior > 0 ? (vendasAnterior / visitasAnterior) * 100 : 0);
      acosAtual = parseFloat(d.acos_atual) || 0;
      acosAnterior = parseFloat(d.acos_anterior) || 0;
    }

    const pctChange = (curr, prev) => prev > 0 ? ((curr - prev) / prev) * 100 : 0;

    return {
      fatAtual, fatAnterior, fatDelta: pctChange(fatAtual, fatAnterior),
      vendasAtual, vendasAnterior, vendasDelta: pctChange(vendasAtual, vendasAnterior),
      visitasAtual, visitasAnterior, visitasDelta: pctChange(visitasAtual, visitasAnterior),
      ticketAtual, ticketAnterior, ticketDelta: pctChange(ticketAtual, ticketAnterior),
      convAtual, convAnterior, convDelta: pctChange(convAtual, convAnterior),
      acosAtual, acosAnterior, acosDelta: acosAtual - acosAnterior
    };
  };

  const metrics = currentMarketplace === 'tiktok'
    ? calculateMetrics(tikTokData, 'tiktok')
    : (currentMarketplace === 'shopee' ? calculateMetrics(shopeeData, 'shopee') : calculateMetrics(mlData, 'ml'));

  const formatBRL = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

  const runMLDiagnosis = (m, d) => {
    let mainPainPoint = "";
    let mainDesc = "";
    let statusLevel = "warning";

    const fatDeltaR$ = m.fatAtual - m.fatAnterior;
    const vendasDeltaUnits = m.vendasAtual - m.vendasAnterior;
    const visitasDeltaUnits = m.visitasAtual - m.visitasAnterior;

    // Perda de vendas estimada exclusivamente por queda na conversão
    const salesLostConv = m.convDelta < 0 ? Math.round(m.visitasAtual * (Math.abs(m.convDelta) / 100)) : 0;
    const fatLostConv = salesLostConv * m.ticketAtual;
    const pctShareConvLoss = fatDeltaR$ < 0 && fatLostConv > 0 ? Math.min(100, Math.round((fatLostConv / Math.abs(fatDeltaR$)) * 100)) : 0;

    let visScore = Math.max(10, Math.min(100, 100 + m.visitasDelta));
    let convScore = Math.max(10, Math.min(100, 100 + m.convDelta));
    let logScore = d.pct_full >= 60 ? 90 : (d.pct_full >= 30 ? 60 : 30);
    let adsScore = d.acos_atual <= 18 ? 95 : (d.acos_atual <= 25 ? 70 : 40);

    if (m.fatDelta < 0) {
      statusLevel = "danger";
      if (m.convDelta < -10 && m.visitasDelta >= -10) {
        mainPainPoint = `🚨 PERDA DE FATURAMENTO ML: ${formatBRL(fatDeltaR$)} (${m.fatDelta.toFixed(1)}%) CAUSADA POR Queda DE CONVERSÃO DE ${m.convAnterior.toFixed(2)}% PARA ${m.convAtual.toFixed(2)}%`;
        mainDesc = `Seu faturamento no Mercado Livre recuou de ${formatBRL(m.fatAnterior)} para ${formatBRL(m.fatAtual)} (${formatBRL(fatDeltaR$)} / ${m.fatDelta.toFixed(1)}%), com perda de ${Math.abs(vendasDeltaUnits)} vendas. A auditoria prova que ${formatBRL(fatLostConv)} dessa perda (${pctShareConvLoss}% do prejuízo total) decorre exclusivamente da queda na Taxa de Conversão. O tráfego permaneceu ativo em ${m.visitasAtual.toLocaleString('pt-BR')} visitas, mas os compradores desistiram no carrinho por falta de estoque no Envios Full (apenas ${d.pct_full}% no Full), tempo de resposta de ${d.tempo_resp_atual} min (vs ${d.tempo_resp_anterior} min anterior) ou ACOS de Ads descontrolado em ${d.acos_atual}%.`;
      } else if (m.visitasDelta < -10) {
        mainPainPoint = `📉 QUEDA SEVERA DE VISIBILIDADE ML: PERDA DE ${Math.abs(visitasDeltaUnits).toLocaleString('pt-BR')} VISITAS (-${Math.abs(m.visitasDelta).toFixed(1)}%)`;
        mainDesc = `A loja perdeu ${Math.abs(visitasDeltaUnits).toLocaleString('pt-BR')} visitas no Mercado Livre, resultando em queda de faturamento de ${formatBRL(fatDeltaR$)}. A causa raiz algorítmica é a degradação no ranking de buscas orgânicas gerada por Ficha Técnica sem atributos obrigatórios, tempo de resposta em ${d.tempo_resp_atual} min e taxa de reclamações em ${d.pct_reclamacoes}% (meta < 2.0%).`;
      } else if (d.acos_atual > 25) {
        mainPainPoint = `💸 INEFICIÊNCIA GRAVE EM MERCADO ADS: ACOS DISPAROU PARA ${d.acos_atual}% (META < 18%)`;
        mainDesc = `O ACOS da conta subiu de ${d.acos_anterior}% para ${d.acos_atual}%, gastando ${formatBRL((d.ads_fat_atual * d.acos_atual) / 100)} em publicidade para gerar ${formatBRL(d.ads_fat_atual)}. O Ads está consumindo a margem de lucro líquida dos produtos campeões.`;
      } else {
        mainPainPoint = `⚠️ QUEDA DE VOLUME NOS CAMPEÕES DA CURVA A: ${d.prod_a_nome}`;
        mainDesc = `O faturamento recuou ${formatBRL(fatDeltaR$)} (${m.fatDelta.toFixed(1)}%), impulsionado pela redução de vendas no produto campeão '${d.prod_a_nome}', que caiu de ${d.prod_a_anterior} para ${d.prod_a_atual} unidades.`;
      }
    } else {
      statusLevel = "success";
      mainPainPoint = `🚀 CONTA MERCADO LIVRE EM CRESCIMENTO: +${formatBRL(fatDeltaR$)} (+${m.fatDelta.toFixed(1)}%)`;
      mainDesc = `Sua conta expandiu o faturamento para ${formatBRL(m.fatAtual)}, com ${m.vendasAtual} vendas concluídas. Próxima etapa: Aumentar participação no Envios Full acima de 60% e cadastrar no Programa de Afiliados.`;
    }

    return { mainPainPoint, mainDesc, statusLevel, scores: { visScore, convScore, logScore, adsScore } };
  };

  const runShopeeDiagnosis = (m, d) => {
    let mainPainPoint = "";
    let mainDesc = "";
    let statusLevel = "warning";

    const fatDeltaR$ = m.fatAtual - m.fatAnterior;
    const vendasDeltaUnits = m.vendasAtual - m.vendasAnterior;

    let visScore = Math.max(10, Math.min(100, 100 + m.visitasDelta));
    let convScore = Math.max(10, Math.min(100, 100 + m.convDelta));
    let logScore = (d.shopee_taxa_cancelamento <= 2.0 && d.shopee_taxa_atraso <= 2.0) ? 95 : 40;
    let adsScore = d.shopee_cir_atual <= 15 ? 95 : (d.shopee_cir_atual <= 22 ? 70 : 35);

    if (d.shopee_penalidades > 0 || d.shopee_chat_response < 85 || d.shopee_taxa_cancelamento > 2.0) {
      statusLevel = "danger";
      mainPainPoint = `🚨 RISCO OPERACIONAL SHOPEE: ${d.shopee_penalidades} PONTO(S) DE PENALIZAÇÃO E CHAT EM ${d.shopee_chat_response}%`;
      mainDesc = `A conta acumula ${d.shopee_penalidades} ponto(s) de penalização na Central do Vendedor e problemas de SLA (Chat CRR em ${d.shopee_chat_response}%, meta >85%; Não Envio NFR em ${d.shopee_taxa_cancelamento}%, meta <2,0%). Na Shopee, acumular 2+ pontos remove o selo Vendedor Indicado, derruba as impressões orgânicas e reduz o faturamento em ${formatBRL(fatDeltaR$)}.`;
    } else if (m.fatDelta < 0) {
      statusLevel = "danger";
      if (d.shopee_cir_atual > 20) {
        mainPainPoint = `💸 CIR DE SHOPEE ADS DISPARADO EM ${d.shopee_cir_atual}% (DESPERDÍCIO DE MÍDIA)`;
        mainDesc = `O CIR (Custo de Publicidade sobre Vendas) subiu de ${d.shopee_cir_anterior}% para ${d.shopee_cir_atual}%. A loja gastou ${formatBRL((d.shopee_ads_fat_atual * d.shopee_cir_atual) / 100)} em anúncios de busca, mas o faturamento total recuou ${formatBRL(fatDeltaR$)} (${m.fatDelta.toFixed(1)}%).`;
      } else if (m.convDelta < -10) {
        mainPainPoint = `🛍️ QUEDA DE CONVERSÃO SHOPEE DE ${m.convAnterior.toFixed(2)}% PARA ${m.convAtual.toFixed(2)}% (-${Math.abs(m.convDelta).toFixed(1)}%)`;
        mainDesc = `Com a conversão em ${m.convAtual.toFixed(2)}%, a loja perdeu aproximadamente ${Math.abs(vendasDeltaUnits)} pedidos. Na Shopee, o comprador abandona o carrinho quando falta Voucher da Loja de 5% ou Combo 'Leve 2 com Desconto'.`;
      } else {
        mainPainPoint = `📉 QUEDA DE TRÁFEGO E VENDAS SHOPEE: ${formatBRL(fatDeltaR$)} (${m.fatDelta.toFixed(1)}%)`;
        mainDesc = `O faturamento na Shopee recuou para ${formatBRL(m.fatAtual)}, motivado por menor volume no top produto '${d.shopee_prod_a_nome}' (caiu de ${d.shopee_prod_a_anterior} para ${d.shopee_prod_a_atual} unidades).`;
      }
    } else {
      statusLevel = "success";
      mainPainPoint = `🧡 CONTA SHOPEE EM EXPANSÃO DE VENDAS: +${formatBRL(fatDeltaR$)} (+${m.fatDelta.toFixed(1)}%)`;
      mainDesc = `Sua loja na Shopee cresceu para ${formatBRL(m.fatAtual)}, com ${m.vendasAtual} pedidos concluídos. Próximos passos: Ativar Shopee Vídeo e Oferta Relâmpago.`;
    }

    return { mainPainPoint, mainDesc, statusLevel, scores: { visScore, convScore, logScore, adsScore } };
  };

  const runTikTokDiagnosis = (m, d) => {
    let mainPainPoint = "";
    let mainDesc = "";
    let statusLevel = "warning";

    const fatDeltaR$ = m.fatAtual - m.fatAnterior;
    const vendasDeltaUnits = m.vendasAtual - m.vendasAnterior;

    let visScore = Math.max(10, Math.min(100, 100 + m.visitasDelta));
    let convScore = Math.max(10, Math.min(100, 100 + m.convDelta));
    let logScore = (d.tiktok_late_dispatch <= 2.0 && d.tiktok_seller_cancellation <= 1.5) ? 95 : 40;
    let adsScore = d.tiktok_roas_atual >= 5.0 ? 95 : (d.tiktok_roas_atual >= 3.5 ? 70 : 35);

    if (d.tiktok_late_dispatch > 2.0 || d.tiktok_seller_cancellation > 1.5 || d.tiktok_violation_points > 0) {
      statusLevel = "danger";
      mainPainPoint = `🚨 RISCO OPERACIONAL TIKTOK SHOP: SLA 48h EM ${d.tiktok_late_dispatch}% + ${d.tiktok_violation_points} VIOLATION POINTS`;
      mainDesc = `A conta apresenta taxa de envio atrasado em ${d.tiktok_late_dispatch}% (meta oficial <2,0%) e ${d.tiktok_violation_points} ponto(s) de violação. No TikTok Shop, estourar o SLA de 48 horas derruba o Shop Performance Score (atualmente ${d.tiktok_shop_score}), desativa o Product Card na vitrine dos afiliados e reduz o GMV em ${formatBRL(fatDeltaR$)}.`;
    } else if (m.fatDelta < 0) {
      statusLevel = "danger";
      if (d.tiktok_roas_atual < 4.0) {
        const roasDeltaPct = d.tiktok_roas_anterior > 0 ? Math.abs(((d.tiktok_roas_atual - d.tiktok_roas_anterior) / d.tiktok_roas_anterior) * 100).toFixed(1) : '0.0';
        mainPainPoint = `💸 QUEDA NO ROAS GMV MAX DE ${d.tiktok_roas_anterior}x PARA ${d.tiktok_roas_atual}x (-${roasDeltaPct}%)`;
        mainDesc = `O retorno de mídia Ads caiu para ${d.tiktok_roas_atual}x no TikTok Shop. Faturamento vindo de mídia recuou de ${formatBRL(d.tiktok_ads_fat_anterior)} para ${formatBRL(d.tiktok_ads_fat_atual)}. Causa: escassez de novos vídeos de afiliados promovendo os produtos.`;
      } else if (m.convDelta < -10) {
        mainPainPoint = `🎬 CONVERSÃO TIKTOK EM QUEDA PARA ${m.convAtual.toFixed(2)}% (FALTA DE LIVES E OFERTAS FLASH)`;
        mainDesc = `A conversão no TikTok recuou de ${m.convAnterior.toFixed(2)}% para ${m.convAtual.toFixed(2)}%. No TikTok Shop, transmissões ao vivo (LIVE Shopping) com cupons relâmpago são cruciais para a decisão de compra.`;
      } else {
        mainPainPoint = `📉 RECUPERAÇÃO DE TRÁFEGO DE CONTEÚDO TIKTOK: ${formatBRL(fatDeltaR$)} (${m.fatDelta.toFixed(1)}%)`;
        mainDesc = `O GMV no TikTok recuou para ${formatBRL(m.fatAtual)}. Queda no produto campeão '${d.tiktok_prod_a_nome}' (de ${d.tiktok_prod_a_anterior} para ${d.tiktok_prod_a_atual} unidades). Necessário enviar amostras grátis (samples) a novos criadores.`;
      }
    } else {
      statusLevel = "success";
      mainPainPoint = `🎵 CONTA TIKTOK SHOP EM FORTE ESCALA: +${formatBRL(fatDeltaR$)} (+${m.fatDelta.toFixed(1)}%)`;
      mainDesc = `Sua loja no TikTok Shop alcançou ${formatBRL(m.fatAtual)} em GMV, com ${m.vendasAtual} pedidos concluídos. Próximos passos: Escalar campanhas GMV Max e integrar com FBT.`;
    }

    return { mainPainPoint, mainDesc, statusLevel, scores: { visScore, convScore, logScore, adsScore } };
  };

  const diagnosis = currentMarketplace === 'tiktok'
    ? runTikTokDiagnosis(metrics, tikTokData)
    : (currentMarketplace === 'shopee' ? runShopeeDiagnosis(metrics, shopeeData) : runMLDiagnosis(metrics, mlData));

  const generateActions = () => {
    const high = [];
    const medium = [];
    const strategic = [];

    if (currentMarketplace === 'tiktok') {
      const prodA = tikTokData.tiktok_prod_a_nome || 'Escova Alisadora Multifuncional';
      const prodAUnitsLost = tikTokData.tiktok_prod_a_anterior - tikTokData.tiktok_prod_a_atual;

      if (tikTokData.tiktok_late_dispatch > 2.0 || tikTokData.tiktok_violation_points > 0) {
        high.push({
          title: `🚨 Normalização Operacional de Despacho 48h (Atrasos em ${tikTokData.tiktok_late_dispatch}%) & Auditoria de Violações (${tikTokData.tiktok_violation_points} Pts)`,
          desc: `Com a taxa de atraso em ${tikTokData.tiktok_late_dispatch}% (meta oficial <2,0%) e ${tikTokData.tiktok_violation_points} ponto(s) de violação, seu Shop Performance Score (atualmente ${tikTokData.tiktok_shop_score}) está sob risco de suspensão de vitrine. Ação: Organizar fluxo de expedição em 2 turnos com bipagem em menos de 24h para proteger as lives e o catálogo.`,
          meta: "Caminho Nativo: TikTok Seller Center > Orders > Shipping & Health | Prazo: 24 Horas | Responsável: Gestor Logístico | Custo: R$ 0,00"
        });
      }

      if (metrics.acosAtual < 4.0) {
        high.push({
          title: `🛑 Otimização de Mídia GMV Max Ads (ROAS Atual: ${metrics.acosAtual}x vs Meta 5.5x)`,
          desc: `O retorno de anúncio caiu de ${metrics.acosAnterior}x para ${metrics.acosAtual}x. Ação: Reajustar o Target ROAS para 5.5x no TikTok Ads Manager, negativar públicos sem engajamento e pausar vídeos com taxa de retenção abaixo de 1.2% nos primeiros 3 segundos.`,
          meta: "Caminho Nativo: TikTok Seller Center > Ads > GMV Max Campaigns | Prazo: 24 Horas | Responsável: Especialista de Mídia | Custo: Ajuste de Lance"
        });
      }

      if (high.length === 0) {
        high.push({
          title: `🔍 Pesquisa de Concorrência & Otimização SEO do Produto Campeão '${prodA}'`,
          desc: `O produto '${prodA}' vendeu ${tikTokData.tiktok_prod_a_atual} unidades (recuo de ${prodAUnitsLost} unidades). Ação: Mapear os 5 vídeos mais vistos da concorrência no TikTok Creative Center, ajustar o preço com base na calculadora para garantir margem e incluir hashtags de alta busca (#TikTokMadeMeBuyIt, #BeautyTok) na descrição.`,
          meta: "Caminho Nativo: TikTok Seller Center > Products > Manage Products | Prazo: 48 Horas | Responsável: Copywriter & SEO | Custo: R$ 0,00"
        });
      }

      medium.push({
        title: `🎁 Recrutamento no Affiliate Open Plan & Envio de 15 Amostras Grátis (Samples) do '${prodA}'`,
        desc: `Para recuperar a conversão de ${metrics.convAtual.toFixed(2)}% para a meta de ${metrics.convAnterior.toFixed(2)}%, envie 15 amostras grátis para criadores de conteúdo com mais de 10k seguidores na categoria, oferecendo comissão entre 12% e 15% no Affiliate Open Plan.`,
        meta: "Caminho Nativo: TikTok Seller Center > Affiliate > Find Creators | Prazo: 5 Dias | Responsável: Gestor de Afiliados | Custo: Insumo de Amostra"
      });

      medium.push({
        title: `🔴 Execução de 3 LIVEs Shopping Semanais com Oferta Relâmpago In-LIVE`,
        desc: `Estruturar transmissões ao vivo de 2 horas exibindo o '${prodA}' com cronômetro de desconto relâmpago (LIVE Flash Sale) ativo na tela para estimular a decisão de compra imediata.`,
        meta: "Caminho Nativo: TikTok Seller Center > Promotions > LIVE Flash Sale | Prazo: 7 Dias | Responsável: Apresentador & Operador de LIVE | Custo: R$ 0,00"
      });

      strategic.push({
        title: `📦 Integração da Curva A no Fulfillment por TikTok (FBT)`,
        desc: `Enviar lote da Curva A para o centro de distribuição FBT. Produtos armazenados no FBT recebem badge oficial de 'Entrega Prioritária Garantida pelo TikTok', aumentando a conversão no carrinho em até 2.2x.`,
        meta: "Caminho Nativo: TikTok Seller Center > Logistics > FBT Fulfillment | Prazo: 20 Dias | Responsável: Diretor de Operações | Custo: Logística FBT"
      });

    } else if (currentMarketplace === 'shopee') {
      const prodA = shopeeData.shopee_prod_a_nome || 'Kit Capas de Almofada 40x40';
      const prodAUnitsLost = shopeeData.shopee_prod_a_anterior - shopeeData.shopee_prod_a_atual;

      if (shopeeData.shopee_penalidades > 0 || shopeeData.shopee_chat_response < 85) {
        high.push({
          title: `🚨 Mutirão de Resposta de Chat CRR (${shopeeData.shopee_chat_response}% vs Meta >85%) & Remoção de ${shopeeData.shopee_penalidades} Ponto(s) de Penalização`,
          desc: `Com a Taxa de Resposta de Chat em ${shopeeData.shopee_chat_response}% e ${shopeeData.shopee_penalidades} ponto(s) de penalidade acumulados, a loja corre risco imediato de perda do selo Vendedor Indicado. Ação: Responder todas as mensagens em menos de 12h para restabelecer o CRR e contestar pontos na Central da Shopee.`,
          meta: "Caminho Nativo: Central do Vendedor > Web Chat Shopee & Penalidades | Prazo: 24 Horas | Responsável: Operador de Atendimento | Custo: R$ 0,00"
        });
      }

      if (metrics.acosAtual > 20) {
        high.push({
          title: `🛑 Reestruturação do Shopee Ads (CIR Atual: ${metrics.acosAtual.toFixed(1)}% vs Meta <15%)`,
          desc: `Com o CIR em ${metrics.acosAtual.toFixed(1)}%, a publicidade está consumindo a margem do '${prodA}'. Ação: Alterar anúncios de busca de 'Seleção Automática' para 'Seleção Manual', definir correspondência exata para as 10 principais palavras-chave de busca e ajustar lances para R$ 0,35 por clique.`,
          meta: "Caminho Nativo: Central do Vendedor > Shopee Ads > Anúncios de Busca | Prazo: 24 Horas | Responsável: Especialista de Tráfego | Custo: Ajuste de Bid"
        });
      }

      if (high.length === 0) {
        high.push({
          title: `🔍 Auditoria SEO de Títulos & Pesquisa de Preço dos Líderes na Shopee para '${prodA}'`,
          desc: `O produto '${prodA}' vendeu ${shopeeData.shopee_prod_a_atual} unidades (recuo de ${prodAUnitsLost} unidades). Ação: Analisar os 5 concorrentes mais vendidos da categoria, ajustar o título para o padrão Shopee '[Produto + Marca + Atributos + Palavra de Busca]' e reajustar o preço com base na calculadora para garantir competitividade.`,
          meta: "Caminho Nativo: Central do Vendedor > Meus Produtos > Editar Título e Preço | Prazo: 48 Horas | Responsável: Especialista de E-commerce | Custo: R$ 0,00"
        });
      }

      medium.push({
        title: `🏷️ Cadastramento de Vouchers da Loja (5% OFF) & Combo 'Leve 2 com Desconto' para o '${prodA}'`,
        desc: `Para elevar a conversão de ${metrics.convAtual.toFixed(2)}% para a meta de ${metrics.convAnterior.toFixed(2)}%, crie um Voucher de Desconto de 5% (para compras acima de R$ 60) e configure o módulo de Combo 'Leve 2 com 8% OFF' na Central de Marketing.`,
        meta: "Caminho Nativo: Central do Vendedor > Central de Marketing > Vouchers e Combos | Prazo: 3 Dias | Responsável: Gerente de Marketing | Custo: 5% de Desconto"
      });

      medium.push({
        title: `⚡ Inscrição dos Top Produtos na Oferta Relâmpago da Loja (Shopee Flash Sale)`,
        desc: `Inscrever os produtos das Curvas A e B no módulo de Oferta Relâmpago da Loja na Central de Marketing, criando escassez de horário com desconto exclusivo de 8% por 4 horas.`,
        meta: "Caminho Nativo: Central do Vendedor > Central de Marketing > Oferta Relâmpago | Prazo: 5 Dias | Responsável: Analista de Vendas | Custo: Margem Promocional"
      });

      strategic.push({
        title: `📱 Ativação do Programa de Afiliados Shopee & Produção de Conteúdo no Shopee Vídeo`,
        desc: `Inscrever a loja no programa oficial de afiliados com comissão adicional de 3% e postar vídeos curtos diários (15-30s) demonstrando os atributos do '${prodA}' na aba Shopee Vídeo.`,
        meta: "Caminho Nativo: Central do Vendedor > Central de Marketing > Afiliados & Vídeo | Prazo: 14 Dias | Responsável: Criador de Conteúdo | Custo: 3% Comissão Extra"
      });

    } else {
      const prodA = mlData.prod_a_nome || 'Kit Ferramentas Pro 110 Peças';
      const prodAUnitsLost = mlData.prod_a_anterior - mlData.prod_a_atual;

      if (mlData.pct_reclamacoes > 2.0 || mlData.pct_atrasos > 6.0) {
        high.push({
          title: `🚨 Mutirão Antidanos de Reputação no Mercado Livre (Reclamações em ${mlData.pct_reclamacoes}% & Atrasos em ${mlData.pct_atrasos}%)`,
          desc: `Com reclamações em ${mlData.pct_reclamacoes}% (meta <2,0%) e atrasos em ${mlData.pct_atrasos}% (meta <6,0%), seu termômetro Verde Escuro está sob ameaça iminente. Ação: Entrar em contato com todos os compradores com reclamação aberta em menos de 24h oferecendo troca ou reembolso para encerrar mediações sem afetar a conta.`,
          meta: "Caminho Nativo: Mercado Livre > Vendas > Reclamações & Mediações | Prazo: 24 Horas | Responsável: Gerente de SAC | Custo: R$ 0,00"
        });
      }

      if (metrics.acosAtual > 25) {
        high.push({
          title: `🛑 Otimização de Mercado Ads (ACOS em ${metrics.acosAtual.toFixed(1)}% vs Meta <18%) & Negativação de Termos Irrelevantes`,
          desc: `O ACOS de publicidade está em ${metrics.acosAtual.toFixed(1)}%, consumindo R$ ${((mlData.ads_fat_atual * metrics.acosAtual) / 100).toFixed(2)} da margem do '${prodA}'. Ação: Alterar o objetivo da campanha para 'Modo Rentabilidade', negativar termos de busca irrelevantes e pausar anúncios com ACOS acima de 30% nos últimos 14 dias.`,
          meta: "Caminho Nativo: Mercado Livre > Publicidade (Mercado Ads) > Campanhas | Prazo: 24 Horas | Responsável: Especialista em Mercado Ads | Custo: Ajuste de Orçamento"
        });
      }

      if (high.length === 0) {
        high.push({
          title: `🔍 Pesquisa de Preços da Concorrência & Auditoria SEO do Produto Campeão '${prodA}'`,
          desc: `O produto '${prodA}' vendeu ${mlData.prod_a_atual} unidades (recuo de ${prodAUnitsLost} unidades). Ação: Fazer benchmark dos 5 concorrentes líderes no catálogo do ML, ajustar o preço com base na calculadora para obter margem líquida de ${margemAlvo}% e incluir palavras-chave de alta busca na Ficha Técnica (GTIN/EAN, marca, modelo).`,
          meta: "Caminho Nativo: Mercado Livre > Pesquisa de Busca & Ficha Técnica | Prazo: 48 Horas | Responsável: Analista de SEO ML | Custo: R$ 0,00"
        });
      }

      medium.push({
        title: `📦 Reabastecimento Emergencial no Mercado Envios Full para o '${prodA}'`,
        desc: `Atualmente apenas ${mlData.pct_full}% das suas vendas estão no Full. Agendar envio de remessa de ${Math.max(50, prodAUnitsLost * 2)} unidades do '${prodA}' para o centro de distribuição para reativar o selo 'Chegará Amanhã' e recuperar a taxa de conversão de ${metrics.convAtual.toFixed(2)}% para ${metrics.convAnterior.toFixed(2)}%.`,
        meta: "Caminho Nativo: Mercado Livre > Gestão de Estoque Full > Enviar Estoque | Prazo: 5 Dias | Responsável: Gestor de Estoque | Custo: Logística de Envio"
      });

      medium.push({
        title: `📸 Reformulação de Fotos de Capa no Padrão ML (1200x1200px Fundo 100% Branco)`,
        desc: `Garantir foto principal 100% no padrão de fundo branco puro com resolução de 1200x1200px sem marca d'água ou textos adicionais para liberar a máxima distribuição no algoritmo de busca orgânica do Mercado Livre.`,
        meta: "Caminho Nativo: Mercado Livre > Meus Anúncios > Editar Fotos | Prazo: 7 Dias | Responsável: Designer Gráfico | Custo: R$ 0,00"
      });

      strategic.push({
        title: `🤝 Ativação da Central de Ofertas & Cadastramento no Programa de Afiliados do Mercado Livre`,
        desc: `Cadastrar a conta no programa oficial de afiliados do ML e inscrever os produtos campeões nas Campanhas de Ofertas da plataforma para atrair divulgadores externos no Instagram e TikTok.`,
        meta: "Caminho Nativo: Mercado Livre > Central de Ofertas & Afiliados | Prazo: 14 Dias | Responsável: Diretor Comercial | Custo: Comissão de Afiliados"
      });
    }

    return { high, medium, strategic };
  };

  const actions = generateActions();

  const loadDemoML = () => {
    setCurrentMarketplace('ml');
    document.body.className = 'ml-active';
    setActiveTab('tab-dashboard');
  };

  const loadDemoShopee = () => {
    setCurrentMarketplace('shopee');
    document.body.className = 'shopee-active';
    setActiveTab('tab-dashboard');
  };

  const loadDemoTikTok = () => {
    setCurrentMarketplace('tiktok');
    document.body.className = 'tiktok-active';
    setActiveTab('tab-dashboard');
  };

  const loadDemo5W2H = () => {
    setActiveTab('tab-alignment');
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    if (currentMarketplace === 'tiktok') {
      document.body.className = 'tiktok-active';
    } else if (currentMarketplace === 'shopee') {
      document.body.className = 'shopee-active';
    } else {
      document.body.className = 'ml-active';
    }
  }, [currentMarketplace]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
    document.body.classList.toggle('sidebar-collapsed');
  };

  return (
    <div className="layout-wrapper">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentMarketplace={currentMarketplace}
        setMarketplace={(mp) => {
          setCurrentMarketplace(mp);
        }}
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
      />

      <main className="main-wrapper">
        <Topbar 
          currentMarketplace={currentMarketplace}
          loadDemoML={loadDemoML}
          loadDemoShopee={loadDemoShopee}
          loadDemoTikTok={loadDemoTikTok}
          loadDemo5W2H={loadDemo5W2H}
          handlePrint={handlePrint}
          onOpenGeminiAI={() => setIsGeminiModalOpen(true)}
        />

        {activeTab === 'tab-input' && (
          currentMarketplace === 'tiktok' ? (
            <DataInputTikTok 
              tikTokData={tikTokData}
              setTikTokData={setTikTokData}
              onSubmitTikTok={(e) => {
                e.preventDefault();
                setActiveTab('tab-dashboard');
              }}
            />
          ) : currentMarketplace === 'shopee' ? (
            <DataInputShopee 
              shopeeData={shopeeData}
              setShopeeData={setShopeeData}
              onSubmitShopee={(e) => {
                e.preventDefault();
                setActiveTab('tab-dashboard');
              }}
            />
          ) : (
            <DataInputML 
              mlData={mlData}
              setMlData={setMlData}
              onSubmitML={(e) => {
                e.preventDefault();
                setActiveTab('tab-dashboard');
              }}
            />
          )
        )}

        {activeTab === 'tab-dashboard' && (
          <ExecutiveDashboard 
            metrics={metrics}
            currentMarketplace={currentMarketplace}
          />
        )}

        {activeTab === 'tab-diagnosis' && (
          <DiagnosisEngine 
            diagnosis={diagnosis}
            metrics={metrics}
            currentMarketplace={currentMarketplace}
            mlData={mlData}
            shopeeData={shopeeData}
            tikTokData={tikTokData}
            onGoTo5W2H={() => setActiveTab('tab-alignment')}
            onOpenGeminiAI={() => setIsGeminiModalOpen(true)}
          />
        )}

        {activeTab === 'tab-actions' && (
          <ActionPlan 
            actions={actions}
          />
        )}

        {activeTab === 'tab-alignment' && (
          <Plan5W2HModel 
            diagnosis={diagnosis}
            metrics={metrics}
            mlData={mlData}
            shopeeData={shopeeData}
            tikTokData={tikTokData}
            currentMarketplace={currentMarketplace}
            handlePrint={handlePrint}
          />
        )}

        {activeTab === 'tab-new-account' && (
          <AccountZeroPlaybook 
            currentMarketplace={currentMarketplace}
          />
        )}

        {activeTab === 'tab-calculator' && (
          <PricingCalculator 
            currentMarketplace={currentMarketplace}
          />
        )}
      </main>

      {/* MODAL IA GEMINI COPILOT */}
      <GeminiCopilotModal 
        isOpen={isGeminiModalOpen}
        onClose={() => setIsGeminiModalOpen(false)}
        metrics={metrics}
        diagnosis={diagnosis}
        currentMarketplace={currentMarketplace}
        mlData={mlData}
        shopeeData={shopeeData}
        tikTokData={tikTokData}
        onApplyPlan={() => setActiveTab('tab-alignment')}
      />

      {/* CHATBOT TUTORIAL FLUTUANTE */}
      <AppTutorialChatbot />
    </div>
  );
}
