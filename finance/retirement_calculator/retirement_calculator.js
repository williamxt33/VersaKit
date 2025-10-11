function toggleMenu() {
    const sideMenu = document.getElementById('side-menu');
    const hamMenu = document.querySelector('.ham-menu');
    
    sideMenu.classList.toggle('show');
    hamMenu.classList.toggle('active');
}

function formatCurrency(amount) {
    return '$' + amount.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

function calculateRetirement() {
    const currentAge = parseInt(document.getElementById('currentAge').value);
    const retirementAge = parseInt(document.getElementById('retirementAge').value);
    const lifeExpectancy = parseInt(document.getElementById('lifeExpectancy').value);
    const currentSavings = parseFloat(document.getElementById('currentSavings').value);
    const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value);
    const returnRate = parseFloat(document.getElementById('returnRate').value) / 100;
    const inflationRate = parseFloat(document.getElementById('inflationRate').value) / 100;
    const desiredIncome = parseFloat(document.getElementById('desiredIncome').value);

    // Validation
    if (retirementAge <= currentAge) {
        alert('Retirement age must be greater than current age');
        return;
    }

    if (lifeExpectancy <= retirementAge) {
        alert('Life expectancy must be greater than retirement age');
        return;
    }

    // Calculate years
    const yearsToRetirement = retirementAge - currentAge;
    const yearsInRetirement = lifeExpectancy - retirementAge;

    // Calculate future value of current savings
    const monthlyRate = returnRate / 12;
    const monthsToRetirement = yearsToRetirement * 12;
    
    // Future value of current savings
    const futureValueOfCurrentSavings = currentSavings * Math.pow(1 + returnRate, yearsToRetirement);

    // Future value of monthly contributions (annuity formula)
    const futureValueOfContributions = monthlyContribution * 
        ((Math.pow(1 + monthlyRate, monthsToRetirement) - 1) / monthlyRate);

    // Total at retirement
    const totalAtRetirement = futureValueOfCurrentSavings + futureValueOfContributions;

    // Total contributions made
    const totalContributions = monthlyContribution * monthsToRetirement;

    // Investment growth
    const investmentGrowth = totalAtRetirement - currentSavings - totalContributions;

    // Calculate sustainable monthly income (using 4% withdrawal rule adjusted for years)
    const monthlyIncomeAvailable = totalAtRetirement / (yearsInRetirement * 12);

    // Adjust desired income for inflation
    const inflationAdjustedIncome = desiredIncome * Math.pow(1 + inflationRate, yearsToRetirement);

    // Display results
    document.getElementById('totalSavings').textContent = formatCurrency(totalAtRetirement);
    document.getElementById('yearsToRetire').textContent = yearsToRetirement;
    document.getElementById('yearsInRetirement').textContent = yearsInRetirement;
    document.getElementById('monthlyRetirement').textContent = formatCurrency(monthlyIncomeAvailable);
    document.getElementById('totalContributions').textContent = formatCurrency(totalContributions);

    document.getElementById('breakdownCurrent').textContent = formatCurrency(currentSavings);
    document.getElementById('breakdownContributions').textContent = formatCurrency(totalContributions);
    document.getElementById('breakdownGrowth').textContent = formatCurrency(investmentGrowth);
    document.getElementById('breakdownTotal').textContent = formatCurrency(totalAtRetirement);

    // Generate recommendation
    generateRecommendation(monthlyIncomeAvailable, inflationAdjustedIncome, totalAtRetirement, yearsInRetirement);

    document.getElementById('resultsSection').classList.remove('hidden');
}

function generateRecommendation(monthlyIncome, desiredIncome, totalSavings, yearsInRetirement) {
    const recommendationBox = document.getElementById('recommendationBox');
    
    if (monthlyIncome >= desiredIncome) {
        recommendationBox.innerHTML = `
            <div class="success-box">
                <p><strong>Good news!</strong> Based on your current plan, you're on track to meet your retirement income goals.</p>
                <p>Your projected monthly income (${formatCurrency(monthlyIncome)}) meets or exceeds your desired income (${formatCurrency(desiredIncome)}).</p>
                <p><strong>Recommendations:</strong></p>
                <p>• Continue your current savings plan</p>
                <p>• Review your plan annually and adjust as needed</p>
                <p>• Consider diversifying your investments</p>
                <p>• Build an emergency fund if you haven't already</p>
            </div>
        `;
    } else {
        const shortfall = desiredIncome - monthlyIncome;
        const additionalNeeded = shortfall * yearsInRetirement * 12;
        const additionalMonthly = additionalNeeded / ((document.getElementById('retirementAge').value - document.getElementById('currentAge').value) * 12);
        
        recommendationBox.innerHTML = `
            <div class="warning-box">
                <p><strong>Important:</strong> Your current plan may not fully meet your retirement income goals.</p>
                <p>Your projected monthly income (${formatCurrency(monthlyIncome)}) falls short of your desired income (${formatCurrency(desiredIncome)}) by ${formatCurrency(shortfall)}.</p>
                <p><strong>To reach your goal, consider:</strong></p>
                <p>• Increase monthly contributions by approximately ${formatCurrency(additionalMonthly)}</p>
                <p>• Work a few more years before retiring</p>
                <p>• Adjust your desired retirement income expectations</p>
                <p>• Seek higher-return investments (with appropriate risk)</p>
            </div>
        `;
    }
}

function clearResults() {
    document.getElementById('currentAge').value = '30';
    document.getElementById('retirementAge').value = '65';
    document.getElementById('lifeExpectancy').value = '85';
    document.getElementById('currentSavings').value = '50000';
    document.getElementById('monthlyContribution').value = '500';
    document.getElementById('returnRate').value = '7';
    document.getElementById('inflationRate').value = '3';
    document.getElementById('desiredIncome').value = '3000';
    
    document.getElementById('resultsSection').classList.add('hidden');
}