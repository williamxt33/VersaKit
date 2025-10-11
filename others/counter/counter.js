function toggleMenu() {
    const sideMenu = document.getElementById('side-menu');
    const hamMenu = document.querySelector('.ham-menu');
    
    sideMenu.classList.toggle('show');
    hamMenu.classList.toggle('active');
}

let mainCounterValue = 0;
let additionalCounters = [];

function updateDisplay() {
    document.getElementById('mainCounter').textContent = mainCounterValue;
}

function increment() {
    const step = parseInt(document.getElementById('stepValue').value) || 1;
    mainCounterValue += step;
    updateDisplay();
}

function decrement() {
    const step = parseInt(document.getElementById('stepValue').value) || 1;
    mainCounterValue -= step;
    updateDisplay();
}

function resetCounter() {
    mainCounterValue = 0;
    updateDisplay();
}

function setCustom() {
    const customValue = parseInt(document.getElementById('customValue').value);
    if (!isNaN(customValue)) {
        mainCounterValue = customValue;
        updateDisplay();
        document.getElementById('customValue').value = '';
    }
}

function addCounter() {
    const name = document.getElementById('newCounterName').value.trim();
    if (name) {
        additionalCounters.push({
            id: Date.now(),
            name: name,
            value: 0
        });
        document.getElementById('newCounterName').value = '';
        renderCounters();
    }
}

function incrementAdditional(id) {
    const counter = additionalCounters.find(c => c.id === id);
    if (counter) {
        const step = parseInt(document.getElementById('stepValue').value) || 1;
        counter.value += step;
        renderCounters();
    }
}

function decrementAdditional(id) {
    const counter = additionalCounters.find(c => c.id === id);
    if (counter) {
        const step = parseInt(document.getElementById('stepValue').value) || 1;
        counter.value -= step;
        renderCounters();
    }
}

function deleteCounter(id) {
    additionalCounters = additionalCounters.filter(c => c.id !== id);
    renderCounters();
}

function renderCounters() {
    const container = document.getElementById('countersList');
    if (additionalCounters.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #6c757d; padding: 2rem;">No additional counters yet. Add one above!</p>';
        return;
    }

    container.innerHTML = additionalCounters.map(counter => `
        <div class="counter-item">
            <div class="counter-item-info">
                <div class="counter-item-name">${counter.name}</div>
                <div class="counter-item-value">${counter.value}</div>
            </div>
            <div class="counter-item-controls">
                <button class="small-btn small-btn-plus" onclick="incrementAdditional(${counter.id})">+</button>
                <button class="small-btn small-btn-minus" onclick="decrementAdditional(${counter.id})">-</button>
                <button class="small-btn small-btn-delete" onclick="deleteCounter(${counter.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    
    if (e.key === 'ArrowUp' || e.key === '+') {
        e.preventDefault();
        increment();
    } else if (e.key === 'ArrowDown' || e.key === '-') {
        e.preventDefault();
        decrement();
    } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        resetCounter();
    }
});

// Initialize
window.addEventListener('load', () => {
    updateDisplay();
    renderCounters();
});