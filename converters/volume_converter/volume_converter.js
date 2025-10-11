function toggleMenu() {
    const sideMenu = document.getElementById('side-menu');
    const hamMenu = document.querySelector('.ham-menu');
    
    sideMenu.classList.toggle('show');
    hamMenu.classList.toggle('active');
}



const conversions = {
    pascal: 1,
    kilopascal: 1000,
    megapascal: 1000000,
    bar: 100000,
    millibar: 100,
    psi: 6894.76,
    psf: 47.8803,
    atm: 101325,
    at: 98066.5,
    mmHg: 133.322,
    inHg: 3386.39,
    mmH2O: 9.80665,
    inH2O: 249.089,
    kgf_cm2: 98066.5
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
    } else if (Math.abs(num) > 10000000000) {
        return num.toExponential(3);
    } else if (Math.abs(num) < 1) {
        return num.toPrecision(6);
    } else {
        return Math.round(num * 1000000) / 1000000;
    }
}