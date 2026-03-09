let playerName;
let selectedCategory;
let questions = [];
let currentQuestion = 0;
let score = 0;
let level = 1;
let timer;
let timeLeft = 30;
  
const allQuestions = {
    "general": [
        {
            "pregunta": "¿Cuál es el planeta más cercano al Sol?",
            "opciones": ["Venus", "Mercurio", "Marte", "Júpiter"],
            "respuesta": "Mercurio"
        }
    ],
    "ciencia": [
        {
            "pregunta": "¿Cuál es la fórmula química del agua?",
            "opciones": ["H2O", "CO2", "O2", "NaCl"],
            "respuesta": "H2O"
        }
    ],
    "historia": [
        {
            "pregunta": "¿Quién fue el primer presidente de México?",
            "opciones": ["Benito Juárez", "Guadalupe Victoria", "Porfirio Díaz"],
            "respuesta": "Guadalupe Victoria"
        }
    ],
    "tecnologia": [
        {
            "pregunta": "¿Qué significa HTML?",
            "opciones": ["HyperText Markup Language", "High Tech Modern Language"],
            "respuesta": "HyperText Markup Language"
        }
    ]
};


function startGame() {
    playerName = document.getElementById("player-name").value.trim();
    selectedCategory = document.getElementById("category-select").value;
    if (!playerName) {
        alert("Por favor, ingresa tu nombre para comenzar!");
        return;
    }

    questions = allQuestions[selectedCategory];
    if (!questions || questions.length === 0) {
        alert("No hay preguntas disponibles para esta categoría.");
        return;
    }

    currentQuestion = 0;
    score = 0;
    level = 1;
    timeLeft = 30;
    document.getElementById("score").textContent = score;
    document.getElementById("level").textContent = level;
    document.getElementById("timer").textContent = timeLeft;

    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("quiz-screen").classList.remove("hidden");


    startTimer();
    showQuestion();
}


function showQuestion() {
    const currentQ = questions[currentQuestion];
    document.getElementById("question").textContent = currentQ.pregunta;
    
    const optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";
    
    currentQ.opciones.forEach(option => {
        const button = document.createElement("button");
        button.textContent = option;
        button.onclick = () => checkAnswer(option);
        optionsContainer.appendChild(button);
    });
}

function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

function checkAnswer(selectedOption) {
    const currentQ = questions[currentQuestion];
    if (selectedOption === currentQ.respuesta) {
        score += 10;
        document.getElementById("correct-sound").play();
    } else {
        document.getElementById("wrong-sound").play();
    }

    document.getElementById("score").textContent = score;
    currentQuestion++;

   
    if (currentQuestion >= questions.length) {
        if (level < 3) { 
            level++;
            currentQuestion = 0;
            timeLeft = 30;
            document.getElementById("level").textContent = level;
            document.getElementById("timer").textContent = timeLeft;
            showQuestion();
        } else {
            clearInterval(timer);
            endGame();
        }
    } else {
        timeLeft = 30;
        document.getElementById("timer").textContent = timeLeft;
        showQuestion();
    }
}

function endGame() {
    document.getElementById("quiz-screen").classList.add("hidden");
    document.getElementById("end-screen").classList.remove("hidden");
    document.getElementById("final-score").innerText = `${playerName}, tu puntaje es ${score}`;

    let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
    ranking.push({ nombre: playerName, puntos: score });
    ranking.sort((a, b) => b.puntos - a.puntos);
    localStorage.setItem("ranking", JSON.stringify(ranking));

    let rankingList = document.getElementById("ranking-list");
    rankingList.innerHTML = "";
    ranking.slice(0, 5).forEach(r => {
        let li = document.createElement("li");
        li.innerText = `${r.nombre}: ${r.puntos} puntos`;
        rankingList.appendChild(li);
    });
}

function restartGame() {
    document.getElementById("end-screen").classList.add("hidden");
    document.getElementById("start-screen").classList.remove("hidden");
    document.getElementById("player-name").value = ""; 
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
}