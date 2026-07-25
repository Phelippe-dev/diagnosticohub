/* ==========================================================================
   Growth Hub - Mercado Livre & Shopee Key Account (KA) Performance Engine
   ========================================================================== */

let currentMarketplace = 'ml'; // 'ml' ou 'shopee'
let chartComparisonInstance = null;
let chartFunnelInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    initMarketplaceSwitcher();
    initTabs();
    initForms();
    initDemoData();
    initShopeeDemoData();
    init5W2HDemo();
    initPrintReport();
    initActionButtons();
    initPricingCalculator();
});

/* --------------------------------------------------------------------------
   1. MENU LATERAL & SIDEBAR COLLAPSE
   -------------------------------------------------------------------------- */
function initSidebar() {
    const sidebar = document.getElementById('app-sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');
    if (!toggleBtn || !sidebar) return;

    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('sidebar-collapsed');
        const icon = toggleBtn.querySelector('svg path');
        if (document.body.classList.contains('sidebar-collapsed')) {
            if (icon) icon.setAttribute('d', 'M9 18l6-6-6-6');
        } else {
            if (icon) icon.setAttribute('d', 'M15 18l-6-6 6-6');
        }
    });
}

/* --------------------------------------------------------------------------
   2. ALTERNADOR DE MARKETPLACE (SEGMENTED CONTROL SWITCHER)
   -------------------------------------------------------------------------- */
function initMarketplaceSwitcher() {
    const btnML = document.getElementById('mp-btn-ml');
    const btnShopee = document.getElementById('mp-btn-shopee');
    const containerML = document.getElementById('form-container-ml');
    const containerShopee = document.getElementById('form-container-shopee');
    const headerBadge = document.getElementById('header-channel-badge');
    const sidebarTag = document.getElementById('sidebar-channel-tag');

    const setMarketplace = (mp) => {
        currentMarketplace = mp;
        if (mp === 'shopee') {
            document.body.classList.remove('ml-active');
            document.body.classList.add('shopee-active');
            
            btnML.classList.remove('active');
            btnShopee.classList.add('active');

            if (containerML) containerML.classList.remove('active');
            if (containerShopee) containerShopee.classList.add('active');

            if (headerBadge) {
                headerBadge.innerHTML = `<span class="dot-indicator dot-shopee"></span> Shopee Key Account Hub`;
            }
            if (sidebarTag) sidebarTag.textContent = 'Shopee KA';

            // Sincroniza calculadora de precificação
            const calcMpSelect = document.getElementById('calc_marketplace');
            if (calcMpSelect && calcMpSelect.value !== 'shopee') {
                calcMpSelect.value = 'shopee';
                calcMpSelect.dispatchEvent(new Event('change'));
            }
        } else {
            document.body.classList.remove('shopee-active');
            document.body.classList.add('ml-active');

            btnShopee.classList.remove('active');
            btnML.classList.add('active');

            if (containerShopee) containerShopee.classList.remove('active');
            if (containerML) containerML.classList.add('active');

            if (headerBadge) {
                headerBadge.innerHTML = `<span class="dot-indicator dot-ml"></span> Mercado Livre Performance Hub`;
            }
            if (sidebarTag) sidebarTag.textContent = 'Mercado Livre';

            // Sincroniza calculadora de precificação
            const calcMpSelect = document.getElementById('calc_marketplace');
            if (calcMpSelect && calcMpSelect.value !== 'ml') {
                calcMpSelect.value = 'ml';
                calcMpSelect.dispatchEvent(new Event('change'));
            }
        }
    };

    if (btnML) btnML.addEventListener('click', () => setMarketplace('ml'));
    if (btnShopee) btnShopee.addEventListener('click', () => setMarketplace('shopee'));
}

/* --------------------------------------------------------------------------
   3. NAVEGAÇÃO POR ABAS LATERAIS
   -------------------------------------------------------------------------- */
function initTabs() {
    const tabs = document.querySelectorAll('.sidebar-nav-container .nav-tab');
    const panels = document.querySelectorAll('.tab-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const target = document.getElementById(tab.dataset.tab);
            if (target) target.classList.add('active');
        });
    });
}

/* --------------------------------------------------------------------------
   4. MANIPULAÇÃO DOS FORMULÁRIOS ML & SHOPEE
   -------------------------------------------------------------------------- */
function initForms() {
    const formML = document.getElementById('ml-data-form');
    if (formML) {
        formML.addEventListener('submit', (e) => {
            e.preventDefault();
            currentMarketplace = 'ml';
            const data = extractMLFormData();
            const metrics = calculateMetrics(data);
            
            renderDashboardCards(metrics, 'ml');
            renderCharts(metrics, 'ml');
            
            const diagnosis = runMLDiagnosisEngine(metrics, data);
            renderDiagnosisUI(diagnosis);
            
            const actions = generateMLActionPlan(diagnosis, metrics, data);
            renderActionPlanUI(actions);

            render5W2HAlignmentUI(diagnosis, metrics, data, 'ml');

            const tabDash = document.querySelector('[data-tab="tab-dashboard"]');
            if (tabDash) tabDash.click();
        });
    }

    const formShopee = document.getElementById('shopee-data-form');
    if (formShopee) {
        formShopee.addEventListener('submit', (e) => {
            e.preventDefault();
            currentMarketplace = 'shopee';
            const data = extractShopeeFormData();
            const metrics = calculateMetrics(data);

            renderDashboardCards(metrics, 'shopee');
            renderCharts(metrics, 'shopee');

            const diagnosis = runShopeeDiagnosisEngine(metrics, data);
            renderDiagnosisUI(diagnosis);

            const actions = generateShopeeActionPlan(diagnosis, metrics, data);
            renderActionPlanUI(actions);

            render5W2HAlignmentUI(diagnosis, metrics, data, 'shopee');

            const tabDash = document.querySelector('[data-tab="tab-dashboard"]');
            if (tabDash) tabDash.click();
        });
    }
}

