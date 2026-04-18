document.addEventListener('DOMContentLoaded', () => {
    const data = getData();
    
    // Update Header Content
    document.getElementById('userName').textContent = data.name;
    document.getElementById('userPoints').textContent = data.points;
    document.getElementById('userStreak').textContent = data.streak;

    // Psychometric State (Mood)
    const moodEmoji = document.getElementById('currentMoodEmoji');
    const moodFeedback = document.getElementById('moodFeedback');
    
    if (data.mood) {
        let emoji = '😶';
        let msg = "Analyzing mood patterns...";
        if (data.mood === 'happy') { emoji = '😄'; msg = "Psychometric state: Stable/Positive"; }
        else if (data.mood === 'neutral') { emoji = '😐'; msg = "Psychometric state: Balanced"; }
        else if (data.mood === 'sad') { emoji = '😔'; msg = "Recommended: Emotional recovery protocol"; }
        
        moodEmoji.textContent = emoji;
        moodFeedback.textContent = msg;
    }

    // Protocol Verification (Habits)
    const habitList = document.getElementById('todayHabitsList');
    if (habitList) {
        habitList.innerHTML = '';
        let completedCount = 0;
        
        // Priority Protocol (Top 3)
        const priorityHabits = data.habits.slice(0, 3);
        
        data.habits.forEach(habit => {
            if (habit.completed) completedCount++;
        });

        priorityHabits.forEach(habit => {
            const li = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'habit-checkbox';
            checkbox.checked = habit.completed;
            checkbox.addEventListener('change', () => toggleHabit(habit.id, checkbox.checked));
            
            const label = document.createElement('span');
            label.textContent = habit.text;
            if (habit.completed) label.style.color = 'var(--text-muted)';
            
            li.appendChild(checkbox);
            li.appendChild(label);
            habitList.appendChild(li);
        });

        // Analytics Update
        const total = data.habits.length;
        if (document.getElementById('habitsCompleted')) {
           document.getElementById('habitsCompleted').textContent = completedCount;
           document.getElementById('habitsTotal').textContent = total;
        }
        
        const compliance = total > 0 ? (completedCount / total) * 100 : 0;
        const progressBar = document.getElementById('habitProgress');
        if (progressBar) {
            progressBar.style.width = `${compliance}%`;
        }

        // Compliance Status Logic
        const statusBadge = document.getElementById('healthStatusBadge');
        if (statusBadge) {
            if (compliance === 0) {
                statusBadge.textContent = 'Minimal';
                statusBadge.className = 'status-badge status-neutral';
            } else if (compliance < 50) {
                statusBadge.textContent = 'Fair';
                statusBadge.className = 'status-badge status-neutral';
            } else if (compliance < 90) {
                statusBadge.textContent = 'Good';
                statusBadge.className = 'status-badge status-positive';
            } else {
                statusBadge.textContent = 'Optimal';
                statusBadge.className = 'status-badge status-positive';
            }
        }
    }

    // Health Resilience Index calculation
    const healthScore = calculateHealthScore();
    const scoreVal = document.getElementById('healthScoreValue');
    const analysis = document.getElementById('scoreAnalysis');
    const circular = document.querySelector('.circular-progress');

    if (scoreVal) {
        scoreVal.textContent = healthScore;
        circular.style.setProperty('--progress', healthScore);
        
        let msg = "Complete protocols to stabilize markers.";
        if (healthScore > 80) msg = "Optimal Resilience detected. All systems balanced.";
        else if (healthScore > 50) msg = "Standard stability. Some protocols pending.";
        else msg = "Resilience marker low. Prioritize routine tasks.";
        analysis.textContent = msg;
    }

    // Recommendation Logic
    const recoContent = document.getElementById('recoContent');
    if (recoContent) {
        let recommendations = [];
        
        const pendingHabits = data.habits.filter(h => !h.completed);
        const pendingChallenges = data.challenges.filter(c => !c.completed);
        
        if (!data.mood) recommendations.push("Update your <strong>Psychometric State</strong> (Mood) to refine analysis.");
        if (pendingHabits.length > 0) recommendations.push(`Complete your <strong>Routine Protocols</strong> (${pendingHabits.length} habits pending).`);
        if (pendingChallenges.length > 0) recommendations.push(`Execute your <strong>Daily Challenges</strong> (${pendingChallenges.length} units available).`);
        
        if (recommendations.length === 0) {
            recoContent.innerHTML = "<p class='status-positive'>All systems operational. Resilience at peak levels.</p>";
        } else {
            recoContent.innerHTML = "<ul>" + recommendations.map(r => `<li>${r}</li>`).join('') + "</ul>";
        }
    }
});


function toggleHabit(id, isCompleted) {
    const data = getData();
    const habit = data.habits.find(h => h.id === id);
    if (habit) {
        habit.completed = isCompleted;
        if(isCompleted) {
            data.points += 5; // Reward points for habit
        } else {
            data.points = Math.max(0, data.points - 5);
        }
        saveData(data);
        location.reload(); // Reload to update dashboard stats
    }
}
