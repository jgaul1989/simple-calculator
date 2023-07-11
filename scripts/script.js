const numbers = document.querySelectorAll(".numeric-btn");
const operations = document.querySelectorAll(".operation");
const display = document.querySelector(".display");
const equalBtn = document.querySelector("#equal-btn");
const resetCalculator = document.querySelector("#clear-btn");

let isOperationSelected = false;
let currentOperation = "";
let isOperationComplete= false;

numbers.forEach((number) => {
    number.addEventListener("click", displayNumber);
});

operations.forEach((operation) => {
    operation.addEventListener("click", displayOperation);
});

equalBtn.addEventListener("click",calculate);

resetCalculator.addEventListener("click", () => {
    display.textContent = "";
    isOperationSelected = false;
    currentOperation = "";
    isOperationComplete = false;
});

function displayOperation(e) {
    if (display.textContent.length < 1) {
        return;
    } else if (!isOperationSelected) {
        currentOperation = e.target.textContent;
        display.textContent += e.target.textContent;
        isOperationSelected = true;
        isOperationComplete = false;
    }
}

function displayNumber(e) {
    let currentText = display.textContent;
    let nextDigit = e.target.textContent;
    if (isOperationSelected) {
        let operationIndex = currentText.indexOf(currentOperation) + 1;
        currentOperation === "mod" ? operationIndex += 2 : operationIndex;
        currentText = cleanCalcDisplay(currentText, nextDigit, operationIndex);
    } else if (isOperationComplete) {    
        currentText = nextDigit;
        isOperationComplete = false;  
    } else {
        currentText = cleanCalcDisplay(currentText, nextDigit);
    }
    display.textContent = currentText;  
}

function cleanCalcDisplay(currentText, nextDigit, zeroToReplace) {
    let zeroIndex = zeroToReplace || "0";
    if(currentText.charAt(zeroIndex) === "0") {
        // replace zero if it is a leading digit in the operand and then a new digit is entered
        currentText = currentText.slice(0, currentText.length - 1) + nextDigit;
    } else if(currentText.length < 15) {
        currentText += nextDigit;
    }
    return currentText;
}

function add(x, y) {
    return parseInt(x) + parseInt(y);
}

function subtract(x,y) {
    return parseInt(x) - parseInt(y);
}

function multiply(x, y) {
    return parseInt(x) * parseInt(y);
}

function divide(x, y) {
    if(y === "0") {
        return "Error"
    }
    return parseInt(x) / parseInt(y);
}

function modulo(x, y) {
    return parseInt(x) % parseInt(y);
}

function calculate() { 
    if (!isOperationSelected) return;

    let parts = display.textContent.split(currentOperation);
    let leftOperand = parts[0];
    let rightOperand = parts[1];
    
    switch(currentOperation) {
        case "+":
            display.textContent = add(leftOperand, rightOperand);
            break;
        case "-":
            display.textContent = subtract(leftOperand, rightOperand);
            break;
        case "*":
            display.textContent = multiply(leftOperand, rightOperand);
            break;
        case "/":
            display.textContent = divide(leftOperand, rightOperand);
            break;
        case "mod":
            display.textContent = modulo(leftOperand, rightOperand);
            break;
    }
    isOperationSelected = false;
    isOperationComplete = true;
}