function extractMLFormData() {
    return {
        periodoAtual: document.getElementById('periodo_atual').value,
        periodoAnterior: document.getElementById('periodo_anterior').value,
        
        fatAtual: parseFloat(document.getElementById('fat_atual').value) || 0,
        fatAnterior: parseFloat(document.getElementById('fat_anterior').value) || 0,
        
        vendasAtual: parseInt(document.getElementById('vendas_atual').value) || 0,
        vendasAnterior: parseInt(document.getElementById('vendas_anterior').value) || 0,
        
        visitasAtual: parseInt(document.getElementById('visitas_atual').value) || 0,
        visitasAnterior: parseInt(document.getElementById('visitas_anterior').value) || 0,
        
        ticketAtualRaw: parseFloat(document.getElementById('ticket_atual').value),
        ticketAnteriorRaw: parseFloat(document.getElementById('ticket_anterior').value),
        
        convAtualRaw: parseFloat(document.getElementById('conv_atual').value),
        convAnteriorRaw: parseFloat(document.getElementById('conv_anterior').value),
        
        tempoRespAtual: parseInt(document.getElementById('tempo_resp_atual').value) || 0,
        tempoRespAnterior: parseInt(document.getElementById('tempo_resp_anterior').value) || 0,
        
        reputacao: document.getElementById('reputacao').value,
        pctFull: parseFloat(document.getElementById('pct_full').value) || 0,
        
        pctReclamacoes: parseFloat(document.getElementById('pct_reclamacoes').value) || 0,
        pctCancelamentos: parseFloat(document.getElementById('pct_cancelamentos').value) || 0,
        pctAtrasos: parseFloat(document.getElementById('pct_atrasos').value) || 0,
        
        adsAtivo: document.getElementById('ads_ativo').value,
        acosAtual: parseFloat(document.getElementById('acos_atual').value) || 0,
        acosAnterior: parseFloat(document.getElementById('acos_anterior').value) || 0,
        
        adsFatAtual: parseFloat(document.getElementById('ads_fat_atual').value) || 0,
        adsFatAnterior: parseFloat(document.getElementById('ads_fat_anterior').value) || 0,
        
        participaAfiliados: document.getElementById('participa_afiliados').value,
        
        prodANome: document.getElementById('prod_a_nome').value || 'Produto A',
        prodAAtual: parseInt(document.getElementById('prod_a_atual').value) || 0,
        prodAAnterior: parseInt(document.getElementById('prod_a_anterior').value) || 0,
        
        prodBNome: document.getElementById('prod_b_nome').value || 'Produto B',
        prodBAtual: parseInt(document.getElementById('prod_b_atual').value) || 0,
        prodBAnterior: parseInt(document.getElementById('prod_b_anterior').value) || 0,
    };
}

function extractShopeeFormData() {
    return {
        periodoAtual: document.getElementById('shopee_periodo_atual').value,
        periodoAnterior: document.getElementById('shopee_periodo_anterior').value,

        fatAtual: parseFloat(document.getElementById('shopee_fat_atual').value) || 0,
        fatAnterior: parseFloat(document.getElementById('shopee_fat_anterior').value) || 0,

        vendasAtual: parseInt(document.getElementById('shopee_vendas_atual').value) || 0,
        vendasAnterior: parseInt(document.getElementById('shopee_vendas_anterior').value) || 0,

        visitasAtual: parseInt(document.getElementById('shopee_visitas_atual').value) || 0,
        visitasAnterior: parseInt(document.getElementById('shopee_visitas_anterior').value) || 0,

        ticketAtualRaw: parseFloat(document.getElementById('shopee_ticket_atual').value),
        ticketAnteriorRaw: parseFloat(document.getElementById('shopee_ticket_anterior').value),

        convAtualRaw: parseFloat(document.getElementById('shopee_conv_atual').value),
        convAnteriorRaw: parseFloat(document.getElementById('shopee_conv_anterior').value),

        penalidades: parseInt(document.getElementById('shopee_penalidades').value) || 0,
        taxaCancelamento: parseFloat(document.getElementById('shopee_taxa_cancelamento').value) || 0,
        taxaAtraso: parseFloat(document.getElementById('shopee_taxa_atraso').value) || 0,
        chatResponse: parseFloat(document.getElementById('shopee_chat_response').value) || 100,
        rating: parseFloat(document.getElementById('shopee_loja_rating').value) || 5.0,
        modalEnvio: document.getElementById('shopee_modal_envio').value,

        adsAtivo: document.getElementById('shopee_ads_ativo').value,
        acosAtual: parseFloat(document.getElementById('shopee_cir_atual').value) || 0,
        acosAnterior: parseFloat(document.getElementById('shopee_cir_anterior').value) || 0,

        adsFatAtual: parseFloat(document.getElementById('shopee_ads_fat_atual').value) || 0,
        adsFatAnterior: parseFloat(document.getElementById('shopee_ads_fat_anterior').value) || 0,

        toolVouchers: document.getElementById('shopee_tool_vouchers').checked,
        toolCombo: document.getElementById('shopee_tool_combo').checked,
        toolFlash: document.getElementById('shopee_tool_flash').checked,
        toolVideo: document.getElementById('shopee_tool_video').checked,
        toolAfiliados: document.getElementById('shopee_tool_afiliados').checked,

        prodANome: document.getElementById('shopee_prod_a_nome').value || 'Produto A Shopee',
        prodAAtual: parseInt(document.getElementById('shopee_prod_a_atual').value) || 0,
        prodAAnterior: parseInt(document.getElementById('shopee_prod_a_anterior').value) || 0,

        prodBNome: document.getElementById('shopee_prod_b_nome').value || 'Produto B Shopee',
        prodBAtual: parseInt(document.getElementById('shopee_prod_b_atual').value) || 0,
        prodBAnterior: parseInt(document.getElementById('shopee_prod_b_anterior').value) || 0,
    };
}

function calculateMetrics(d) {
    const ticketAtual = d.ticketAtualRaw || (d.vendasAtual > 0 ? d.fatAtual / d.vendasAtual : 0);
    const ticketAnterior = d.ticketAnteriorRaw || (d.vendasAnterior > 0 ? d.fatAnterior / d.vendasAnterior : 0);
    
    const convAtual = d.convAtualRaw || (d.visitasAtual > 0 ? (d.vendasAtual / d.visitasAtual) * 100 : 0);
    const convAnterior = d.convAnteriorRaw || (d.visitasAnterior > 0 ? (d.vendasAnterior / d.visitasAnterior) * 100 : 0);

    const pctChange = (curr, prev) => prev > 0 ? ((curr - prev) / prev) * 100 : 0;

    return {
        fatAtual: d.fatAtual,
        fatAnterior: d.fatAnterior,
        fatDelta: pctChange(d.fatAtual, d.fatAnterior),
        
        vendasAtual: d.vendasAtual,
        vendasAnterior: d.vendasAnterior,
        vendasDelta: pctChange(d.vendasAtual, d.vendasAnterior),
        
        visitasAtual: d.visitasAtual,
        visitasAnterior: d.visitasAnterior,
        visitasDelta: pctChange(d.visitasAtual, d.visitasAnterior),
        
        ticketAtual: ticketAtual,
        ticketAnterior: ticketAnterior,
        ticketDelta: pctChange(ticketAtual, ticketAnterior),
        
        convAtual: convAtual,
        convAnterior: convAnterior,
        convDelta: pctChange(convAtual, convAnterior),
        
        acosAtual: d.acosAtual,
        acosAnterior: d.acosAnterior,
        acosDelta: d.acosAtual - d.acosAnterior,
        
        prodADelta: pctChange(d.prodAAtual, d.prodAAnterior),
        prodBDelta: pctChange(d.prodBAtual, d.prodBAnterior)
    };
}

