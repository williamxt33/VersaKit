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

function celsiusToFahrenheit(c) {
    return (c * 9/5) + 32;
}

function celsiusToKelvin(c) {
    return c + 273.15;
}

function celsiusToRankine(c) {
    return (c + 273.15) * 9/5;
}

function fahrenheitToCelsius(f) {
    return (f - 32) * 5/9;
}

function kelvinToCelsius(k) {
    return k - 273.15;
}

function rankineToCelsius(r) {
    return (r * 5/9) - 273.15;
}

// Get all input elements
const inputs = {
    celsius: document.getElementById('celsius'),
    fahrenheit: document.getElementById('fahrenheit'), 
    kelvin: document.getElementById('kelvin'),
    rankine: document.getElementById('rankine')
};

// Add event listeners to all inputs
Object.keys(inputs).forEach(unit => {
    if (inputs[unit]) {
        inputs[unit].addEventListener('input', (e) => {
            if (e.target.value === '') {
                clearAllExcept(unit);
                return;
            }

            const value = parseFloat(e.target.value);
            if (isNaN(value)) return;

            // Convert from the input unit to all others
            let celsius;
            
            // First convert to Celsius as the base unit
            switch(unit) {
                case 'celsius':
                    celsius = value;
                    break;
                case 'fahrenheit':
                    celsius = fahrenheitToCelsius(value);
                    break;
                case 'kelvin':
                    celsius = kelvinToCelsius(value);
                    break;
                case 'rankine':
                    celsius = rankineToCelsius(value);
                    break;
            }
            
            // Convert from Celsius to all other units
            Object.keys(inputs).forEach(otherUnit => {
                if (otherUnit !== unit && inputs[otherUnit]) {
                    let convertedValue;
                    
                    switch(otherUnit) {
                        case 'celsius':
                            convertedValue = celsius;
                            break;
                        case 'fahrenheit':
                            convertedValue = celsiusToFahrenheit(celsius);
                            break;
                        case 'kelvin':
                            convertedValue = celsiusToKelvin(celsius);
                            break;
                        case 'rankine':
                            convertedValue = celsiusToRankine(celsius);
                            break;
                    }
                    
                    inputs[otherUnit].value = formatNumber(convertedValue);
                }
            });
        });
    }
});

function clearAllExcept(keepUnit) {
    Object.keys(inputs).forEach(unit => {
        if (unit !== keepUnit && inputs[unit]) {
            inputs[unit].value = '';
        }
    });
}

function formatNumber(num) {
    if (num === 0) return '0';
    if (Math.abs(num) < 0.01) {
        return num.toFixed(4);
    } else if (Math.abs(num) > 10000) {
        return num.toExponential(2);
    } else {
        return Math.round(num * 100) / 100;
    }
}