document.addEventListener('DOMContentLoaded', () => {
    loadProfile();

    document.getElementById('profileForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveProfile();
    });
});

function loadProfile() {
    const data = getData();
    
    // Form data
    document.getElementById('userNameInput').value = data.name;
    document.getElementById('userEmailInput').value = data.email || 'N/A';
    document.getElementById('userGoalSelect').value = data.goal;

    // Stats
    document.getElementById('statPoints').textContent = data.points;
    document.getElementById('statStreak').textContent = data.streak;

    // Guest vs Member actions
    if (data.name === 'Guest' || !data.email || data.email === 'N/A') {
        document.getElementById('upgradeBtn').classList.remove('hidden');
        document.getElementById('emailGroup').classList.add('hidden');
    } else {
        document.getElementById('emailGroup').classList.remove('hidden');
    }
}

function saveProfile() {
    const data = getData();
    
    const newName = document.getElementById('userNameInput').value.trim();
    const newGoal = document.getElementById('userGoalSelect').value;
    
    if (newName) {
        data.name = newName;
    }
    const newEmail = document.getElementById('userEmailInput').value;
    data.email = newEmail;
    data.goal = newGoal;
    
    saveData(data);
    
    // Celebrate the update!
    triggerConfetti();
    
    // Show success message
    const msg = document.getElementById('saveMessage');
    msg.classList.remove('hidden');
    msg.classList.add('fade-in');
    
    setTimeout(() => {
        msg.classList.add('hidden');
        msg.classList.remove('fade-in');
    }, 3000);
}
