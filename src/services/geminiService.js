// Serviço de Integração com a IA Gemini da Google (Sem chaves expostas no bundle)
const DEFAULT_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const MODELS = [
  "models/gemini-3.6-flash",
  "models/gemini-3.1-flash-lite",
  "models/gemini-2.0-flash"
];

/**
 * Função utilitária para chamar a API REST do Gemini com fallback de modelos
 */
async function callGeminiApi(prompt, jsonMode = false, apiKeyOverride = null) {
  const key = (apiKeyOverride && apiKeyOverride.trim() !== "") 
    ? apiKeyOverride.trim() 
    : DEFAULT_API_KEY;

  if (!key) {
    throw new Error("Chave da API da IA Gemini não foi encontrada no arquivo .env nem informada no painel.");
  }

  let lastError = null;

  for (const model of MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${key}`;
      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
      };

      if (jsonMode) {
        payload.generationConfig = { responseMimeType: "application/json" };
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (textResponse) {
          return textResponse;
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        lastError = errData.error?.message || `Erro HTTP ${res.status}`;
      }
    } catch (err) {
      lastError = err.message;
    }
  }

  throw new Error(lastError || "Não foi possível comunicar com a IA Gemini.");
}

/**
 * Sanitiza a resposta bruta da IA removendo marcações markdown para parse JSON limpo
 */
function parseCleanJson(rawText) {
  if (!rawText) throw new Error("Resposta da IA vazia.");
  
  // Remove blocos de código ```json ... ```
  let cleaned = rawText
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    // Tenta encontrar o primeiro { até o último }
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error("Formato de resposta JSON inválido retornado pela IA.");
  }
}

/**
 * Gera um diagnóstico executivo avançado para a conta
 */
export async function generateAccountDiagnosis({
  metrics,
  currentMarketplace,
  mlData,
  shopeeData,
  tikTokData,
  apiKeyOverride = null
}) {
  const channelName = currentMarketplace === 'shopee' 
    ? 'Shopee' 
    : (currentMarketplace === 'tiktok' ? 'TikTok Shop' : 'Mercado Livre');

  const formatBRL = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  let specificDetails = "";
  if (currentMarketplace === 'shopee') {
    specificDetails = `
- Taxa de Resposta do Chat (CRR): ${shopeeData.shopee_chat_response}% (Meta > 85%)
- Avaliação da Loja: ${shopeeData.shopee_loja_rating} / 5.0 (Meta >= 4.6)
- Modal Logístico: ${shopeeData.shopee_modal_envio}
- CIR / ACOS Shopee Ads: ${shopeeData.shopee_cir_atual}% (Anterior: ${shopeeData.shopee_cir_anterior}%)
- Faturamento Vindo de Ads: ${formatBRL(shopeeData.shopee_ads_fat_atual)}
- Produto Campeão: '${shopeeData.shopee_prod_a_nome}' (${shopeeData.shopee_prod_a_atual} un atuais vs ${shopeeData.shopee_prod_a_anterior} un ant.)
    `;
  } else if (currentMarketplace === 'tiktok') {
    specificDetails = `
- ROAS Ads: ${tikTokData.tiktok_roas_atual}x (Anterior: ${tikTokData.tiktok_roas_anterior}x)
- Faturamento Ads: ${formatBRL(tikTokData.tiktok_ads_fat_atual)}
- Comissão Afiliados: ${tikTokData.tiktok_affiliate_commission}%
- Ferramentas Ativas: Afiliados (${tikTokData.tiktok_tool_affiliate ? 'Sim' : 'Não'}), Lives (${tikTokData.tiktok_tool_live ? 'Sim' : 'Não'}), Amostras Grátis (${tikTokData.tiktok_tool_samples ? 'Sim' : 'Não'})
    `;
  } else {
    specificDetails = `
- ACOS Mercado Ads: ${mlData.acos_atual}% (Anterior: ${mlData.acos_anterior}%)
- Faturamento Vindo de Ads: ${formatBRL(mlData.ads_fat_atual)}
- Vendas no Envios Full: ${mlData.pct_full}%
- Tempo Médio de Resposta: ${mlData.tempo_resp_atual} min (Anterior: ${mlData.tempo_resp_anterior} min)
- Taxa de Reclamações: ${mlData.pct_reclamacoes}% (Meta < 2.0%)
- Taxa de Atrasos na Expedição: ${mlData.pct_atrasos}% (Meta < 6.0%)
- Produto Campeão: '${mlData.prod_a_nome}' (${mlData.prod_a_atual} un atuais vs ${mlData.prod_a_anterior} un ant.)
    `;
  }

  const prompt = `Você é um Consultor Especialista de Inteligência de Mercado e E-commerce especializado em Mercado Livre, Shopee e TikTok Shop.
Analise detalhadamente o desempenho da conta a seguir e busque os diagnósticos exatos cruzando com todas as fontes web confiáveis do setor (Mercado Livre Seller Center, Shopee Seller Education Hub, TikTok Shop University, E-commerce Brasil, ABComm e relatórios oficiais de benchmark de ACOS/Conversão).

REGRA DE SEGURANÇA E FIDELIDADE DE DADOS:
- Seja 100% fiel aos valores fornecidos abaixo. NUNCA invente faturamentos ou métricas diferentes dos dados abaixo.
- Cite exatamente os valores de Faturamento, Conversão e ACOS/CIR/ROAS informados.

DADOS DA CONTA (${channelName}):
- Faturamento Atual: ${formatBRL(metrics.fatAtual)} | Anterior: ${formatBRL(metrics.fatAnterior)} (${metrics.fatDelta.toFixed(1)}%)
- Vendas Concluídas: ${metrics.vendasAtual} un | Anteriores: ${metrics.vendasAnterior} un (${metrics.vendasDelta.toFixed(1)}%)
- Visitas / Tráfego: ${metrics.visitasAtual.toLocaleString('pt-BR')} | Anteriores: ${metrics.visitasAnterior.toLocaleString('pt-BR')} (${metrics.visitasDelta.toFixed(1)}%)
- Ticket Médio: ${formatBRL(metrics.ticketAtual)} (Anterior: ${formatBRL(metrics.ticketAnterior)})
- Taxa de Conversão: ${metrics.convAtual.toFixed(2)}% (Anterior: ${metrics.convAnterior.toFixed(2)}%)
- ACOS / CIR / ROAS de Publicidade: ${metrics.acosAtual}% (Anterior: ${metrics.acosAnterior}%)

MÉTRICAS ESPECÍFICAS DO CANAL:
${specificDetails}

INSTRUÇÕES DE SAÍDA:
Retorne ESTRITAMENTE um objeto JSON válido (sem tags markdown ou textos fora do objeto JSON) contendo as chaves:
{
  "summaryText": "Síntese executiva cirúrgica e aprofundada com a explicação da causa matemática e estratégica dos resultados.",
  "keyCauses": [
    "Causa 1 com detalhes específicos de gargalos",
    "Causa 2 com métricas de comparação",
    "Causa 3 estratégica"
  ],
  "smartActions": [
    "Ação prioritária 1 com o que fazer e prazo recomendado",
    "Ação prioritária 2 para otimização de publicidade/conversão",
    "Ação prioritária 3 de alavancagem de vendas"
  ],
  "webSources": [
    "Mercado Livre Seller Center - Guia de Algoritmo & Full",
    "Shopee Ads Education - Benchmark de CIR por Categoria",
    "E-commerce Brasil - Relatório Anual de Margens e ACOS"
  ],
  "marketBenchmark": "Comparativo curto entre a taxa de conversão/ACOS desta conta vs a média saudável do mercado no mesmo segmento."
}`;

  const jsonRaw = await callGeminiApi(prompt, true, apiKeyOverride);
  return parseCleanJson(jsonRaw);
}

/**
 * Responde dúvidas do usuário no Chatbot Tutorial
 */
export async function askTutorialChatbot(userMessage, chatHistory = [], apiKeyOverride = null) {
  const systemPrompt = `Você é o "Assistente IA do Diagnóstico de Desempenho", um instrutor amigável e especialista em e-commerce dentro da plataforma web.
Seu objetivo é ensinar o usuário a navegar e usar todas as funcionalidades do aplicativo:
1. Como selecionar o canal (Mercado Livre, Shopee, TikTok Shop).
2. Como preencher as Métricas Gerais e entender a diferença entre Período Atual vs Anterior.
3. Como preencher o ACOS (Mercado Ads), CIR (Shopee Ads) e ROAS (TikTok Ads).
4. Como utilizar o "Smart Import" / Importador Automático para colar relatórios ou CSVs.
5. Como interpretar o Painel Executivo (Score da Conta, Perda por Conversão, Termômetros).
6. Como utilizar o Plano de Ação 5W2H e exportar relatórios.
7. Como acionar a IA Gemini para gerar o Diagnóstico Automático.

Regras de Resposta:
- Seja didático, claro e direto ao ponto.
- Use emojis adequados para organizar o texto.
- Formate a resposta em Markdown (com negritos e tópicos).
- NUNCA invente funcionalidades que não existem no app.

Mensagem do Usuário: "${userMessage}"`;

  return await callGeminiApi(systemPrompt, false, apiKeyOverride);
}
