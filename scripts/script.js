const numbers = document.querySelectorAll(".numeric-btn");
const operations = document.querySelectorAll(".operation");
const display = document.querySelector(".display");
const equalBtn = document.querySelector("#equal-btn");

let isOperationSelected = false;
let currentOperation = "";

numbers.forEach((number) => {
    number.addEventListener("click", displayNumber);
});

operations.forEach((operation) => {
    operation.addEventListener("click", displayOperation);
});

equalBtn.addEventListener("click",calculate);

function displayOperation(e) {
    if (display.textContent.length < 1) {
        return;
    } else if (!isOperationSelected) {
        currentOperation = e.target.textContent;
        display.textContent += e.target.textContent;
        isOperationSelected = true;
    }
}

function displayNumber(e) {
    let currentText = display.textContent;
    if (isOperationSelected) {
        const operationIndex = currentText.indexOf(currentOperation);
        if(currentText.charAt(operationIndex + 1) === "0") {
            //if a user types 0 as the first digit after the operator replace it with another digit if one is entered
            currentText = currentText.slice(0, currentText.length - 1) + e.target.textContent;
        } else if(currentText.length < 15) {
            currentText += e.target.textContent;
        }
    } else {
        if (currentText.charAt(0) === "0") {
            // if 0 is the first number entered replace it with a number if one is entered before an operator
            currentText = e.target.textContent;
        } else if (currentText.length < 15) {
            currentText += e.target.textContent;
        }
    }
    display.textContent = currentText;  
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
    }
    isOperationSelected = false;
}