// Formatadores PT-BR
const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
const formatNumber = (val) => new Intl.NumberFormat('pt-BR').format(val);
const formatPercent = (val) => (val >= 0 ? `+${val.toFixed(1)}%` : `${val.toFixed(1)}%`);

function renderDashboardCards(m, channel) {
    const lblAdsTitle = document.getElementById('lbl-ads-title');
    if (lblAdsTitle) {
        lblAdsTitle.textContent = channel === 'shopee' ? 'CIR Shopee Ads (%)' : 'ACOS Mercado Ads (%)';
    }

    updateCard('fat', formatCurrency(m.fatAtual), `Anterior: ${formatCurrency(m.fatAnterior)}`, m.fatDelta);
    updateCard('vendas', `${formatNumber(m.vendasAtual)} un`, `Anterior: ${formatNumber(m.vendasAnterior)} un`, m.vendasDelta);
    updateCard('visitas', formatNumber(m.visitasAtual), `Anterior: ${formatNumber(m.visitasAnterior)}`, m.visitasDelta);
    updateCard('conv', `${m.convAtual.toFixed(2)}%`, `Anterior: ${m.convAnterior.toFixed(2)}%`, m.convDelta);
    updateCard('ticket', formatCurrency(m.ticketAtual), `Anterior: ${formatCurrency(m.ticketAnterior)}`, m.ticketDelta);
    
    const acosBadge = document.getElementById('badge-acos');
    document.getElementById('val-acos-atual').textContent = `${m.acosAtual.toFixed(1)}%`;
    document.getElementById('val-acos-ant').textContent = `Anterior: ${m.acosAnterior.toFixed(1)}%`;
    if (m.acosDelta > 0) {
        acosBadge.textContent = `+${m.acosDelta.toFixed(1)}% (Piorou)`;
        acosBadge.className = 'metric-badge badge-down';
    } else if (m.acosDelta < 0) {
        acosBadge.textContent = `${m.acosDelta.toFixed(1)}% (Melhorou)`;
        acosBadge.className = 'metric-badge badge-up';
    } else {
        acosBadge.textContent = 'Estável / Opcional';
        acosBadge.className = 'metric-badge badge-neutral';
    }
}

function updateCard(id, valCurr, valSub, delta) {
    document.getElementById(`val-${id}-atual`).textContent = valCurr;
    document.getElementById(`val-${id}-ant`).textContent = valSub;
    const badge = document.getElementById(`badge-${id}`);
    badge.textContent = formatPercent(delta);

    if (delta > 0) {
        badge.className = 'metric-badge badge-up';
    } else if (delta < 0) {
        badge.className = 'metric-badge badge-down';
    } else {
        badge.className = 'metric-badge badge-neutral';
    }
}

function renderCharts(m, channel) {
    const ctxComp = document.getElementById('chartComparison').getContext('2d');
    if (chartComparisonInstance) chartComparisonInstance.destroy();

    const barColor = channel === 'shopee' 
        ? (m.fatDelta >= 0 ? 'rgba(255, 87, 34, 0.85)' : 'rgba(239, 68, 68, 0.85)')
        : (m.fatDelta >= 0 ? 'rgba(255, 214, 0, 0.85)' : 'rgba(239, 68, 68, 0.85)');

    const barBorder = channel === 'shopee' ? '#ff5722' : '#ffd600';

    chartComparisonInstance = new Chart(ctxComp, {
        type: 'bar',
        data: {
            labels: ['Faturamento (R$)', 'Vendas (Un)', 'Visitas (x10)'],
            datasets: [
                {
                    label: 'Período Anterior',
                    data: [m.fatAnterior, m.vendasAnterior, m.visitasAnterior / 10],
                    backgroundColor: 'rgba(148, 163, 184, 0.4)',
                    borderColor: 'rgba(148, 163, 184, 0.8)',
                    borderWidth: 1
                },
                {
                    label: 'Período Atual',
                    data: [m.fatAtual, m.vendasAtual, m.visitasAtual / 10],
                    backgroundColor: barColor,
                    borderColor: barBorder,
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', weight: '600' } } }
            },
            scales: {
                x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.04)' } },
                y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.04)' } }
            }
        }
    });

    const ctxFunnel = document.getElementById('chartFunnel').getContext('2d');
    if (chartFunnelInstance) chartFunnelInstance.destroy();

    const lineColor = channel === 'shopee' ? '#ff5722' : '#ffd600';
    const lineBg = channel === 'shopee' ? 'rgba(255, 87, 34, 0.12)' : 'rgba(255, 214, 0, 0.12)';

    chartFunnelInstance = new Chart(ctxFunnel, {
        type: 'line',
        data: {
            labels: ['Período Anterior', 'Período Atual'],
            datasets: [
                {
                    label: 'Taxa de Conversão (%)',
                    data: [m.convAnterior, m.convAtual],
                    borderColor: lineColor,
                    backgroundColor: lineBg,
                    fill: true,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', weight: '600' } } }
            },
            scales: {
                x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.04)' } },
                y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.04)' } }
            }
        }
    });
}

/* --------------------------------------------------------------------------
   5. MOTOR DE DIAGNÓSTICO DE CAUSA RAIZ (ML & SHOPEE)
   -------------------------------------------------------------------------- */
