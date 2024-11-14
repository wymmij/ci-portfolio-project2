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

    // run on page load rather than waiting to run manually
    run();
});
