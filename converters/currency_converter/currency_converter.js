function toggleMenu() {
    const sideMenu = document.getElementById('side-menu');
    const hamMenu = document.querySelector('.ham-menu');
    
    sideMenu.classList.toggle('show');
    hamMenu.classList.toggle('active');
}



const country_code = {
    "AED": "AE", "AFN": "AF", "ALL": "AL", "AMD": "AM", "ANG": "AN", "AOA": "AO", "ARS": "AR", "AUD": "AU", "AWG": "AW", "AZN": "AZ",
    "BAM": "BA", "BBD": "BB", "BDT": "BD", "BGN": "BG", "BHD": "BH", "BIF": "BI", "BMD": "BM", "BND": "BN", "BOB": "BO", "BRL": "BR",
    "BSD": "BS", "BTN": "BT", "BWP": "BW", "BYN": "BY", "BZD": "BZ", "CAD": "CA", "CDF": "CD", "CHF": "CH", "CLP": "CL", "CNY": "CN",
    "COP": "CO", "CRC": "CR", "CUP": "CU", "CVE": "CV", "CZK": "CZ", "DJF": "DJ", "DKK": "DK", "DOP": "DO", "DZD": "DZ", "EGP": "EG",
    "ERN": "ER", "ETB": "ET", "EUR": "EU", "FJD": "FJ", "FKP": "FK", "GBP": "GB", "GEL": "GE", "GHS": "GH", "GIP": "GI", "GMD": "GM",
    "GNF": "GN", "GTQ": "GT", "GYD": "GY", "HKD": "HK", "HNL": "HN", "HRK": "HR", "HTG": "HT", "HUF": "HU", "IDR": "ID", "ILS": "IL",
    "INR": "IN", "IQD": "IQ", "IRR": "IR", "ISK": "IS", "JMD": "JM", "JOD": "JO", "JPY": "JP", "KES": "KE", "KGS": "KG", "KHR": "KH",
    "KMF": "KM", "KPW": "KP", "KRW": "KR", "KWD": "KW", "KYD": "KY", "KZT": "KZ", "LAK": "LA", "LBP": "LB", "LKR": "LK", "LRD": "LR",
    "LSL": "LS", "LTL": "LT", "LVL": "LV", "LYD": "LY", "MAD": "MA", "MDL": "MD", "MGA": "MG", "MKD": "MK", "MMK": "MM", "MNT": "MN",
    "MOP": "MO", "MRU": "MR", "MUR": "MU", "MVR": "MV", "MWK": "MW", "MXN": "MX", "MYR": "MY", "MZN": "MZ", "NAD": "NA", "NGN": "NG",
    "NIO": "NI", "NOK": "NO", "NPR": "NP", "NZD": "NZ", "OMR": "OM", "PAB": "PA", "PEN": "PE", "PGK": "PG", "PHP": "PH", "PKR": "PK",
    "PLN": "PL", "PYG": "PY", "QAR": "QA", "RON": "RO", "RSD": "RS", "RUB": "RU", "RWF": "RW", "SAR": "SA", "SBD": "SB", "SCR": "SC",
    "SDG": "SD", "SEK": "SE", "SGD": "SG", "SHP": "SH", "SLL": "SL", "SOS": "SO", "SRD": "SR", "SSP": "SS", "STN": "ST", "SVC": "SV",
    "SYP": "SY", "SZL": "SZ", "THB": "TH", "TJS": "TJ", "TMT": "TM", "TND": "TN", "TOP": "TO", "TRY": "TR", "TTD": "TT", "TVD": "TV",
    "TWD": "TW", "TZS": "TZ", "UAH": "UA", "UGX": "UG", "USD": "US", "UYU": "UY", "UZS": "UZ", "VES": "VE", "VND": "VN", "VUV": "VU",
    "WST": "WS", "XAF": "XAF", "XAG": "XAG", "XAU": "XAU", "XCD": "XCD", "XOF": "XOF", "XPF": "XPF", "YER": "YE", "ZAR": "ZA", "ZMW": "ZM", "ZWL": "ZW"
};

const fromContainer = document.getElementById('fromCurrencyContainer');
const toContainer = document.getElementById('toCurrencyContainer');
const fromCurrencyList = document.getElementById('fromCurrencyList');
const toCurrencyList = document.getElementById('toCurrencyList');
const fromCurrencyBtn = document.getElementById('fromCurrencyBtn');
const toCurrencyBtn = document.getElementById('toCurrencyBtn');
const fromFlag = document.getElementById('fromFlag');
const toFlag = document.getElementById('toFlag');
const button = document.getElementById("btn");
const apiKey = "6b53b2c2bd6fd05bfdb15925";