function runMLDiagnosisEngine(m, d) {
    let mainPainPoint = "";
    let mainDesc = "";
    let statusLevel = "warning";

    let visScore = 100 + m.visitasDelta;
    let convScore = 100 + m.convDelta;
    let logScore = d.pctFull >= 60 ? 90 : (d.pctFull >= 30 ? 60 : 30);
    let adsScore = d.acosAtual <= 18 ? 95 : (d.acosAtual <= 25 ? 70 : 40);

    visScore = Math.max(10, Math.min(100, visScore));
    convScore = Math.max(10, Math.min(100, convScore));

    if (m.fatDelta < 0) {
        statusLevel = "danger";
        if (m.convDelta < -15 && m.visitasDelta >= -5) {
            mainPainPoint = "🚨 PERDA CRÍTICA DE CONVERSÃO ML (OFERTA & COMPETITIVIDADE)";
            mainDesc = `O tráfego se manteve (Visitas: ${formatPercent(m.visitasDelta)}), porém a Taxa de Conversão desabou em ${formatPercent(m.convDelta)} (de ${m.convAnterior.toFixed(2)}% para ${m.convAtual.toFixed(2)}%). Isso indica perda de atratividade da oferta: concorrência baixou preços, falta de estoque no Full ou reclamações afetando a confiança do comprador.`;
        } else if (m.visitasDelta < -15 && m.convDelta >= -10) {
            mainPainPoint = "📉 QUEDA SEVERA DE VISIBILIDADE ML (SEO & ALGORITMO ORGÂNICO)";
            mainDesc = `A conversão se manteve relativamente estável, mas a conta perdeu ${formatPercent(m.visitasDelta)} das visitas. Isso decorre de perda de relevância no algoritmo do ML (queda no ranking da categoria), perda de medalha/reputação, tempo de resposta alto ou fim de estoque no Full dos campeões Curva A.`;
        } else if (d.acosAtual > 25 && m.acosDelta > 5) {
            mainPainPoint = "💸 INEFICIÊNCIA DE MERCADO ADS & EROSÃO DE MARGEM";
            mainDesc = `O custo de publicidade (ACOS) disparou para ${d.acosAtual.toFixed(1)}% (aumento de +${m.acosDelta.toFixed(1)}%). O investimento em anúncios está canibalizando a margem sem gerar crescimento de faturamento orgânico.`;
        } else if (d.pctFull < 50 && d.pctFull > 0) {
            mainPainPoint = "📦 GARGALO LOGÍSTICO ML & DEPENDÊNCIA DE MODAL LENTO";
            mainDesc = `Apenas ${d.pctFull}% das suas vendas estão no Full. No Mercado Livre atual, anúncios no Fulfillment convertem até 3x mais e possuem tag de entrega no dia seguinte, superando anúncios de coleta/agência.`;
        } else {
            mainPainPoint = "⚠️ CONCUSTO DE QUEDA DE VOLUME E MARGEM EM CURVA A";
            mainDesc = `Queda geral de faturamento (${formatPercent(m.fatDelta)}) impulsionada pela redução de vendas nos produtos principais (${d.prodANome}: ${formatPercent(m.prodADelta)}).`;
        }
    } else {
        statusLevel = "success";
        mainPainPoint = "🚀 CONTA MERCADO LIVRE EM CRESCIMENTO!";
        mainDesc = `Sua conta apresentou crescimento de +${m.fatDelta.toFixed(1)}% no faturamento. O objetivo agora é acelerar a participação em Afiliados, otimizar publicidade para aumentar margem líquida e expandir estoque no Full.`;
    }

    return { mainPainPoint, mainDesc, statusLevel, scores: { visScore, convScore, logScore, adsScore } };
}

function runShopeeDiagnosisEngine(m, d) {
    let mainPainPoint = "";
    let mainDesc = "";
    let statusLevel = "warning";

    let visScore = 100 + m.visitasDelta;
    let convScore = 100 + m.convDelta;
    let logScore = (d.taxaCancelamento <= 2.0 && d.taxaAtraso <= 2.0) ? 95 : (d.taxaCancelamento <= 4.0 ? 55 : 20);
    let adsScore = d.acosAtual <= 15 ? 95 : (d.acosAtual <= 22 ? 70 : 35);

    visScore = Math.max(10, Math.min(100, visScore));
    convScore = Math.max(10, Math.min(100, convScore));

    if (d.penalidades > 0 || d.chatResponse < 85 || d.taxaCancelamento > 2.0 || d.taxaAtraso > 2.0) {
        statusLevel = "danger";
        mainPainPoint = "🚨 RISCO OPERACIONAL SHOPEE: PERDA DE VENDEDOR INDICADO & PENALIDADES";
        mainDesc = `A conta acumula ${d.penalidades} ponto(s) de penalização e problemas de SLA (Chat: ${d.chatResponse}%, Cancelamento NFR: ${d.taxaCancelamento}%). Na Shopee, isso remove o selo de Vendedor Indicado, reduz a exposição nas buscas e impede participação nas Grandes Campanha de Key Account.`;
    } else if (m.fatDelta < 0) {
        statusLevel = "danger";
        if (d.acosAtual > 20 && m.acosDelta > 4) {
            mainPainPoint = "💸 CIR DE SHOPEE ADS DISPARADO & DESPERDÍCIO DE MÍDIA";
            mainDesc = `O CIR (ACOS da Shopee) subiu para ${d.acosAtual.toFixed(1)}%. O gasto com Shopee Ads aumentou enquanto o GMV total caiu (${formatPercent(m.fatDelta)}). É necessário negativar palavras irrelevantes e ajustar o orçamento diário.`;
        } else if (m.convDelta < -10) {
            mainPainPoint = "🛍️ QUEDA DE CONVERSÃO SHOPEE (FALTA DE VOUCHERS & COMBOS)";
            mainDesc = `A conversão caiu ${formatPercent(m.convDelta)}. Na Shopee, compradores exigem Cupons da Loja (Vouchers) e ofertas atrativas como Combo (Leve+Por-) para concluir o carrinho.`;
        } else {
            mainPainPoint = "📉 QUEDA DE TRÁFEGO E VENDAS NOS CAMPEÕES SHOPEE";
            mainDesc = `O faturamento na Shopee recuou ${formatPercent(m.fatDelta)}, com queda de vendas no top produto (${d.prodANome}: ${formatPercent(m.prodADelta)}).`;
        }
    } else {
        statusLevel = "success";
        mainPainPoint = "🧡 CONTA SHOPEE KA EM EXPANSÃO DE VENDAS!";
        mainDesc = `Sua loja na Shopee cresceu +${m.fatDelta.toFixed(1)}% no faturamento. Próximos passos de KA: Ativar Shopee Live/Vídeo, programa de Afiliados e ofertas relâmpago.`;
    }

    return { mainPainPoint, mainDesc, statusLevel, scores: { visScore, convScore, logScore, adsScore } };
}

