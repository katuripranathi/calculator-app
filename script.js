const output = document.getElementById("output");
const numberButtons = document.querySelectorAll(".num");
const operatorButtons = document.querySelectorAll(".op");
const equalsButton = document.getElementById("equals");
const clearButton = document.getElementById("clear");

let displayExpression = "0";
let currentValue = "0";      
let firstOperand = null;     
let operator = null;         
let waitingForSecondOperand = false; 
let resultShown = false;     

function updateDisplay() {
  output.textContent = displayExpression;
}

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const digit = button.dataset.value;

    if (resultShown) {
      currentValue = digit;
      displayExpression = digit;
      resultShown = false;
    } else if (waitingForSecondOperand) {
      currentValue = digit;
      displayExpression += digit; 
      waitingForSecondOperand = false;
    } else {
      currentValue = currentValue === "0" ? digit : currentValue + digit;
      displayExpression = displayExpression === "0" ? digit : displayExpression + digit;
    }

    updateDisplay();
  });
});

operatorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const clickedOperator = button.dataset.value;

    if (firstOperand === null) {
      firstOperand = parseFloat(currentValue);
      displayExpression = currentValue + clickedOperator;
    } else if (!waitingForSecondOperand) {
      const result = calculate(firstOperand, parseFloat(currentValue), operator);
      firstOperand = result;
      displayExpression = String(result) + clickedOperator;
    } else {
      
      displayExpression = displayExpression.slice(0, -1) + clickedOperator;
    }

    operator = clickedOperator;
    waitingForSecondOperand = true;
    resultShown = false;
    updateDisplay();
  });
});

function calculate(first, second, op) {
  switch (op) {
    case "+": return first + second;
    case "-": return first - second;
    case "*": return first * second;
    case "/": return second === 0 ? "Error" : first / second;
    default: return second;
  }
}

equalsButton.addEventListener("click", () => {
  if (operator === null || waitingForSecondOperand) return;

  const secondOperand = parseFloat(currentValue);
  const result = calculate(firstOperand, secondOperand, operator);

  displayExpression = String(result); // show only the final result now
  currentValue = String(result);
  firstOperand = null;
  operator = null;
  waitingForSecondOperand = false;
  resultShown = true;

  updateDisplay();
});

clearButton.addEventListener("click", () => {
  displayExpression = "0";
  currentValue = "0";
  firstOperand = null;
  operator = null;
  waitingForSecondOperand = false;
  resultShown = false;
  updateDisplay();
});

