let currentInput='';let previousInput='';let currentOperator=null;const display=document.getElementById('display');function appendNumber(number){if(number==='.'&&currentInput.includes('.'))return;currentInput+=number;updateDisplay()}
function setOperator(operator){if(currentInput==='')return;if(previousInput!==''){calculate()}
currentOperator=operator;previousInput=currentInput;currentInput=''}
function calculate(){let result;const prev=parseFloat(previousInput);const current=parseFloat(currentInput);if(isNaN(prev)||isNaN(current))return;switch(currentOperator){case '+':result=prev+current;break;case '-':result=prev-current;break;case '*':result=prev*current;break;case '/':if(current===0){alert("Cannot divide by zero");clearDisplay();return}
result=prev/current;break;default:return}
currentInput=result.toString();currentOperator=null;previousInput='';updateDisplay()}
function clearDisplay(){currentInput='';previousInput='';currentOperator=null;updateDisplay()}
function updateDisplay(){display.value=currentInput}