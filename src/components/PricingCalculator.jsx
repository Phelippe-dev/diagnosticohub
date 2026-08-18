import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, AlertTriangle, CheckCircle, Info, Zap, ShoppingBag, Video, HelpCircle } from 'lucide-react';
import FormattedInput from './FormattedInput';

// ============================================================
// TABELAS OFICIAIS 2026 — SHOPEE BRASIL
// Fonte: Shopee Central do Vendedor (Março/2026)
// ============================================================
const SHOPEE_FAIXAS = [
  {
    label: 'Até R$ 79,99',
    min: 0, max: 79.99,
    comissao: 20.0,    // inclui taxa de transação + frete grátis obrigatorio
    taxaFixa: 4.00,
    subsidioFrete: 20.00,
    descFrete: 'Subsídio oficial de Frete Grátis de até R$ 20,00',
  },
  {
    label: 'R$ 80,00 a R$ 99,99',
    min: 80, max: 99.99,
    comissao: 14.0,
    taxaFixa: 16.00,
    subsidioFrete: 30.00,
    descFrete: 'Subsídio oficial de Frete Grátis de até R$ 30,00',
    subsidioPixPct: 5.0,
  },
  {
    label: 'R$ 100,00 a R$ 199,99',
    min: 100, max: 199.99,
    comissao: 14.0,
    taxaFixa: 20.00,
    subsidioFrete: 30.00,
    descFrete: 'Subsídio oficial de Frete Grátis de até R$ 30,00',
    subsidioPixPct: 5.0,
  },
  {
    label: 'R$ 200,00 a R$ 499,99',
    min: 200, max: 499.99,
    comissao: 14.0,
    taxaFixa: 26.00,
    subsidioFrete: 40.00,
    descFrete: 'Subsídio oficial de Frete Grátis de até R$ 40,00',
    subsidioPixPct: 5.0,
  },
  {
    label: 'Acima de R$ 500,00',
    min: 500, max: Infinity,
    comissao: 14.0,
    taxaFixa: 26.00,
    subsidioFrete: 40.00,
    descFrete: 'Subsídio oficial de Frete Grátis de até R$ 40,00',
    subsidioPixPct: 8.0,
  },
];

// ============================================================
// TABELAS OFICIAIS 2026 — MERCADO LIVRE BRASIL
// Fonte: Central do Vendedor ML (Regras de Frete & Comissões 2026)
// ============================================================
const ML_CATEGORIAS = [
  { label: 'Geral / Utilidades Domésticas', classico: 11, premium: 16 },
  { label: 'Ferramentas / Construção', classico: 11, premium: 16 },
  { label: 'Alimentos / Bebidas / Pets', classico: 12, premium: 17 },
  { label: 'Calçados / Bolsas / Acessórios', classico: 13, premium: 18 },
  { label: 'Moda / Roupas / Têxteis', classico: 14, premium: 19 },
  { label: 'Esportes / Lazer / Brinquedos', classico: 11, premium: 16 },
  { label: 'Informática / Eletrônicos', classico: 10, premium: 15 },
  { label: 'Celulares / Smartphones', classico: 10, premium: 15 },
  { label: 'Saúde / Beleza / Higiene', classico: 12, premium: 17 },
  { label: 'Automotivo / Moto Peças', classico: 11, premium: 16 },
  { label: 'Livros / Papelaria', classico: 10, premium: 15 },
  { label: 'Industria e Comércio', classico: 11, premium: 16 },
];

const ML_FRETE_BASE = [
  { label: 'Até 300g', pesoMax: 0.3, freteBase: 18.50 },
  { label: '300g a 500g', pesoMax: 0.5, freteBase: 21.90 },
  { label: '500g a 1kg', pesoMax: 1.0, freteBase: 24.50 },
  { label: '1kg a 2kg', pesoMax: 2.0, freteBase: 28.90 },
  { label: '2kg a 5kg', pesoMax: 5.0, freteBase: 36.50 },
  { label: '5kg a 10kg', pesoMax: 10.0, freteBase: 48.00 },
  { label: 'Acima de 10kg', pesoMax: 999, freteBase: 65.00 },
];

const ML_REPUTACAO = [
  { label: 'MercadoLíder Platinum / Gold — 70% Off no Frete', descPct: 70 },
  { label: 'MercadoLíder Silver — 50% Off no Frete', descPct: 50 },
  { label: 'Reputação Verde Escuro — 40% Off no Frete', descPct: 40 },
  { label: 'Reputação Verde Claro — 20% Off no Frete', descPct: 20 },
  { label: 'Sem Reputação / Amarela — 0% Off no Frete', descPct: 0 },
];

const formatBRL = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);
const formatPct = (v) => `${(v || 0).toFixed(2).replace('.', ',')}%`;

