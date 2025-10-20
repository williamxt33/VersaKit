function toggleMenu() {
    const sideMenu = document.getElementById('side-menu');
    const hamMenu = document.querySelector('.ham-menu');
    
    sideMenu.classList.toggle('show');
    hamMenu.classList.toggle('active');
}

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

function calculateCompoundInterest() {
    const principal = parseFloat(document.getElementById('principal').value) || 0;
    const rate = parseFloat(document.getElementById('rate').value) / 100 || 0;
    const time = parseInt(document.getElementById('time').value) || 0;
    const compound = parseInt(document.getElementById('compound').value);
    const contribution = parseFloat(document.getElementById('contribution').value) || 0;
    const contributionFreq = parseInt(document.getElementById('contributionFreq').value);
    const contributionTiming = document.getElementById('contributionTiming').value;
    const inflationRate = parseFloat(document.getElementById('inflationRate').value) / 100 || 0;

    if (principal < 0 || time < 1) {
        alert('Please enter valid values');
        return;
    }

    let yearlyData = [];
    let balance = principal;
    let totalContributions = principal;
    
    for (let year = 1; year <= time; year++) {
        let startingBalance = balance;
        let yearContributions = 0;
        let yearInterest = 0;

        const periodsPerYear = Math.max(compound, contributionFreq);
        const compoundInterval = 1 / compound;
        const contributionInterval = 1 / contributionFreq;

        for (let period = 1; period <= periodsPerYear; period++) {
            if (contributionTiming === 'start' && period % (periodsPerYear / contributionFreq) === 1) {
                balance += contribution;
                yearContributions += contribution;
                totalContributions += contribution;
            }

            if (period % (periodsPerYear / compound) === 0) {
                const periodInterest = balance * (rate / compound);
                balance += periodInterest;
                yearInterest += periodInterest;
            }

            if (contributionTiming === 'end' && period % (periodsPerYear / contributionFreq) === 0) {
                balance += contribution;
                yearContributions += contribution;
                totalContributions += contribution;
            }
        }

        yearlyData.push({
            year: year,
            startingBalance: startingBalance,
            contributions: yearContributions,
            interest: yearInterest,
            endingBalance: balance
        });
    }

    const finalAmount = balance;
    const totalInterest = finalAmount - totalContributions;
    const realValue = finalAmount / Math.pow(1 + inflationRate, time);

    displayResults(finalAmount, totalContributions, totalInterest, realValue, yearlyData);
}

function displayResults(finalAmount, totalContributions, totalInterest, realValue, yearlyData) {
    document.getElementById('statFinalAmount').textContent = formatCurrency(finalAmount);
    document.getElementById('statTotalContributions').textContent = formatCurrency(totalContributions);
    document.getElementById('statTotalInterest').textContent = formatCurrency(totalInterest);
    document.getElementById('statRealValue').textContent = formatCurrency(realValue);

    const principalPercent = (totalContributions / finalAmount) * 100;
    const interestPercent = (totalInterest / finalAmount) * 100;

    const barPrincipal = document.getElementById('barPrincipal');
    const barInterest = document.getElementById('barInterest');
    
    barPrincipal.style.width = principalPercent + '%';
    barPrincipal.textContent = formatCurrency(totalContributions);
    
    barInterest.style.width = interestPercent + '%';
    barInterest.textContent = formatCurrency(totalInterest);

    const breakdownBody = document.getElementById('breakdownBody');
    breakdownBody.innerHTML = '';

    yearlyData.forEach(data => {
        const row = breakdownBody.insertRow();
        row.innerHTML = `
            <td>${data.year}</td>
            <td>${formatCurrency(data.startingBalance)}</td>
            <td>${formatCurrency(data.contributions)}</td>
            <td>${formatCurrency(data.interest)}</td>
            <td>${formatCurrency(data.endingBalance)}</td>
        `;
    });

    document.getElementById('resultsSection').classList.remove('hidden');
}

function clearResults() {
    document.getElementById('principal').value = '10000';
    document.getElementById('rate').value = '5';
    document.getElementById('time').value = '10';
    document.getElementById('compound').value = '12';
    document.getElementById('contribution').value = '0';
    document.getElementById('contributionFreq').value = '12';
    document.getElementById('contributionTiming').value = 'end';
    document.getElementById('inflationRate').value = '2';
    
    document.getElementById('resultsSection').classList.add('hidden');
}

window.addEventListener('load', () => {
    calculateCompoundInterest();
});