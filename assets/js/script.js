import * as conjugationDataSets from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    const dataSet = document.getElementById('data-set');
    const questionForms = document.getElementById('question-form');
    const answerForms = document.getElementById('answer-form');
    const answerCheck = document.getElementById('answer-check');

    // Event Listeners
    // runs whenever a different data set is selected
    dataSet.addEventListener('change', (event) => {
        dataSet.setAttribute('data-choice', event.target.value);
    });

    // runs whenever a different question trigger form is selected
    questionForms.addEventListener('change', (event) => {
        questionForms.setAttribute('data-choice', event.target.value);
        disableForm();
        run();
    });

    // runs whenever a different answer form to be tested on is selected
    answerForms.addEventListener('change', (event) => {
        answerForms.setAttribute('data-choice', event.target.value);
    });

    // ensures the ‘Submit Answer’ button processes the answer when mouse-clicked
    answerCheck.addEventListener('click', checkAnswer);

    // create the menu for choosing between different conjugation data sets
    buildDataMenu();

    // create the question and answer conjugation forms radio button groups
    buildConjugationMenus();

    const conjugationForms = getForms();
    const frm1 = conjugationForms[0];
    const frm2 = conjugationForms[1];
    const questionInput1 = document.getElementById(`question-${frm1}`);
    const answerInput1 = document.getElementById(`answer-${frm1}`);
    const answerInput2 = document.getElementById(`answer-${frm2}`);

    // select the first and second conjugation forms for the question and
    // answer options respectively
    questionForms.setAttribute('data-choice', frm1);
    answerForms.setAttribute('data-choice', frm2);
    questionInput1.checked = true;
    answerInput2.checked = true;
    answerInput1.disabled = true;

    // run on page load rather than waiting to run manually
    run();
});

/**
 * Returns an array of the names of the data sets.
 * @returns {array}
 */
function getDataSets() {
    let dataSets = new Array();
    for (const dataSet in conjugationDataSets) {
        dataSets.push(dataSet);
    }

    return dataSets;
}

/**
 * Creates the HTML option elements as children of the select element for
 * choosing between the different conjugation data sets.
 */
function buildDataMenu() {
    const dataSets = getDataSets();
    const dataSelect = document.getElementById('data-set');

    for (const dataSet of dataSets) {
        let opt = document.createElement('option');
        opt.textContent = displayFormat(dataSet);
        opt.setAttribute('value', dataSet);
        dataSelect.appendChild(opt);
    }
    document.querySelector('option:last-of-type').selected = true;
    dataSelect.setAttribute('data-choice', dataSelect.value);
}

/**
 * Returns the currently selected conjugation data set, which is an
 * array of objects.
 * @returns {array}
 */
function getConjugationData() {
    const dataSet = document.getElementById('data-set');
    const dataSetChoice = dataSet.getAttribute('data-choice');

    return conjugationDataSets[dataSetChoice];
}

/**
 * Returns an array of the names of the grammatical forms currently
 * being tested.
 */
function getForms() {
    let conjugationForms = new Array();
    const dataForms = getConjugationData()[0];
    for (const key in dataForms) {
        conjugationForms.push(key);
    }
    return conjugationForms;
}

/**
 * Creates the HTML label and input elements to configure which grammatical
 * form the question and answer will trigger and test on.
 */
function buildConjugationMenus() {
    const questionForms = document.getElementById('question-form');
    const answerForms = document.getElementById('answer-form');
    const conjugationForms = getForms();

    for (const form of conjugationForms) {
        // <label> elements with 'for' attributes
        let lbl = document.createElement('label');
        lbl.textContent = displayFormat(form);
        lbl.setAttribute('for', form);
        questionForms.appendChild(lbl);
        answerForms.appendChild(lbl.cloneNode(true));

        // <input> elements with 'type', 'value', 'name' and 'id' attributes
        let inptQ = document.createElement('input');
        inptQ.setAttribute('type', 'radio');
        inptQ.setAttribute('value', form);
        let inptA = inptQ.cloneNode(true);
        inptQ.setAttribute('name', 'question');
        inptQ.setAttribute('id', `question-${form}`);
        inptA.setAttribute('name', 'answer');
        inptA.setAttribute('id', `answer-${form}`);
        questionForms.appendChild(inptQ);
        answerForms.appendChild(inptA);
    }
}

