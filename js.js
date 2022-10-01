const MEDAL = 'Medal';
const FOOD = 'Food';
const WINE = 'Wine';
const SCROLL = 'Scroll';

let numMedal = 0;
let numFood = 0;
let numWine = 0;
let numScroll = 0;
let prevCorrect = 0;

const basePossible = [
    MEDAL, SCROLL, WINE, FOOD ,
];

const highlight = (input) => {
    const field = document.getElementsByName(input)[0];
    field.focus();
    field.select();
}

const isSame = (arr1, arr2) => {
    return arr1[0] === arr2[0]
    && arr1[1] === arr2[1]
    && arr1[2] === arr2[2]
    && arr1[3] === arr2[3];
};

const hasNumCorrect = (arr1, arr2, correct) => {
    let numCorrect = 0;
    if (arr1[0] === arr2[0]) numCorrect++;
    if (arr1[1] === arr2[1]) numCorrect++;
    if (arr1[2] === arr2[2]) numCorrect++;
    if (arr1[3] === arr2[3]) numCorrect++;

    return numCorrect === correct;
}

const generateAllPossibleGuesses = (numOptions) => {
    if (numOptions === 1) {
        return [[MEDAL], [FOOD], [WINE], [SCROLL]];
    }
    let suffixes = generateAllPossibleGuesses(numOptions - 1, basePossible)
    let result = [];
    basePossible.forEach((o) => {
        suffixes.forEach((suffix) => {
            result.push([o].concat(suffix));
        });
    });
    return result;
}

let allPossible = generateAllPossibleGuesses(4);

let tries = 0;

let combination = [MEDAL, MEDAL, MEDAL, MEDAL];

const renderCombo = () => {
    document.getElementById('combination').innerHTML = combination.join(' | ');
}

const reset = () => {
    numMedal = 0;
    numFood = 0;
    numWine = 0;
    numScroll = 0;
    prevCorrect = 0;
    combination = [MEDAL, MEDAL, MEDAL, MEDAL];
    allPossible = generateAllPossibleGuesses(4);
    tries = 0;

    const errorElem = document.getElementById('error-text');
    const count = document.getElementById('guess-count');
    count.innerHTML = '1';
    errorElem.innerHTML = '';

    document.getElementsByName("correct")[0].value = 0;
    document.getElementsByName("incorrect")[0].value = 0;
    document.getElementsByName("unknown")[0].value = 0;

    renderCombo();
}

const swap = (array, index1, index2) => {
    const temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
}

const getOccurance = (array, value) => {
    let count = 0;
    array.forEach((v) => (v === value && count++));
    return count;
}

const hasNumIncorrect = (arr1, arr2, incorrect) => {
    let numIncorrect = 0;
    const wrong1 = new Set();
    const wrong2 = new Set();

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            if (!wrong2.has(arr1[i])) {
                wrong1.add(arr1[i]);
            } else {
                wrong2.delete(arr1[i]);
                numIncorrect++
            }
            if (!wrong1.has(arr2[i])) {
                wrong2.add(arr2[i]);
            } else {
                wrong1.delete(arr2[i]);
                numIncorrect++;
            }       
        }
    }
    return numIncorrect === incorrect;
}

const hasNumUnknown = (arr1, arr2, unknown) => {
    let differences = 0;
    basePossible.forEach((item) => {
        const num1 = arr1.filter(x => x === item).length;
        const num2 = arr2.filter(x => x === item).length;
        differences += Math.abs(num2 - num1);
    });
    return (differences / 2) === unknown;
}

const getNextCombination = () => {
    const correct = parseInt(document.getElementsByName("correct")[0].value);
    const incorrect = parseInt(document.getElementsByName("incorrect")[0].value);
    const unknown = parseInt(document.getElementsByName("unknown")[0].value);
    const errorElem = document.getElementById('error-text');

    if (isNaN(correct) || isNaN(incorrect) || isNaN(unknown) || correct + incorrect + unknown !== 4) {
        errorElem.innerHTML = 'ERROR! Invalid combo!';
        return;
    }

    allPossible = allPossible.filter((possible) => {
        return hasNumCorrect(possible, combination, correct)
        && hasNumIncorrect(possible, combination, incorrect)
        && hasNumUnknown(possible, combination, unknown)
        && !isSame(possible, combination);
    });

    if (allPossible.length === 0) {
        errorElem.innerHTML = 'ERROR! Ran out of combos!';
        return;
    }

    const count = document.getElementById('guess-count');
    count.innerHTML = parseInt(count.innerHTML) + 1;

    errorElem.innerHTML = '';

    combination = allPossible[0];
    
    prevCorrect = correct;
    tries++;
    renderCombo();
}
