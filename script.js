const ranks = [
    {
        name: 'Bronze',
        basePoints: 25,
        increment: 25,
        maxPoints: 150,
    },
    {
        name: 'Silver',
        basePoints: 150,
        increment: 50,
        maxPoints: 375,
    },
    {
        name: 'Gold',
        basePoints: 375,
        increment: 75,
        maxPoints: 700,
    },
    {
        name: 'Platinum',
        basePoints: 700,
        increment: 100,
        maxPoints: 1150,
    },
    {
        name: 'Diamond',
        basePoints: 1150,
        increment: 150,
        maxPoints: 1800,
    },
    {
        name: 'Emerald',
        basePoints: 1800,
        increment: 200,
        maxPoints: 2400,
    },
];
const sidebar = document.getElementById('historySidebar');
const toggleSidebarBtn = document.getElementById('toggleSidebar');
const pointsInput = document.getElementById('pointsInput');

// Restore points and sidebar state on page load
window.onload = function () {
    const savedPoints = localStorage.getItem('rankPoints');
    if (savedPoints) {
        pointsInput.value = savedPoints;
        updateCalculations();
    }

    const sidebarState = localStorage.getItem('sidebarState');
    if (sidebarState === 'visible') {
        sidebar.classList.add('visible');
    }

    loadHistory(); // Load history on page load
};

// Toggle Sidebar
toggleSidebarBtn.addEventListener('click', () => {
    const isVisible = sidebar.classList.toggle('visible');
    localStorage.setItem('sidebarState', isVisible ? 'visible' : 'hidden');
});

// Add Points and Save
function addPoints(points) {
    const currentPoints = parseInt(pointsInput.value || 0);
    const newPoints = currentPoints + points;
    pointsInput.value = newPoints;
    localStorage.setItem('rankPoints', newPoints);

    saveHistory(points);
    updateCalculations();
}

function setPoints(value) {
    const points = Number.parseInt(value);
    localStorage.setItem('rankPoints', points);

    updateCalculations();
}

// Save a history entry
function saveHistory(pointsAdded) {
    const timestamp = new Date();
    const formattedDate = timestamp.toLocaleDateString('en-GB'); // DD-MM-YY
    const formattedTime = timestamp.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const entry = `${formattedDate} ${formattedTime} +${pointsAdded}`;

    // Retrieve existing history, add the new entry, and save it back
    const history = JSON.parse(localStorage.getItem('historyLog')) || [];
    history.unshift(entry); // Add newest entry to the top
    localStorage.setItem('historyLog', JSON.stringify(history));

    loadHistory(); // Refresh the sidebar log
}

// Load history and display it in the sidebar
function loadHistory() {
    const history = JSON.parse(localStorage.getItem('historyLog')) || [];
    const historyLog = document.getElementById('historyLog');
    historyLog.innerHTML = ''; // Clear existing entries

    history.forEach(entry => {
        const historyEntry = document.createElement('div');
        historyEntry.className = 'history-entry';
        historyEntry.textContent = entry;
        historyLog.appendChild(historyEntry);
    });
}


function getRankData(points) {
    let rankData;
    let nextRankData;
    for (let i = 0; i < ranks.length; i++) {
        if (points >= ranks[i].basePoints && points < ranks[i].maxPoints) {
            rankData = ranks[i];
            nextRankData = ranks[i + 1] || null;
            break;
        }
    }

    if (!rankData) {
        return {
            rank: 'Unranked',
            tier: 'N/A',
            pointsToNextTier: 'N/A',
            nextTierName: 'N/A',
            pointsToNextRank: 'N/A',
            nextRankName: 'N/A',
            pointsToEmerald: 'N/A'
        };
    }


    const {name, basePoints, increment, maxPoints} = rankData;
    const tierNumber = 4 - Math.floor((points - basePoints) / increment);
    const tier = `Tier ${Math.max(1, Math.min(4, tierNumber))}`;


    let nextTierName;
    let nextTierPoints;
    if (tierNumber > 1) {
        nextTierPoints = basePoints + (4 - (tierNumber - 1)) * increment;
        nextTierName = `Tier ${tierNumber - 1}`;
    } else {
        nextTierPoints = nextRankData ? nextRankData.basePoints : 'N/A';
        nextTierName = nextRankData ? `${nextRankData.name} 4` : 'N/A';
    }
    const pointsToNextTier = points < nextTierPoints ? nextTierPoints - points : 'N/A';

    const pointsToNextRank = points < maxPoints ? maxPoints - points : 'N/A';
    const nextRankName = nextRankData ? nextRankData.name : 'N/A';

    const pointsToEmerald = 2400 - points > 0 ? 2400 - points : 'N/A';

    return {rank: name, tier: tier, pointsToNextTier, nextTierName, pointsToNextRank, nextRankName, pointsToEmerald};
}


function updateCalculations() {
    const points = parseInt(document.getElementById('pointsInput').value || 0);
    localStorage.setItem('rankPoints', points);

    const {
        rank,
        tier,
        pointsToNextTier,
        nextTierName,
        pointsToNextRank,
        nextRankName,
        pointsToEmerald
    } = getRankData(points);

    document.getElementById('rankAndTier').innerText = `Rank: ${rank} | Tier: ${tier}`;


    document.getElementById('nextTierName').innerText = `(${nextTierName})`;
    document.getElementById('nextTierPoints').innerText = pointsToNextTier !== 'N/A' ? `${points + pointsToNextTier} points` : 'N/A';

    document.getElementById('nextRankName').innerText = `(${nextRankName})`;
    document.getElementById('nextRankPoints').innerText = pointsToNextRank !== 'N/A' ? `${points + pointsToNextRank} points` : 'N/A';

    document.getElementById('emeraldPoints').innerText = `2400 points`;


    document.getElementById('tierSecondRound').innerText = `Second Round: ${Math.ceil(pointsToNextTier / 6)} times`;
    document.getElementById('tierFinalRound').innerText = `Final Round: ${Math.ceil(pointsToNextTier / 14)} times`;
    document.getElementById('tierFinalVictory').innerText = `Final Victory: ${Math.ceil(pointsToNextTier / 25)} times`;


    document.getElementById('secondRound').innerText = `Second Round: ${Math.ceil(pointsToNextRank / 6)} times`;
    document.getElementById('finalRound').innerText = `Final Round: ${Math.ceil(pointsToNextRank / 14)} times`;
    document.getElementById('finalVictory').innerText = `Final Victory: ${Math.ceil(pointsToNextRank / 25)} times`;


    document.getElementById('emeraldSecondRound').innerText = `Second Round: ${Math.ceil(pointsToEmerald / 6)} times`;
    document.getElementById('emeraldFinalRound').innerText = `Final Round: ${Math.ceil(pointsToEmerald / 14)} times`;
    document.getElementById('emeraldFinalVictory').innerText = `Final Victory: ${Math.ceil(pointsToEmerald / 25)} times`;
}
