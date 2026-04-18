document.addEventListener('DOMContentLoaded', () => {
    renderHabits();

    document.getElementById('addHabitBtn').addEventListener('click', addHabit);
    document.getElementById('newHabitInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addHabit();
        }
    });
});

function renderHabits() {
    const data = getData();
    const list = document.getElementById('habitListFull');
    list.innerHTML = '';

    data.habits.forEach(habit => {
        const li = document.createElement('li');
        li.className = 'habit-item organic-shape';

        const infoDiv = document.createElement('div');
        infoDiv.className = 'habit-info';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'habit-checkbox';
        checkbox.checked = habit.completed;
        checkbox.addEventListener('change', (e) => {
            toggleHabitStatus(habit.id, checkbox.checked);
            if (checkbox.checked) {
                const growthMsgs = [
                    "Your garden is blooming! 🌺",
                    "A new leaf has sprouted! 🌿",
                    "Roots getting stronger! 🌱",
                    "Beautiful growth! 🌳",
                    "Sprouting with energy! ✨"
                ];
                const msg = growthMsgs[Math.floor(Math.random() * growthMsgs.length)];
                showMessage(msg, "success");
                checkbox.classList.add('pop-anim');
                setTimeout(() => checkbox.classList.remove('pop-anim'), 400);
            }
        });


        const span = document.createElement('span');
        span.className = `habit-text ${habit.completed ? 'completed' : ''}`;
        span.textContent = habit.text;

        infoDiv.appendChild(checkbox);
        infoDiv.appendChild(span);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-delete';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.title = "Delete Habit";
        deleteBtn.addEventListener('click', () => deleteHabit(habit.id));

        li.appendChild(infoDiv);
        li.appendChild(deleteBtn);

        list.appendChild(li);
    });
}

function addHabit() {
    const input = document.getElementById('newHabitInput');
    const text = input.value.trim();
    if (!text) return;

    const data = getData();
    const newId = data.habits.length > 0 ? Math.max(...data.habits.map(h => h.id)) + 1 : 1;
    
    data.habits.push({ id: newId, text: text, completed: false });
    saveData(data);
    
    input.value = '';
    renderHabits();
    showMessage("Habit added successfully!", "success");
}

function toggleHabitStatus(id, isCompleted) {
    const data = getData();
    const habit = data.habits.find(h => h.id === id);
    if (habit) {
        habit.completed = isCompleted;
        if(isCompleted) data.points += 5;
        saveData(data);
        renderHabits();
    }
}

function deleteHabit(id) {
    const data = getData();
    data.habits = data.habits.filter(h => h.id !== id);
    saveData(data);
    renderHabits();
    showMessage("Habit deleted.", "error");
}

function showMessage(msg, type) {
    const msgElement = document.getElementById('habitMessage');
    msgElement.textContent = msg;
    msgElement.className = (type === 'success') ? "pop-anim" : "";
    setTimeout(() => {
        msgElement.textContent = "";
    }, 3000);
}
