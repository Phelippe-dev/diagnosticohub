/**
 * Utilitário de persistência no LocalStorage para Histórico de Diagnósticos
 */

const STORAGE_KEY = 'growth_hub_diagnosis_history_v1';

export function getSavedDiagnoses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Erro ao ler histórico de diagnósticos:', err);
    return [];
  }
}

export function saveDiagnosisSnapshot(title, marketplace, metrics, diagnosis, formData) {
  try {
    const history = getSavedDiagnoses();
    
    const newEntry = {
      id: `diag_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      title: title || `Diagnóstico ${marketplace.toUpperCase()} - ${new Date().toLocaleDateString('pt-BR')}`,
      createdAt: new Date().toISOString(),
      dateFormatted: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      marketplace,
      metrics: {
        fatAtual: metrics.fatAtual || 0,
        fatAnterior: metrics.fatAnterior || 0,
        fatDelta: metrics.fatDelta || 0,
        vendasAtual: metrics.vendasAtual || 0,
        vendasAnterior: metrics.vendasAnterior || 0,
        visitasAtual: metrics.visitasAtual || 0,
        visitasAnterior: metrics.visitasAnterior || 0,
        convAtual: metrics.convAtual || 0,
        convAnterior: metrics.convAnterior || 0,
        ticketAtual: metrics.ticketAtual || 0,
        ticketAnterior: metrics.ticketAnterior || 0
      },
      diagnosis: {
        mainPainPoint: diagnosis.mainPainPoint || 'Diagnóstico sem gargalo crítico',
        statusLevel: diagnosis.statusLevel || 'success',
        mainDesc: diagnosis.mainDesc || ''
      },
      formData: { ...formData }
    };

    const updatedHistory = [newEntry, ...history];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    return newEntry;
  } catch (err) {
    console.error('Erro ao salvar diagnóstico:', err);
    throw new Error('Não foi possível salvar o diagnóstico no armazenamento local.');
  }
}

export function deleteDiagnosisSnapshot(id) {
  try {
    const history = getSavedDiagnoses();
    const filtered = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (err) {
    console.error('Erro ao excluir diagnóstico:', err);
    return getSavedDiagnoses();
  }
}

export function clearAllDiagnoses() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  } catch (err) {
    console.error('Erro ao limpar histórico:', err);
    return [];
  }
}
