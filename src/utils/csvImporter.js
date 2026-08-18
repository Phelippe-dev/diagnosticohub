/**
 * Utilitário dinâmico para parsing de planilhas CSV / TSV de e-commerce
 */

// Limpa strings de moeda/porcentagem brasileiras e converte para valor numérico puro
export function parseNumberBR(val) {
  if (val === undefined || val === null) return '';
  let str = String(val).trim();
  if (!str) return '';
  
  // Se contiver R$, %, etc.
  str = str.replace(/[R$\s%]/g, '');
  
  // Se usa vírgula como separador decimal no padrão BR (ex: "1.500,50" -> "1500.50")
  if (str.includes(',') && str.includes('.')) {
    str = str.replace(/\./g, '').replace(',', '.');
  } else if (str.includes(',')) {
    str = str.replace(',', '.');
  }

  const num = parseFloat(str);
  return isNaN(num) ? '' : num;
}

// Converte texto bruto CSV/TSV em objeto de chaves e valores
export function parseCsvText(rawText) {
  if (!rawText || typeof rawText !== 'string') return {};

  const lines = rawText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  if (lines.length === 0) return {};

  // Detecta delimitador (;, \t ou ,)
  const firstLine = lines[0];
  let delimiter = ',';
  if (firstLine.includes(';')) delimiter = ';';
  else if (firstLine.includes('\t')) delimiter = '\t';

  // Se houver 2 linhas (Cabeçalho + Valores)
  if (lines.length >= 2) {
    const headers = splitCsvLine(lines[0], delimiter).map(h => normalizeKey(h));
    const values = splitCsvLine(lines[1], delimiter);

    const result = {};
    headers.forEach((header, idx) => {
      if (header && values[idx] !== undefined) {
        result[header] = values[idx].trim();
      }
    });
    return result;
  }

  // Se for lista de Chave: Valor (uma por linha ou separada por delimitador)
  const result = {};
  lines.forEach(line => {
    const parts = line.split(delimiter);
    if (parts.length >= 2) {
      const key = normalizeKey(parts[0]);
      const val = parts.slice(1).join(delimiter).trim();
      if (key) result[key] = val;
    } else if (line.includes(':')) {
      const partsColon = line.split(':');
      const key = normalizeKey(partsColon[0]);
      const val = partsColon.slice(1).join(':').trim();
      if (key) result[key] = val;
    }
  });

  return result;
}

