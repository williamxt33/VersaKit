function toggleMenu() {
    const sideMenu = document.getElementById('side-menu');
    const hamMenu = document.querySelector('.ham-menu');
    
    sideMenu.classList.toggle('show');
    hamMenu.classList.toggle('active');
}

let rollHistory = [];

function setPreset(num, sides) {
    document.getElementById('numDice').value = num;
    document.getElementById('diceSides').value = sides;
}

function rollDice() {
    const numDice = parseInt(document.getElementById('numDice').value);
    const diceSides = parseInt(document.getElementById('diceSides').value);
    const modifier = parseInt(document.getElementById('modifier').value) || 0;
    const dropLowest = parseInt(document.getElementById('dropLowest').value);
    const dropHighest = parseInt(document.getElementById('dropHighest').value);
    const advantage = document.getElementById('advantage').value;

    if (numDice < 1 || numDice > 20) {
        alert('Please enter between 1 and 20 dice');
        return;
    }

    if (diceSides < 2 || diceSides > 100) {
        alert('Please enter between 2 and 100 sides');
        return;
    }

    let rolls = [];
    let numRolls = advantage !== 'normal' ? 2 : 1;

    for (let i = 0; i < numRolls; i++) {
        let singleRoll = [];
        for (let j = 0; j < numDice; j++) {
            singleRoll.push(Math.floor(Math.random() * diceSides) + 1);
        }
        rolls.push(singleRoll);
    }

    let finalRoll;
    if (advantage === 'advantage') {
        const sum1 = rolls[0].reduce((a, b) => a + b, 0);
        const sum2 = rolls[1].reduce((a, b) => a + b, 0);
        finalRoll = sum1 >= sum2 ? rolls[0] : rolls[1];
    } else if (advantage === 'disadvantage') {
        const sum1 = rolls[0].reduce((a, b) => a + b, 0);
        const sum2 = rolls[1].reduce((a, b) => a + b, 0);
        finalRoll = sum1 <= sum2 ? rolls[0] : rolls[1];
    } else {
        finalRoll = rolls[0];
    }

    let sortedRoll = [...finalRoll].sort((a, b) => a - b);
    
    if (dropLowest > 0) {
        sortedRoll = sortedRoll.slice(dropLowest);
    }
    
    if (dropHighest > 0) {
        sortedRoll = sortedRoll.slice(0, -dropHighest);
    }

    displayResults(finalRoll, sortedRoll, modifier, dropLowest, dropHighest);
    addToHistory(numDice, diceSides, sortedRoll, modifier);
}

function displayResults(originalRoll, keptRoll, modifier, dropLowest, dropHighest) {
    const container = document.getElementById('diceContainer');
    container.innerHTML = '';

    originalRoll.forEach((value, index) => {
        const isDropped = !keptRoll.includes(value) || 
                            (dropLowest > 0 && index < dropLowest) ||
                            (dropHighest > 0 && index >= originalRoll.length - dropHighest);
        
        const dice = document.createElement('div');
        dice.className = 'dice';
        dice.textContent = value;
        
        if (isDropped) {
            dice.style.opacity = '0.3';
            dice.style.textDecoration = 'line-through';
        }
        
        container.appendChild(dice);
    });

    const total = keptRoll.reduce((a, b) => a + b, 0) + modifier;
    const average = (keptRoll.reduce((a, b) => a + b, 0) / keptRoll.length).toFixed(1);
    const highest = Math.max(...keptRoll);
    const lowest = Math.min(...keptRoll);

    document.getElementById('statTotal').textContent = total;
    document.getElementById('statAverage').textContent = average;
    document.getElementById('statHighest').textContent = highest;
    document.getElementById('statLowest').textContent = lowest;

    document.getElementById('resultsSection').classList.remove('hidden');
}

function addToHistory(numDice, diceSides, rolls, modifier) {
    const total = rolls.reduce((a, b) => a + b, 0) + modifier;
    const modifierText = modifier !== 0 ? ` ${modifier >= 0 ? '+' : ''}${modifier}` : '';
    const rollText = `${numDice}D${diceSides}${modifierText}`;
    
    rollHistory.unshift({
        roll: rollText,
        result: total,
        individual: rolls.join(', ')
    });

    if (rollHistory.length > 10) {
        rollHistory.pop();
    }

    updateHistory();
}

function updateHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';

    rollHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const rollInfo = document.createElement('div');
        rollInfo.className = 'history-roll';
        rollInfo.textContent = `${item.roll} → [${item.individual}]`;
        
        const resultInfo = document.createElement('div');
        resultInfo.className = 'history-result';
        resultInfo.textContent = item.result;
        
        historyItem.appendChild(rollInfo);
        historyItem.appendChild(resultInfo);
        historyList.appendChild(historyItem);
    });

    if (rollHistory.length > 0) {
        document.getElementById('historySection').classList.remove('hidden');
    }
}

function clearResults() {
    document.getElementById('diceContainer').innerHTML = '';
    document.getElementById('resultsSection').classList.add('hidden');
    rollHistory = [];
    document.getElementById('historySection').classList.add('hidden');
    
    document.getElementById('numDice').value = '2';
    document.getElementById('diceSides').value = '6';
    document.getElementById('modifier').value = '0';
    document.getElementById('dropLowest').value = '0';
    document.getElementById('dropHighest').value = '0';
    document.getElementById('advantage').value = 'normal';
}