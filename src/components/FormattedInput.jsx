import React, { useState, useEffect } from 'react';

export default function FormattedInput({ 
  id, 
  value, 
  onChange, 
  placeholder, 
  type = 'currency', // 'currency' (98.500,25), 'integer' (1.250), 'decimal' (28,5 ou 28.5)
  required = false, 
  className = '',
  style = {}
}) {
  const parseNum = (val) => {
    if (val === null || val === undefined || val === '') return 0;
    if (typeof val === 'number') return val;
    const str = String(val).trim();
    if (!str) return 0;

    if (type === 'decimal') {
      if (str.includes('.') && str.includes(',')) {
        const clean = str.replace(/\./g, '').replace(',', '.');
        return parseFloat(clean) || 0;
      }
      if (str.includes(',')) {
        return parseFloat(str.replace(',', '.')) || 0;
      }
      if (str.includes('.')) {
        return parseFloat(str) || 0;
      }
      return parseFloat(str) || 0;
    }

    const cleanStr = str.replace(/\./g, '').replace(',', '.');
    return parseFloat(cleanStr) || 0;
  };

  const formatBR = (val) => {
    if (val === null || val === undefined || val === '') return '';
    const num = parseNum(val);
    if (isNaN(num)) return String(val);

    if (type === 'currency') {
      return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else if (type === 'integer') {
      return Math.round(num).toLocaleString('pt-BR');
    } else if (type === 'decimal') {
      // Retorna com vírgula padrão brasileira (ex: 28,5)
      return num.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
    }
    return String(val);
  };

  const [displayVal, setDisplayVal] = useState(formatBR(value));
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setDisplayVal(formatBR(value));
    }
  }, [value, isFocused]);

  const handleBlur = () => {
    setIsFocused(false);
    const parsed = parseNum(displayVal);
    const formatted = formatBR(parsed);
    setDisplayVal(formatted);

    onChange({ target: { id, value: parsed, type: 'text' } });
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleChange = (e) => {
    const raw = e.target.value;
    setDisplayVal(raw);

    const parsedNum = parseNum(raw);
    onChange({ target: { id, value: parsedNum, type: 'text' } });
  };

  return (
    <input
      type="text"
      id={id}
      value={displayVal}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={placeholder}
      required={required}
      className={className}
      style={style}
    />
  );
}
