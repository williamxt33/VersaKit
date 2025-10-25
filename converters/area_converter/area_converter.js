function toggleMenu() {
    const sideMenu = document.getElementById('side-menu');
    const hamMenu = document.querySelector('.ham-menu');
    
    sideMenu.classList.toggle('show');
    hamMenu.classList.toggle('active');
}

// Close side menu when clicking outside
document.addEventListener('click', function(event) {
    const sideMenu = document.getElementById('side-menu');
    const hamMenu = document.querySelector('.ham-menu');
    
    if (!sideMenu.contains(event.target) && !hamMenu.contains(event.target)) {
        sideMenu.classList.remove('show');
        hamMenu.classList.remove('active');
    }
});


// Conversion factors to meters
const conversions = {
    square_meter: 1,
    square_centimeter: 0.0001,
    square_millimeter: 0.000001,
    square_kilometer: 1000000,
    hectare: 10000,
    are: 100,
    square_yard: 0.836127,
    square_foot: 0.092903,
    square_inch: 0.00064516,
    acre: 4046.86
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

        // Convert to meters first
        const meters = value * conversions[unit];
        
        // Convert to all other units
        Object.keys(conversions).forEach(otherUnit => {
            if (otherUnit !== unit) {
                const convertedValue = meters / conversions[otherUnit];
                inputs[otherUnit].value = formatNumber(convertedValue);
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
    if (Math.abs(num) < 0.000001) {
        return num.toExponential(3);
    } else if (Math.abs(num) > 1000000) {
        return num.toExponential(3);
    } else if (Math.abs(num) < 1) {
        return num.toPrecision(6);
    } else {
        return Math.round(num * 1000000) / 1000000;
    }
}