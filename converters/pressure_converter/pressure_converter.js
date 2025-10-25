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

const conversions = {
    kgf_cm2: 98066.5,
    n_m2: 1,
    psi: 6894.76,
    psf: 47.8803,
    pa: 1,
    kpa: 1000,
    mpa: 1000000,
    atm: 101325,
    at: 98066.5,
    bar: 100000,
    mbar: 100,
    mmAq: 9.80665,
    inH2O: 249.0889,
    mmHg: 133.322,
    cmHg: 1333.22,
    inHg: 3386.39
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