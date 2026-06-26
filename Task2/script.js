const resultEl = document.getElementById('result');
const historyEl = document.getElementById('history');

let current = '0';
let previous = null;
let operator = null;
let justEvaluated = false;

const opSymbols = { add: '+', subtract: '−', multiply: '×', divide: '÷' };

function updateDisplay(){
  resultEl.textContent = current;
  resultEl.classList.add('pulse');
  setTimeout(() => resultEl.classList.remove('pulse'), 250);
}

function updateHistory(text){
  historyEl.textContent = text;
}

function inputNumber(num){
  if(justEvaluated){
    current = num === '.' ? '0.' : num;
    justEvaluated = false;
    updateHistory('');
    updateDisplay();
    return;
  }
  if(num === '.' && current.includes('.')) return;
  if(current === '0' && num !== '.'){
    current = num;
  } else {
    if(current.length >= 14) return;
    current += num;
  }
  updateDisplay();
}

function setOperator(op){
  if(operator && previous !== null && !justEvaluated){
    evaluate();
  }
  previous = current;
  operator = op;
  justEvaluated = false;
  current = '0';
  updateHistory(`${previous} ${opSymbols[op]}`);
}

function evaluate(){
  if(operator === null || previous === null) return;
  const a = parseFloat(previous);
  const b = parseFloat(current);
  let res;

  switch(operator){
    case 'add': res = a + b; break;
    case 'subtract': res = a - b; break;
    case 'multiply': res = a * b; break;
    case 'divide':
      if(b === 0){
        current = 'Error';
        updateHistory(`${previous} ${opSymbols[operator]} ${current}`);
        updateDisplay();
        operator = null;
        previous = null;
        justEvaluated = true;
        return;
      }
      res = a / b;
      break;
    default: return;
  }

  res = Math.round((res + Number.EPSILON) * 1e10) / 1e10;

  updateHistory(`${previous} ${opSymbols[operator]} ${current} =`);
  current = String(res);
  previous = null;
  operator = null;
  justEvaluated = true;
  updateDisplay();
}

function clearAll(){
  current = '0';
  previous = null;
  operator = null;
  justEvaluated = false;
  updateHistory('');
  updateDisplay();
}

function deleteLast(){
  if(justEvaluated){
    clearAll();
    return;
  }
  if(current.length === 1){
    current = '0';
  } else {
    current = current.slice(0, -1);
  }
  updateDisplay();
}

function percent(){
  current = String(parseFloat(current) / 100);
  updateDisplay();
}

function flashKey(el){
  if(!el) return;
  el.classList.add('pressed');
  setTimeout(() => el.classList.remove('pressed'), 120);
}

// ----- Button clicks -----
document.querySelectorAll('.key').forEach(btn => {
  btn.addEventListener('click', () => {
    const num = btn.dataset.num;
    const action = btn.dataset.action;

    if(num !== undefined){
      inputNumber(num);
    } else if(action){
      switch(action){
        case 'clear': clearAll(); break;
        case 'delete': deleteLast(); break;
        case 'percent': percent(); break;
        case 'equals': evaluate(); break;
        default: setOperator(action);
      }
    }
  });
});

// ----- Keyboard support -----
const keyMap = {
  '+': 'add',
  '-': 'subtract',
  '*': 'multiply',
  '/': 'divide',
  'Enter': 'equals',
  '=': 'equals',
  'Backspace': 'delete',
  'Escape': 'clear',
  '%': 'percent'
};

window.addEventListener('keydown', (e) => {
  const key = e.key;

  if(/^[0-9.]$/.test(key)){
    inputNumber(key);
    flashKey(document.querySelector(`[data-num="${key}"]`));
    return;
  }

  if(keyMap[key]){
    e.preventDefault();
    const action = keyMap[key];
    flashKey(document.querySelector(`[data-action="${action}"]`));

    switch(action){
      case 'clear': clearAll(); break;
      case 'delete': deleteLast(); break;
      case 'percent': percent(); break;
      case 'equals': evaluate(); break;
      default: setOperator(action);
    }
  }
});

updateDisplay();