document.addEventListener('DOMContentLoaded', () => {
    loadMood();

    const moodBtns = document.querySelectorAll('.mood-btn');
    moodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mood = btn.getAttribute('data-mood');
            saveMood(mood);
            updateUI(mood);
        });
    });
});

function loadMood() {
    const data = getData();
    if (data.mood) {
        updateUI(data.mood);
    }
}

function saveMood(mood) {
    const data = getData();
    // Only give points if it's the first time setting mood today
    if (!data.mood) {
        data.points += 10;
    }
    data.mood = mood;
    saveData(data);
}

function updateUI(mood) {
    // Update buttons
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.getAttribute('data-mood') === mood) {
            btn.classList.add('selected');
        }
    });

    // Update feedback
    const feedbackBox = document.getElementById('moodFeedback');
    feedbackBox.className = `feedback-box fade-in ${mood}`; // Reset and add new classes
    
    let message = "";
    if (mood === 'happy') {
        message = "That's wonderful! Keep spreading the positive energy. 🌟";
    } else if (mood === 'neutral') {
        message = "A balanced day is a good day. Deep breaths and stay steady. 🌿";
    } else if (mood === 'sad') {
        message = "It's okay to not be okay. Remember to be kind to yourself today. 💙";
    }
    
    feedbackBox.textContent = message;
    
    // Update background glow color
    const glow = document.getElementById('cursor-glow');
    if (glow) {
        let glowColor = 'rgba(12, 102, 228, 0.15)'; // Default
        if (mood === 'happy') {
            glowColor = 'rgba(54, 179, 126, 0.2)';
            triggerConfetti(); // Positive mood gets a celebration
        } else if (mood === 'neutral') {
            glowColor = 'rgba(255, 171, 0, 0.2)';
        } else if (mood === 'sad') {
            glowColor = 'rgba(207, 34, 46, 0.15)';
        }
        document.documentElement.style.setProperty('--glow-color', glowColor);
    }
    
    // Update current status
    document.getElementById('currentMoodStatus').innerHTML = `You are feeling <strong>${mood.toUpperCase()}</strong> today!`;
}