function renderDiagnosisUI(diag) {
    document.getElementById('diag-main-title').textContent = diag.mainPainPoint;
    document.getElementById('diag-main-desc').textContent = diag.mainDesc;

    const badge = document.getElementById('diag-badge-main');
    if (diag.statusLevel === 'danger') {
        badge.textContent = 'ALERTA CRÍTICO DE PERFORMANCE';
        badge.style.background = 'var(--danger-bg)';
        badge.style.color = 'var(--danger)';
    } else if (diag.statusLevel === 'success') {
        badge.textContent = 'SAÚDE EXCELENTE';
        badge.style.background = 'var(--success-bg)';
        badge.style.color = 'var(--success)';
    } else {
        badge.textContent = 'ATENÇÃO REQUERIDA';
        badge.style.background = 'var(--warning-bg)';
        badge.style.color = 'var(--warning)';
    }

    document.getElementById('bar-visib').style.width = `${diag.scores.visScore}%`;
    document.getElementById('bar-conv').style.width = `${diag.scores.convScore}%`;
    document.getElementById('bar-log').style.width = `${diag.scores.logScore}%`;
    document.getElementById('bar-ads').style.width = `${diag.scores.adsScore}%`;
}

/* --------------------------------------------------------------------------
   6. GERADOR DE PLANO DE AÇÃO PRIORIZADO (ML & SHOPEE)
   -------------------------------------------------------------------------- */
function generateMLActionPlan(diag, m, d) {
    const high = [];
    const medium = [];
    const strategic = [];

    if (d.pctReclamacoes > 2.0 || d.pctAtrasos > 6.0 || d.pctCancelamentos > 1.0) {
        high.push({
            title: "🚨 Mutirão de Bloqueio de Danos à Reputação ML",
            desc: `Reclamações (${d.pctReclamacoes}%) ou atrasos (${d.pctAtrasos}%) acima dos limites do ML. Entre em contato com compradores antes que virem mediação.`,
            meta: "Prazo: 24h | Impacto: Proteção de Reputação Verde Escuro"
        });
    }

    if (m.acosAtual > 25) {
        high.push({
            title: "🛑 Negativar Palavras e Pausar Anúncios de Ads Ineficientes ML",
            desc: `Com ACOS em ${d.acosAtual}%, mude a meta para Modo Rentabilidade e negative termos desinteressantes.`,
            meta: "Prazo: 24h | Impacto: Estancar sangria de margem"
        });
    }

    if (m.prodADelta < -20) {
        high.push({
            title: `⚡ Auditoria Emergencial no Produto Curva A (${d.prodANome})`,
            desc: `O produto caiu ${formatPercent(m.prodADelta)}. Verifique destaque em catálogo, estoque no Full ou concorrente com oferta relâmpago.`,
            meta: "Prazo: 24h | Impacto: Recuperação de faturamento principal"
        });
    }

    if (high.length === 0) {
        high.push({
            title: "🔍 Monitorar Estoque e Preços da Concorrência Direta ML",
            desc: "Checagem diária dos 5 concorrentes diretos dos top 3 produtos da conta no Mercado Livre.",
            meta: "Prazo: 48h | Impacto: Manutenção de relevância"
        });
    }

    medium.push({
        title: "📦 Enviar Reabastecimento para Mercado Envios Full",
        desc: "Agendar envio de remessa para a curva A e B de produtos. Anúncios no Full ganham o selo 'Chegará Amanhã'.",
        meta: "Prazo: 5 dias | Impacto: Aumento de 2x a 3x na taxa de conversão"
    });

    medium.push({
        title: "📸 Reformular Imagens de Capa e Vídeo Demonstrativo",
        desc: "Garantir fundo 100% branco (2500x2500px), infográficos com os principais benefícios e vídeo no anúncio.",
        meta: "Prazo: 7 dias | Impacto: Aumento de cliques nas buscas"
    });

    strategic.push({
        title: "🤝 Ativar Programa de Afiliados do Mercado Livre",
        desc: "Cadastrar a conta no programa de afiliados do ML para criadores divulgarem seus produtos por comissão.",
        meta: "Prazo: 14 dias | Impacto: Tráfego externo qualificado"
    });

    return { high, medium, strategic };
}

function generateShopeeActionPlan(diag, m, d) {
    const high = [];
    const medium = [];
    const strategic = [];

    if (d.penalidades > 0 || d.chatResponse < 85 || d.taxaCancelamento > 2.0) {
        high.push({
            title: "🚨 Mutirão Emergencial de SLA & Resposta de Chat (< 12h) Shopee",
            desc: `Taxa de Chat em ${d.chatResponse}% e Cancelamento em ${d.taxaCancelamento}%. Atribuir operador para responder 100% dos chats em menos de 12 horas e zerar estoques fura-filha para eliminar cancelamentos por falta de item.`,
            meta: "Prazo: 24h | Impacto: Recuperação do Selo Vendedor Indicado"
        });
    }

    if (m.acosAtual > 20) {
        high.push({
            title: "🛑 Otimização Rigorosa do Shopee Ads (Ajuste de Palavras & Match)",
            desc: `CIR do Shopee Ads em ${d.acosAtual}%. Mudar anúncios de busca de correspondência ampla para correspondência exata e pausar palavras-chave com mais de 20 cliques sem conversão.`,
            meta: "Prazo: 24h | Impacto: Redução imediata de custo por clique (CPC)"
        });
    }

    if (high.length === 0) {
        high.push({
            title: "📦 Verificação de Estoque e Prazos de Postagem na Shopee",
            desc: "Garantir postagem de pedidos em menos de 24 horas úteis no ponto de coleta Shopee Xpress.",
            meta: "Prazo: 24h | Impacto: SLA de Envio Superior"
        });
    }

    if (!d.toolVouchers || !d.toolCombo) {
        medium.push({
            title: "🏷️ Ativar Cupons da Loja (Vouchers) & Combo (Leve+Por-)",
            desc: "Cadastrar Voucher de Desconto de 5% para novos seguidores e criar regras de Combo (Ex: Compre 2 leve 10% de desconto) para subir a conversão no carrinho.",
            meta: "Prazo: 3 dias | Impacto: +25% em taxa de conversão e Ticket Médio"
        });
    }

    medium.push({
        title: "⚡ Cadastrar Anúncios Campeões em Ofertas Relâmpago Shopee (Flash Sale)",
        desc: "Inscrever os 3 produtos campeões no módulo de Oferta Relâmpago da Loja no Central de Marketing para gerar picos de venda.",
        meta: "Prazo: 5 dias | Impacto: Explosão de visitas em 24h"
    });

    if (!d.toolAfiliados || !d.toolVideo) {
        strategic.push({
            title: "📱 Ativar Programa de Afiliados Shopee & Postagens no Shopee Vídeo",
            desc: "Cadastrar produtos na taxa de comissão extra de afiliados Shopee e publicar vídeos curtos (15-30s) demonstrativos do produto no Shopee Vídeo.",
            meta: "Prazo: 14 dias | Impacto: Tráfego orgânico nativo de redes sociais"
        });
    }

    strategic.push({
        title: "👑 Negociação de Campanhas Exclusivas com Gerente de Conta (KA Shopee)",
        desc: "Apresentar plano de faturamento e solicitar slots exclusivos em banners de categoria e push notifications com o gestor KA Shopee.",
        meta: "Prazo: 30 dias | Impacto: Destaque de grandes datas (11.11, 12.12)"
    });

    return { high, medium, strategic };
}

