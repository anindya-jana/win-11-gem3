import React, { useState } from 'react';
import { AppProps } from '../types';

const Calculator: React.FC<AppProps> = () => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const handleNum = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOp = (op: string) => {
    const current = parseFloat(display);
    if (prevValue === null) {
      setPrevValue(current);
    } else if (operator) {
      const result = calculate(prevValue, current, operator);
      setPrevValue(result);
      setDisplay(String(result));
    }
    setWaitingForNewValue(true);
    setOperator(op);
  };

  const calculate = (a: number, b: number, op: string) => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return a / b;
      default: return b;
    }
  };

  const handleEqual = () => {
    if (operator && prevValue !== null) {
      const current = parseFloat(display);
      const result = calculate(prevValue, current, operator);
      setDisplay(String(result));
      setPrevValue(null);
      setOperator(null);
      setWaitingForNewValue(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForNewValue(false);
  };

  const btnClass = "flex items-center justify-center p-3 rounded hover:bg-white/10 active:bg-white/20 transition text-sm font-medium";
  const opClass = "flex items-center justify-center p-3 rounded bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 transition text-sm font-medium";

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white p-2">
      <div className="flex-1 flex items-end justify-end text-4xl font-light p-4 break-all">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-1">
        <button onClick={handleClear} className="col-span-3 bg-gray-700/50 p-3 rounded hover:bg-gray-700/80">AC</button>
        <button onClick={() => handleOp('/')} className={opClass}>÷</button>
        
        {['7', '8', '9'].map(n => <button key={n} onClick={() => handleNum(n)} className={btnClass}>{n}</button>)}
        <button onClick={() => handleOp('*')} className={opClass}>×</button>
        
        {['4', '5', '6'].map(n => <button key={n} onClick={() => handleNum(n)} className={btnClass}>{n}</button>)}
        <button onClick={() => handleOp('-')} className={opClass}>-</button>
        
        {['1', '2', '3'].map(n => <button key={n} onClick={() => handleNum(n)} className={btnClass}>{n}</button>)}
        <button onClick={() => handleOp('+')} className={opClass}>+</button>
        
        <button onClick={() => handleNum('0')} className={`${btnClass} col-span-2`}>0</button>
        <button onClick={() => handleNum('.')} className={btnClass}>.</button>
        <button onClick={handleEqual} className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded">=</button>
      </div>
    </div>
  );
};

export default Calculator;
