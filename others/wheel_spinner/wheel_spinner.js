function toggleMenu() {
    const sideMenu = document.getElementById('side-menu');
    const hamMenu = document.querySelector('.ham-menu');
    sideMenu.classList.toggle('show');
    hamMenu.classList.toggle('active');
}


const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
    '#F8B195', '#F67280', '#C06C84', '#6C5B7B'
];

let items = [];
let spinHistory = []
let wheelType = ""

const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const newItemInput = document.getElementById('itemInput');
const addBtn = document.querySelector(".add-btn")
const itemsList = document.getElementById('itemsList');
const itemCount = document.getElementById('itemCount');
const resultText = document.getElementById('resultValue');
const resultBox = document.getElementById('resultBox')
const pointerEl = document.getElementById('pointer');
const spinBtn = document.querySelector('.wheel-wrapper');
const itemPanel = document.getElementById('itemPanel')
const resultValueGroup = document.querySelector('.result-value-group')

function drawWheel() {
    if (items.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#e9ecef';
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = '#6c757d';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Add names to start', canvas.width / 2, canvas.height / 2);
        return;
    }

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY);
    const segmentAngle = (2 * Math.PI) / items.length;

    // Draw outer white border
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 5, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();

    // Draw segments
    items.forEach((item, i) => {
        const startAngle = i * segmentAngle;
        const endAngle = (i + 1) * segmentAngle;

        // Draw segment
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + segmentAngle / 2);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'white';

        // Fixed maximum width regardless of number of items
        let maxWidth = radius * 0.8; // Fixed max width

        // Initial font size
        let fontSize = Math.max(12, Math.floor(radius * 0.12));
        ctx.font = `bold ${fontSize}px Arial`;

        // Text content
        let text = item;
        let textWidth = ctx.measureText(text).width;

        // Shrink font when text width exceeds max width
        while (textWidth > maxWidth && fontSize > 8) {
            fontSize -= 1;
            ctx.font = `bold ${fontSize}px Arial`;
            textWidth = ctx.measureText(text).width;
        }

        // If still too wide, truncate text with ellipsis
        if (textWidth > maxWidth) {
            while (ctx.measureText(text + '...').width > maxWidth && text.length > 0) {
                text = text.slice(0, -1);
            }
            text += '...';
        }

        // Draw text with shadow for better readability
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;

        ctx.fillText(text, radius * 0.6, 0);

        ctx.restore();
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.stroke();
}

let isSpinning = false
let currentRotation = 0;

function spin() {
    if (isSpinning || items.length === 0) return;
    isSpinning = true;
    spinBtn.disabled = true;
    resultText.textContent = 'Spinning...';
    resultText.style.color = '#ffc107';

    const spins = 5 + Math.random() * 5;
    const extraDegrees = Math.random() * 360;
    const totalRotation = currentRotation + (spins * 360) + extraDegrees;
    const duration = 4000;
    const startTime = Date.now();

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = t => 1 - Math.pow(1 - t, 3);
        const eased = easeOut(progress);
        const rotation = currentRotation + (totalRotation - currentRotation) * eased;

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
        drawWheel();
        ctx.restore();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            currentRotation = totalRotation % 360;

            const canvasRect = canvas.getBoundingClientRect();
            const pointerRect = pointerEl.getBoundingClientRect();
            const centerX = canvasRect.left + canvas.width / 2;
            const centerY = canvasRect.top + canvas.height / 2;
            const px = pointerRect.left + pointerRect.width / 2;
            const py = pointerRect.top + pointerRect.height / 2;

            let pointerAngle = Math.atan2(py - centerY, px - centerX) * 180 / Math.PI;
            if (pointerAngle < 0) pointerAngle += 360;

            const segmentAngle = 360 / items.length;
            const pointerAngleUnrotated = (pointerAngle - (currentRotation % 360) + 360) % 360;
            const epsilon = 1e-6;
            const winnerIndex = Math.floor((pointerAngleUnrotated + epsilon) / segmentAngle) % items.length;
            const winnerColor = colors[winnerIndex % colors.length];

            
            
            resultText.style.color = "#28a745"

            updateHistory(items[winnerIndex])


            if(items.filter(item => item == items[winnerIndex]).length >= 2){
                resultBox.innerHTML = `
                    <h2 class="result-label" style="background-color: ${winnerColor};">We got a winner!</h2>
                    <div class="results">
                        <div class="result-value-group"> 
                            <div class=wheel-type>${wheelType}</div>
                            <div class="result-value" id="resultValue">${items[winnerIndex]}</div>
                        </div>
                        <div>
                            <button id="removeResultBtn" class="delete-btn" onclick="removeItemFromBtn(${winnerIndex})">remove</button>
                            <button id="removeResultBtn" class="delete-btn" onclick="removeItemsFromBtn(${winnerIndex})">remove all</button>     
                        </div>
                    </div>
                `;
            }
            else{
                resultBox.innerHTML = `
                    <h2 class="result-label" style="background-color: ${winnerColor};">We got a winner!</h2>
                    <div class="results">
                        <div class="result-value-group"> 
                            <div class=wheel-type>${wheelType}</div>
                            <div class="result-value" id="resultValue">${items[winnerIndex]}</div>
                        </div>
                        <button id="removeResultBtn" class="delete-btn" onclick="removeItemFromBtn(${winnerIndex})">remove</button>
                    </div>
                `;
            }

            let fontSize;
            if (items[winnerIndex].length <= 3) {
                fontSize = '3rem';  
            } else if (items[winnerIndex].length <= 8) {
                fontSize = '2.5rem';   
            } else if (items[winnerIndex].length <= 15) {
                fontSize = '2rem'; 
            } else if (items[winnerIndex].length <= 25) {
                fontSize = '1.6rem'; 
            } else if (items[winnerIndex].length <= 40) {
                fontSize = '1.3rem';    
            }
            else{
                fontSize = '1rem';   
            }

            document.getElementById("resultValue").style.fontSize = fontSize



            isSpinning = false;
            spinBtn.disabled = false;
        }
    }

    requestAnimationFrame(animate);
}

