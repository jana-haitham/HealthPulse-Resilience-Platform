const defaultData = {
    name: 'Guest',
    email: '',
    password: '',
    goal: 'Stay Fit',
    points: 0,
    streak: 0,
    habits: [
        { id: 1, text: 'Drink 2L water', completed: false },
        { id: 2, text: 'Walk 10,000 steps', completed: false }
    ],
    lastActiveDate: new Date().toDateString(),
    mood: null,
    challenges: [
        { id: 1, text: 'Do 15 minutes of stretching', completed: false, points: 50 },
        { id: 2, text: 'Eat a healthy green salad', completed: false, points: 50 },
        { id: 3, text: 'Meditate for 10 minutes', completed: false, points: 50 }
    ],
    currentChallengeIndex: 0
};

const challengeLibrary = {
    'Stay Fit': [
        { id: 'sf1', text: 'Do 15 minutes of dynamic stretching', points: 50 },
        { id: 'sf2', text: 'Perform 20 air squats during a break', points: 50 },
        { id: 'sf3', text: 'Take the stairs instead of the elevator', points: 50 },
        { id: 'sf4', text: 'Hold a 1-minute plank', points: 50 }
    ],
    'Lose Weight': [
        { id: 'lw1', text: 'Drink 500ml of water before your next meal', points: 50 },
        { id: 'lw2', text: 'Replace an afternoon snack with a fruit', points: 50 },
        { id: 'lw3', text: 'Skip all sugary drinks for the next 24 hours', points: 50 },
        { id: 'lw4', text: 'Go for a 15-minute brisk walk after dinner', points: 50 }
    ],
    'Mental Health': [
        { id: 'mh1', text: 'Spend 10 minutes in silent meditation', points: 50 },
        { id: 'mh2', text: 'Journal 3 positive things from today', points: 50 },
        { id: 'mh3', text: 'Reach out to a friend or family member', points: 50 },
        { id: 'mh4', text: 'Practice 5-minute deep breathing exercises', points: 50 }
    ],
    'Build Muscle': [
        { id: 'bm1', text: 'Perform 3 sets of 12 push-ups', points: 50 },
        { id: 'bm2', text: 'Include a high-protein source in your next meal', points: 50 },
        { id: 'bm3', text: 'Do 20 lunges on each leg', points: 50 },
        { id: 'bm4', text: 'Perform maximum pull-ups or bodyweight rows', points: 50 }
    ]
};

function initData() {
    let data = localStorage.getItem('healthCompanionData');
    const today = new Date().toDateString();

    if (!data) {
        let initialData = { ...defaultData };
        initialData.lastActiveDate = today;
        initialData.challenges = selectDailyChallenges(initialData.goal);
        localStorage.setItem('healthCompanionData', JSON.stringify(initialData));
    } else {
        const parsed = JSON.parse(data);
        if (parsed.lastActiveDate !== today) {
            // New day reset
            parsed.habits.forEach(h => h.completed = false);
            parsed.mood = null;
            parsed.lastActiveDate = today;
            parsed.streak += 1;

            // Refresh challenges based on goal
            parsed.challenges = selectDailyChallenges(parsed.goal);

            localStorage.setItem('healthCompanionData', JSON.stringify(parsed));
        }
    }
}

function selectDailyChallenges(goal) {
    const library = challengeLibrary[goal] || challengeLibrary['Stay Fit'];
    // Randomly select 3 challenges from the library
    const shuffled = [...library].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3).map(c => ({ ...c, completed: false }));
}

function getData() {
    return JSON.parse(localStorage.getItem('healthCompanionData'));
}

function saveData(data) {
    localStorage.setItem('healthCompanionData', JSON.stringify(data));
}

function logout() {
    if (confirm("Are you sure you want to terminate the current session? All local protocol data will be reset.")) {
        localStorage.removeItem('healthCompanionData');
        window.location.href = 'index.html';
    }
}

function addPoints(pts) {
    const data = getData();
    data.points += pts;
    saveData(data);
}

function calculateHealthScore() {
    const data = getData();
    let score = 0;

    // Habits contribution (40%)
    const completedHabits = data.habits.filter(h => h.completed).length;
    const habitScore = data.habits.length > 0 ? (completedHabits / data.habits.length) * 40 : 0;

    // Challenges contribution (40%)
    const completedChallenges = data.challenges.filter(c => c.completed).length;
    const challengeScore = data.challenges.length > 0 ? (completedChallenges / data.challenges.length) * 40 : 0;

    // Mood contribution (20%)
    let moodScore = 0;
    if (data.mood === 'happy') moodScore = 20;
    else if (data.mood === 'neutral') moodScore = 15;
    else if (data.mood === 'sad') moodScore = 5;

    score = Math.round(habitScore + challengeScore + moodScore);
    return score;
}