function splitCsvLine(line, delimiter) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function normalizeKey(key) {
  return String(key || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
}

/**
 * Mapeia os valores extraídos da planilha para os campos do estado do formulário
 */
export function mapCsvToMarketplaceData(parsedMap, marketplace = 'ml') {
  const findVal = (possibleKeys) => {
    for (const key of possibleKeys) {
      const normKey = normalizeKey(key);
      if (parsedMap[normKey] !== undefined) return parsedMap[normKey];
      // Busca parcial
      const foundKey = Object.keys(parsedMap).find(k => k.includes(normKey) || normKey.includes(k));
      if (foundKey) return parsedMap[foundKey];
    }
    return '';
  };

  if (marketplace === 'ml') {
    return {
      periodo_atual: findVal(['periodo_atual', 'periodo', 'mes_atual']) || 'Mês Atual',
      periodo_anterior: findVal(['periodo_anterior', 'mes_anterior']) || 'Mês Anterior',
      fat_atual: parseNumberBR(findVal(['fat_atual', 'faturamento_atual', 'faturamento'])),
      fat_anterior: parseNumberBR(findVal(['fat_anterior', 'faturamento_anterior'])),
      vendas_atual: parseNumberBR(findVal(['vendas_atual', 'vendas', 'unidades_atual'])),
      vendas_anterior: parseNumberBR(findVal(['vendas_anterior', 'unidades_anterior'])),
      visitas_atual: parseNumberBR(findVal(['visitas_atual', 'visitas', 'acessos_atual'])),
      visitas_anterior: parseNumberBR(findVal(['visitas_anterior', 'acessos_anterior'])),
      ticket_atual: parseNumberBR(findVal(['ticket_atual', 'ticket_medio_atual'])),
      ticket_anterior: parseNumberBR(findVal(['ticket_anterior', 'ticket_medio_anterior'])),
      conv_atual: parseNumberBR(findVal(['conv_atual', 'conversao_atual', 'taxa_conversao'])),
      conv_anterior: parseNumberBR(findVal(['conv_anterior', 'conversao_anterior'])),
      tempo_resp_atual: parseNumberBR(findVal(['tempo_resp_atual', 'tempo_resposta'])),
      tempo_resp_anterior: parseNumberBR(findVal(['tempo_resp_anterior'])),
      reputacao: findVal(['reputacao']) || 'VerdeEscuro',
      pct_full: parseNumberBR(findVal(['pct_full', 'full_pct', 'penetracao_full'])),
      pct_reclamacoes: parseNumberBR(findVal(['pct_reclamacoes', 'reclamacoes'])),
      pct_cancelamentos: parseNumberBR(findVal(['pct_cancelamentos', 'cancelamentos'])),
      pct_atrasos: parseNumberBR(findVal(['pct_atrasos', 'atrasos'])),
      ads_ativo: findVal(['ads_ativo', 'ads']) === 'Sim' || findVal(['ads_ativo']) === 'true' ? 'Sim' : 'Não',
      acos_atual: parseNumberBR(findVal(['acos_atual', 'acos'])),
      acos_anterior: parseNumberBR(findVal(['acos_anterior'])),
      ads_fat_atual: parseNumberBR(findVal(['ads_fat_atual', 'investimento_ads'])),
      ads_fat_anterior: parseNumberBR(findVal(['ads_fat_anterior'])),
      prod_a_nome: findVal(['prod_a_nome', 'produto_a_nome', 'top_produto_1']) || '',
      prod_a_atual: parseNumberBR(findVal(['prod_a_atual', 'produto_a_faturamento'])),
      prod_a_anterior: parseNumberBR(findVal(['prod_a_anterior'])),
      prod_b_nome: findVal(['prod_b_nome', 'produto_b_nome', 'top_produto_2']) || '',
      prod_b_atual: parseNumberBR(findVal(['prod_b_atual', 'produto_b_faturamento'])),
      prod_b_anterior: parseNumberBR(findVal(['prod_b_anterior']))
    };
  }

  if (marketplace === 'shopee') {
    return {
      shopee_periodo_atual: findVal(['periodo_atual', 'periodo', 'shopee_periodo_atual']) || 'Mês Atual',
      shopee_periodo_anterior: findVal(['periodo_anterior', 'shopee_periodo_anterior']) || 'Mês Anterior',
      shopee_fat_atual: parseNumberBR(findVal(['shopee_fat_atual', 'fat_atual', 'faturamento_atual', 'gmv_atual'])),
      shopee_fat_anterior: parseNumberBR(findVal(['shopee_fat_anterior', 'fat_anterior', 'faturamento_anterior'])),
      shopee_vendas_atual: parseNumberBR(findVal(['shopee_vendas_atual', 'vendas_atual', 'pedidos_atual'])),
      shopee_vendas_anterior: parseNumberBR(findVal(['shopee_vendas_anterior', 'vendas_anterior'])),
      shopee_visitas_atual: parseNumberBR(findVal(['shopee_visitas_atual', 'visitas_atual', 'visualizacoes'])),
      shopee_visitas_anterior: parseNumberBR(findVal(['shopee_visitas_anterior', 'visitas_anterior'])),
      shopee_ticket_atual: parseNumberBR(findVal(['shopee_ticket_atual', 'ticket_atual'])),
      shopee_ticket_anterior: parseNumberBR(findVal(['shopee_ticket_anterior'])),
      shopee_conv_atual: parseNumberBR(findVal(['shopee_conv_atual', 'conv_atual', 'conversao'])),
      shopee_conv_anterior: parseNumberBR(findVal(['shopee_conv_anterior'])),
      shopee_penalidades: parseNumberBR(findVal(['shopee_penalidades', 'penalidades'])),
      shopee_taxa_cancelamento: parseNumberBR(findVal(['shopee_taxa_cancelamento', 'cancelamento'])),
      shopee_taxa_atraso: parseNumberBR(findVal(['shopee_taxa_atraso', 'atraso'])),
      shopee_chat_response: parseNumberBR(findVal(['shopee_chat_response', 'taxa_chat'])),
      shopee_loja_rating: parseNumberBR(findVal(['shopee_loja_rating', 'avaliacao_loja'])),
      shopee_ads_ativo: findVal(['shopee_ads_ativo', 'ads_ativo']) === 'Sim' ? 'Sim' : 'Não',
      shopee_cir_atual: parseNumberBR(findVal(['shopee_cir_atual', 'cir_atual', 'cir'])),
      shopee_cir_anterior: parseNumberBR(findVal(['shopee_cir_anterior'])),
      shopee_ads_fat_atual: parseNumberBR(findVal(['shopee_ads_fat_atual', 'investimento_ads'])),
      shopee_ads_fat_anterior: parseNumberBR(findVal(['shopee_ads_fat_anterior'])),
      shopee_prod_a_nome: findVal(['shopee_prod_a_nome', 'produto_a']) || '',
      shopee_prod_a_atual: parseNumberBR(findVal(['shopee_prod_a_atual'])),
      shopee_prod_a_anterior: parseNumberBR(findVal(['shopee_prod_a_anterior'])),
      shopee_prod_b_nome: findVal(['shopee_prod_b_nome', 'produto_b']) || '',
      shopee_prod_b_atual: parseNumberBR(findVal(['shopee_prod_b_atual'])),
      shopee_prod_b_anterior: parseNumberBR(findVal(['shopee_prod_b_anterior']))
    };
  }

  if (marketplace === 'tiktok') {
    return {
      tiktok_periodo_atual: findVal(['periodo_atual', 'periodo']) || 'Mês Atual',
      tiktok_periodo_anterior: findVal(['periodo_anterior']) || 'Mês Anterior',
      tiktok_fat_atual: parseNumberBR(findVal(['tiktok_fat_atual', 'fat_atual', 'gmv_atual'])),
      tiktok_fat_anterior: parseNumberBR(findVal(['tiktok_fat_anterior', 'fat_anterior'])),
      tiktok_vendas_atual: parseNumberBR(findVal(['tiktok_vendas_atual', 'vendas_atual', 'pedidos'])),
      tiktok_vendas_anterior: parseNumberBR(findVal(['tiktok_vendas_anterior'])),
      tiktok_visitas_atual: parseNumberBR(findVal(['tiktok_visitas_atual', 'visitas_atual', 'impressoes'])),
      tiktok_visitas_anterior: parseNumberBR(findVal(['tiktok_visitas_anterior'])),
      tiktok_ticket_atual: parseNumberBR(findVal(['tiktok_ticket_atual', 'ticket_atual'])),
      tiktok_ticket_anterior: parseNumberBR(findVal(['tiktok_ticket_anterior'])),
      tiktok_conv_atual: parseNumberBR(findVal(['tiktok_conv_atual', 'conv_atual', 'conversao'])),
      tiktok_conv_anterior: parseNumberBR(findVal(['tiktok_conv_anterior'])),
      tiktok_late_dispatch: parseNumberBR(findVal(['tiktok_late_dispatch', 'atraso_envio'])),
      tiktok_cancellation_rate: parseNumberBR(findVal(['tiktok_cancellation_rate', 'taxa_cancelamento'])),
      tiktok_return_rate: parseNumberBR(findVal(['tiktok_return_rate', 'taxa_devolucao'])),
      tiktok_shop_rating: parseNumberBR(findVal(['tiktok_shop_rating', 'shop_score'])),
      tiktok_ads_ativo: findVal(['tiktok_ads_ativo', 'ads_ativo']) === 'Sim' ? 'Sim' : 'Não',
      tiktok_roas_atual: parseNumberBR(findVal(['tiktok_roas_atual', 'roas_atual', 'roas'])),
      tiktok_roas_anterior: parseNumberBR(findVal(['tiktok_roas_anterior'])),
      tiktok_ads_spend_atual: parseNumberBR(findVal(['tiktok_ads_spend_atual', 'gasto_ads'])),
      tiktok_ads_spend_anterior: parseNumberBR(findVal(['tiktok_ads_spend_anterior']))
    };
  }

  return {};
}

/**
 * Gera e baixa uma planilha CSV de exemplo (Template) para o usuário preencher
 */
export function downloadCsvTemplate(marketplace = 'ml') {
  let filename = `modelo_importacao_${marketplace}.csv`;
  let csvContent = '';

  if (marketplace === 'ml') {
    csvContent = [
      'periodo_atual;periodo_anterior;fat_atual;fat_anterior;vendas_atual;vendas_anterior;visitas_atual;visitas_anterior;ticket_atual;ticket_anterior;conv_atual;conv_anterior;tempo_resp_atual;tempo_resp_anterior;reputacao;pct_full;pct_reclamacoes;pct_cancelamentos;pct_atrasos;ads_ativo;acos_atual;acos_anterior;ads_fat_atual;ads_fat_anterior;prod_a_nome;prod_a_atual;prod_a_anterior;prod_b_nome;prod_b_atual;prod_b_anterior',
      'Mês Atual;Mês Anterior;150000;185000;1200;1450;45000;52000;125;127.5;2.66;2.78;14;18;VerdeEscuro;65;0.8;0.3;1.5;Sim;14.5;18.2;35000;42000;Kit Camisetas Algodão;45000;55000;Calça Jeans Slim;28000;34000'
    ].join('\n');
  } else if (marketplace === 'shopee') {
    csvContent = [
      'shopee_periodo_atual;shopee_periodo_anterior;shopee_fat_atual;shopee_fat_anterior;shopee_vendas_atual;shopee_vendas_anterior;shopee_visitas_atual;shopee_visitas_anterior;shopee_ticket_atual;shopee_ticket_anterior;shopee_conv_atual;shopee_conv_anterior;shopee_penalidades;shopee_taxa_cancelamento;shopee_taxa_atraso;shopee_chat_response;shopee_loja_rating;shopee_ads_ativo;shopee_cir_atual;shopee_cir_anterior;shopee_ads_fat_atual;shopee_ads_fat_anterior;shopee_prod_a_nome;shopee_prod_a_atual;shopee_prod_a_anterior;shopee_prod_b_nome;shopee_prod_b_atual;shopee_prod_b_anterior',
      'Mês Atual;Mês Anterior;98000;120000;1960;2350;65000;78000;50;51;3.01;3.01;0;0.5;1.2;95;4.85;Sim;12.5;14.2;22000;28000;Kit Meias Performance;32000;39000;Fone Bluetooth TWS;18000;24000'
    ].join('\n');
  } else {
    csvContent = [
      'tiktok_periodo_atual;tiktok_periodo_anterior;tiktok_fat_atual;tiktok_fat_anterior;tiktok_vendas_atual;tiktok_vendas_anterior;tiktok_visitas_atual;tiktok_visitas_anterior;tiktok_ticket_atual;tiktok_ticket_anterior;tiktok_conv_atual;tiktok_conv_anterior;tiktok_late_dispatch;tiktok_cancellation_rate;tiktok_return_rate;tiktok_shop_rating;tiktok_ads_ativo;tiktok_roas_atual;tiktok_roas_anterior;tiktok_ads_spend_atual;tiktok_ads_spend_anterior',
      'Mês Atual;Mês Anterior;65000;82000;812;980;32000;38000;80;83.6;2.53;2.57;1.1;0.4;2.1;4.78;Sim;4.8;5.2;8500;11000'
    ].join('\n');
  }

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
