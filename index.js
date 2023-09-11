//getting the html elements
const target = document.querySelector(".target-number");
const current = document.querySelector(".current-number");
const buttonOne = document.querySelector(".button-one");
const buttonTwo = document.querySelector(".button-two");
const buttonThree = document.querySelector(".button-three");
const buttonFour = document.querySelector(".button-four");
const buttonFive = document.querySelector(".button-five");
const buttonSix = document.querySelector(".button-six");
const addButton = document.querySelector(".addition");
const subtractButton = document.querySelector(".subtraction");
const multiplyButton = document.querySelector(".multiplication");
const divideButton = document.querySelector(".division");
const undoButton = document.querySelector(".undo-button");
const winCount = document.querySelector(".win-count");


//storing the used buttons and operations
let selectedButtons= new Map;

//the current selected operation
let selectedOperation = null;

//creating the first target
createNewTarget();


//event listeners
buttonOne.addEventListener('click', function(e) {updateCurrentNumber(e.target);});
buttonTwo.addEventListener('click', function(e) {updateCurrentNumber(e.target);});
buttonThree.addEventListener('click', function(e) {updateCurrentNumber(e.target);});
buttonFour.addEventListener('click', function(e) {updateCurrentNumber(e.target);});
buttonFive.addEventListener('click', function(e) {updateCurrentNumber(e.target);});
buttonSix.addEventListener('click', function(e) {updateCurrentNumber(e.target);});
addButton.addEventListener('click', function(e) {updateOperations("addition", e.target);});
subtractButton.addEventListener('click', function(e) {updateOperations("subtraction", e.target);});
multiplyButton.addEventListener('click', function(e) {updateOperations("multiplication", e.target);});
divideButton.addEventListener('click', function(e) {updateOperations("division", e.target);});
undoButton.addEventListener('click', function (e) {undoOperation();});


//check if the target and current numbers match
function checkIfCorrect(){
    return target.textContent === current.textContent;
}


//resets all data
function resetAllData(){

    //reset the variables
    selectedButtons.clear();
    selectedOperation = null;
    current.textContent = "";

    //change the style of all buttons back to default
    buttonOne.style.backgroundColor = "rgb(255,255,255)";
    buttonTwo.style.backgroundColor = "rgb(255,255,255)";
    buttonThree.style.backgroundColor = "rgb(255,255,255)";
    buttonFour.style.backgroundColor = "rgb(255,255,255)";
    buttonFive.style.backgroundColor = "rgb(255,255,255)";
    buttonSix.style.backgroundColor = "rgb(255,255,255)";
    addButton.style.backgroundColor = "rgb(255,255,255)";
    subtractButton.style.backgroundColor = "rgb(255,255,255)";
    multiplyButton.style.backgroundColor = "rgb(255,255,255)";
    divideButton.style.backgroundColor = "rgb(255,255,255)";
}


//updates the selected operation and all the operation button styles
function updateOperations(operation, eventTarget){

    //change the style of all operations back to default
    addButton.style.backgroundColor = "rgb(255,255,255)";
    subtractButton.style.backgroundColor = "rgb(255,255,255)";
    multiplyButton.style.backgroundColor = "rgb(255,255,255)";
    divideButton.style.backgroundColor = "rgb(255,255,255)";

    //if there is no eventTarget or if the same operation is selected, return
    if (eventTarget == null || selectedOperation === operation){
        selectedOperation = null;
        return;
    }

    //set the new operation
    switch (operation) {
        case "addition":
            addButton.style.backgroundColor = "rgb(128,128,128)"
            break;
        case "subtraction":
            subtractButton.style.backgroundColor = "rgb(128,128,128)"
            break;
        case "multiplication":
            multiplyButton.style.backgroundColor = "rgb(128,128,128)"
            break;
        case "division":
            divideButton.style.backgroundColor = "rgb(128,128,128)"
            break;
    }

    selectedOperation = operation;
}