document.addEventListener('DOMContentLoaded', () => {
    initData();
    const currentLoc = window.location.pathname.split('/').pop() || 'home.html';
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        if (link.getAttribute('href') === currentLoc) {
            link.classList.add('active');
        }
    });

    // --- Motivational Toast System ---
    const motivationMessages = [
        { text: "Your health is your real wealth ❤️", icon: "🏥" },
        { text: "Drink water and stay hydrated 💧", icon: "🌊" },
        { text: "Small habits create big changes 🏃‍♀️", icon: "📊" },
        { text: "Take care of your mind and body 🧠", icon: "⚕️" },
        { text: "Rest is part of productivity 💤", icon: "🔋" },
        { text: "Prevention is better than cure ⚖️", icon: "🛡️" },
        { text: "Mental health is as important as physical health 🧘‍♀️", icon: "✨" },
        { text: "Focus on progress, not perfection 📈", icon: "🎯" },
        { text: "A healthy outside starts from the inside 🍏", icon: "🧬" },
        { text: "Consistency is the key to resilience 🏁", icon: "🏗️" }
    ];

    function showMotivationToast() {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }

        const randomMsg = motivationMessages[Math.floor(Math.random() * motivationMessages.length)];

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <span class="toast-icon">${randomMsg.icon}</span>
            <span class="toast-text">${randomMsg.text}</span>
        `;

        container.appendChild(toast);

        // Disappear after 5 seconds
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => {
                toast.remove();
            }, 500);
        }, 5000);

        // Schedule next toast (20-40 seconds)
        const nextInterval = Math.floor(Math.random() * (40000 - 20000 + 1)) + 20000;
        setTimeout(showMotivationToast, nextInterval);
    }

    // Start toast system
    setTimeout(showMotivationToast, 10000); // Wait 10s after load for first toast

    // --- Dynamic Background Elements ---
    const bgContainer = document.createElement('div');
    bgContainer.id = 'bg-elements';
    document.body.appendChild(bgContainer);

    const icons = ['❤️', '🏥', '🧬', '🧪', '💊', '⚕️', '🧠', '🥦', '🏃', '🍎'];
    for (let i = 0; i < 15; i++) {
        const icon = document.createElement('div');
        icon.className = 'bg-icon';
        icon.textContent = icons[Math.floor(Math.random() * icons.length)];
        icon.style.left = Math.random() * 100 + 'vw';
        icon.style.top = Math.random() * 100 + 'vh';
        icon.style.fontSize = (Math.random() * 2 + 1) + 'rem';
        icon.style.animationDelay = (Math.random() * 5) + 's';
        icon.style.animationDuration = (Math.random() * 10 + 10) + 's';
        icon.style.opacity = Math.random() * 0.4 + 0.1;
        bgContainer.appendChild(icon);
    }

    // --- Cursor Glow Tracker ---
    const glow = document.createElement('div');
    glow.id = 'cursor-glow';
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });

    // --- Ripple Effect Implementation ---
    document.addEventListener('click', function (e) {
        const target = e.target.closest('.btn-primary, .mood-btn, .habit-check');
        if (target) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';

            const rect = target.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';

            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            target.classList.add('ripple');
            target.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        }
    });
});

// --- Confetti Celebration ---
function triggerConfetti() {
    const count = 150;
    const defaults = {
        origin: { y: 0.7 }
    };

    function fire(particleRatio, opts) {
        if (typeof confetti === 'function') {
            confetti(Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio)
            }));
        } else {
            // Fallback: Simple CSS/JS confetti if library not loaded
            createSimpleConfetti();
        }
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
}

function createSimpleConfetti() {
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = ['#0c66e4', '#00b8d9', '#36b37e', '#ffab00'][Math.floor(Math.random() * 4)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = '50%';
        confetti.style.zIndex = '10000';
        confetti.style.transition = `transform ${Math.random() * 2 + 1}s ease-out, top ${Math.random() * 2 + 1}s ease-out`;
        document.body.appendChild(confetti);

        setTimeout(() => {
            confetti.style.top = '110vh';
            confetti.style.transform = `translateX(${(Math.random() - 0.5) * 200}px) rotate(${Math.random() * 360}deg)`;
        }, 10);

        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}
