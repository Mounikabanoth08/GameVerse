// Global Variables - ఇవి పేజీ రీలోడ్ అయ్యే వరకు స్కోర్ ని సేవ్ చేస్తాయి
let currentScore = 0; 
let liveTime = 0; 
let timerInterval;
let activeMode = "Single";
let currentGame = "";

// --- 1. 10 DIFFERENT GAMES DATA ---
const questionBank = {
    "BugHunter": [
        {q: "CSS ID symbol?", a: "#", h: "Hashtag..."},
        {q: "Python file extension?", a: ".py", h: "Starts with 'p' and 'y'..."},
        {q: "Semicolon symbol?", a: ";", h: "Dot over a comma..."},
        {q: "Largest heading?", a: "h1", h: "Letter H and number 1..."},
        {q: "JS Constant?", a: "const", h: "Short for constant..."}
    ],
    "SQLQuest": [
        {q: "Command to fetch data?", a: "select", h: "You 'choose' what to see..."},
        {q: "Symbol for all columns?", a: "*", h: "A little star..."},
        {q: "To add new data?", a: "insert", h: "Opposite of Extract..."},
        {q: "To remove a table?", a: "drop", h: "Like letting something fall..."},
        {q: "Full form of SQL?", a: "structured query language", h: "S.Q.L..."}
    ],
    "MathNinja": [
        {q: "15 * 4 = ?", a: "60", h: "Minutes in an hour..."},
        {q: "Square root of 81?", a: "9", h: "Single digit..."},
        {q: "Half of 250?", a: "125", h: "One two five..."},
        {q: "99 + 11 = ?", a: "110", h: "Ten more than 100..."},
        {q: "100 / 4 = ?", a: "25", h: "A quarter..."}
    ],
    "RiddleMe": [
        {q: "What has keys but no locks?", a: "keyboard", h: "You type on it..."},
        {q: "What has a neck but no head?", a: "bottle", h: "Used for water..."},
        {q: "What gets wetter as it dries?", a: "towel", h: "Used after bath..."},
        {q: "Face but no eyes?", a: "clock", h: "Tells time..."},
        {q: "Has a thumb but no fingers?", a: "glove", h: "Worn on hands..."}
    ],
    "LogicGate": [
        {q: "AND(1,1) is?", a: "1", h: "Both are true..."},
        {q: "OR(1,0) is?", a: "1", h: "One is true..."},
        {q: "NOT(0) is?", a: "1", h: "Opposite..."},
        {q: "Binary of 3?", a: "11", h: "Two ones..."},
        {q: "Base of Decimal?", a: "10", h: "Ten digits..."}
    ],
    "HexDash": [
        {q: "Hex for 10?", a: "a", h: "First letter..."},
        {q: "Hex for 15?", a: "f", h: "Last hex letter..."},
        {q: "Color #000000?", a: "black", h: "Darkness..."},
        {q: "Hex for 11?", a: "b", h: "Second letter..."},
        {q: "Hex for 12?", a: "c", h: "Third letter..."}
    ],
    "EmojiSpy": [
        {q: "🦁👑", a: "lion king", h: "Disney movie..."},
        {q: "🦇👨", a: "batman", h: "Hero of Gotham..."},
        {q: "🕷️👨", a: "spiderman", h: "Web slinger..."},
        {q: "🚢🧊", a: "titanic", h: "Ship vs Ice..."},
        {q: "🍎💻", a: "apple", h: "Fruit brand..."}
    ],
    "CodeMaster": [
        {q: "Web language?", a: "html", h: "Skeleton of web..."},
        {q: "Styling language?", a: "css", h: "Making things look good..."},
        {q: "Is JS compiled?", a: "no", h: "It's interpreted..."},
        {q: "Array index starts at?", a: "0", h: "First digit..."},
        {q: "Python creator?", a: "guido van rossum", h: "G.V.R..."}
    ],
    "MindMaze": [
        {q: "2, 4, 6, 8, ?", a: "10", h: "Even numbers..."},
        {q: "1, 3, 5, 7, ?", a: "9", h: "Odd numbers..."},
        {q: "First Vowel?", a: "a", h: "Start of alphabet..."},
        {q: "Colors in rainbow?", a: "7", h: "VIBGYOR..."},
        {q: "Sides in Hexagon?", a: "6", h: "Hex means..."}
    ],
    "BrainTest": [
        {q: "Planet Earth?", a: "earth", h: "We live here..."},
        {q: "Capital of AP?", a: "amaravati", h: "Current hub..."},
        {q: "30 days in June?", a: "yes", h: "True or False..."},
        {q: "Sky color?", a: "blue", h: "Not red..."},
        {q: "Human eyes count?", a: "2", h: "A pair..."}
    ]
};

// --- 2. CORE LOGIC ---

function initArena() {
    const params = new URLSearchParams(window.location.search);
    currentGame = params.get('game') || "BugHunter";
    document.getElementById('active-game-title').innerText = currentGame;
    document.getElementById('current-score').innerText = currentScore;
}