export default function PricingCalculator({ currentMarketplace }) {
  const [mp, setMp] = useState(currentMarketplace || 'ml');

  // Campos comuns
  const [custoProd, setCustoProd] = useState('35,00');
  const [precoVenda, setPrecoVenda] = useState('89,90');
  const [embalagem, setEmbalagem] = useState('3,00');
  const [imposto, setImposto] = useState('6,0');
  const [margemAlvo, setMargemAlvo] = useState('20,0');

  // Campos ML
  const [mlCategoria, setMlCategoria] = useState(0);
  const [mlTipoAnuncio, setMlTipoAnuncio] = useState('premium');
  const [mlFreteIdx, setMlFreteIdx] = useState(2);          // 500g a 1kg
  const [mlRepIdx, setMlRepIdx] = useState(2);              // Verde Escuro
  const [mlModal, setMlModal] = useState('full');
  const [mlMercadoAds, setMlMercadoAds] = useState('0');
  const [mlParcelamento, setMlParcelamento] = useState(false);

  // Campos Shopee
  const [shopeeTipoConta, setShopeeTipoConta] = useState('cnpj');
  const [shopeeCupom, setShopeeCupom] = useState('0,0');
  const [shopeeCampanha, setShopeeCampanha] = useState(false);
  const [shopeePix, setShopeePix] = useState(false);
  const [shopeeAfiliado, setShopeeAfiliado] = useState('0,0');
  const [shopeeAds, setShopeeAds] = useState('0,0');

  // Campos TikTok Shop (Regras Oficialmente Vigentes em 2026)
  const [tikTokAds, setTikTokAds] = useState('5,0');
  const [tikTokAffiliate, setTikTokAffiliate] = useState('12,0');
  const [tikTokFreeShipping, setTikTokFreeShipping] = useState(true);
  const [tikTokIsencao, setTikTokIsencao] = useState(false);

  useEffect(() => {
    if (currentMarketplace) setMp(currentMarketplace);
  }, [currentMarketplace]);

  const parseBRL = (str) => {
    if (typeof str === 'number') return str;
    const clean = String(str).replace(/\./g, '').replace(',', '.');
    return parseFloat(clean) || 0;
  };

  const numPreco = parseBRL(precoVenda);
  const numCusto = parseBRL(custoProd);
  const numEmb = parseBRL(embalagem);
  const numImp = parseBRL(imposto);
  const numMargAlvo = parseBRL(margemAlvo);

  // ============================================================
  // CÁLCULO MERCADO LIVRE (Com Auditoria Matemática Exata)
  // ============================================================
  const calcML = () => {
    const cat = ML_CATEGORIAS[mlCategoria];
    const pctComissao = mlTipoAnuncio === 'premium' ? cat.premium : cat.classico;
    const freteRow = ML_FRETE_BASE[mlFreteIdx];
    const repRow = ML_REPUTACAO[mlRepIdx];
    const numAcos = parseBRL(mlMercadoAds);

    let taxaFixa = 0;
    let custoFrete = 0;
    let custoParcelamento = 0;

    if (numPreco > 0 && numPreco < 79.00) {
      taxaFixa = freteRow.freteBase * 0.32;
    } else if (numPreco >= 79.00) {
      const descFator = (100 - repRow.descPct) / 100;
      custoFrete = freteRow.freteBase * descFator;
      if (mlModal === 'full') custoFrete = custoFrete * 0.92;
    }

    if (mlTipoAnuncio === 'premium' && mlParcelamento) {
      custoParcelamento = numPreco * 0.028;
    }

    const valorComissao = Number(((numPreco * pctComissao) / 100).toFixed(2));
    const valorImposto = Number(((numPreco * numImp) / 100).toFixed(2));
    const valorAds = Number(((numPreco * numAcos) / 100).toFixed(2));
    const valorParcelamento = Number(custoParcelamento.toFixed(2));
    const valorTaxaFixa = Number(taxaFixa.toFixed(2));
    const valorFrete = Number(custoFrete.toFixed(2));

    const totalCustos = Number((valorComissao + valorTaxaFixa + valorFrete + valorParcelamento + valorImposto + numEmb + numCusto + valorAds).toFixed(2));
    const lucro = Number((numPreco - totalCustos).toFixed(2));
    const margemPct = numPreco > 0 ? (lucro / numPreco) * 100 : 0;

    // Cálculo Dinâmico de Preço Breakeven e Preço Alvo
    const computeMLPriceForMarg = (targetPct) => {
      const pctVar = (pctComissao + numImp + numAcos + (mlTipoAnuncio === 'premium' && mlParcelamento ? 2.8 : 0)) / 100;
      const denom = 1 - (pctVar + targetPct / 100);
      if (denom <= 0) return 0;

      // Cenário 1: Preço >= R$ 79.00 (Frete Grátis Obrigatório)
      const descFator = (100 - repRow.descPct) / 100;
      let shippingHigh = freteRow.freteBase * descFator;
      if (mlModal === 'full') shippingHigh *= 0.92;
      const pHigh = (numCusto + numEmb + shippingHigh) / denom;
      if (pHigh >= 79.00) return pHigh;

      // Cenário 2: Preço < R$ 79.00 (Taxa de gestão logistica)
      const feeLow = freteRow.freteBase * 0.32;
      const pLow = (numCusto + numEmb + feeLow) / denom;
      return pLow;
    };

    const precoBreak = computeMLPriceForMarg(0);
    const precoMargAlvo = computeMLPriceForMarg(numMargAlvo);

    return {
      pctComissao, valorComissao, taxaFixa: valorTaxaFixa, custoFrete: valorFrete, custoParcelamento: valorParcelamento,
      valorImposto, valorAds, totalCustos, lucro, margemPct,
      precoBreak, precoMargAlvo,
      cat, freteRow, repRow, numAcos
    };
  };

  // ============================================================
  // CÁLCULO SHOPEE BRASIL (Com Auditoria Escalonada por Faixa)
  // ============================================================
  const calcShopee = () => {
    const faixa = SHOPEE_FAIXAS.find(f => numPreco >= f.min && numPreco <= f.max) || SHOPEE_FAIXAS[0];
    const numCupom = parseBRL(shopeeCupom);
    const numAfil = parseBRL(shopeeAfiliado);
    const numAds = parseBRL(shopeeAds);

    let pctTotal = faixa.comissao;
    let taxaFixa = faixa.taxaFixa;
    if (shopeeTipoConta === 'cpf_alto') taxaFixa += 3.00;
    if (shopeeCampanha) pctTotal += 2.5;

    let subsidioPixValor = 0;
    if (shopeePix && faixa.subsidioPixPct) {
      subsidioPixValor = Number(((numPreco * faixa.subsidioPixPct) / 100).toFixed(2));
    }

    const valorComissao = Number(((numPreco * pctTotal) / 100).toFixed(2));
    const valorCupom = Number(((numPreco * numCupom) / 100).toFixed(2));
    const valorAfil = Number(((numPreco * numAfil) / 100).toFixed(2));
    const valorAds = Number(((numPreco * numAds) / 100).toFixed(2));
    const valorImposto = Number(((numPreco * numImp) / 100).toFixed(2));
    const valorTaxaFixa = Number(taxaFixa.toFixed(2));

    const totalCustos = Number((valorComissao + valorTaxaFixa + valorCupom + valorAfil + valorAds + valorImposto + numEmb + numCusto - subsidioPixValor).toFixed(2));
    const lucro = Number((numPreco - totalCustos).toFixed(2));
    const margemPct = numPreco > 0 ? (lucro / numPreco) * 100 : 0;

    // Cálculo Dinâmico de Preço Breakeven e Preço Alvo testando as faixas oficiais
    const computeShopeePriceForMarg = (targetPct) => {
      const extraCPF = shopeeTipoConta === 'cpf_alto' ? 3.00 : 0;
      const extraCamp = shopeeCampanha ? 2.5 : 0;

      for (let f of SHOPEE_FAIXAS) {
        let pct = f.comissao + extraCamp;
        let fix = f.taxaFixa + extraCPF;
        let pixSub = (shopeePix && f.subsidioPixPct) ? f.subsidioPixPct : 0;

        const pctVar = (pct + numCupom + numAfil + numAds + numImp - pixSub) / 100;
        const denom = 1 - (pctVar + targetPct / 100);
        if (denom <= 0) continue;

        const pCalculated = (numCusto + numEmb + fix) / denom;
        if (pCalculated >= f.min && pCalculated <= f.max) {
          return pCalculated;
        }
      }
      // Se estrapolar a última faixa:
      const fLast = SHOPEE_FAIXAS[SHOPEE_FAIXAS.length - 1];
      let pct = fLast.comissao + extraCamp;
      let fix = fLast.taxaFixa + extraCPF;
      let pixSub = (shopeePix && fLast.subsidioPixPct) ? fLast.subsidioPixPct : 0;
      const pctVar = (pct + numCupom + numAfil + numAds + numImp - pixSub) / 100;
      const denom = 1 - (pctVar + targetPct / 100);
      return denom > 0 ? (numCusto + numEmb + fix) / denom : 0;
    };

    const precoBreak = computeShopeePriceForMarg(0);
    const precoMargAlvo = computeShopeePriceForMarg(numMargAlvo);

    return {
      faixa, pctTotal, valorComissao, taxaFixa: valorTaxaFixa, valorCupom, valorAfil, valorAds,
      subsidioPixValor, valorImposto, totalCustos, lucro, margemPct,
      precoBreak, precoMargAlvo
    };
  };

  // ============================================================
  // CÁLCULO TIKTOK SHOP BRASIL (Com Auditoria Oficial 2026)
  // ============================================================
  const calcTikTok = () => {
    const numAds = parseBRL(tikTokAds);
    const numAfil = parseBRL(tikTokAffiliate);

    // Tabela Oficial Jul/2026:
    // Preço < R$ 50: 10% comissão + R$ 4,00 taxa fixa
    // Preço >= R$ 50: 6% comissão + R$ 6,00 taxa fixa
    let pctComissao = numPreco < 50.00 ? 10.0 : 6.0;
    if (tikTokIsencao) pctComissao = 0;

    let taxaFixa = numPreco < 50.00 ? 4.00 : 6.00;

    // Frete Grátis Coparticipado TikTok (6% com limite máximo de R$ 50 por item)
    let custoFreteGratis = 0;
    if (tikTokFreeShipping) {
      custoFreteGratis = Math.min((numPreco * 6.0) / 100, 50.00);
    }

    const valorComissao = Number(((numPreco * pctComissao) / 100).toFixed(2));
    const valorFreteGratis = Number(custoFreteGratis.toFixed(2));
    const valorAfil = Number(((numPreco * numAfil) / 100).toFixed(2));
    const valorAds = Number(((numPreco * numAds) / 100).toFixed(2));
    const valorImposto = Number(((numPreco * numImp) / 100).toFixed(2));
    const valorTaxaFixa = Number(taxaFixa.toFixed(2));

    const totalCustos = Number((valorComissao + valorTaxaFixa + valorFreteGratis + valorAfil + valorAds + valorImposto + numEmb + numCusto).toFixed(2));
    const lucro = Number((numPreco - totalCustos).toFixed(2));
    const margemPct = numPreco > 0 ? (lucro / numPreco) * 100 : 0;

    // Cálculo Dinâmico de Preço Breakeven e Preço Alvo no TikTok Shop
    const computeTikTokPriceForMarg = (targetPct) => {
      const fsPct = tikTokFreeShipping ? 6.0 : 0;

      // Testar Faixa 1 (< R$ 50)
      let comm1 = tikTokIsencao ? 0 : 10.0;
      let pctVar1 = (comm1 + fsPct + numAfil + numAds + numImp) / 100;
      let denom1 = 1 - (pctVar1 + targetPct / 100);
      let p1 = denom1 > 0 ? (numCusto + numEmb + 4.00) / denom1 : 0;
      if (p1 > 0 && p1 < 50.00) return p1;

      // Testar Faixa 2 (>= R$ 50)
      let comm2 = tikTokIsencao ? 0 : 6.0;
      let pctVar2 = (comm2 + fsPct + numAfil + numAds + numImp) / 100;
      let denom2 = 1 - (pctVar2 + targetPct / 100);
      let p2 = denom2 > 0 ? (numCusto + numEmb + 6.00) / denom2 : 0;
      return p2;
    };

    const precoBreak = computeTikTokPriceForMarg(0);
    const precoMargAlvo = computeTikTokPriceForMarg(numMargAlvo);

    return {
      pctComissao, valorComissao, taxaFixa: valorTaxaFixa, custoFreteGratis: valorFreteGratis, valorAfil, valorAds,
      valorImposto, totalCustos, lucro, margemPct, precoBreak, precoMargAlvo
    };
  };

  const ml = calcML();
  const sh = calcShopee();
  const tk = calcTikTok();

  const res = mp === 'tiktok' ? tk : (mp === 'shopee' ? sh : ml);
  const accent = mp === 'tiktok' ? 'var(--tiktok-cyan)' : (mp === 'shopee' ? 'var(--shopee-orange)' : 'var(--ml-yellow)');
  const accentBg = mp === 'tiktok' ? 'var(--tiktok-cyan-bg)' : (mp === 'shopee' ? 'var(--shopee-orange-bg)' : 'var(--ml-yellow-bg)');
  const accentBorder = mp === 'tiktok' ? 'var(--tiktok-cyan-border)' : (mp === 'shopee' ? 'var(--shopee-orange-border)' : 'var(--ml-yellow-border)');

  const channelLabel = mp === 'tiktok' ? 'TikTok Shop Brasil' : (mp === 'shopee' ? 'Shopee Brasil' : 'Mercado Livre');

  const margemColor = res.margemPct >= numMargAlvo
    ? 'var(--success)' : res.margemPct >= 10
    ? 'var(--warning)' : 'var(--danger)';

  const margemIcon = res.margemPct >= numMargAlvo ? '✅' : res.margemPct >= 10 ? '⚠️' : '🚨';

  const handleNumInput = (val, setter) => setter(val);

  return (
    <div className="tab-panel">
      {/* Header */}
      <div className="card" style={{ marginBottom: '1.25rem', borderLeft: `4px solid ${accent}` }}>
        <div className="card-header flex-header">
          <div>
            <span className="badge" style={{ background: accentBg, color: accent, border: `1px solid ${accentBorder}` }}>
              AUDITORIA FINANCEIRA OFICIAL 2026 — {channelLabel.toUpperCase()}
            </span>
            <h2 style={{ marginTop: '0.4rem' }}>Calculadora de Precificação e Margem Real</h2>
            <p>Cálculos de alta exatidão baseados rigorosamente nas tabelas oficiais vigentes de 2026.</p>
          </div>
          <div className="segmented-control" style={{ maxWidth: '380px' }}>
            <button type="button" className={`seg-btn ${mp === 'ml' ? 'active' : ''}`} onClick={() => setMp('ml')}>
              <Zap size={14} /> ML
            </button>
            <button type="button" className={`seg-btn ${mp === 'shopee' ? 'active' : ''}`} onClick={() => setMp('shopee')}>
              <ShoppingBag size={14} /> Shopee
            </button>
            <button type="button" className={`seg-btn ${mp === 'tiktok' ? 'active' : ''}`} onClick={() => setMp('tiktok')}>
              <Video size={14} /> TikTok
            </button>
          </div>
        </div>
      </div>

      <div className="alignment-grid">
        {/* ===== COLUNA ESQUERDA — INPUTS ===== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Dados do produto */}
          <div className="card">
            <div className="card-header">
              <h3><Calculator size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />Dados de Custos do Vendedor</h3>
            </div>
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label>Custo de Aquisição / CMV (R$)</label>
              <FormattedInput type="currency" id="custoProd" value={custoProd}
                onChange={e => setCustoProd(e.target.value)}
                placeholder="Ex: 35,00" />
            </div>
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label>Preço de Venda Simulado (R$)</label>
              <FormattedInput type="currency" id="precoVenda" value={precoVenda}
                onChange={e => setPrecoVenda(e.target.value)}
                placeholder="Ex: 89,90" />
            </div>
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label>Custo de Embalagem e Insumos (R$)</label>
              <FormattedInput type="currency" id="embalagem" value={embalagem}
                onChange={e => setEmbalagem(e.target.value)}
                placeholder="Ex: 3,00" />
            </div>
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label>Alíquota de Imposto — Simples Nacional (%)</label>
              <FormattedInput type="decimal" id="imposto" value={imposto}
                onChange={e => setImposto(e.target.value)}
                placeholder="Ex: 6,0" />
            </div>
            <div className="form-group">
              <label>Margem Líquida Alvo Desejada (%)</label>
              <FormattedInput type="decimal" id="margemAlvo" value={margemAlvo}
                onChange={e => setMargemAlvo(e.target.value)}
                placeholder="Ex: 20,0" />
            </div>
          </div>

          {/* Configurações do Marketplace */}
          {mp === 'tiktok' ? (
            <div className="card">
              <div className="card-header">
                <h3>⚙️ Configurações TikTok Shop Brasil</h3>
                <p style={{ fontSize: '0.78rem', marginTop: '0.2rem', color: 'var(--text-muted)' }}>
                  Regra Oficial de Julho/2026 (Comissão 10% &lt; R$50 | 6% &gt;= R$50)
                </p>
              </div>

              <div style={{ padding: '0.75rem', background: 'var(--tiktok-cyan-bg)', border: '1px solid var(--tiktok-cyan-border)', borderRadius: 'var(--radius-sm)', marginBottom: '0.85rem' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--tiktok-cyan)', fontWeight: 700, marginBottom: '0.3rem' }}>
                  REGRA APLICADA PARA O PREÇO DE R$ {numPreco.toFixed(2)}
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                  Comissão Base: {tk.pctComissao}% + Tarifa Fixa por Item: {formatBRL(tk.taxaFixa)}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  {numPreco < 50.00 ? 'Produtos abaixo de R$ 50,00 aplicam 10% de comissão + R$ 4,00 por item' : 'Produtos de R$ 50,00 ou mais aplicam 6% de comissão + R$ 6,00 por item'}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label>Comissão de Afiliados TikTok (%)</label>
                <input type="text" inputMode="decimal" value={tikTokAffiliate}
                  onChange={e => setTikTokAffiliate(e.target.value)}
                  placeholder="Ex: 12,0 — informe 0 se não usa afiliados" />
              </div>

              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label>Investimento Mídia GMV Max Ads (%)</label>
                <input type="text" inputMode="decimal" value={tikTokAds}
                  onChange={e => setTikTokAds(e.target.value)}
                  placeholder="Ex: 5,0 — informe 0 se não usa Ads" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <input type="checkbox" id="tiktok_freeshipping" checked={tikTokFreeShipping} onChange={e => setTikTokFreeShipping(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                  <label htmlFor="tiktok_freeshipping" style={{ fontSize: '0.85rem', cursor: 'pointer', margin: 0 }}>
                    Programa de Frete Grátis Coparticipado TikTok (+6% taxa de serviço)
                  </label>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <input type="checkbox" id="tiktok_isencao" checked={tikTokIsencao} onChange={e => setTikTokIsencao(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                  <label htmlFor="tiktok_isencao" style={{ fontSize: '0.85rem', cursor: 'pointer', margin: 0 }}>
                    Isenção Promocional de Conta Nova (0% de comissão base por 60 dias)
                  </label>
                </div>
              </div>
            </div>
          ) : mp === 'shopee' ? (
            <div className="card">
              <div className="card-header">
                <h3>⚙️ Configurações Shopee Brasil</h3>
                <p style={{ fontSize: '0.78rem', marginTop: '0.2rem', color: 'var(--text-muted)' }}>
                  Tabela Oficial Escalonada por Faixa de Preço — Vigente em 2026
                </p>
              </div>

              {numPreco > 0 && (
                <div style={{ padding: '0.75rem', background: 'var(--shopee-orange-bg)', border: '1px solid var(--shopee-orange-border)', borderRadius: 'var(--radius-sm)', marginBottom: '0.85rem' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--shopee-orange)', fontWeight: 700, marginBottom: '0.3rem' }}>
                    FAIXA OFICIAL APLICADA AUTOMATICAMENTE
                  </div>
                  <div style={{ fontWeight: 600 }}>
                    {sh.faixa.label} — Comissão {sh.faixa.comissao}% + Taxa Fixa {formatBRL(sh.faixa.taxaFixa)}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    {sh.faixa.descFrete}
                  </div>
                </div>
              )}

              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label>Tipo de Conta do Vendedor</label>
                <select className="select-input" value={shopeeTipoConta} onChange={e => setShopeeTipoConta(e.target.value)}>
                  <option value="cnpj">CNPJ — Tabela Padrão Oficial</option>
                  <option value="cpf_alto">CPF com mais de 450 Pedidos em 90 dias (+R$ 3,00 taxa por item)</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label>Cupom da Loja — Desconto do Vendedor (%)</label>
                <input type="text" inputMode="decimal" value={shopeeCupom}
                  onChange={e => setShopeeCupom(e.target.value)}
                  placeholder="Ex: 5,0 — informe 0 se não usa" />
              </div>
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label>Taxa de Afiliados Shopee (%)</label>
                <input type="text" inputMode="decimal" value={shopeeAfiliado}
                  onChange={e => setShopeeAfiliado(e.target.value)}
                  placeholder="Ex: 3,0 — informe 0 se não participa" />
              </div>
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label>Shopee Ads — Custo de Mídia Pago (%)</label>
                <input type="text" inputMode="decimal" value={shopeeAds}
                  onChange={e => setShopeeAds(e.target.value)}
                  placeholder="Ex: 5,0 — informe 0 se não usa Ads" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <input type="checkbox" id="shopee_campanha" checked={shopeeCampanha} onChange={e => setShopeeCampanha(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                  <label htmlFor="shopee_campanha" style={{ fontSize: '0.85rem', cursor: 'pointer', margin: 0 }}>
                    Campanha de Destaque Shopee (+2,5% sobre o valor da venda)
                  </label>
                </div>

                {sh.faixa && sh.faixa.subsidioPixPct > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <input type="checkbox" id="shopee_pix" checked={shopeePix} onChange={e => setShopeePix(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                    <label htmlFor="shopee_pix" style={{ fontSize: '0.85rem', cursor: 'pointer', margin: 0 }}>
                      Pagamento via PIX — Subsídio Shopee (−{sh.faixa.subsidioPixPct}% de desconto no custo)
                    </label>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-header">
                <h3>⚙️ Configurações Mercado Livre</h3>
                <p style={{ fontSize: '0.78rem', marginTop: '0.2rem', color: 'var(--text-muted)' }}>
                  Tabela Oficial de Comissões e Frete Obrigatório por Reputação
                </p>
              </div>

              {/* REGRAS OFICIAIS ML 2026 + MUDANÇAS DE 24 DE AGOSTO */}
              <div style={{
                padding: '0.75rem 0.9rem',
                background: 'rgba(255, 214, 0, 0.04)',
                border: '1px solid var(--ml-yellow-border)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '0.85rem',
                fontSize: '0.78rem',
                lineHeight: '1.45'
              }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--ml-yellow)', fontWeight: 700, marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Zap size={14} />
                  <span>Regras Mercado Livre &amp; Atualização de 24 de Agosto</span>
                </div>
                <div style={{ color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <div>• <strong>Clássicos:</strong> 10% a 14% | <strong>Premium:</strong> 15% a 19% (12x sem juros ~2.8%).</div>
                  <div>• <strong>Abaixo de R$ 79:</strong> Isento de frete total, taxa de gestão logística de 32% sobre frete base.</div>
                  <div>• <strong>A partir de R$ 79:</strong> Frete grátis obrigatório (desconto até 70% para Líder Gold/Platinum).</div>
                  <div>• <strong>Full:</strong> 8% de desc. extra no frete | <strong>Afiliados:</strong> 3% a 7% comissão externa.</div>
                  <div style={{ borderTop: '1px dashed var(--ml-yellow-border)', paddingTop: '0.3rem', marginTop: '0.2rem', color: 'var(--ml-yellow)', fontWeight: 700 }}>
                    🚨 MUDANÇAS A PARTIR DE 24 DE AGOSTO:
                  </div>
                  <div>• <strong>Envios Flex:</strong> Cálculo dinâmico por <em>Peso, Dimensão do Pacote e Distância</em> (substitui taxa única).</div>
                  <div>• <strong>Custos de Envio:</strong> Reajustes nos fretes &lt;R$19 e &gt;R$19, e alterações no Frete Grátis Rápido (~R$0,90).</div>
                  <div>• <strong>Full Supermercado:</strong> Exige código EAN cadastrado na Lista Oficial de Produtos Selecionados.</div>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label>Categoria do Produto</label>
                <select className="select-input" value={mlCategoria} onChange={e => setMlCategoria(Number(e.target.value))}>
                  {ML_CATEGORIAS.map((c, i) => (
                    <option key={i} value={i}>{c.label} — Clássico {c.classico}% | Premium {c.premium}%</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label>Tipo de Anúncio ML</label>
                <select className="select-input" value={mlTipoAnuncio} onChange={e => setMlTipoAnuncio(e.target.value)}>
                  <option value="classico">Anúncio Clássico — {ML_CATEGORIAS[mlCategoria].classico}% de Comissão (Sem parcelamento sem juros)</option>
                  <option value="premium">Anúncio Premium — {ML_CATEGORIAS[mlCategoria].premium}% de Comissão (Permite 12x sem juros)</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label>Modal Logístico ML</label>
                <select className="select-input" value={mlModal} onChange={e => setMlModal(e.target.value)}>
                  <option value="full">Mercado Envios Full — Fulfillment CD (−8% no custo do frete)</option>
                  <option value="flex">Mercado Envios Flex — Entrega Própria no Mesmo Dia</option>
                  <option value="coleta">Coleta / Agência — Ponto de Coleta Oficial</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label>Faixa de Peso / Cubagem do Produto</label>
                <select className="select-input" value={mlFreteIdx} onChange={e => setMlFreteIdx(Number(e.target.value))}>
                  {ML_FRETE_BASE.map((f, i) => (
                    <option key={i} value={i}>{f.label} — Frete Base R$ {f.freteBase.toFixed(2).replace('.', ',')}</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label>Nível de Reputação / Desconto de Frete ML</label>
                <select className="select-input" value={mlRepIdx} onChange={e => setMlRepIdx(Number(e.target.value))}>
                  {ML_REPUTACAO.map((r, i) => (
                    <option key={i} value={i}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label>Mercado Ads — ACOS Atual (%)</label>
                <input type="text" inputMode="decimal" value={mlMercadoAds}
                  onChange={e => setMlMercadoAds(e.target.value)}
                  placeholder="Ex: 15,0 — informe 0 se não usa Ads" />
              </div>
              {mlTipoAnuncio === 'premium' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <input type="checkbox" id="ml_parcelamento" checked={mlParcelamento} onChange={e => setMlParcelamento(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                  <label htmlFor="ml_parcelamento" style={{ fontSize: '0.85rem', cursor: 'pointer', margin: 0 }}>
                    Incluir custo financeiro do parcelamento 12x sem juros (~2,8%)
                  </label>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ===== COLUNA DIREITA — RESULTADO AUDITADO ===== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* KPIs principais */}
          <div className="card" style={{ borderTop: `3px solid ${accent}` }}>
            <div className="card-header">
              <h3><TrendingUp size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                Resultado da Precificação — {channelLabel}
              </h3>
            </div>
            <div className="metrics-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
              <div className="metric-card">
                <div className="metric-title">Lucro Líquido por Venda</div>
                <div className="metric-value" style={{ color: res.lucro >= 0 ? 'var(--success)' : 'var(--danger)', fontSize: '1.35rem' }}>
                  {formatBRL(res.lucro)}
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-title">{margemIcon} Margem Líquida Real</div>
                <div className="metric-value" style={{ color: margemColor, fontSize: '1.35rem' }}>
                  {formatPct(res.margemPct)}
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-title">Total de Custos e Taxas</div>
                <div className="metric-value" style={{ color: 'var(--danger)', fontSize: '1.1rem' }}>
                  {formatBRL(res.totalCustos)}
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-title">Margem Alvo Configurada</div>
                <div className="metric-value" style={{ color: accent, fontSize: '1.1rem' }}>
                  {formatPct(numMargAlvo)}
                </div>
              </div>
            </div>

            {/* Status da margem */}
            <div style={{
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: res.margemPct >= numMargAlvo ? 'rgba(34,197,94,0.08)' : res.margemPct >= 10 ? 'rgba(234,179,8,0.08)' : 'rgba(239,68,68,0.08)',
              border: `1px solid ${res.margemPct >= numMargAlvo ? 'rgba(34,197,94,0.25)' : res.margemPct >= 10 ? 'rgba(234,179,8,0.25)' : 'rgba(239,68,68,0.25)'}`,
              marginBottom: '0.85rem'
            }}>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.3rem', color: margemColor }}>
                {res.margemPct >= numMargAlvo
                  ? `✅ Preço de R$ ${numPreco.toFixed(2)} atingiu a margem alvo de ${formatPct(numMargAlvo)}`
                  : res.margemPct >= 10
                  ? `⚠️ Margem de ${formatPct(res.margemPct)} abaixo do alvo — Preço sugerido: ${formatBRL(res.precoMargAlvo)}`
                  : `🚨 Risco de prejuízo! Margem de apenas ${formatPct(res.margemPct)} — Preço sugerido: ${formatBRL(res.precoMargAlvo)}`}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {res.margemPct < numMargAlvo && `Para alcançar sua margem de ${formatPct(numMargAlvo)}, o preço deve ser ajustado para ${formatBRL(res.precoMargAlvo)}.`}
              </div>
            </div>
          </div>

          {/* DRE detalhada e auditada do pedido */}
          <div className="card">
            <div className="card-header">
              <h3>📄 Demonstrativo DRE Auditado por Unidade Vendida</h3>
              <p style={{ fontSize: '0.78rem', marginTop: '0.2rem', color: 'var(--text-muted)' }}>
                Desmembramento de cada alíquota e taxa oficial do pedido
              </p>
            </div>
            <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span>(+) Preço de Venda Final:</span>
                <span>{formatBRL(numPreco)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--danger)' }}>
                <span>(−) Custo de Aquisição (CMV):</span>
                <span>− {formatBRL(numCusto)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--danger)' }}>
                <span>(−) Embalagem e Insumos:</span>
                <span>− {formatBRL(numEmb)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--danger)' }}>
                <span>(−) Imposto ({numImp}% Simples):</span>
                <span>− {formatBRL(res.valorImposto)}</span>
              </div>

              {mp === 'tiktok' ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--danger)' }}>
                    <span>(−) Comissão Base TikTok ({res.pctComissao}%):</span>
                    <span>− {formatBRL(res.valorComissao)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--danger)' }}>
                    <span>(−) Tarifa Fixa por Item Sold:</span>
                    <span>− {formatBRL(res.taxaFixa)}</span>
                  </div>
                  {res.custoFreteGratis > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--danger)' }}>
                      <span>(−) Frete Grátis Coparticipado (6%):</span>
                      <span>− {formatBRL(res.custoFreteGratis)}</span>
                    </div>
                  )}
                  {res.valorAfil > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--danger)' }}>
                      <span>(−) Comissão de Afiliados ({parseBRL(tikTokAffiliate)}%):</span>
                      <span>− {formatBRL(res.valorAfil)}</span>
                    </div>
                  )}
                  {res.valorAds > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--danger)' }}>
                      <span>(−) Mídia GMV Max Ads ({parseBRL(tikTokAds)}%):</span>
                      <span>− {formatBRL(res.valorAds)}</span>
                    </div>
                  )}
                </>
              ) : mp === 'shopee' ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--danger)' }}>
                    <span>(−) Comissão Shopee ({res.pctTotal}%):</span>
                    <span>− {formatBRL(res.valorComissao)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--danger)' }}>
                    <span>(−) Taxa Fixa por Item ({sh.faixa.label}):</span>
                    <span>− {formatBRL(res.taxaFixa)}</span>
                  </div>
                  {res.valorCupom > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--danger)' }}>
                      <span>(−) Cupom de Desconto da Loja ({parseBRL(shopeeCupom)}%):</span>
                      <span>− {formatBRL(res.valorCupom)}</span>
                    </div>
                  )}
                  {res.valorAfil > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--danger)' }}>
                      <span>(−) Comissão Afiliados Shopee ({parseBRL(shopeeAfiliado)}%):</span>
                      <span>− {formatBRL(res.valorAfil)}</span>
                    </div>
                  )}
                  {res.valorAds > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--danger)' }}>
                      <span>(−) Shopee Ads ({parseBRL(shopeeAds)}%):</span>
                      <span>− {formatBRL(res.valorAds)}</span>
                    </div>
                  )}
                  {res.subsidioPixValor > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
                      <span>(+) Subsídio PIX Shopee ({sh.faixa.subsidioPixPct}%):</span>
                      <span>+ {formatBRL(res.subsidioPixValor)}</span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--danger)' }}>
                    <span>(−) Comissão Mercado Livre ({res.pctComissao}%):</span>
                    <span>− {formatBRL(res.valorComissao)}</span>
                  </div>
                  {res.taxaFixa > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--danger)' }}>
                      <span>(−) Tarifa Fixa Gestão Logística (&lt; R$79):</span>
                      <span>− {formatBRL(res.taxaFixa)}</span>
                    </div>
                  )}
                  {res.custoFrete > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--danger)' }}>
                      <span>(−) Custo Frete Grátis Mercado Envios (&gt;= R$79):</span>
                      <span>− {formatBRL(res.custoFrete)}</span>
                    </div>
                  )}
                  {res.custoParcelamento > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--danger)' }}>
                      <span>(−) Parcelamento 12x Sem Juros (~2.8%):</span>
                      <span>− {formatBRL(res.custoParcelamento)}</span>
                    </div>
                  )}
                  {res.valorAds > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--danger)' }}>
                      <span>(−) Mercado Ads ({res.numAcos}%):</span>
                      <span>− {formatBRL(res.valorAds)}</span>
                    </div>
                  )}
                </>
              )}

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', marginTop: '0.3rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.95rem', color: res.lucro >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                <span>(=) Lucro Líquido Final:</span>
                <span>{formatBRL(res.lucro)} ({formatPct(res.margemPct)})</span>
              </div>
            </div>
          </div>

          {/* Breakeven e Preço Sugerido */}
          <div className="card">
            <div className="card-header">
              <h3>🎯 Ponto de Equilíbrio &amp; Preço Sugerido</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Preço Mínimo Breakeven (Zero Lucro/Zero Prejuízo):</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--warning)' }}>
                  {formatBRL(res.precoBreak)}
                </div>
              </div>

              <div style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', border: `1px solid ${accentBorder}` }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Preço Recomendado para {formatPct(numMargAlvo)} de Margem Líquida:</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: accent }}>
                  {formatBRL(res.precoMargAlvo)}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
