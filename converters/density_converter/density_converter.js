function toggleMenu() {
    const sideMenu = document.getElementById('side-menu');
    const hamMenu = document.querySelector('.ham-menu');
    
    sideMenu.classList.toggle('show');
    hamMenu.classList.toggle('active');
}

const conversions = {
    "g_cm3": 1,
    "kg_m3": 0.001,
    "g_ml": 1,
    "g_L": 0.001,
    "kg_L": 1,
    "slug_ft3": 0.515,
    "lb_ft3": 0.016018,
    "lb_gal_uk": 0.099776,
    "lb_gal_us": 0.119826
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