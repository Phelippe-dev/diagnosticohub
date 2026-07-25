import React, { useState } from 'react';
import { ShoppingBag, Zap, Video } from 'lucide-react';

export default function AccountZeroPlaybook({ currentMarketplace }) {
  const [activePlaybook, setActivePlaybook] = useState(currentMarketplace || 'ml');

  const isShopee = activePlaybook === 'shopee';
  const isTikTok = activePlaybook === 'tiktok';

  const accentColor = isTikTok ? 'var(--tiktok-cyan)' : (isShopee ? 'var(--shopee-orange)' : 'var(--ml-yellow)');
  const channelName = isTikTok ? 'TikTok Shop' : (isShopee ? 'Shopee Brasil' : 'Mercado Livre');

  return (
    <div className="tab-panel">
      {/* CARD DE SELEÇÃO DO MARKETPLACE NO PLAYBOOK */}
      <div className="card" style={{ marginBottom: '1.25rem', borderLeft: `4px solid ${accentColor}` }}>
        <div className="card-header flex-header">
          <div>
            <span className="badge" style={{ background: isTikTok ? 'var(--tiktok-cyan-bg)' : (isShopee ? 'var(--shopee-orange-bg)' : 'var(--ml-yellow-bg)'), color: accentColor, border: `1px solid ${isTikTok ? 'var(--tiktok-cyan-border)' : (isShopee ? 'var(--shopee-orange-border)' : 'var(--ml-yellow-border)')}` }}>
              PLAYBOOK EXCLUSIVO DE CONTA ZERO
            </span>
            <h2 style={{ marginTop: '0.4rem' }}>
              Roteiro de Aceleração e Escala: {channelName}
            </h2>
            <p>Passo a passo estratégico específico para estruturar a loja do zero até atingir faturamento escalável no canal.</p>
          </div>

          <div className="segmented-control" style={{ maxWidth: '380px' }}>
            <button 
              type="button"
              className={`seg-btn ${activePlaybook === 'ml' ? 'active' : ''}`}
              data-mp="ml"
              onClick={() => setActivePlaybook('ml')}
            >
              <Zap size={14} /> Mercado Livre
            </button>
            <button 
              type="button"
              className={`seg-btn ${activePlaybook === 'shopee' ? 'active' : ''}`}
              data-mp="shopee"
              onClick={() => setActivePlaybook('shopee')}
            >
              <ShoppingBag size={14} /> Shopee
            </button>
            <button 
              type="button"
              className={`seg-btn ${activePlaybook === 'tiktok' ? 'active' : ''}`}
              data-mp="tiktok"
              onClick={() => setActivePlaybook('tiktok')}
            >
              <Video size={14} /> TikTok Shop
            </button>
          </div>
        </div>
      </div>

      {/* PLAYBOOK TIKTOK SHOP */}
      {isTikTok && (
        <>
          {/* FASE 1 TIKTOK */}
          <div className="action-category category-high" style={{ borderLeftColor: 'var(--tiktok-cyan)' }}>
            <div className="category-header">
              <div className="badge badge-tiktok">FASE 1 - ESTRUTURAÇÃO E AFFILIATE OPEN PLAN (DIAS 1 A 5)</div>
              <h3>Ativação do Seller Center, Planos de Afiliados e Amostras Grátis</h3>
            </div>
            <div className="action-list">
              <div className="action-item">
                <input type="checkbox" className="action-checkbox" />
                <div className="action-content">
                  <div className="action-title">📱 Ativar Affiliate Center &amp; Criar Open Plan (12% a 15% de Comissão)</div>
                  <div className="action-desc">No TikTok Shop, o tráfego de criadores é o principal motor. Cadastre seu catálogo no Affiliate Center e configure o Open Plan com comissão competitiva para que criadores comecem a adicionar seus produtos na vitrine.</div>
                  <div className="action-meta">Caminho: Seller Center &gt; Affiliate &gt; Open Plan | Prazo: 24h</div>
                </div>
              </div>
              <div className="action-item">
                <input type="checkbox" className="action-checkbox" />
                <div className="action-content">
                  <div className="action-title">🎁 Envio de 15 Amostras Grátis (Free Samples) aos Top Criadores</div>
                  <div className="action-desc">Selecione 15 criadores de conteúdo do seu nicho no Creator Marketplace do TikTok e solicite o envio de amostras para que gravem vídeos de reviews/demonstração de produto com o link de compra (Product Card).</div>
                  <div className="action-meta">Caminho: Seller Center &gt; Affiliate &gt; Find Creators | Prazo: 48h</div>
                </div>
              </div>
            </div>
          </div>

          {/* FASE 2 TIKTOK */}
          <div className="action-category category-medium">
            <div className="category-header">
              <div className="badge badge-warning">FASE 2 - LIVES SEMANAIS E SLA DE 48H (DIAS 6 A 15)</div>
              <h3>Geração de Tráfego ao Vivo e Blindagem de Despacho</h3>
            </div>
            <div className="action-list">
              <div className="action-item">
                <input type="checkbox" className="action-checkbox" />
                <div className="action-content">
                  <div className="action-title">🔴 Agendar e Executar 3 LIVEs Shopping Semanais (2 horas por sessão)</div>
                  <div className="action-desc">Realizar transmissões ao vivo apresentando os produtos campeões, ativando Cupons no Carrinho da Live e Oferta Flash Relâmpago com cronômetro na tela para estimular o gatilho da urgência.</div>
                  <div className="action-meta">Caminho: Seller Center &gt; Promotions &gt; In-LIVE Flash Sale | Prazo: 7 dias</div>
                </div>
              </div>
              <div className="action-item">
                <input type="checkbox" className="action-checkbox" />
                <div className="action-content">
                  <div className="action-title">⚡ Manter SLA de Despacho &lt; 48 Horas (Shop Performance Score)</div>
                  <div className="action-desc">No TikTok Shop, o envio com atraso acima de 48h gera pontos de penalização no Shop Performance Score (&lt;4.5 estrelas) e pode pausar seus anúncios de publicidade.</div>
                  <div className="action-meta">Caminho: Seller Center &gt; Health &gt; Shop Performance | Prazo: Contínuo</div>
                </div>
              </div>
            </div>
          </div>

          {/* FASE 3 TIKTOK */}
          <div className="action-category category-strategic">
            <div className="category-header">
              <div className="badge badge-info">FASE 3 - ESCALA GMV MAX ADS E INTEGRAR ESTOQUE FBT (DIAS 16 A 30)</div>
              <h3>Automação de Tráfego Pago e Fulfillment Nativo</h3>
            </div>
            <div className="action-list">
              <div className="action-item">
                <input type="checkbox" className="action-checkbox" />
                <div className="action-content">
                  <div className="action-title">🚀 Ativar Campanha GMV Max Ads (Target ROAS &gt; 4.5x)</div>
                  <div className="action-desc">Criar campanha de anúncios de automação nativa GMV Max Ads para impulsionar o tráfego dos vídeos de criadores que obtiveram maior taxa de conversão orgânica.</div>
                  <div className="action-meta">Caminho: Seller Center / Ads Manager &gt; GMV Max | Prazo: 20 dias</div>
                </div>
              </div>
              <div className="action-item">
                <input type="checkbox" className="action-checkbox" />
                <div className="action-content">
                  <div className="action-title">📦 Integrar Estoque no FBT (Fulfillment by TikTok)</div>
                  <div className="action-desc">Enviar remessa inicial para o armazém oficial FBT para garantir envio no mesmo dia e frete prioritário para compradores em todo o Brasil.</div>
                  <div className="action-meta">Caminho: Seller Center &gt; Logistics &gt; FBT Enrollment | Prazo: 25 dias</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* PLAYBOOK MERCADO LIVRE */}
      {activePlaybook === 'ml' && (
        <>
          {/* FASE 1 ML */}
          <div className="action-category category-high">
            <div className="category-header">
              <div className="badge badge-yellow">FASE 1 - DESBLOQUEIO DAS 10 PRIMEIRAS VENDAS (DIAS 1 A 5)</div>
              <h3>Ativação do Termômetro e Reputação Inicial no Mercado Livre</h3>
            </div>
            <div className="action-list">
              <div className="action-item">
                <input type="checkbox" className="action-checkbox" />
                <div className="action-content">
                  <div className="action-title">🚀 Preço de Penetração para Conquistar as 10 Primeiras Vendas ML</div>
                  <div className="action-desc">No Mercado Livre, a conta nova exige exatamente 10 vendas para ativar a reputação e liberar o termômetro. Colocar os 3 produtos campeões a preço de custo para atingir a meta rapidamente.</div>
                  <div className="action-meta">Prazo: 48h | Requisito Exclusivo do Mercado Livre</div>
                </div>
              </div>
              <div className="action-item">
                <input type="checkbox" className="action-checkbox" />
                <div className="action-content">
                  <div className="action-title">📄 Cadastro Fiscal NF-e e Emissor Integrado ML</div>
                  <div className="action-desc">Integrar ERP (Bling/Tiny) para emissão automática de NF-e e habilitação da Coleta/Agência Mercado Livre.</div>
                  <div className="action-meta">Prazo: 24h | Requisito Operacional ML</div>
                </div>
              </div>
            </div>
          </div>

          {/* FASE 2 ML */}
          <div className="action-category category-medium">
            <div className="category-header">
              <div className="badge badge-warning">FASE 2 - REPUTAÇÃO VERDE ESCURO E IMAGENS 1200x1200px (DIAS 6 A 15)</div>
              <h3>Blindagem de SLAs e Relevância Orgânica</h3>
            </div>
            <div className="action-list">
              <div className="action-item">
                <input type="checkbox" className="action-checkbox" />
                <div className="action-content">
                  <div className="action-title">🟢 Garantir Termômetro Verde Escuro (SLA Rigoroso ML)</div>
                  <div className="action-desc">Manter taxa de reclamações menor que 2,0%, cancelamentos menor que 1,0% e atrasos no despacho menor que 6,0%. Responder perguntas em menos de 15 minutos.</div>
                  <div className="action-meta">Prazo: Contínuo | Proteção da Visibilidade nas Buscas ML</div>
                </div>
              </div>
              <div className="action-item">
                <input type="checkbox" className="action-checkbox" />
                <div className="action-content">
                  <div className="action-title">📸 Imagens de Capa em Fundo Branco Puro (1200x1200px)</div>
                  <div className="action-desc">Fotos no padrão quadrado (1200x1200px) com fundo 100% branco sem textos na capa para passar no algoritmo orgânico do ML.</div>
                  <div className="action-meta">Prazo: 5 dias | +50% no CTR das buscas ML</div>
                </div>
              </div>
            </div>
          </div>

          {/* FASE 3 ML */}
          <div className="action-category category-strategic">
            <div className="category-header">
              <div className="badge badge-info">FASE 3 - ENTREGAS NO FULL E MERCADO ADS (DIAS 16 A 30)</div>
              <h3>Envio para Fulfillment e Escala de Mídia Pago</h3>
            </div>
            <div className="action-list">
              <div className="action-item">
                <input type="checkbox" className="action-checkbox" />
                <div className="action-content">
                  <div className="action-title">📦 Primeira Remessa para Mercado Envios Full</div>
                  <div className="action-desc">Agendar envio do estoque da curva A para o centro de distribuição do Full para ativar a tag "Chegará Amanhã" (subindo a conversão em 3x).</div>
                  <div className="action-meta">Prazo: 20 dias | Aumento de 3x na Taxa de Conversão</div>
                </div>
              </div>
              <div className="action-item">
                <input type="checkbox" className="action-checkbox" />
                <div className="action-content">
                  <div className="action-title">🎯 Ativação de Mercado Ads no Modo Crescimento</div>
                  <div className="action-desc">Criar campanha de Product Ads com ACOS meta em 20% para alavancar a tração dos anúncios recém-enviados ao Full.</div>
                  <div className="action-meta">Prazo: 25 dias | Escala de Tráfego Pago ML</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* PLAYBOOK SHOPEE */}
      {isShopee && (
        <>
          {/* FASE 1 SHOPEE */}
          <div className="action-category category-high">
            <div className="category-header">
              <div className="badge badge-shopee">FASE 1 - FRETE GRÁTIS EXTRA E IMAGENS 1200x1200px (DIAS 1 A 5)</div>
              <h3>Estruturação Direta sem Exigência de 10 Vendas</h3>
            </div>
            <div className="action-list">
              <div className="action-item">
                <input type="checkbox" className="action-checkbox" />
                <div className="action-content">
                  <div className="action-title">🚚 Adesão Imediata ao Programa de Frete Grátis Extra Shopee</div>
                  <div className="action-desc">Na Shopee, a loja vende desde a primeira publicação sem precisar de 10 vendas prévias. O Programa de Frete Grátis Extra é a principal alavanca inicial.</div>
                  <div className="action-meta">Prazo: 24h | Ativação Imediata de Vendas</div>
                </div>
              </div>
              <div className="action-item">
                <input type="checkbox" className="action-checkbox" />
                <div className="action-content">
                  <div className="action-title">📸 Cadastro de Anúncios no Padrão Quadrado (1200x1200px)</div>
                  <div className="action-desc">Cadastrar fotos dos produtos no padrão oficial de alta resolução 1200x1200px com imagens detalhadas em infográfico.</div>
                  <div className="action-meta">Prazo: 48h | Padrão Visual Oficial Shopee</div>
                </div>
              </div>
            </div>
          </div>

          {/* FASE 2 SHOPEE */}
          <div className="action-category category-medium">
            <div className="category-header">
              <div className="badge badge-warning">FASE 2 - CHAT CRR &gt; 85% E SELO VENDEDOR INDICADO (DIAS 6 A 15)</div>
              <h3>Conquista de Selo Oficial e Resposta Rápida</h3>
            </div>
            <div className="action-list">
              <div className="action-item">
                <input type="checkbox" className="action-checkbox" />
                <div className="action-content">
                  <div className="action-title">💬 Manter Taxa de Resposta do Chat (CRR) &gt; 85% em &lt; 12 Horas</div>
                  <div className="action-desc">Atribuir operador para responder o Chat Shopee Web imediatamente. Resposta rápida impulsiona o selo de Vendedor Indicado (Preferred Seller).</div>
                  <div className="action-meta">Prazo: Contínuo | Conquista do Selo Vendedor Indicado</div>
                </div>
              </div>
              <div className="action-item">
                <input type="checkbox" className="action-checkbox" />
                <div className="action-content">
                  <div className="action-title">🏷️ Ativar Vouchers da Loja e Combo (Leve Mais por Menos)</div>
                  <div className="action-desc">Cadastrar cupons de desconto de 5% e combos promocionais na Central de Marketing Shopee para subir o ticket médio.</div>
                  <div className="action-meta">Prazo: 7 dias | +30% na Taxa de Conversão Shopee</div>
                </div>
              </div>
            </div>
          </div>

          {/* FASE 3 SHOPEE */}
          <div className="action-category category-strategic">
            <div className="category-header">
              <div className="badge badge-info">FASE 3 - SHOPEE ADS E AFILIADOS (DIAS 16 A 30)</div>
              <h3>Mídia de Busca e Vídeos de Afiliados</h3>
            </div>
            <div className="action-list">
              <div className="action-item">
                <input type="checkbox" className="action-checkbox" />
                <div className="action-content">
                  <div className="action-title">🎯 Ativar Shopee Ads Busca em Correspondência Exata</div>
                  <div className="action-desc">Criar campanha de busca manual com as 5 palavras-chave de maior intenção de compra, definindo o bid entre R$ 0,28 e R$ 0,45.</div>
                  <div className="action-meta">Prazo: 18 dias | Escala em Tráfego de Busca Shopee</div>
                </div>
              </div>
              <div className="action-item">
                <input type="checkbox" className="action-checkbox" />
                <div className="action-content">
                  <div className="action-title">📱 Cadastrar Produtos no Programa de Afiliados Shopee</div>
                  <div className="action-desc">Oferecer comissão extra para afiliados e publicar vídeos curtos no Shopee Vídeo / Live Stream com link direto de compra.</div>
                  <div className="action-meta">Prazo: 25 dias | Tráfego Orgânico em Vídeo</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
