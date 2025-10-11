function toggleMenu() {
    const sideMenu = document.getElementById('side-menu');
    const hamMenu = document.querySelector('.ham-menu');
    
    sideMenu.classList.toggle('show');
    hamMenu.classList.toggle('active');
}


const conversions = {
    watt: 1,             
    kilowatt: 1000,         
    ps: 735.49875,          
    hp: 745.69987, 
    kcal_h: 1.163,         
    btu_h: 0.29307107      
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
        return parseFloat(num.toExponential(3));
    } else if (Math.abs(num) > 1000000) {
        return parseFloat(num.toExponential(3));
    } else if (Math.abs(num) < 1) {
        return parseFloat(num.toPrecision(6));
    } else {
        return parseFloat(Math.round(num * 1000000) / 1000000);
    }
}