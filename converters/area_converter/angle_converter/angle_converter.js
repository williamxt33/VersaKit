function toggleMenu() {
    const sideMenu = document.getElementById('side-menu');
    const hamMenu = document.querySelector('.ham-menu');
    
    sideMenu.classList.toggle('show');
    hamMenu.classList.toggle('active');
}

const conversions = {
    degree: 1,                  
    radian: 180 / Math.PI,     
    arcmin: 1/60,             
    arcsec: 1/3600             
};

const inputs = {};
Object.keys(conversions).forEach(unit => {
    inputs[unit] = document.getElementById(unit);
});

// DMS 特殊三個欄位
const dmsInputs = {
    d: document.getElementById('dms_degree'),
    m: document.getElementById('dms_minute'),
    s: document.getElementById('dms_second')
};

// 統一事件綁定
Object.keys(inputs).forEach(unit => {
    inputs[unit].addEventListener('input', (e) => {
        if (e.target.value === '') {
            clearAllExcept(unit);
            clearDMS();
            return;
        }

        const value = parseFloat(e.target.value);
        if (isNaN(value)) return;

        // 先轉成 degree
        const degrees = value * conversions[unit];
        
        updateAll(degrees, unit);
    });
});

// DMS 事件綁定
Object.values(dmsInputs).forEach(el => {
    el.addEventListener('input', () => {
        const d = parseFloat(dmsInputs.d.value) || 0;
        const m = parseFloat(dmsInputs.m.value) || 0;
        const s = parseFloat(dmsInputs.s.value) || 0;

        const degrees = d + m/60 + s/3600;
        updateAll(degrees, 'dms');
    });
});

function updateAll(degrees, sourceUnit) {
    // 更新其他單位
    Object.keys(conversions).forEach(otherUnit => {
        if (otherUnit !== sourceUnit) {
            const convertedValue = degrees / conversions[otherUnit];
            inputs[otherUnit].value = formatNumber(convertedValue);
        }
    });

    // 更新 DMS
    if (sourceUnit !== 'dms') {
        const d = Math.floor(degrees);
        const m = Math.floor((degrees - d) * 60);
        const s = ((degrees - d) * 3600 - m * 60).toFixed(2);
        dmsInputs.d.value = d;
        dmsInputs.m.value = m;
        dmsInputs.s.value = s;
    }
}

function clearAllExcept(keepUnit) {
    Object.keys(inputs).forEach(unit => {
        if (unit !== keepUnit) {
            inputs[unit].value = '';
        }
    });
}

function clearDMS() {
    dmsInputs.d.value = '';
    dmsInputs.m.value = '';
    dmsInputs.s.value = '';
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