function startLiveTimer() {
    clearInterval(timerInterval);
    liveTime = 0;
    const timerDisplay = document.getElementById('timer-val');
    timerInterval = setInterval(() => {
        liveTime++;
        if(timerDisplay) timerDisplay.innerText = liveTime;
    }, 1000);
}

function setMode(mode, event) {
    activeMode = mode;
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active-mode'));
    if(event) event.target.classList.add('active-mode');
}

function showLevels(count, diff) {
    document.getElementById('selection-screen').classList.add('hidden');
    document.getElementById('map-screen').classList.remove('hidden');
    
    const grid = document.getElementById('map-grid');
    grid.innerHTML = "";
    for(let i=1; i<=count; i++) {
        const btn = document.createElement('div');
        btn.className = "lvl-btn clickable";
        btn.style.cssText = "width:55px; height:55px; border:2px solid #38bdf8; display:flex; align-items:center; justify-content:center; cursor:pointer; font-weight:bold; color:white; border-radius:12px; background:rgba(56,189,248,0.1);";
        btn.innerText = i;
        btn.onclick = () => startPlay(i);
        grid.appendChild(btn);
    }
}

function startPlay(lvl) {
    document.getElementById('map-screen').classList.add('hidden');
    document.getElementById('play-screen').classList.remove('hidden');
    document.getElementById('lvl-txt').innerText = `Level ${lvl}`;
    
    startLiveTimer();

    // Mode based count
    let qCount = (lvl === 1) ? 3 : (3 + lvl);
    if(activeMode === "2 Players") qCount += 2;
    if(activeMode === "Group") qCount += 5;

    const area = document.getElementById('quest-area');
    area.style.maxHeight = "380px"; 
    area.style.overflowY = "auto";
    area.innerHTML = "";

    // Get current game questions and shuffle
    let pool = [...(questionBank[currentGame] || questionBank["BugHunter"])];
    pool.sort(() => Math.random() - 0.5); 

    for(let i=0; i < qCount && i < pool.length; i++) {
        let qObj = pool[i];
        area.innerHTML += `
            <div class="q-row" style="margin-bottom:15px; padding:15px; border-bottom:1px solid #444; text-align:left; background:rgba(255,255,255,0.02); border-radius:8px;">
                <p>Q${i+1}: ${qObj.q} <span style="cursor:pointer; color:#fbbf24; font-size:14px; margin-left:10px;" onclick="alert('Indirect Hint: ${qObj.h}')">💡 Hint</span></p>
                <input type="text" class="ans-field" data-correct="${qObj.a}" placeholder="Type here..." style="width:95%; padding:10px; background:#020617; border:1px solid #333; color:white; border-radius:5px;">
            </div>
        `;
    }
}

// --- 3. SCORING SYSTEM (Level 1 to 10 continuity) ---
function validateLevel() {
    clearInterval(timerInterval);
    const inputs = document.querySelectorAll('.ans-field');
    let pointsThisRound = 0;

    inputs.forEach(input => {
        let userVal = input.value.trim().toLowerCase();
        let correctVal = input.getAttribute('data-correct').toLowerCase();

        if(userVal === correctVal && userVal !== "") {
            pointsThisRound += 20; 
            input.style.border = "2px solid #10b981";
        } else if (userVal !== "") {
            input.style.border = "2px solid #ef4444";
        }
    });

    // Score update (Cumulative)
    currentScore += pointsThisRound;
    document.getElementById('current-score').innerText = currentScore;
    
    alert(`Success! \nPoints this level: ${pointsThisRound} \nTotal Arena Score: ${currentScore}`);
    
   
    backToMap();
}

function backToMap() {
    document.getElementById('play-screen').classList.add('hidden');
    document.getElementById('map-screen').classList.remove('hidden');
}
// --- 4. LOGIN & DATABASE INTEGRATION ---


async function loginUser(event) {
    if(event) event.preventDefault();

    const email = document.getElementById('email').value; 
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (result.success) {
         
            localStorage.setItem('userEmail', result.user.email);
            localStorage.setItem('userName', result.user.name);
            
            alert(`Welcome, ${result.user.name}! Let's play!`);
            window.location.href = '/dashboard';
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        console.error("Login Error:", error);
        alert("Server కి కనెక్ట్ అవ్వలేకపోతున్నాను. Server.js రన్ అవుతుందో లేదో చూడు బ్రో!");
    }
}

async function syncScoreToDB(score, timeTaken) {
    const userEmail = localStorage.getItem('userEmail');
    
    if (!userEmail) return; 

    try {
        await fetch('/update-score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: userEmail,
                game: currentGame,
                score: score,
                time: timeTaken
            })
        });
        console.log("Score synced to College_portal_info.db");
    } catch (err) {
        console.error("Score sync error:", err);
    }
}


// syncScoreToDB(pointsThisRound, liveTime);

function goBack() {
    if(!document.getElementById('play-screen').classList.contains('hidden')) {
        backToMap();
    } else if(!document.getElementById('map-screen').classList.contains('hidden')) {
        document.getElementById('map-screen').classList.add('hidden');
        document.getElementById('selection-screen').classList.remove('hidden');
    } else {
        window.location.href = '/dashboard';
    }
}