/**
 * Disables the corresponding answer form when a new question form is selected
 * as the trigger question.
 */
function disableForm() {
    const questionForms = document.getElementById('question-form');
    const answerForms = document.getElementById('answer-form');
    const questionChoice = questionForms.getAttribute('data-choice');
    const answerChoice = answerForms.getAttribute('data-choice');

    // enables the currently disabled #answer-form input element
    const disabledCur = document.querySelector('input:disabled');
    disabledCur.disabled = false;

    // disables the #answer-form input element corresponding to the newly-checked
    // #question-form input element
    const disabledNew = document.getElementById(`answer-${questionChoice}`);
    disabledNew.disabled = true;

    // if the newly-checked question form is the same form as the answer form
    // currently checked, then:
    //   1). the #answer-form data-choice attribute will have to be updated
    //   2). a new answer form will have to be checked
    if (answerChoice === questionChoice) {
        const conjugationForms = getForms();
        let idx = conjugationForms.findIndex((x) => x === answerChoice);
        const lastIdx = conjugationForms.length - 1;
        idx === lastIdx ? (idx = 0) : ++idx;
        const form = conjugationForms[idx];
        // 1).
        answerForms.setAttribute('data-choice', form);
        // 2).
        document.getElementById(`answer-${form}`).checked = true;
    }
}

/**
 * Returns a titlecase string more appropriate (nicer) for textual display
 * @param {string} str - the string to format
 * @returns {string} The ‘display’ titlecase version of the input string
 */
function displayFormat(str) {
    const format = str.replace(/([a-z])([A-Z])/g, '$1 $2');

    return format.charAt(0).toUpperCase() + format.slice(1);
}

/**
 * Constitutes a single ‘turn’.
 * Randomly retrieves a question object from the current conjugation data
 * and selects the form according to the pre-selected parameters.
 */
function run() {
    const conjugationData = getConjugationData();
    const choice = Math.floor(Math.random() * conjugationData.length);
    const questionForms = document.getElementById('question-form');
    const answerForms = document.getElementById('answer-form');
    const questionChoice = questionForms.getAttribute('data-choice');
    const answerChoice = answerForms.getAttribute('data-choice');
    const question = document.getElementById('question');
    const answerBox = document.getElementById('answer-box');

    // clears previous input on each run
    answerBox.value = '';
    // ensures the answer box is selected on each run
    answerBox.focus();
    // displays a reminder of the expected grammatical form of the answer
    answerBox.setAttribute('placeholder', displayFormat(answerChoice));

    // stores the choice as a data attribute of the question
    question.setAttribute('data-choice', choice);
    // sets question text by directly retrieving it from the conjugation data
    question.textContent = conjugationData[choice][questionChoice];
}

/**
 * Checks the answer submitted and changes the score accordingly.
 * Unless the ‘answer-hide’ parameter is checked, incorrect answers are also
 * displayed for 1.5 seconds.
 * Finally, a new question is generated.
 */
function checkAnswer() {
    const conjugationData = getConjugationData();
    const question = document.getElementById('question');
    const answerForms = document.getElementById('answer-form');
    const choice = question.getAttribute('data-choice');
    const answerChoice = answerForms.getAttribute('data-choice');
    const userAnswer = document.getElementById('answer-box').value;
    const correctAnswer = conjugationData[choice][answerChoice];
    const answerHide = document.getElementById('answer-hide');
    const answerRecent = document.getElementById('answer-recent');

    if (userAnswer === correctAnswer) {
        increaseCorrect(); // correct answer tally is increased
    } else {
        increaseIncorrect(); // incorrect answer tally is increased
        // also, an incorrect answer is conditionally displayed
        if (!answerHide.checked) {
            answerRecent.textContent = correctAnswer;
            answerRecent.style.backgroundColor = 'yellow';
            answerRecent.style.borderColor = 'blue';
            setTimeout(() => {
                answerRecent.textContent = '';
                answerRecent.style.backgroundColor = 'transparent';
                answerRecent.style.borderColor = 'transparent';
            }, 1500);
        }
    }

    run();
}

function increaseCorrect() {
    const correct = document.getElementById('correct');
    let score = parseInt(correct.textContent);

    correct.textContent = ++score;
}

function increaseIncorrect() {
    const incorrect = document.getElementById('incorrect');
    let score = parseInt(incorrect.textContent);

    incorrect.textContent = ++score;
}