function addItem() {
    const value = newItemInput.value.trim();
    if (value && items.length < 30 && !isSpinning) {
        items.push(value);
        newItemInput.value = '';
        updateUI();
    }
}

function removeItem(index) {
    if (!isSpinning) {
        items.splice(index, 1);  
        updateUI();
    }
}

function removeItemFromBtn(winnerIndex) {
    resultBox.innerHTML = `
        <div class="results">
            <div class="result-value" id="resultValue">Click spin to start</div>
        </div>
    `;
    console.log(items[winnerIndex]);
    removeItem(winnerIndex);
}

function removeItemsFromBtn(winnerIndex) {
    resultBox.innerHTML = `
        <div class="results">
            <div class="result-value" id="resultValue">Click spin to start</div>
        </div>
    `;

    // Filter out all items that match the winner
    const itemToRemove = items[winnerIndex];
    items = items.filter(item => item !== itemToRemove);
    
    updateUI();
}

function updateUI() {
    itemCount.textContent = `${items.length}/30 items`;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    drawWheel();
    ctx.restore();


    if (items.length === 0) {
        itemsList.innerHTML = '<p style="text-align: center; color: #6c757d; font-style: italic;">No names added yet</p>';
        return;
    }

    itemsList.innerHTML = '';
    items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `
            <span class="item-text">${item}</span>
            <button class="remove-btn" onclick="removeItem(${index})">✕</button>
        `;
        itemsList.appendChild(div);
    });

    addBtn.disabled = items.length >= 30;


}

