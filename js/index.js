document.addEventListener('DOMContentLoaded', () => {
    // Check if user has already onboarded
    const data = getData();
    if (data && data.name !== 'Guest' && data.name !== '' && data.email !== '') {
        // Redirection logic can be enabled for production
        // window.location.href = 'home.html';
    }

    const step1 = document.getElementById('step1');
    const signInForm = document.getElementById('signInForm');
    const step2 = document.getElementById('step2');
    
    const guestBtn = document.getElementById('guestBtn');
    const signInBtn = document.getElementById('signInBtn');
    const authContinueBtn = document.getElementById('authContinueBtn');
    const backToIdentity = document.getElementById('backToIdentity');
    const finishBtn = document.getElementById('finishBtn');
    
    const goalSelect = document.getElementById('goalSelect');
    const regName = document.getElementById('regName');
    const regEmail = document.getElementById('regEmail');
    const regPass = document.getElementById('regPass');

    let userType = 'Guest';

    guestBtn.addEventListener('click', () => {
        userType = 'Guest';
        proceedToStep2();
    });

    signInBtn.addEventListener('click', () => {
        userType = 'Member';
        step1.classList.add('hidden');
        signInForm.classList.remove('hidden');
        signInForm.classList.add('fade-in');
    });

    backToIdentity.addEventListener('click', () => {
        signInForm.classList.add('hidden');
        step1.classList.remove('hidden');
        step1.classList.add('fade-in');
    });

    authContinueBtn.addEventListener('click', () => {
        if (!regName.value || !regEmail.value || !regPass.value) {
            alert('Please complete all registry fields.');
            return;
        }
        proceedToStep2();
    });

    function proceedToStep2() {
        step1.classList.add('hidden');
        signInForm.classList.add('hidden');
        step2.classList.remove('hidden');
        step2.classList.add('fade-in');
    }

    finishBtn.addEventListener('click', () => {
        const goal = goalSelect.value;
        const data = getData();

        if (userType === 'Member') {
            data.name = regName.value;
            data.email = regEmail.value;
            data.password = regPass.value; // In a real app, this would be hashed
        } else {
            data.name = 'Guest';
            data.email = 'N/A';
        }
        
        data.goal = goal;
        saveData(data);

        // Success animation and redirect
        if (typeof triggerConfetti === 'function') triggerConfetti();
        finishBtn.innerHTML = 'Verifying Credentials...';
        finishBtn.disabled = true;

        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1500);
    });
});
