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
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

function calculateEMI() {
    const principal = parseFloat(document.getElementById('loanAmount').value) || 0;
    const annualRate = parseFloat(document.getElementById('interestRate').value) || 0;
    let tenure = parseInt(document.getElementById('loanTenure').value) || 0;
    const tenureType = document.getElementById('tenureType').value;
    const processingFeePercent = parseFloat(document.getElementById('processingFee').value) || 0;

    if (principal <= 0 || tenure <= 0) {
        alert('Please enter valid loan amount and tenure');
        return;
    }

    const months = tenureType === 'years' ? tenure * 12 : tenure;
    const monthlyRate = annualRate / 12 / 100;

    let emi;
    if (monthlyRate === 0) {
        emi = principal / months;
    } else {
        emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                (Math.pow(1 + monthlyRate, months) - 1);
    }

    const totalAmount = emi * months;
    const totalInterest = totalAmount - principal;
    const processingFeeAmount = (principal * processingFeePercent) / 100;

    document.getElementById('monthlyEMI').textContent = formatCurrency(emi);
    document.getElementById('totalInterest').textContent = formatCurrency(totalInterest);
    document.getElementById('totalAmount').textContent = formatCurrency(totalAmount);
    document.getElementById('processingFeeAmount').textContent = formatCurrency(processingFeeAmount);

    document.getElementById('principalAmount').textContent = formatCurrency(principal);
    document.getElementById('interestAmount').textContent = formatCurrency(totalInterest);

    createPieChart(principal, totalInterest);
    generateAmortizationSchedule(principal, monthlyRate, emi, months);
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

function generateAmortizationSchedule(principal, monthlyRate, emi, totalMonths) {
    const tbody = document.getElementById('amortizationBody');
    tbody.innerHTML = '';

    let balance = principal;
    const monthsToShow = Math.min(12, totalMonths);

    for (let month = 1; month <= monthsToShow; month++) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = emi - interestPayment;
        balance -= principalPayment;

        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${month}</td>
            <td>${formatCurrency(emi)}</td>
            <td>${formatCurrency(principalPayment)}</td>
            <td>${formatCurrency(interestPayment)}</td>
            <td>${formatCurrency(balance)}</td>
        `;
    }
}

function clearForm() {
    document.getElementById('loanAmount').value = '500000';
    document.getElementById('interestRate').value = '10.5';
    document.getElementById('loanTenure').value = '5';
    document.getElementById('tenureType').value = 'years';
    document.getElementById('loanType').value = 'personal';
    document.getElementById('processingFee').value = '1';
    document.getElementById('prepayment').value = '0';
    document.getElementById('prepaymentMonth').value = '12';

    document.getElementById('monthlyEMI').textContent = '₹0';
    document.getElementById('totalInterest').textContent = '₹0';
    document.getElementById('totalAmount').textContent = '₹0';
    document.getElementById('processingFeeAmount').textContent = '₹0';
    document.getElementById('principalAmount').textContent = '₹0';
    document.getElementById('interestAmount').textContent = '₹0';

    const pieChart = document.getElementById('pieChart');
    pieChart.style.background = '#e9ecef';

    const tbody = document.getElementById('amortizationBody');
    tbody.innerHTML = '';
}

window.addEventListener('load', () => {
    calculateEMI();
});