function updateHistory(winner) {
    
    spinHistory.unshift(winner);
    
    if (spinHistory.length > 10) {
        spinHistory.pop();
    }
    
    const historyList = document.getElementById('historyList');
    
    if (spinHistory.length === 0) {
        historyList.innerHTML = '<p style="text-align: center; color: #6c757d; font-style: italic;">No spins yet</p>';
        return;
    }
    
    historyList.innerHTML = '';
    spinHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <span class="history-winner">🎉 ${item}</span>
        `;
        historyList.appendChild(historyItem);
    });
}

const yesNo = ['yes','no','yes','no','yes','no','yes','no']
const dares = [
  "eatASpoonfulOfHotSauce",
  "letSomeoneGiveYouATemporaryTattoo",
  "sendAFlirtyMessageToTheFirstPersonInYourContactList",
  "do20Burpees",
  "PutYourClothingOnBackwardsFor20Mins",
  "runAroundTheOutsideOfTheHouseThreeTimes",
  "letTheGroupChooseADareForYou",
  "putIceCubesDownYourShirtAndLetThemMelt",
  "holdAPlankForTwoMinutes",
  "Put10DifferentAvailableLiquidsIntoACupAndDrinkIt",
  "wearSomeoneElsesClothesForTheNextHour",
  "giveSomeoneYourUnlockedPhoneFor5Minutes",
  "letSomeoneCheckYourSearchHistory",
  "performADareOfSomeoneElsesChoice",
  "postOldestSelfieOnInstagram",
  "scrollPhoneBookUntilSomeoneSaysStop",
  "allowSomeoneToSendTextToAnybody"
];
const truths = [
  "haveYouEverCheatedOnSomeone",
  "whatsTheWorstThingYouveEverDone",
  "whatsTheWorstThingYouveEverDoneAtWork",
  "whatsSomethingYoureGladYourFamilyDoesntKnowAboutYou",
  "whatsTheWorstIntimateExperienceYouveEverHad",
  "whatsTheBestIntimateExperienceYouveEverHad",
  "whatsTheMostEmbarrassingThingYouveDoneDuringSex",
  "haveYouEverBrokenTheLaw",
  "haveYouEverBeenCaughtWatchingPornByFamily",
  "ifYouHadToNeverSpeakToSomeoneInThisRoomAgainWhoWouldItBeAndWhy",
  "haveYouEverStayedFriendsWithSomeoneBecauseItBenefitedYouBeyondJustTheFriendship",
  "whoWouldYouLikeToKissInThisRoom",
  "haveYouEverBeenCaughtDoingSomethingYouShouldntHave",
  "listAllYourCrushesAndBoyOrGirlFriends"
];
const neverHaveIEver = [
    "stolenSomethingValuable",
    "cheatedOnSomeoneSeriously",
    "hadPublicSex",
    "sentNudePhotos",
    "usedHardDrugs",
    "beenArrested",
    "hookedUpWithSomeoneMuchOlderOrYounger",
    "liedForSexOrMoney",
    "hadSexWithMoreThan2PeopleInOneNight",
    "beenCaughtWatchingPornByFamily",
    "beenPaidForSexOrPaidSomeoneForSex",
    "hadSexInAForbiddenPlace",
    "beenPhysicallyAbusedOrAbusedSomeone",
    "snoopedThroughPartnersPhone",
    "peeInAPool",
    "liedAboutAge",
    "watchedAnEntireTVSeriesInOneDay"
];

const wouldYouRather = [
    "loseAllYourMoneyOrAllYourSexualExperiences",
    "beCaughtCheatingOrCatchSomeoneCheatingOnYou",
    "beNakedInPublicOrTalkAboutYourSexLifeWithStrangers",
    "giveUpSexOrGiveUpYourPhoneForAYear",
    "sleepWithYourCrushOrYourBestFriendsCrush",
    "WouldYouRatherLoseYourSightOrYourMemories?",
    "sendARisquePhotoToYourBossOrParents",
    "beDominatedOrDominateInBedroomActivities",
    "beLockedInARoomWithSomeoneYouHateOrSomeoneYouCrushOn",
    "loseYourMemoryOrLoseYourSenseOfTouch",
    "hookUpWithSomeoneMuchOlderOrMuchYounger",
    "beExposedForAFireOrSecretOrLieYouTold",
    "haveNoPrivacyOrNoFriendsForAYear",
    "revealAllYourCrushesOrAllYourSecrets",
    "telekinesis or telepathy"
];

const movieGenres = [
  "action",
  "adventure",
  "animation",
  "comedy",
  "crime",
  "drama",
  "fantasy",
  "historical",
  "horror",
  "mystery",
  "romance",
  "scienceFiction",
  "superhero",
  "thriller",
  "war",
  "western",
  "musical",
  "sports",
  "documentary",
  "family"
];

const videoGameGenres = [
  "action",
  "adventure",
  "rolePlaying",       
  "shooter",
  "simulation",
  "strategy",
  "sports",
  "racing",
  "puzzle",
  "horror",
  "survival",
  "platformer",
  "fighting",
  "sandbox",
  "roguelike",
  "battleRoyale",
  "mmorpg",
  "stealth",
  "rhythm",
  "towerDefense"
];


function autoAddItems(type){
    items = []

    switch (type) {
        case "yesNo":
            yesNo.forEach(e => {
                if (items.length < 30 && !isSpinning) {
                    items.push(e);
                    wheelType = "Yes/No"
                    updateUI();
                }
            })
            break;
        case "dares":
            dares.forEach(e => {
                if (items.length < 30 && !isSpinning) {
                    items.push(e);
                    wheelType = "Dares"
                    updateUI();
                }
            })
            break;
        case "truths":
            truths.forEach(e => {
                if (items.length < 30 && !isSpinning) {
                    items.push(e);
                    wheelType = "Truths"
                    updateUI();
                }
            })
            break;
        case "neverHaveIEver":
            neverHaveIEver.forEach(e => {
                if (items.length < 30 && !isSpinning) {
                    items.push(e);
                    wheelType = "Never Have I Ever:"
                    updateUI();
                }
            })
            break;
        case "wouldYouRather":
            wouldYouRather.forEach(e => {
                if (items.length < 30 && !isSpinning) {
                    items.push(e);
                    wheelType = "Would You Rather:"
                    updateUI();
                }
            })
            break;
        case "moviesGenre":
            movieGenres.forEach(e => {
                if (items.length < 30 && !isSpinning) {
                    items.push(e);
                    wheelType = "Movie Genre"
                    updateUI();
                }
            })
            break;
        case "videoGamesGenre":
            videoGameGenres.forEach(e => {
                if (items.length < 30 && !isSpinning) {
                    items.push(e);
                    wheelType = "video Games Genre"
                    updateUI();
                }
            })
            break;
    }
}



window.addEventListener('load', () => {
    drawWheel();
    updateUI();
});


document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        spin();
    }
});


itemPanel.addEventListener("mousemove", () => {
    if (isSpinning) {
        itemPanel.classList.add("disabled")
        document.querySelectorAll(".remove-btn").forEach(btn => {
            btn.disabled = true;
        });
        addBtn.disabled = true
        newItemInput.disabled = true
    }
    else{
        itemPanel.classList.remove("disabled")
        document.querySelectorAll(".remove-btn").forEach(btn => {
            btn.disabled = false;
        });
        addBtn.disabled = false
        newItemInput.disabled = false
    }
});

itemPanel.addEventListener("mouseleave",() => {
    itemPanel.classList.remove("disabled")
    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.disabled = false;
    });
    addBtn.disabled = false
    newItemInput.disabled = false
})