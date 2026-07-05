// Grab the elements we need to work with
const output = document.getElementById("output");
const numberButtons = document.querySelectorAll(".num");
const operatorButtons = document.querySelectorAll(".op");
const equalsButton = document.getElementById("equals");
const clearButton = document.getElementById("clear");

// State variables
let displayExpression = "0"; // what's shown on screen (e.g. "7+1")
let currentValue = "0";      // the number currently being typed
let firstOperand = null;     // number entered before the operator
let operator = null;         // the operator chosen (+, -, *, /)
let waitingForSecondOperand = false; // true right after an operator is clicked
let resultShown = false;     // true right after "=" is pressed

// Update the display
function updateDisplay() {
  output.textContent = displayExpression;
}

// Handle number button clicks
numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const digit = button.dataset.value;

    if (resultShown) {
      // Start a brand new calculation after "="
      currentValue = digit;
      displayExpression = digit;
      resultShown = false;
    } else if (waitingForSecondOperand) {
      // Start typing the second number
      currentValue = digit;
      displayExpression += digit; // append digit right after the operator, e.g. "7+1"
      waitingForSecondOperand = false;
    } else {
      // Still typing the first number (or continuing the second)
      currentValue = currentValue === "0" ? digit : currentValue + digit;
      displayExpression = displayExpression === "0" ? digit : displayExpression + digit;
    }

    updateDisplay();
  });
});

// Handle operator button clicks (+, -, *, /)
operatorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const clickedOperator = button.dataset.value;

    if (firstOperand === null) {
      // First operator pressed — store the first number
      firstOperand = parseFloat(currentValue);
      displayExpression = currentValue + clickedOperator;
    } else if (!waitingForSecondOperand) {
      // Chaining operators, e.g. 5 + 3 + -> calculate running total first
      const result = calculate(firstOperand, parseFloat(currentValue), operator);
      firstOperand = result;
      displayExpression = String(result) + clickedOperator;
    } else {
      // User pressed an operator right after another operator — just swap it
      displayExpression = displayExpression.slice(0, -1) + clickedOperator;
    }

    operator = clickedOperator;
    waitingForSecondOperand = true;
    resultShown = false;
    updateDisplay();
  });
});

// Perform the math
function calculate(first, second, op) {
  switch (op) {
    case "+": return first + second;
    case "-": return first - second;
    case "*": return first * second;
    case "/": return second === 0 ? "Error" : first / second;
    default: return second;
  }
}

// Handle "="
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

// Handle "C" (clear)
clearButton.addEventListener("click", () => {
  displayExpression = "0";
  currentValue = "0";
  firstOperand = null;
  operator = null;
  waitingForSecondOperand = false;
  resultShown = false;
  updateDisplay();
});