// Generate currency options
for (let code in country_code) {
    let liFrom = document.createElement('li');
    liFrom.innerHTML = `
        <img class="currency-flag" src="https://flagsapi.com/${country_code[code]}/flat/64.png" alt="${code}">
        <span>${code}</span>
    `;
    liFrom.onclick = () => {
        setCurrency(code, 'from');
        hideDropDown('from');
    };
    fromCurrencyList.appendChild(liFrom);

    let liTo = document.createElement('li');
    liTo.innerHTML = `
        <img class="currency-flag" src="https://flagsapi.com/${country_code[code]}/flat/64.png" alt="${code}">
        <span>${code}</span>
    `;
    liTo.onclick = () => {
        setCurrency(code, 'to');
        hideDropDown('to');
    };
    toCurrencyList.appendChild(liTo);
}

function setCurrency(code, type) {
    if (type === 'from') {
        fromCurrencyBtn.textContent = code;
        fromFlag.src = `https://flagsapi.com/${country_code[code]}/flat/64.png`;
    } else {
        toCurrencyBtn.textContent = code;
        toFlag.src = `https://flagsapi.com/${country_code[code]}/flat/64.png`;
    }
    
    // Auto convert if there's a value
    if (document.getElementById('input').value) {
        getExchangeRate();
    }
}

function hideDropDown(type) {
    if (type === 'from') {
        fromCurrencyList.classList.remove('show');
        fromContainer.classList.remove('active');
    } else {
        toCurrencyList.classList.remove('show');
        toContainer.classList.remove('active');
    }
}

// Dropdown toggle
fromContainer.addEventListener("click", () => {
    fromCurrencyList.classList.toggle('show');
    fromContainer.classList.toggle('active');
    hideDropDown('to');
});

toContainer.addEventListener("click", () => {
    toCurrencyList.classList.toggle('show');
    toContainer.classList.toggle('active');
    hideDropDown('from');
});

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!fromContainer.contains(e.target)) {
        hideDropDown('from');
    }
    if (!toContainer.contains(e.target)) {
        hideDropDown('to');
    }
});

// Convert button
button.addEventListener("click", e => {
    e.preventDefault();
    getExchangeRate();
});

// Exchange currencies
const exchangeIcon = document.getElementById("exchangeIcon");
exchangeIcon.addEventListener("click", () => {
    let tempCode = fromCurrencyBtn.textContent;
    let tempFlag = fromFlag.src;
    
    fromCurrencyBtn.textContent = toCurrencyBtn.textContent;
    fromFlag.src = toFlag.src;
    
    toCurrencyBtn.textContent = tempCode;
    toFlag.src = tempFlag;
    
    getExchangeRate();
});

// Auto-convert on input
document.getElementById('input').addEventListener('input', () => {
    if (document.getElementById('input').value) {
        getExchangeRate();
    } else {
        document.getElementById('output').value = '';
        document.getElementById('rateInfo').style.display = 'none';
    }
});

function getExchangeRate() {
    const amountInput = document.getElementById("input");
    const outputField = document.getElementById("output");
    let amountVal = amountInput.value;
    
    if (amountVal === "" || amountVal === "0") {
        amountInput.value = "1";
        amountVal = 1;
    }
    
    outputField.value = "Converting...";
    outputField.classList.add('loading');
    
    let fromCode = fromCurrencyBtn.textContent;
    let toCode = toCurrencyBtn.textContent;
    let url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCode}`;
    
    fetch(url)
        .then(response => response.json())
        .then(result => {
            if (result.result === 'success') {
                let rate = result.conversion_rates[toCode];
                let total = (amountVal * rate).toFixed(2);
                
                outputField.value = total;
                outputField.classList.remove('loading');
                
                // Show rate info
                document.getElementById('currentRate').textContent = 
                    `1 ${fromCode} = ${rate.toFixed(4)} ${toCode}`;
                document.getElementById('rateInfo').style.display = 'block';
            } else {
                outputField.value = "Error occurred";
                outputField.classList.remove('loading');
            }
        })
        .catch(error => {
            outputField.value = "Connection error";
            outputField.classList.remove('loading');
            console.error('Error:', error);
        });
}

// Initial conversion
window.addEventListener('load', () => {
    document.getElementById('input').value = '1';
    getExchangeRate();
});