function renderActionPlanUI(actions) {
    renderCategory('list-high-priority', actions.high);
    renderCategory('list-medium-priority', actions.medium);
    renderCategory('list-strategic-priority', actions.strategic);

    updateActionProgress();
}

function renderCategory(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    items.forEach((item, idx) => {
        const div = document.createElement('div');
        div.className = 'action-item';
        div.innerHTML = `
            <input type="checkbox" class="action-checkbox" id="chk-${containerId}-${idx}">
            <div class="action-content">
                <div class="action-title">${item.title}</div>
                <div class="action-desc">${item.desc}</div>
                <div class="action-meta">${item.meta}</div>
            </div>
        `;
        container.appendChild(div);

        div.querySelector('.action-checkbox').addEventListener('change', (e) => {
            if (e.target.checked) {
                div.classList.add('completed');
            } else {
                div.classList.remove('completed');
            }
            updateActionProgress();
        });
    });
}

function updateActionProgress() {
    const checkboxes = document.querySelectorAll('.action-checkbox');
    const checked = document.querySelectorAll('.action-checkbox:checked');

    const total = checkboxes.length;
    const count = checked.length;
    const pct = total > 0 ? (count / total) * 100 : 0;

    const bar = document.getElementById('action-progress-bar');
    const txt = document.getElementById('action-progress-text');

    if (bar) bar.style.width = `${pct}%`;
    if (txt) txt.textContent = `${count} de ${total} concluídas (${pct.toFixed(0)}%)`;
}

function render5W2HAlignmentUI(diag, m, d, channel) {
    const targetConv = (m.convAtual * 1.35).toFixed(2);
    const channelName = channel === 'shopee' ? 'Shopee' : 'Mercado Livre';
    
    const metaTitle = document.getElementById('5w2h-meta-title');
    const metaDesc = document.getElementById('5w2h-meta-desc');

    if (metaTitle) metaTitle.textContent = `Elevar Conversão na ${channelName} de ${m.convAtual.toFixed(2)}% para ${targetConv}% em 15 Dias`;
    if (metaDesc) metaDesc.textContent = `Alinhamento 5W2H direcionado ao gargalo identificado na ${channelName}: ${diag.mainPainPoint}.`;

    const smartList = document.getElementById('5w2h-smart-list');
    if (smartList) {
        smartList.innerHTML = `
            <li><strong>S (Específica):</strong> Foco nos produtos Curva A (${d.prodANome}) na ${channelName}.</li>
            <li><strong>M (Mensurável):</strong> Elevar conversão de ${m.convAtual.toFixed(2)}% para ${targetConv}%.</li>
            <li><strong>A (Atingível):</strong> Ajuste de foto, cupom/voucher de loja e otimização de tráfego.</li>
            <li><strong>R (Relevante):</strong> Recuperar faturamento de ${formatCurrency(Math.abs(m.fatAnterior - m.fatAtual))}.</li>
            <li><strong>T (Temporal):</strong> Prazo de 15 dias com revisão quinzenal das métricas.</li>
        `;
    }

    const okrObj = document.getElementById('5w2h-okr-obj');
    const okrList = document.getElementById('5w2h-okr-kr-list');

    if (okrObj) okrObj.textContent = `🎯 Objetivo: Restabelecer a eficiência comercial e conversão dos produtos na ${channelName}`;
    if (okrList) {
        okrList.innerHTML = `
            <li><strong>Resultado-Chave 1:</strong> Elevar a taxa de conversão para ${targetConv}% em 15 dias.</li>
            <li><strong>Resultado-Chave 2:</strong> Reduzir a taxa de mídia (ACOS/CIR) para níveis rentáveis.</li>
            <li><strong>Resultado-Chave 3:</strong> Garantir 100% de cumprimento dos SLAs operacionais.</li>
        `;
    }
}

/* --------------------------------------------------------------------------
   7. CARREGAMENTO DE DADOS DE EXEMPLO (ML, SHOPEE & 5W2H)
   -------------------------------------------------------------------------- */
function initDemoData() {
    const btn = document.getElementById('btn-load-demo');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const btnML = document.getElementById('mp-btn-ml');
        if (btnML) btnML.click();

        document.getElementById('periodo_atual').value = '01/06 a 30/06';
        document.getElementById('periodo_anterior').value = '01/05 a 31/05';
        
        document.getElementById('fat_atual').value = 142500.00;
        document.getElementById('fat_anterior').value = 185000.00;
        
        document.getElementById('vendas_atual').value = 1250;
        document.getElementById('vendas_anterior').value = 1600;
        
        document.getElementById('visitas_atual').value = 45000;
        document.getElementById('visitas_anterior').value = 48000;
        
        document.getElementById('ticket_atual').value = 114.00;
        document.getElementById('ticket_anterior').value = 115.62;
        
        document.getElementById('conv_atual').value = 2.78;
        document.getElementById('conv_anterior').value = 3.33;
        
        document.getElementById('tempo_resp_atual').value = 24;
        document.getElementById('tempo_resp_anterior').value = 12;
        
        document.getElementById('reputacao').value = 'Verde Escuro';
        document.getElementById('pct_full').value = 42.0;
        document.getElementById('pct_reclamacoes').value = 1.4;
        document.getElementById('pct_cancelamentos').value = 0.8;
        document.getElementById('pct_atrasos').value = 4.2;
        
        document.getElementById('ads_ativo').value = 'Sim';
        document.getElementById('acos_atual').value = 28.5;
        document.getElementById('acos_anterior').value = 16.2;
        document.getElementById('ads_fat_atual').value = 42000.00;
        document.getElementById('ads_fat_anterior').value = 55000.00;
        document.getElementById('participa_afiliados').value = 'Sim';
        
        document.getElementById('prod_a_nome').value = 'Kit Ferramentas Pro 110 Peças';
        document.getElementById('prod_a_atual').value = 380;
        document.getElementById('prod_a_anterior').value = 620;
        
        document.getElementById('prod_b_nome').value = 'Parafusadeira Sem Fio 18V';
        document.getElementById('prod_b_atual').value = 290;
        document.getElementById('prod_b_anterior').value = 310;

        document.getElementById('ml-data-form').dispatchEvent(new Event('submit'));
    });
}

