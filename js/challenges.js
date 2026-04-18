document.addEventListener('DOMContentLoaded', () => {
    loadChallenges();
});

function loadChallenges() {
    const data = getData();
    const container = document.getElementById('challengesContainer');
    container.innerHTML = '';

    data.challenges.forEach((challenge, index) => {
        const card = document.createElement('div');
        card.className = `challenge-card card ${challenge.completed ? 'completed' : ''}`;
        
        card.innerHTML = `
            <div class="status-badge ${challenge.completed ? 'completed' : 'status-neutral'}">
                ${challenge.completed ? 'Completed' : 'Operation Ready'}
            </div>
            <h3 class="challenge-text">${challenge.text}</h3>
            <p class="reward-text">Allocation: <span>${challenge.points}</span> Clinical Credits 💳</p>
            <button class="btn-primary challenge-btn" ${challenge.completed ? 'disabled' : ''} onclick="completeChallenge(${index})">
                ${challenge.completed ? 'Protocol Verified ✅' : 'Verify Completion ✅'}
            </button>
        `;
        
        container.appendChild(card);
    });
}

window.completeChallenge = function(index) {
    const data = getData();
    const challenge = data.challenges[index];

    if (!challenge.completed) {
        challenge.completed = true;
        data.points += challenge.points;
        saveData(data);
        
        // Celebrate!
        if (typeof triggerConfetti === 'function') triggerConfetti();
        
        // Immediate feedback
        loadChallenges();
    }
};
