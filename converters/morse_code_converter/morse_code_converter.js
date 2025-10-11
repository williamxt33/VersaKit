function toggleMenu() {
    const sideMenu = document.getElementById('side-menu');
    const hamMenu = document.querySelector('.ham-menu');
    
    sideMenu.classList.toggle('show');
    hamMenu.classList.toggle('active');
}

const conversions = {
    gram: 1,
    kilogram: 1000,
    tonne: 1000000,
    ounce: 28.3495,
    pound: 453.592,
    uk_ton: 1016046.91,
    us_ton: 907184.74
};

// Get all input elements
const inputs = {};
Object.keys(conversions).forEach(unit => {
    inputs[unit] = document.getElementById(unit);
});

// Add event listeners to all inputs
Object.keys(inputs).forEach(unit => {
    inputs[unit].addEventListener('input', (e) => {
        if (e.target.value === '') {
            clearAllExcept(unit);
            return;
        }

        const value = parseFloat(e.target.value);
        if (isNaN(value)) return;

        // Convert to gram first
        const gram = value * conversions[unit];
        
        // Convert to all other units
        Object.keys(conversions).forEach(otherUnit => {
            if (otherUnit !== unit) {
                const convertedValue = gram / conversions[otherUnit];
                inputs[otherUnit].value = Number(formatNumber(convertedValue));
            }
        });
    });
});

function clearAllExcept(keepUnit) {
    Object.keys(inputs).forEach(unit => {
        if (unit !== keepUnit) {
            inputs[unit].value = '';
        }
    });
}

function formatNumber(num) {
    if (num === 0) return '0';
    if (Math.abs(num) < 0.0000000000001) {
        return num.toExponential(3);
    } else if (Math.abs(num) > 100000000000) {
        return num.toExponential(3);
    } else if (Math.abs(num) < 1) {
        return num.toPrecision(6);
    } else {
        return Math.round(num * 1000000) / 1000000;
    }
}