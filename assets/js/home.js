document.addEventListener('DOMContentLoaded', () => {
    const data = getData();
    
    // Personalization Logic
    if (document.getElementById('welcomeName')) {
        document.getElementById('welcomeName').textContent = data.name || 'User';
    }
    
    const statusOverlay = document.getElementById('statusOverlay');
    const miniScore = document.getElementById('miniScoreVal');
    if (statusOverlay && data.name !== 'Guest') {
        const score = calculateHealthScore();
        miniScore.textContent = score;
        statusOverlay.classList.remove('hidden');
    }

    // Original Tip Logic
    const tips = [
        "Drink at least 8 glasses of water a day to stay hydrated.",
        "A 30-minute walk everyday can significantly improve your cardiovascular health.",
        "Take regular breaks from screens to reduce eye strain.",
        "Eating a diet rich in fruits and vegetables can boost your immune system.",
        "Quality sleep (7-9 hours) is crucial for mental and physical recovery."
    ];
    const todayDay = new Date().getDay();
    const tipIndex = todayDay % tips.length;
    document.getElementById('dailyTip').textContent = tips[tipIndex];

    // Feature 1: Global Health Facts Slider
    const facts = [
        { icon: "🌍", text: "1 in 3 people lack access to essential healthcare services." },
        { icon: "💚", text: "Mental health is as important as physical health for total well-being." },
        { icon: "🏥", text: "Universal health coverage is a primary goal of SDG 3." },
        { icon: "🏃‍♀️", text: "Regular exercise reduces the risk of major chronic diseases by up to 50%." },
        { icon: "💧", text: "Clean water and sanitation are fundamental to global health safety." }
    ];

    let currentFactIndex = 0;
    const factText = document.getElementById('fact-text');
    const factIcon = document.getElementById('fact-icon');
    const factContent = document.getElementById('fact-content');
    const dotsContainer = document.getElementById('slider-dots');

    // Create dots
    facts.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = `dot ${i === 0 ? 'active' : ''}`;
        dot.onclick = () => showFact(i);
        dotsContainer.appendChild(dot);
    });

    function showFact(index) {
        currentFactIndex = index;
        factContent.style.animation = 'none';
        factContent.offsetHeight; // trigger reflow
        factContent.style.animation = 'fadeInOut 0.8s ease-in-out';
        
        factIcon.textContent = facts[index].icon;
        factText.textContent = facts[index].text;

        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    }

    setInterval(() => {
        let nextIndex = (currentFactIndex + 1) % facts.length;
        showFact(nextIndex);
    }, 4000);

    // Initial fact
    showFact(0);

    // Feature 2: Health Quiz System
    const questions = [
        {
            q: "How many hours do you sleep per day?",
            options: [
                { text: "Less than 5 hours", score: 0 },
                { text: "5 - 7 hours", score: 1 },
                { text: "7 - 9 hours", score: 2 }
            ]
        },
        {
            q: "Do you exercise regularly?",
            options: [
                { text: "Rarely", score: 0 },
                { text: "1-2 times a week", score: 1 },
                { text: "3+ times a week", score: 2 }
            ]
        },
        {
            q: "Do you drink enough water daily?",
            options: [
                { text: "Less than 1 liter", score: 0 },
                { text: "1 - 2 liters", score: 1 },
                { text: "2+ liters", score: 2 }
            ]
        }
    ];

    let currentQuizIndex = 0;
    let totalScore = 0;

    window.resetQuiz = function() {
        currentQuizIndex = 0;
        totalScore = 0;
        document.getElementById('quiz-result').classList.add('hidden');
        document.getElementById('quiz-container').classList.remove('hidden');
        updateQuiz();
    };

    function updateQuiz() {
        const question = questions[currentQuizIndex];
        document.getElementById('question-text').textContent = question.q;
        document.getElementById('quiz-step').textContent = `Question ${currentQuizIndex + 1}/${questions.length}`;
        const progress = ((currentQuizIndex) / questions.length) * 100;
        document.getElementById('quiz-progress-fill').style.width = `${progress}%`;

        const optionsDiv = document.getElementById('quiz-options');
        optionsDiv.innerHTML = '';
        question.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-opt-btn';
            btn.textContent = opt.text;
            btn.onclick = () => handleChoice(opt.score);
            optionsDiv.appendChild(btn);
        });
    }

    function handleChoice(score) {
        totalScore += score;
        currentQuizIndex++;

        if (currentQuizIndex < questions.length) {
            updateQuiz();
        } else {
            showResult();
        }
    }

    function showResult() {
        document.getElementById('quiz-container').classList.add('hidden');
        document.getElementById('quiz-result').classList.remove('hidden');
        document.getElementById('quiz-progress-fill').style.width = `100%`;

        const resultText = document.getElementById('result-text');
        const motivMsg = document.getElementById('result-motivational');
        const maxScore = questions.length * 2;

        if (totalScore >= maxScore * 0.8) {
            resultText.textContent = "Optimal Performance 💪";
            motivMsg.textContent = "Excellent data markers. Your health protocol compliance is outstanding. Maintain this level of routine.";
        } else if (totalScore >= maxScore * 0.4) {
            resultText.textContent = "Functional Balance 👍";
            motivMsg.textContent = "Operational capacity is stable. Minor adjustments in sleep or hydration logic will optimize your results.";
        } else {
            resultText.textContent = "Sub-Optimal Markers 📊";
            motivMsg.textContent = "Current markers indicate areas for optimization. Prioritize systemic recovery and increase physical activity protocol.";
        }
    }

    // Initialize Quiz
    updateQuiz();
});
