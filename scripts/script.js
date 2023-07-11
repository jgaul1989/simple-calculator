const numberBtn = document.querySelectorAll(".numeric-btn");
const operations = document.querySelectorAll(".operation");
const display = document.querySelector(".display");
const equalBtn = document.querySelector("#equal-btn");
const resetCalculator = document.querySelector("#clear-btn");
const decimalBtn = document.querySelector("#decimal");
const signChangeBtn = document.querySelector("#sign-change");
const deleteBtn = document.querySelector("#del");
const validDisplayKeys = ["1" , "2", "3", "4", "5", "6",
 "7", "8", "9", "0", "."];
 const validOperations = ["+", "-", "*", "/", "%"];

let isOperationSelected = false;
let currentOperation = "";
let isOperationComplete= false;
let numDecimals = 0;
let operationIndex = 0;

numberBtn.forEach((number) => {
    number.addEventListener("click", (e) => {
        pressedKey = e.target.textContent;
        displayNumber(pressedKey);
    });
});

operations.forEach((operation) => {
    operation.addEventListener("click", (e) => {
        pressedKey = e.target.textContent;
        displayOperation(pressedKey);
    });
});

equalBtn.addEventListener("click",calculate);

decimalBtn.addEventListener("click", (e) => {
    pressedKey = e.target.textContent;
    displayNumber(pressedKey);
});

signChangeBtn.addEventListener("click",changeSign);
deleteBtn.addEventListener("click", removePrevious);

window.addEventListener("keydown", (e) => {
    pressedKey = e.key;
    if (validDisplayKeys.includes(pressedKey)) {
        displayNumber(pressedKey);
    } else if (validOperations.includes(pressedKey)) {
        displayOperation(pressedKey);
    } else if (pressedKey === "Backspace") {
        removePrevious();
    } else if (pressedKey === "=") {
        calculate();
    } else if (pressedKey === "`") {
        changeSign();
    }
    
});

resetCalculator.addEventListener("click", () => {
    display.textContent = "";
    isOperationSelected = false;
    currentOperation = "";
    isOperationComplete = false;
    numDecimals = 0;
});

function removePrevious() {
    currentText = display.textContent;
    if (isOperationSelected && currentText.length - 1 === operationIndex) {
        operationIndex = 0;
        isOperationSelected = false;
    }
    let removedChar = currentText.charAt(currentText.length - 1);
    if (removedChar === ".") {
        numDecimals -= 1;
    }
    currentText = currentText.slice(0,currentText.length - 1);
    display.textContent = currentText;
}

function changeSign() {
    currentText = display.textContent;
    if(!isOperationSelected) {
        if (currentText.charAt(0) === "0") {
            currentText = "-";
        }
        else if(currentText.charAt(0) !== "-") {
            currentText = "-" + currentText;
        } else {
            currentText = currentText.slice(1);
        }
    } else {
        rightOperand = currentText.slice(operationIndex + 1);
        leftOperand = currentText.slice(0, operationIndex + 1);
        if (rightOperand.charAt(0) === "0") {
            rightOperand = "-"
        }
        else if(rightOperand.charAt(0) !== "-") {
            rightOperand =  "-" + rightOperand;
        } else {
            rightOperand = rightOperand.slice(1);
        }
        currentText = leftOperand + rightOperand;
    }
    display.textContent = currentText;
}

function displayOperation(pressedKey) {
    if(pressedKey === "mod") {
        pressedKey = "%";
    }
    if (display.textContent.length < 1) {
        return;
    } else if (!isOperationSelected && display.textContent.length < 13) {
        currentOperation = pressedKey;
        display.textContent += pressedKey;
        operationIndex = display.textContent.length - 1;
        isOperationSelected = true;
        isOperationComplete = false; 
    }
}

function displayNumber(nextDigit) {
    let currentText = display.textContent;
    if (currentText.charAt(0) === "-" && nextDigit === "0" && currentText.length === 1) {
        return;
    }
    if (currentText.charAt(operationIndex + 1) == "-" && nextDigit === "0") {
        if (currentText.length - 1 === operationIndex + 1) {
            return;
        }
    } 

    if (isOperationSelected) {
        let zeroIndex = operationIndex + 1;
        currentOperation === "mod" ? zeroIndex += 2 : zeroIndex;
        currentText = cleanCalcDisplay(currentText, nextDigit, zeroIndex);
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
    } else if(currentText.length < 14) {
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
    let currentText = display.textContent;
    if (currentText.length === operationIndex + 1) return;
    let parts = currentText.split(currentOperation);
    let leftOperand = parts[0];
    let rightOperand = parts[1];
    if (rightOperand === "-") return;
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
        case "%":
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