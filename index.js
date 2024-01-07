// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    // Selecting necessary DOM elements
    const targetNumberElement = document.querySelector('.target-value');
    const winCountElement = document.querySelector('.win-count');
    const numberButtons = document.querySelectorAll('.number-button');
    const operationButtons = document.querySelectorAll('.operation-button');
    const undoButton = document.querySelector('.undo-button');

    // Initializing variables to store game state
    let currentOperation = null;
    let selectedNumberButton = null;
    let operationHistory = [];
    let winCount = 0;

    // Function to generate an array of random numbers
    function generateRandomNumbers() {
        return Array.from({ length: 6 }, () => Math.floor(Math.random() * (5 + winCount)) + 1);
    }

    // Function to calculate a target number based on the generated numbers
    function calculateTarget(numbers) {
        let result;
        let attempts = 0;

        // Attempt to calculate a valid target number
        do {
            result = numbers[0];
            for (let i = 1; i < numbers.length; i++) {
                switch (Math.floor(Math.random() * 4)) {
                    case 0: result += numbers[i]; break;
                    case 1: result = Math.max(result - numbers[i], numbers[i] - result); break;
                    case 2: result *= numbers[i]; break;
                    case 3: if (result % numbers[i] === 0) result /= numbers[i]; break;
                }
            }
            attempts++;
        } while ((result < 0 || result >= 9999 || !Number.isInteger(result)) && attempts < 1000);

        return result;
    }

    // Function to reset the game and start a new round
    function resetGame() {
        const numbers = generateRandomNumbers();
        numberButtons.forEach((button, index) => {
            button.textContent = numbers[index];
            button.style.display = 'inline-block';
            button.classList.remove('selected');
            button.disabled = false;
        });
        targetNumberElement.textContent = calculateTarget(numbers);
        currentOperation = null;
        selectedNumberButton = null;
        operationHistory = [];
        operationButtons.forEach(button => button.classList.remove('selected'));
    }

    // Function to apply the selected operation on two numbers
    function applyOperation(num1, num2, operation) {
        let result;
        switch (operation) {
            case 'addition': result = num1 + num2; break;
            case 'subtraction': result = num1 - num2; break;
            case 'multiplication': result = num1 * num2; break;
            case 'division': if (num1 % num2 === 0) result = num1 / num2; else return null; break;
            default: return null;
        }
        return result >= 0 ? result : null;
    }

    // Function to check if the player has won the game
    function checkWin() {
        const remainingNumbers = Array.from(numberButtons).filter(button => button.style.display !== 'none').map(button => parseInt(button.textContent));
        if (remainingNumbers.length === 1 && remainingNumbers[0] == targetNumberElement.textContent) {
            winCountElement.textContent = ++winCount;
            resetGame();
        }
    }

    // Event listeners for number buttons
    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (currentOperation && selectedNumberButton && selectedNumberButton !== button) {
                const num1 = parseInt(selectedNumberButton.textContent);
                const num2 = parseInt(button.textContent);
                const result = applyOperation(num1, num2, currentOperation);

                if (result !== null) {
                    operationHistory.push({ operation: currentOperation, num1: num1, num2: num2, num2Button: button, resultButton: selectedNumberButton });
                    button.textContent = result;
                    selectedNumberButton.style.display = 'none';
                    checkWin();
                }

                selectedNumberButton = null;
                operationButtons.forEach(opButton => opButton.classList.remove('selected'));
            } else {
                selectedNumberButton = button;
                numberButtons.forEach(nb => nb.classList.remove('selected'));
                button.classList.add('selected');
            }
        });
    });

    // Event listeners for operation buttons
    operationButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentOperation = button.classList[1]; // Extracts the operation type from the class
            operationButtons.forEach(opButton => opButton.classList.remove('selected'));
            button.classList.add('selected');
        });
    });

    // Event listener for the undo button
    undoButton.addEventListener('click', () => {
        const lastOperation = operationHistory.pop();
        if (lastOperation) {
            const { num1, num2, num2Button, resultButton } = lastOperation;
            num2Button.textContent = num2;
            resultButton.style.display = 'inline-block';
        }
    });

    // Initialize the game
    resetGame();
});
