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
    joule: 1,         
    kilojoule: 1000,    
    kwh: 3600000,          
    hph: 2684510,          
    cal: 4.184,             
    kcal: 4184,             
    btu: 1055.06        
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