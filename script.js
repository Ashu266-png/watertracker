let currentUser = null;

window.onload = function () {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showTracker();
    }
};

function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        document.getElementById('login-result').innerText = 'Please enter a username and password.';
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.find(user => user.username === username)) {
        document.getElementById('login-result').innerText = 'Username already exists. Please log in.';
        return;
    }

    users.push({ username, password, goal: 0, consumed: 0, achievedDays: [] });
    localStorage.setItem('users', JSON.stringify(users));
    document.getElementById('login-result').innerText = 'Registration successful. Please log in.';
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    currentUser = users.find(user => user.username === username && user.password === password);

    if (currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showTracker();
    } else {
        document.getElementById('login-result').innerText = 'Invalid username or password.';
    }
}

function showTracker() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('tracker-container').style.display = 'block';
    loadCalendar();
}

function calculateWater() {
    const goal = parseInt(document.getElementById('goal').value);
    const consumed = parseInt(document.getElementById('consumed').value);

    if (isNaN(goal) || isNaN(consumed)) {
        document.getElementById('result').innerText = 'Please enter valid numbers.';
        return;
    }

    currentUser.goal = goal;
    currentUser.consumed = consumed;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    const remaining = goal - consumed;
    if (remaining > 0) {
        document.getElementById('result').innerText = `You need ${remaining} ml more to reach your goal.`;
    } else {
        document.getElementById('result').innerText = `Great job! You've exceeded your goal by ${-remaining} ml.`;
        markTodayAsAchieved();
    }
}

function loadCalendar() {
    const calendarDiv = document.getElementById('calendar');
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    calendarDiv.innerHTML = '';
    for (let i = 0; i < firstDay; i++) {
        calendarDiv.innerHTML += '<div class="day"></div>';
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(today.getFullYear(), today.getMonth(), i);
        const isAchieved = currentUser.achievedDays.includes(date.toDateString());
        calendarDiv.innerHTML += `<div class="day ${isAchieved ? 'achieved' : ''}">${i}</div>`;
    }
}

function markTodayAsAchieved() {
    const today = new Date();
    if (!currentUser.achievedDays.includes(today.toDateString())) {
        currentUser.achievedDays.push(today.toDateString());
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        loadCalendar();
    }
}
