function toggleMenu() {
    const sideMenu = document.getElementById('side-menu');
    const hamMenu = document.querySelector('.ham-menu');
    
    sideMenu.classList.toggle('show');
    hamMenu.classList.toggle('active');
}

// Conversion factors (all to degrees)
const conversions = {
    degree: 1,
    radian: 180 / Math.PI,
    arcminute: 1 / 60,
    arcsecond: 1 / 3600
};

// Get all input elements
const inputs = {};
Object.keys(conversions).forEach(unit => {
    inputs[unit] = document.getElementById(unit);
});
inputs.dms = document.getElementById('dms');

// Add event listeners to numeric inputs
Object.keys(conversions).forEach(unit => {
    inputs[unit].addEventListener('input', (e) => {
        if (e.target.value === '') {
            clearAllExcept(unit);
            return;
        }

        const value = parseFloat(e.target.value);
        if (isNaN(value)) return;

        // Convert to degrees first
        const degrees = value * conversions[unit];
        
        // Convert to all other units
        Object.keys(conversions).forEach(otherUnit => {
            if (otherUnit !== unit) {
                const convertedValue = degrees / conversions[otherUnit];
                inputs[otherUnit].value = formatNumber(convertedValue);
            }
        });

        // Update DMS
        inputs.dms.value = degreesToDMS(degrees);
    });
});

// Add event listener for DMS input
inputs.dms.addEventListener('input', (e) => {
    if (e.target.value === '') {
        clearAllExcept('dms');
        return;
    }

    const degrees = parseDMS(e.target.value);
    if (isNaN(degrees)) return;

    // Convert to all other units
    Object.keys(conversions).forEach(unit => {
        const convertedValue = degrees / conversions[unit];
        inputs[unit].value = formatNumber(convertedValue);
    });
});

function parseDMS(dmsString) {
    // Parse formats like "45° 30' 15"" or "45 30 15" or "45°30'15""
    const match = dmsString.match(/(-?\d+(?:\.\d+)?)[°\s]+(\d+(?:\.\d+)?)['\s]+(\d+(?:\.\d+)?)/);
    if (match) {
        const deg = parseFloat(match[1]);
        const min = parseFloat(match[2]);
        const sec = parseFloat(match[3]);
        return deg + (min / 60) + (sec / 3600);
    }
    return NaN;
}

function degreesToDMS(degrees) {
    const sign = degrees < 0 ? -1 : 1;
    degrees = Math.abs(degrees);
    
    const d = Math.floor(degrees);
    const minFloat = (degrees - d) * 60;
    const m = Math.floor(minFloat);
    const s = (minFloat - m) * 60;
    
    return `${sign * d}° ${m}' ${formatNumber(s)}"`;
}

function clearAllExcept(keepUnit) {
    Object.keys(conversions).forEach(unit => {
        if (unit !== keepUnit) {
            inputs[unit].value = '';
        }
    });
    if (keepUnit !== 'dms') {
        inputs.dms.value = '';
    }
}

function formatNumber(num) {
    if (num === 0) return '0';
    if (Math.abs(num) < 0.000001) {
        return num.toExponential(6);
    } else if (Math.abs(num) > 1000000) {
        return num.toExponential(6);
    } else if (Math.abs(num) < 1) {
        return num.toPrecision(8);
    } else {
        return Math.round(num * 100000000) / 100000000;
    }
}