function initShopeeDemoData() {
    const btn = document.getElementById('btn-load-shopee-demo');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const btnShopee = document.getElementById('mp-btn-shopee');
        if (btnShopee) btnShopee.click();

        document.getElementById('shopee_periodo_atual').value = '01/06 a 30/06';
        document.getElementById('shopee_periodo_anterior').value = '01/05 a 31/05';

        document.getElementById('shopee_fat_atual').value = 112000.00;
        document.getElementById('shopee_fat_anterior').value = 158000.00;

        document.getElementById('shopee_vendas_atual').value = 1400;
        document.getElementById('shopee_vendas_anterior').value = 1950;

        document.getElementById('shopee_visitas_atual').value = 52000;
        document.getElementById('shopee_visitas_anterior').value = 55000;

        document.getElementById('shopee_ticket_atual').value = 80.00;
        document.getElementById('shopee_ticket_anterior').value = 81.02;

        document.getElementById('shopee_conv_atual').value = 2.69;
        document.getElementById('shopee_conv_anterior').value = 3.55;

        document.getElementById('shopee_penalidades').value = 4;
        document.getElementById('shopee_taxa_cancelamento').value = 3.8;
        document.getElementById('shopee_taxa_atraso').value = 4.2;
        document.getElementById('shopee_chat_response').value = 74.0;
        document.getElementById('shopee_loja_rating').value = 4.6;
        document.getElementById('shopee_modal_envio').value = 'shopee_xpress';

        document.getElementById('shopee_ads_ativo').value = 'Sim';
        document.getElementById('shopee_cir_atual').value = 24.5;
        document.getElementById('shopee_cir_anterior').value = 12.0;

        document.getElementById('shopee_ads_fat_atual').value = 32000.00;
        document.getElementById('shopee_ads_fat_anterior').value = 48000.00;

        document.getElementById('shopee_tool_vouchers').checked = true;
        document.getElementById('shopee_tool_combo').checked = false;
        document.getElementById('shopee_tool_flash').checked = false;

        document.getElementById('shopee_prod_a_nome').value = 'Kit Capas de Almofada 40x40 (4 Unidades)';
        document.getElementById('shopee_prod_a_atual').value = 420;
        document.getElementById('shopee_prod_a_anterior').value = 850;

        document.getElementById('shopee_prod_b_nome').value = 'Jogo de Lençol Casal 4 Peças';
        document.getElementById('shopee_prod_b_atual').value = 310;
        document.getElementById('shopee_prod_b_anterior').value = 390;

        document.getElementById('shopee-data-form').dispatchEvent(new Event('submit'));
    });
}

function init5W2HDemo() {
    const btn = document.getElementById('btn-load-5w2h-demo');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const btnML = document.getElementById('mp-btn-ml');
        if (btnML) btnML.click();

        document.getElementById('periodo_atual').value = '01/06 a 30/06';
        document.getElementById('periodo_anterior').value = '01/05 a 31/05';
        document.getElementById('fat_atual').value = 98000.00;
        document.getElementById('fat_anterior').value = 140000.00;
        document.getElementById('vendas_atual').value = 800;
        document.getElementById('vendas_anterior').value = 1200;
        document.getElementById('visitas_atual').value = 66000;
        document.getElementById('visitas_anterior').value = 70000;
        document.getElementById('conv_atual').value = 1.21;
        document.getElementById('conv_anterior').value = 1.71;
        document.getElementById('acos_atual').value = 32.0;
        document.getElementById('acos_anterior').value = 18.0;

        document.getElementById('ml-data-form').dispatchEvent(new Event('submit'));

        const tabAlign = document.querySelector('[data-tab="tab-alignment"]');
        if (tabAlign) tabAlign.click();
    });
}

/* --------------------------------------------------------------------------
   8. IMPRESSÃO PDF EM TEMA ESCURO
   -------------------------------------------------------------------------- */
function initPrintReport() {
    const printHandler = () => {
        const activeTab = document.querySelector('.sidebar-nav-container .nav-tab.active');
        const activeTabId = activeTab ? activeTab.dataset.tab : 'tab-input';

        if (activeTabId !== 'tab-calculator') {
            document.querySelectorAll('.tab-panel').forEach(p => {
                if (p.id === 'tab-calculator') {
                    p.classList.remove('active');
                } else {
                    p.classList.add('active');
                }
            });
        }

        window.print();

        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        const currentTarget = document.getElementById(activeTabId);
        if (currentTarget) currentTarget.classList.add('active');
    };

    const btnPrint = document.getElementById('btn-print-report');
    if (btnPrint) btnPrint.addEventListener('click', printHandler);

    const btnPrint5W2H = document.getElementById('btn-print-5w2h');
    if (btnPrint5W2H) btnPrint5W2H.addEventListener('click', printHandler);

    const btnGoTo5W2H = document.getElementById('btn-go-to-5w2h');
    if (btnGoTo5W2H) {
        btnGoTo5W2H.addEventListener('click', () => {
            const tab5 = document.querySelector('[data-tab="tab-alignment"]');
            if (tab5) tab5.click();
        });
    }
}

/* --------------------------------------------------------------------------
   9. BOTÕES DE CHECKLIST DO PLANO DE AÇÃO
   -------------------------------------------------------------------------- */
function initActionButtons() {
    const btnCheckAll = document.getElementById('btn-check-all');
    if (btnCheckAll) {
        btnCheckAll.addEventListener('click', () => {
            document.querySelectorAll('.action-checkbox').forEach(chk => {
                chk.checked = true;
                const parent = chk.closest('.action-item');
                if (parent) parent.classList.add('completed');
            });
            updateActionProgress();
        });
    }

    const btnUncheckAll = document.getElementById('btn-uncheck-all');
    if (btnUncheckAll) {
        btnUncheckAll.addEventListener('click', () => {
            document.querySelectorAll('.action-checkbox').forEach(chk => {
                chk.checked = false;
                const parent = chk.closest('.action-item');
                if (parent) parent.classList.remove('completed');
            });
            updateActionProgress();
        });
    }
}

