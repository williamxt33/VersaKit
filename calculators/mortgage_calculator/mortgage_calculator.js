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
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

function calculateMortgage() {
    const homePrice = parseFloat(document.getElementById('homePrice').value) || 0;
    const downPayment = parseFloat(document.getElementById('downPayment').value) || 0;
    const loanTerm = parseInt(document.getElementById('loanTerm').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value) || 0;
    const propertyTax = parseFloat(document.getElementById('propertyTax').value) || 0;
    const homeInsurance = parseFloat(document.getElementById('homeInsurance').value) || 0;
    const hoa = parseFloat(document.getElementById('hoa').value) || 0;
    const pmiRate = parseFloat(document.getElementById('pmi').value) || 0;

    const principal = homePrice - downPayment;
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    let monthlyPI = 0;
    if (monthlyInterestRate > 0) {
        monthlyPI = principal * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
                    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    } else {
        monthlyPI = principal / numberOfPayments;
    }

    const monthlyTax = propertyTax / 12;
    const monthlyInsurance = homeInsurance / 12;
    
    const downPaymentPercent = (downPayment / homePrice) * 100;
    const monthlyPMI = (downPaymentPercent < 20) ? (principal * pmiRate / 100 / 12) : 0;

    const totalMonthlyPayment = monthlyPI + monthlyTax + monthlyInsurance + hoa + monthlyPMI;

    const totalPaid = (monthlyPI * numberOfPayments) + downPayment;
    const totalInterest = (monthlyPI * numberOfPayments) - principal;

    document.getElementById('monthlyPayment').textContent = formatCurrency(totalMonthlyPayment);
    document.getElementById('principalInterest').textContent = formatCurrency(monthlyPI);
    document.getElementById('totalInterest').textContent = formatCurrency(totalInterest);
    document.getElementById('totalCost').textContent = formatCurrency(totalPaid);

    document.getElementById('principalAmount').textContent = formatCurrency(principal);
    document.getElementById('interestAmount').textContent = formatCurrency(totalInterest);

    createPieChart(principal, totalInterest);
    
    generateAmortizationSchedule(principal, monthlyInterestRate, monthlyPI, numberOfPayments);
}

function createPieChart(principal, interest) {
    const total = principal + interest;
    const principalPercent = (principal / total) * 100;
    const interestPercent = (interest / total) * 100;

    const pieChart = document.getElementById('pieChart');
    pieChart.style.background = `conic-gradient(
        #007bff 0% ${principalPercent}%,
        #dc3545 ${principalPercent}% 100%
    )`;
}

function generateAmortizationSchedule(principal, monthlyRate, monthlyPayment, totalPayments) {
    const tbody = document.getElementById('amortizationBody');
    tbody.innerHTML = '';

    let balance = principal;
    const monthsToShow = Math.min(12, totalPayments);

    for (let month = 1; month <= monthsToShow; month++) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        balance -= principalPayment;

        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${month}</td>
            <td>${formatCurrency(monthlyPayment)}</td>
            <td>${formatCurrency(principalPayment)}</td>
            <td>${formatCurrency(interestPayment)}</td>
            <td>${formatCurrency(balance)}</td>
        `;
    }
}

function clearForm() {
    document.getElementById('homePrice').value = '300000';
    document.getElementById('downPayment').value = '60000';
    document.getElementById('loanTerm').value = '30';
    document.getElementById('interestRate').value = '6.5';
    document.getElementById('propertyTax').value = '3000';
    document.getElementById('homeInsurance').value = '1200';
    document.getElementById('hoa').value = '0';
    document.getElementById('pmi').value = '0.5';

    document.getElementById('monthlyPayment').textContent = '$0';
    document.getElementById('principalInterest').textContent = '$0';
    document.getElementById('totalInterest').textContent = '$0';
    document.getElementById('totalCost').textContent = '$0';
    document.getElementById('principalAmount').textContent = '$0';
    document.getElementById('interestAmount').textContent = '$0';

    const pieChart = document.getElementById('pieChart');
    pieChart.style.background = '#e9ecef';

    const tbody = document.getElementById('amortizationBody');
    tbody.innerHTML = '';
}

window.addEventListener('load', () => {
    calculateMortgage();
});