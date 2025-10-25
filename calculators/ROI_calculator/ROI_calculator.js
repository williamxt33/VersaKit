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

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

function formatPercentage(value) {
    return value.toFixed(2) + '%';
}

function calculateROI() {
    const initialInvestment = parseFloat(document.getElementById('initialInvestment').value) || 0;
    const finalValue = parseFloat(document.getElementById('finalValue').value) || 0;
    const investmentPeriod = parseFloat(document.getElementById('investmentPeriod').value) || 1;
    const additionalCosts = parseFloat(document.getElementById('additionalCosts').value) || 0;
    const dividends = parseFloat(document.getElementById('dividends').value) || 0;
    const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
    const inflationRate = parseFloat(document.getElementById('inflationRate').value) || 0;
    const calculationType = document.getElementById('calculationType').value;

    const totalInvestment = initialInvestment + additionalCosts;
    const totalReturn = finalValue + dividends;
    const grossProfit = totalReturn - totalInvestment;
    const taxAmount = (grossProfit > 0) ? (grossProfit * taxRate / 100) : 0;
    const netProfit = grossProfit - taxAmount;

    let simpleROI = (netProfit / totalInvestment) * 100;
    let annualizedROI = (Math.pow((totalReturn / totalInvestment), (1 / investmentPeriod)) - 1) * 100;
    
    let realROI = annualizedROI - inflationRate;

    let displayROI = simpleROI;
    if (calculationType === 'annualized') {
        displayROI = annualizedROI;
    } else if (calculationType === 'real') {
        displayROI = realROI;
    }

    document.getElementById('totalReturn').textContent = formatCurrency(totalReturn);
    document.getElementById('netProfit').textContent = formatCurrency(netProfit);
    document.getElementById('roiPercentage').textContent = formatPercentage(displayROI);
    document.getElementById('annualizedROI').textContent = formatPercentage(annualizedROI);

    const roiElement = document.getElementById('roiPercentage');
    const netProfitElement = document.getElementById('netProfit');
    
    if (displayROI >= 0) {
        roiElement.classList.add('positive');
        roiElement.classList.remove('negative');
        netProfitElement.classList.add('positive');
        netProfitElement.classList.remove('negative');
    } else {
        roiElement.classList.add('negative');
        roiElement.classList.remove('positive');
        netProfitElement.classList.add('negative');
        netProfitElement.classList.remove('positive');
    }

    updatePieChart(totalInvestment, Math.max(0, netProfit));
    
    document.getElementById('investmentAmount').textContent = formatCurrency(totalInvestment);
    document.getElementById('profitAmount').textContent = formatCurrency(netProfit);

    generateComparisonTable(totalInvestment, annualizedROI, investmentPeriod);
}

function updatePieChart(investment, profit) {
    const total = investment + profit;
    const investmentPercentage = (investment / total) * 100;
    const profitPercentage = (profit / total) * 100;

    const pieChart = document.getElementById('pieChart');
    pieChart.style.background = `conic-gradient(
        #007bff 0% ${investmentPercentage}%,
        #28a745 ${investmentPercentage}% 100%
    )`;
}

function generateComparisonTable(initialInvestment, annualROI, totalYears) {
    const tbody = document.getElementById('comparisonBody');
    tbody.innerHTML = '';

    const scenarios = [1, 2, 3, 5, 10, 15, 20, 25, 30].filter(year => year <= totalYears * 2);

    scenarios.forEach(years => {
        const value = initialInvestment * Math.pow(1 + (annualROI / 100), years);
        const roi = ((value - initialInvestment) / initialInvestment) * 100;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${years}</td>
            <td>${formatCurrency(value)}</td>
            <td>${formatPercentage(roi)}</td>
            <td>${formatPercentage(annualROI)}</td>
        `;
        tbody.appendChild(row);
    });
}

function clearForm() {
    document.getElementById('initialInvestment').value = '10000';
    document.getElementById('finalValue').value = '15000';
    document.getElementById('investmentPeriod').value = '3';
    document.getElementById('additionalCosts').value = '0';
    document.getElementById('dividends').value = '0';
    document.getElementById('taxRate').value = '0';
    document.getElementById('inflationRate').value = '2.5';
    document.getElementById('calculationType').value = 'simple';
    
    calculateROI();
}

window.onload = function() {
    calculateROI();
};