/* --------------------------------------------------------------------------
   10. CALCULADORA DE PRECIFICAÇÃO MERCADO LIVRE & SHOPEE
   -------------------------------------------------------------------------- */
function initPricingCalculator() {
    const calcForm = document.getElementById('calc-form');
    const calcMpSelect = document.getElementById('calc_marketplace');
    const fieldsML = document.getElementById('calc-fields-ml');
    const fieldsShopee = document.getElementById('calc-fields-shopee');
    if (!calcForm || !calcMpSelect) return;

    calcMpSelect.addEventListener('change', () => {
        const mp = calcMpSelect.value;
        const resTitle = document.getElementById('res-detalhe-titulo');
        
        if (mp === 'shopee') {
            if (fieldsML) fieldsML.style.display = 'none';
            if (fieldsShopee) fieldsShopee.style.display = 'block';
            if (resTitle) resTitle.textContent = 'Detalhamento Operacional Shopee (Taxas KA)';
        } else {
            if (fieldsShopee) fieldsShopee.style.display = 'none';
            if (fieldsML) fieldsML.style.display = 'block';
            if (resTitle) resTitle.textContent = 'Detalhamento Operacional Mercado Livre (Regras 2026)';
        }
        computePricing();
    });

    const computePricing = () => {
        const mp = calcMpSelect.value;
        const custoProd = parseFloat(document.getElementById('calc_custo').value) || 0;
        const precoVenda = parseFloat(document.getElementById('calc_preco_venda').value) || 0;
        const pctImposto = parseFloat(document.getElementById('calc_imposto').value) || 0;
        const custoEmbalagem = parseFloat(document.getElementById('calc_embalagem').value) || 0;

        let valorComissao = 0;
        let taxaFixa = 0;
        let custoFreteReal = 0;
        let valorDescontoCupom = 0;

        if (mp === 'shopee') {
            const pctComissaoBase = parseFloat(document.getElementById('calc_shopee_comissao').value) || 14;
            const pctFreteExtra = parseFloat(document.getElementById('calc_shopee_frete_extra').value) || 0;
            const pctComissaoTotal = pctComissaoBase + pctFreteExtra;
            const pctCupom = parseFloat(document.getElementById('calc_shopee_cupom').value) || 0;

            const comissaoBruta = (precoVenda * pctComissaoTotal) / 100;
            valorComissao = Math.min(100.00, comissaoBruta);

            taxaFixa = 4.00;
            valorDescontoCupom = (precoVenda * pctCupom) / 100;
            custoFreteReal = 0;
        } else {
            const pctComissao = parseFloat(document.getElementById('calc_tipo_anuncio').value) || 16;
            const freteBaseFaixa = parseFloat(document.getElementById('calc_peso_faixa').value) || 0;
            const modalLogistico = document.getElementById('calc_modal_logistico').value || 'full';
            const rawDescReputacao = document.getElementById('calc_desc_reputacao').value;
            const pctDescReputacao = rawDescReputacao === 'none' ? 0 : (parseFloat(rawDescReputacao) || 0);

            if (precoVenda < 79.00 && precoVenda > 0) {
                taxaFixa = 6.50;
                custoFreteReal = 0;
            } else if (precoVenda >= 79.00) {
                if (freteBaseFaixa > 0) {
                    const fatorDesconto = (100 - pctDescReputacao) / 100;
                    custoFreteReal = freteBaseFaixa * fatorDesconto;
                    if (modalLogistico === 'full') {
                        custoFreteReal = custoFreteReal * 0.95;
                    }
                }
            }

            valorComissao = (precoVenda * pctComissao) / 100;
        }

        const valorImposto = (precoVenda * pctImposto) / 100;
        const custoTotalDeducoes = valorComissao + taxaFixa + custoFreteReal + valorDescontoCupom + valorImposto + custoEmbalagem + custoProd;
        const lucroLiquido = precoVenda - custoTotalDeducoes;
        const margemLiquidaPct = precoVenda > 0 ? (lucroLiquido / precoVenda) * 100 : 0;

        const pctDeducoesVariaveis = mp === 'shopee'
            ? ((parseFloat(document.getElementById('calc_shopee_comissao').value) || 14) + (parseFloat(document.getElementById('calc_shopee_frete_extra').value) || 0) + (parseFloat(document.getElementById('calc_shopee_cupom').value) || 0) + pctImposto) / 100
            : ((parseFloat(document.getElementById('calc_tipo_anuncio').value) || 16) + pctImposto) / 100;

        const custosFixosTotais = custoProd + custoEmbalagem + taxaFixa + custoFreteReal;
        const precoMinimoBreakEven = pctDeducoesVariaveis < 1 ? custosFixosTotais / (1 - pctDeducoesVariaveis) : 0;

        document.getElementById('res-lucro-rs').textContent = formatCurrency(lucroLiquido);
        document.getElementById('res-margem-pct').textContent = `${margemLiquidaPct.toFixed(1)}%`;
        document.getElementById('res-taxa-comissao').textContent = formatCurrency(valorComissao);
        document.getElementById('res-taxa-fixa').textContent = formatCurrency(taxaFixa);
        document.getElementById('res-frete-gratis').textContent = formatCurrency(custoFreteReal);
        
        if (mp === 'shopee') {
            document.getElementById('res-desc-aplicado').textContent = valorDescontoCupom > 0 ? `${formatCurrency(valorDescontoCupom)} (Cupom Vendedor)` : 'Sem Cupom';
        } else {
            document.getElementById('res-desc-aplicado').textContent = precoVenda >= 79 ? 'Desconto Reputação Aplicado' : 'Isento (< R$ 79)';
        }

        document.getElementById('res-impostos-emb').textContent = formatCurrency(valorImposto + custoEmbalagem);
        document.getElementById('res-custo-prod').textContent = formatCurrency(custoProd);
        document.getElementById('res-preco-minimo').textContent = formatCurrency(precoMinimoBreakEven);
    };

    calcForm.addEventListener('submit', (e) => {
        e.preventDefault();
        computePricing();
    });

    calcForm.querySelectorAll('input, select').forEach(elem => {
        elem.addEventListener('change', computePricing);
        elem.addEventListener('input', computePricing);
    });

    computePricing();
}
