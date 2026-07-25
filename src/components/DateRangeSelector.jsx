import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CalendarDays, Edit3 } from 'lucide-react';

export default function DateRangeSelector({ 
  periodoAtual, 
  periodoAnterior, 
  onPeriodChange, 
  accentColor = 'var(--ml-yellow)' 
}) {
  const [preset, setPreset] = useState('mes_atual'); // 'mes_atual', 'ultimos_30', 'ultimos_7', 'custom'

  const toISO = (dateObj) => {
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const formatDateBR = (isoStr) => {
    if (!isoStr) return '';
    const parts = isoStr.split('-');
    if (parts.length !== 3) return isoStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  // Gerador de datas dinâmicas baseadas na data atual real
  const getDynamicDates = (selectedPreset) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed
    const todayDate = now.getDate();

    let dtAtualStart, dtAtualEnd, dtAntStart, dtAntEnd;

    if (selectedPreset === 'mes_atual') {
      // Mês Atual: do dia 1 do mês atual até hoje (ou fim do mês se for 1º dia)
      const startCur = new Date(currentYear, currentMonth, 1);
      const endCur = now;

      // Mês Anterior Comparativo: mesmo período no mês anterior
      const startPrev = new Date(currentYear, currentMonth - 1, 1);
      // Fim do mês anterior proporcional ao dia atual ou último dia do mês anterior
      const lastDayPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
      const targetDayPrev = Math.min(todayDate, lastDayPrevMonth);
      const endPrev = new Date(currentYear, currentMonth - 1, targetDayPrev);

      dtAtualStart = toISO(startCur);
      dtAtualEnd = toISO(endCur);
      dtAntStart = toISO(startPrev);
      dtAntEnd = toISO(endPrev);
    } else if (selectedPreset === 'ultimos_30') {
      // Últimos 30 dias até hoje
      const endCur = now;
      const startCur = new Date(now);
      startCur.setDate(now.getDate() - 29);

      // 30 dias imediatamente anteriores ao período atual
      const endPrev = new Date(startCur);
      endPrev.setDate(startCur.getDate() - 1);
      const startPrev = new Date(endPrev);
      startPrev.setDate(endPrev.getDate() - 29);

      dtAtualStart = toISO(startCur);
      dtAtualEnd = toISO(endCur);
      dtAntStart = toISO(startPrev);
      dtAntEnd = toISO(endPrev);
    } else if (selectedPreset === 'ultimos_7') {
      // Últimos 7 dias até hoje
      const endCur = now;
      const startCur = new Date(now);
      startCur.setDate(now.getDate() - 6);

      // 7 dias imediatamente anteriores
      const endPrev = new Date(startCur);
      endPrev.setDate(startCur.getDate() - 1);
      const startPrev = new Date(endPrev);
      startPrev.setDate(endPrev.getDate() - 6);

      dtAtualStart = toISO(startCur);
      dtAtualEnd = toISO(endCur);
      dtAntStart = toISO(startPrev);
      dtAntEnd = toISO(endPrev);
    }

    return { dtAtualStart, dtAtualEnd, dtAntStart, dtAntEnd };
  };

  const initialDates = getDynamicDates('mes_atual');
  const [dataAtualInicio, setDataAtualInicio] = useState(initialDates.dtAtualStart);
  const [dataAtualFim, setDataAtualFim] = useState(initialDates.dtAtualEnd);
  const [dataAntInicio, setDataAntInicio] = useState(initialDates.dtAntStart);
  const [dataAntFim, setDataAntFim] = useState(initialDates.dtAntEnd);

  // Efeito inicial para notificar o componente pai com as datas reais de hoje
  useEffect(() => {
    const txtAtual = `${formatDateBR(dataAtualInicio)} a ${formatDateBR(dataAtualFim)}`;
    const txtAnt = `${formatDateBR(dataAntInicio)} a ${formatDateBR(dataAntFim)}`;
    onPeriodChange(txtAtual, txtAnt);
  }, []);

  const handlePresetSelect = (selectedPreset) => {
    setPreset(selectedPreset);
    if (selectedPreset === 'custom') return;

    const { dtAtualStart, dtAtualEnd, dtAntStart, dtAntEnd } = getDynamicDates(selectedPreset);

    setDataAtualInicio(dtAtualStart);
    setDataAtualFim(dtAtualEnd);
    setDataAntInicio(dtAntStart);
    setDataAntFim(dtAntEnd);

    const txtAtual = `${formatDateBR(dtAtualStart)} a ${formatDateBR(dtAtualEnd)}`;
    const txtAnt = `${formatDateBR(dtAntStart)} a ${formatDateBR(dtAntEnd)}`;
    onPeriodChange(txtAtual, txtAnt);
  };

  // Quando o usuário clica diretamente no input date (estilo Mercado Livre / Shopee)
  const handleDateInputChange = (field, newIsoValue) => {
    setPreset('custom'); // Ativa modo personalizado ao interagir com a data

    let newCurStart = dataAtualInicio;
    let newCurEnd = dataAtualFim;
    let newPrevStart = dataAntInicio;
    let newPrevEnd = dataAntFim;

    if (field === 'curStart') newCurStart = newIsoValue;
    if (field === 'curEnd') newCurEnd = newIsoValue;
    if (field === 'prevStart') newPrevStart = newIsoValue;
    if (field === 'prevEnd') newPrevEnd = newIsoValue;

    setDataAtualInicio(newCurStart);
    setDataAtualFim(newCurEnd);
    setDataAntInicio(newPrevStart);
    setDataAntFim(newPrevEnd);

    const txtAtual = `${formatDateBR(newCurStart)} a ${formatDateBR(newCurEnd)}`;
    const txtAnt = `${formatDateBR(newPrevStart)} a ${formatDateBR(newPrevEnd)}`;
    onPeriodChange(txtAtual, txtAnt);
  };

  return (
    <div className="form-section">
      <h3 className="section-title">
        <span className="step-num">1</span> Seleção de Período da Análise (Acompanha Data Atual Real)
      </h3>

      {/* Botões de Presets Rápidos */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.1rem' }}>
        <button
          type="button"
          className={`btn ${preset === 'mes_atual' ? 'btn-yellow' : 'btn-outline'}`}
          style={{ background: preset === 'mes_atual' ? accentColor : undefined, color: preset === 'mes_atual' ? '#0b0e14' : undefined }}
          onClick={() => handlePresetSelect('mes_atual')}
        >
          <Calendar size={15} /> Mês Atual vs Mês Anterior
        </button>

        <button
          type="button"
          className={`btn ${preset === 'ultimos_30' ? 'btn-yellow' : 'btn-outline'}`}
          style={{ background: preset === 'ultimos_30' ? accentColor : undefined, color: preset === 'ultimos_30' ? '#0b0e14' : undefined }}
          onClick={() => handlePresetSelect('ultimos_30')}
        >
          <CalendarDays size={15} /> Últimos 30 Dias
        </button>

        <button
          type="button"
          className={`btn ${preset === 'ultimos_7' ? 'btn-yellow' : 'btn-outline'}`}
          style={{ background: preset === 'ultimos_7' ? accentColor : undefined, color: preset === 'ultimos_7' ? '#0b0e14' : undefined }}
          onClick={() => handlePresetSelect('ultimos_7')}
        >
          <Clock size={15} /> Últimos 7 Dias
        </button>

        <button
          type="button"
          className={`btn ${preset === 'custom' ? 'btn-yellow' : 'btn-outline'}`}
          style={{ background: preset === 'custom' ? accentColor : undefined, color: preset === 'custom' ? '#0b0e14' : undefined }}
          onClick={() => setPreset('custom')}
        >
          <Edit3 size={15} /> Período Personalizado
        </button>
      </div>

      {/* Inputs de Calendário interativos e editáveis a qualquer momento */}
      <div className="form-grid dual-col">
        <div className="form-group">
          <label>Período Atual (Data Inicial &amp; Data Final)</label>
          <div className="input-pair">
            <input 
              type="date" 
              value={dataAtualInicio} 
              onChange={(e) => handleDateInputChange('curStart', e.target.value)} 
              title="Clique para alterar a data de início do período atual"
            />
            <input 
              type="date" 
              value={dataAtualFim} 
              onChange={(e) => handleDateInputChange('curEnd', e.target.value)} 
              title="Clique para alterar a data final do período atual"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Período Anterior Comparativo (Data Inicial &amp; Data Final)</label>
          <div className="input-pair">
            <input 
              type="date" 
              value={dataAntInicio} 
              onChange={(e) => handleDateInputChange('prevStart', e.target.value)} 
              title="Clique para alterar a data inicial do período comparativo"
            />
            <input 
              type="date" 
              value={dataAntFim} 
              onChange={(e) => handleDateInputChange('prevEnd', e.target.value)} 
              title="Clique para alterar a data final do período comparativo"
            />
          </div>
        </div>
      </div>

      <div style={{
        marginTop: '0.75rem',
        padding: '0.6rem 0.85rem',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-subtle)',
        fontSize: '0.82rem',
        color: 'var(--text-secondary)'
      }}>
        📌 <strong>Período Selecionado:</strong> {periodoAtual || `${formatDateBR(dataAtualInicio)} a ${formatDateBR(dataAtualFim)}`} comparado com {periodoAnterior || `${formatDateBR(dataAntInicio)} a ${formatDateBR(dataAntFim)}`}
      </div>
    </div>
  );
}
