function toggleMenu() {
    const sideMenu = document.getElementById('side-menu');
    const hamMenu = document.querySelector('.ham-menu');
    
    sideMenu.classList.toggle('show');
    hamMenu.classList.toggle('active');
}






// Unit conversion functions
function lbsToKg(lbs) {
    return lbs * 0.453592;
}

function kgToLbs(kg) {
    return kg * 2.20462;
}

function ftInToCm(ft, inches) {
    return (ft * 30.48) + (inches * 2.54);
}



function cmToFtIn(cm) {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    return { feet, inches };
}

// Auto-conversion between metric and imperial
document.getElementById('heightCm').addEventListener('input', function() {
    if (this.value) {
        const cm = parseFloat(this.value);
        const { feet, inches } = cmToFtIn(cm);
        document.getElementById('heightFt').value = feet;
        document.getElementById('heightIn').value = inches.toFixed(1);
    }
});

document.getElementById('heightFt').addEventListener('input', updateImperialHeight);
document.getElementById('heightIn').addEventListener('input', updateImperialHeight);

function updateImperialHeight() {
    const ft = parseFloat(document.getElementById('heightFt').value) || 0;
    const inches = parseFloat(document.getElementById('heightIn').value) || 0;
    
    if (ft > 0 || inches > 0) {
        const cm = ftInToCm(ft, inches);
        document.getElementById('heightCm').value = cm.toFixed(1);
    }
}

document.getElementById('weightKg').addEventListener('input', function() {
    if (this.value) {
        const kg = parseFloat(this.value);
        const lbs = kgToLbs(kg);
        document.getElementById('weightLbs').value = lbs.toFixed(1);
    }
});

document.getElementById('weightLbs').addEventListener('input', function() {
    if (this.value) {
        const lbs = parseFloat(this.value);
        const kg = lbsToKg(lbs);
        document.getElementById('weightKg').value = kg.toFixed(1);
    }
});

function calculateBMI() {
    let heightCm = parseFloat(document.getElementById('heightCm').value);
    let weightKg = parseFloat(document.getElementById('weightKg').value);

    // Validation
    if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
        alert('Please enter valid height and weight values');
        return;
    }

    if (heightCm < 50 || heightCm > 300) {
        alert('Please enter a height between 50-300 cm');
        return;
    }

    if (weightKg < 20 || weightKg > 500) {
        alert('Please enter a weight between 20-500 kg');
        return;
    }

    // Calculate BMI
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);

    // Display BMI
    document.getElementById('bmiValue').textContent = bmi.toFixed(1);

    // Determine category and styling
    let category, description, categoryClass, activeScale;

    if (bmi < 18.5) {
        category = 'Underweight';
        description = 'Your BMI indicates you may be underweight. Consider consulting a healthcare professional.';
        categoryClass = 'category-underweight';
        activeScale = 'scale-underweight';
    } else if (bmi < 25) {
        category = 'Normal Weight';
        description = 'Your BMI indicates a healthy weight. Keep up the good work!';
        categoryClass = 'category-normal';
        activeScale = 'scale-normal';
    } else if (bmi < 30) {
        category = 'Overweight';
        description = 'Your BMI indicates you may be overweight. Consider a balanced diet and regular exercise.';
        categoryClass = 'category-overweight';
        activeScale = 'scale-overweight';
    } else {
        category = 'Obese';
        description = 'Your BMI indicates obesity. Please consider consulting a healthcare professional for guidance.';
        categoryClass = 'category-obese';
        activeScale = 'scale-obese';
    }

    // Update display
    const categoryElement = document.getElementById('bmiCategory');
    categoryElement.textContent = category;
    categoryElement.className = categoryClass;
    
    document.getElementById('bmiDescription').textContent = description;

    // Highlight active scale
    document.querySelectorAll('.scale-item').forEach(item => {
        item.classList.remove('active');
    });
    document.getElementById(activeScale).classList.add('active');

    // Update health info
    updateHealthInfo(bmi, category);

    // Show results
    document.getElementById('results').classList.remove('hidden');
}

function updateHealthInfo(bmi, category) {
    const healthInfo = document.getElementById('healthInfo');
    let content = '<h4>Health Information</h4>';

    switch(category) {
        case 'Underweight':
            content += `
                <p>With a BMI of ${bmi.toFixed(1)}, you are classified as underweight.</p>
                <p><strong>Recommendations:</strong></p>
                <p>• Consult with a healthcare provider or nutritionist</p>
                <p>• Focus on nutrient-dense foods to gain healthy weight</p>
                <p>• Consider strength training to build muscle mass</p>
            `;
            break;
        case 'Normal Weight':
            content += `
                <p>With a BMI of ${bmi.toFixed(1)}, you are in the healthy weight range.</p>
                <p><strong>Recommendations:</strong></p>
                <p>• Maintain your current healthy lifestyle</p>
                <p>• Continue regular physical activity</p>
                <p>• Follow a balanced diet rich in fruits and vegetables</p>
            `;
            break;
        case 'Overweight':
            content += `
                <p>With a BMI of ${bmi.toFixed(1)}, you are classified as overweight.</p>
                <p><strong>Recommendations:</strong></p>
                <p>• Aim for 150 minutes of moderate exercise per week</p>
                <p>• Focus on portion control and balanced nutrition</p>
                <p>• Consider consulting a healthcare provider</p>
            `;
            break;
        case 'Obese':
            content += `
                <p>With a BMI of ${bmi.toFixed(1)}, you are classified as obese.</p>
                <p><strong>Recommendations:</strong></p>
                <p>• Consult with a healthcare provider for a comprehensive plan</p>
                <p>• Consider working with a registered dietitian</p>
                <p>• Start with gradual lifestyle changes</p>
                <p>• Focus on sustainable, long-term health improvements</p>
            `;
            break;
    }

    healthInfo.innerHTML = content;
}

function clearAll() {
    document.getElementById('heightCm').value = '';
    document.getElementById('weightKg').value = '';
    document.getElementById('heightFt').value = '';
    document.getElementById('heightIn').value = '';
    document.getElementById('weightLbs').value = '';
    
    document.getElementById('results').classList.add('hidden');
    
    document.querySelectorAll('.scale-item').forEach(item => {
        item.classList.remove('active');
    });
}