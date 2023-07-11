const numbers = document.querySelectorAll(".numeric-btn");
const operations = document.querySelectorAll(".operation");
const display = document.querySelector(".display");
const equalBtn = document.querySelector("#equal-btn");
const resetCalculator = document.querySelector("#clear-btn");
const decimalBtn = document.querySelector("#decimal");

let isOperationSelected = false;
let currentOperation = "";
let isOperationComplete= false;
let numDecimals = 0;

numbers.forEach((number) => {
    number.addEventListener("click", displayNumber);
});

operations.forEach((operation) => {
    operation.addEventListener("click", displayOperation);
});

equalBtn.addEventListener("click",calculate);
decimalBtn.addEventListener("click", displayNumber);

resetCalculator.addEventListener("click", () => {
    display.textContent = "0";
    isOperationSelected = false;
    currentOperation = "";
    isOperationComplete = false;
    numDecimals = 0;
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
        if(currentText === ".") {
            numDecimals = 1;
        } else {
            numDecimals = 0;
        }
        isOperationComplete = false;  
    } else {
        currentText = cleanCalcDisplay(currentText, nextDigit);
    }
    display.textContent = currentText;  
}

function cleanCalcDisplay(currentText, nextDigit, zeroToReplace) {
    if(nextDigit === "." && !checkValidDecimal(currentText)) {
        return currentText;
    }
    let zeroIndex = zeroToReplace || "0";
    if(currentText.charAt(zeroIndex) === "0") {
        // replace zero if it is a leading digit in the operand and then a new digit is entered
        currentText = currentText.slice(0, currentText.length - 1) + nextDigit;
    } else if(currentText.length < 15) {
        if (currentText === "Error") {
            currentText = nextDigit;
        } else {
            currentText += nextDigit;
        }
    }
    nextDigit === "." ? numDecimals += 1 : numDecimals;
    return currentText;
}

function checkValidDecimal(currentText){
    if (numDecimals === 2) {
        return false;
    } else if (numDecimals === 1 && !isOperationSelected) {
        return false;
    } else if (isOperationSelected) {
        parts = currentText.split(currentOperation);
        if (parts[1].indexOf(".") !== -1) {
            return false;
        }
    }
    return true;
}

function add(x, y) {
    if (x.indexOf(".") !== -1 || y.indexOf(".") !== -1) {
        return Math.round((parseFloat(x) + parseFloat(y)) * 100) /100;
    } 
    return parseInt(x) + parseInt(y);
}

function subtract(x,y) {
    if (x.indexOf(".") !== -1 || y.indexOf(".") !== -1) {
        return Math.round((parseFloat(x) - parseFloat(y)) * 100) /100;
    } 
    return parseInt(x) - parseInt(y);
}

function multiply(x, y) {
    if (x.indexOf(".") !== -1 || y.indexOf(".") !== -1) {
        return Math.round((parseFloat(x) * parseFloat(y)) * 100) /100;
    } 
    return parseInt(x) * parseInt(y);
}

function divide(x, y) {
    if(y === "0") {
        return "Error";
    } else if (x.indexOf(".") !== -1 || y.indexOf(".") !== -1) {
        return Math.round((parseFloat(x) / parseFloat(y)) * 100) /100;
    } 
    return parseInt(x) / parseInt(y);
}

function modulo(x, y) {
    if(y === "0") {
        return "Error";
    } else if (x.indexOf(".") !== -1 || y.indexOf(".") !== -1) {
        return "Error";
    } 
    return parseInt(x) % parseInt(y);
}

function calculate() { 
    if (!isOperationSelected) return;

    let parts = display.textContent.split(currentOperation);
    let leftOperand = parts[0];
    let rightOperand = parts[1];
    if (leftOperand === ".") {
        leftOperand = "0";
    }
    if (rightOperand === ".") {
        rightOperand = "0";
    }
    
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
    prepareNextCalculation();
}

function prepareNextCalculation() {
    isOperationSelected = false;
    isOperationComplete = true;
    currentText = display.textContent;
    if (currentText.indexOf(".") === -1) {
        numDecimals = 0;
    } else {
        numDecimals = 1;
    }
}