//create a new target number
function createNewTarget(){

    //clear previous data
    resetAllData();

    //keep track of which buttons have been used and the final target count
    let unusedButtons= [1,2,3,4,5,6];
    let finalTargetCount= 0;


    //generate a random number to start with
    let value= Math.floor(Math.random()*(4+Number(winCount.textContent)))+1;
    finalTargetCount += value;

    //randomly assign the first random number to a button
    unusedButtons = setCurrentButton(unusedButtons ,Math.floor(Math.random()*6), value);


    //randomly determine which buttons are to be used for division
    let divisionIndexes = [];
    let divisionAmount = Math.floor(Math.random()*3);
    for (let i= 0; i < divisionAmount; i++){
        divisionIndexes.push(Math.floor(Math.random()*5));
    }

    //loop through the remaining buttons
    for (let i= 0; i < 5; i++){

        //randomly obtain the button
        let randomIndex = Math.floor(Math.random()*unusedButtons.length);
        let randomButton = unusedButtons[randomIndex];

        //if the button is one to be used for division
        if (divisionIndexes.includes(randomButton)){

            //factors
            let factors = [];

            //get the factors of the current final target
            for(let i = 1; i <= finalTargetCount; i++){

                if(finalTargetCount % i === 0){
                    factors.push(i);
                }
            }

            //pick a random factor to divide by
            let selectedFactor = factors[Math.floor(Math.random()*factors.length)];

            //apply the division
            finalTargetCount /= selectedFactor;
            unusedButtons = setCurrentButton(unusedButtons, randomButton, selectedFactor)


        //the button is to be used for any other operation
        } else {

            //randomly obtain the button to set
            let randomIndex = Math.floor(Math.random()*unusedButtons.length);
            let randomButton = unusedButtons[randomIndex];

            //apply a random operation and amount
            let randomIncrement = Math.floor(Math.random()*(4+Number(winCount.textContent)))+1;
            switch (Math.floor(Math.random()*3)){
                case (0):
                    finalTargetCount += randomIncrement;
                    unusedButtons = setCurrentButton(unusedButtons, randomButton, randomIncrement);
                    break;
                case (1):
                    finalTargetCount += randomIncrement;
                    unusedButtons = setCurrentButton(unusedButtons, randomButton, randomIncrement);
                    break;
                case (2):
                    unusedButtons = setCurrentButton(unusedButtons, randomButton, randomIncrement);
                    break;
            }
        }
    }

    target.innerHTML = String(finalTargetCount);
}


//sets the specified button to the specified value
function setCurrentButton(buttonArray, buttonNumber, value){

    switch (buttonNumber){
        case (0):
            buttonOne.innerHTML = String(value);
            buttonArray.splice(0,0);
            break;
        case (1):
            buttonTwo.innerHTML = String(value);
            buttonArray.splice(1,1);
            break;
        case (2):
            buttonThree.innerHTML = String(value);
            buttonArray.splice(2,2);
            break;
        case (3):
            buttonFour.innerHTML = String(value);
            buttonArray.splice(3,3);
            break;
        case (4):
            buttonFive.innerHTML = String(value);
            buttonArray.splice(4,4);
            break;
        case (5):
            buttonSix.innerHTML = String(value);
            buttonArray.splice(5,5);
            break;
    }

    return buttonArray;
}


//update the current number
function updateCurrentNumber(eventTarget){

    //if the current number doesn't exist or no operation is selected with no previous buttons pressed
    if (current.textContent === "" || (selectedOperation === null && selectedButtons.size === 1)){

        //clear and fix the style of the previous selected buttons if applicable
        for (let button of selectedButtons.keys()){
            button.style.backgroundColor = "rgb(255,255,255)";
        }
        selectedButtons.clear();

        //set the selected button to the starting number
        current.textContent = eventTarget.textContent;
        selectedButtons.set(eventTarget, ["addition", parseInt(eventTarget.textContent)]);
        eventTarget.style.backgroundColor = "rgb(128,128,128)";
        return;
    }

    //if the clicked button has been already used, return
    if (selectedButtons.has(eventTarget)) {
        return;
    }

    //apply the proper calculation
    switch (selectedOperation) {
        case "addition":
            current.textContent = String(parseInt(current.textContent) + parseInt(eventTarget.textContent));
            selectedButtons.set(eventTarget, ["addition", parseInt(eventTarget.textContent)]);
            eventTarget.style.backgroundColor = "rgb(128,128,128)";
            updateOperations("addition", null)
            break;
        case "subtraction":
            current.textContent = String(parseInt(current.textContent) - parseInt(eventTarget.textContent));
            selectedButtons.set(eventTarget, ["subtraction", parseInt(eventTarget.textContent)]);
            eventTarget.style.backgroundColor = "rgb(128,128,128)";
            updateOperations("subtraction", null)
            break;
        case "multiplication":
            current.textContent = String(parseInt(current.textContent) * parseInt(eventTarget.textContent));
            selectedButtons.set(eventTarget, ["multiplication", parseInt(eventTarget.textContent)]);
            eventTarget.style.backgroundColor = "rgb(128,128,128)";
            updateOperations("multiplication", null)
            break;
        case "division":

            //if the division won't yield an int, break
            if (parseFloat(current.textContent) % parseFloat(eventTarget.textContent) !== 0) {
                break;
            }

            current.textContent = String(parseInt(current.textContent) / parseInt(eventTarget.textContent));
            selectedButtons.set(eventTarget, ["division", parseInt(eventTarget.textContent)]);
            eventTarget.style.backgroundColor = "rgb(128,128,128)";
            updateOperations("division", null)
            break;
    }


    //create new numbers if the solution is correct
    if (checkIfCorrect() && selectedButtons.size === 6){
        winCount.textContent = String(Number(winCount.textContent) + 1);
        createNewTarget();

    //create new numbers if the solution is incorrect
    } else if (selectedButtons.size === 6) {
        createNewTarget();
    }
}


//undo the last step
function undoOperation(){

}
