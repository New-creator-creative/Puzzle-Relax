"use strict";

/* =========================================
   PUZZLE MASTER 3D
   TO‘LIQ JAVASCRIPT
========================================= */


/* =========================================
   EKRANLAR
========================================= */

const home = document.getElementById("home");
const ageScreen = document.getElementById("ageScreen");
const gameScreen = document.getElementById("gameScreen");
const levelsScreen = document.getElementById("levelsScreen");
const winScreen = document.getElementById("winScreen");
const loseScreen = document.getElementById("loseScreen");


function showScreen(screen) {
    document.querySelectorAll(".screen").forEach(function(s) {
        s.classList.remove("active");
    });

    screen.classList.add("active");
}


/* =========================================
   TUGMALAR
========================================= */

const playBtn = document.getElementById("playBtn");
const levelsBtn = document.getElementById("levelsBtn");

const ageBackBtn = document.getElementById("ageBackBtn");
const gameBackBtn = document.getElementById("gameBackBtn");
const levelsBackBtn = document.getElementById("levelsBackBtn");

const shuffleBtn = document.getElementById("shuffleBtn");

const nextBtn = document.getElementById("nextBtn");
const winMenuBtn = document.getElementById("winMenuBtn");

const retryBtn = document.getElementById("retryBtn");
const loseMenuBtn = document.getElementById("loseMenuBtn");

const imageInput = document.getElementById("imageInput");


/* =========================================
   O‘YIN O‘ZGARUVCHILARI
========================================= */

let selectedLevel = null;

let currentStage = 1;

let score = 0;

let time = 60;

let lives = 3;

let timer = null;

let selectedPiece = null;


/* =========================================
   STANDART RASM
   INTERNET KERAK EMAS
========================================= */

const defaultSVG = `
<svg xmlns="http://www.w3.org/2000/svg"
width="800"
height="800"
viewBox="0 0 800 800">

<defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#5b7cff"/>
        <stop offset="50%" stop-color="#9b5cff"/>
        <stop offset="100%" stop-color="#32d583"/>
    </linearGradient>
</defs>

<rect width="800" height="800" fill="url(#g)"/>

<circle cx="150" cy="150" r="90"
fill="rgba(255,255,255,.20)"/>

<circle cx="650" cy="180" r="110"
fill="rgba(255,255,255,.15)"/>

<circle cx="180" cy="650" r="120"
fill="rgba(255,255,255,.13)"/>

<circle cx="650" cy="650" r="100"
fill="rgba(255,255,255,.18)"/>

<text
x="400"
y="350"
text-anchor="middle"
font-size="120"
font-family="Arial">
🧩
</text>

<text
x="400"
y="480"
text-anchor="middle"
font-size="70"
font-family="Arial"
font-weight="bold"
fill="white">
PUZZLE
</text>

<text
x="400"
y="560"
text-anchor="middle"
font-size="70"
font-family="Arial"
font-weight="bold"
fill="white">
MASTER
</text>

</svg>
`;

let selectedImage =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(defaultSVG);


/* =========================================
   DARAJALAR
========================================= */

const levels = {

    age4: {
        name: "4 yosh",
        difficulty: "Juda oson",
        size: 2,
        time: 90
    },

    age5: {
        name: "5 yosh",
        difficulty: "Oson",
        size: 2,
        time: 80
    },

    age6: {
        name: "6 yosh",
        difficulty: "Oson+",
        size: 3,
        time: 75
    },

    age7: {
        name: "7 yosh",
        difficulty: "O‘rta",
        size: 3,
        time: 70
    },

    grade1: {
        name: "1-sinf",
        difficulty: "Boshlang‘ich",
        size: 3,
        time: 65
    },

    grade2: {
        name: "2-sinf",
        difficulty: "Boshlang‘ich+",
        size: 3,
        time: 60
    },

    grade3: {
        name: "3-sinf",
        difficulty: "O‘rta",
        size: 4,
        time: 60
    },

    grade4: {
        name: "4-sinf",
        difficulty: "O‘rta+",
        size: 4,
        time: 55
    },

    grade5: {
        name: "5-sinf",
        difficulty: "Qiyin",
        size: 4,
        time: 50
    },

    grade6: {
        name: "6-sinf",
        difficulty: "Qiyin+",
        size: 5,
        time: 50
    },

    grade7: {
        name: "7-sinf",
        difficulty: "PRO",
        size: 5,
        time: 45
    },

    grade8: {
        name: "8-sinf",
        difficulty: "MASTER",
        size: 6,
        time: 40
    }
};


/* =========================================
   MENU
========================================= */

playBtn.addEventListener("click", function() {

    showScreen(ageScreen);

});


levelsBtn.addEventListener("click", function() {

    createLevelList();

    showScreen(levelsScreen);

});


ageBackBtn.addEventListener("click", function() {

    showScreen(home);

});


levelsBackBtn.addEventListener("click", function() {

    showScreen(home);

});


gameBackBtn.addEventListener("click", function() {

    stopTimer();

    showScreen(home);

});


/* =========================================
   YOSH / SINF TANLASH
========================================= */

document.querySelectorAll(".age-card").forEach(function(card) {

    card.addEventListener("click", function() {

        const type = card.dataset.type;

        const value = card.dataset.value;

        let key = "";

        if (type === "age") {

            key = "age" + value;

        } else {

            key = "grade" + value;

        }

        if (!levels[key]) {
            return;
        }

        selectedLevel = levels[key];

        currentStage = 1;

        startGame();

    });

});


/* =========================================
   O‘YINNI BOSHLASH
========================================= */

function startGame() {

    stopTimer();

    score = 0;

    lives = 3;

    time = selectedLevel.time;

    selectedPiece = null;

    updateStats();

    document.getElementById("playerLevel").textContent =
        selectedLevel.name;

    document.getElementById("difficulty").textContent =
        selectedLevel.difficulty;

    document.getElementById("gameTitle").textContent =
        "🧩 " + currentStage + "-bosqich";

    document.getElementById("gameMessage").textContent =
        "Bo‘laklarni joyiga qo‘ying!";

    showScreen(gameScreen);

    createPuzzle();

    startTimer();
}


/* =========================================
   STATISTIKANI YANGILASH
========================================= */

function updateStats() {

    document.getElementById("score").textContent = score;

    document.getElementById("time").textContent = time;

    document.getElementById("lives").textContent = lives;

}


/* =========================================
   PUZZLE YARATISH
========================================= */

function createPuzzle() {

    const puzzle = document.getElementById("puzzle");

    puzzle.innerHTML = "";

    selectedPiece = null;

    const size = selectedLevel.size;

    const total = size * size;

    let pieces = [];

    for (let i = 0; i < total; i++) {

        pieces.push(i);

    }


    /* Aralashtirish */

    do {

        shuffleArray(pieces);

    } while (isSolved(pieces));


    puzzle.style.gridTemplateColumns =
        "repeat(" + size + ", 1fr)";


    pieces.forEach(function(position) {

        const piece = document.createElement("div");

        piece.className = "piece";

        piece.dataset.position = position;


        const row = Math.floor(position / size);

        const col = position % size;


        const percent =
            size === 1
                ? 0
                : 100 / (size - 1);


        piece.style.backgroundImage =
            'url("' + selectedImage + '")';


        piece.style.backgroundSize =
            size * 100 + "% " + size * 100 + "%";


        piece.style.backgroundPosition =
            col * percent + "% " +
            row * percent + "%";


        piece.addEventListener("click", function() {

            selectPiece(piece);

        });


        puzzle.appendChild(piece);

    });

}


/* =========================================
   SOLVED TEKSHIRISH
========================================= */

function isSolved(array) {

    for (let i = 0; i < array.length; i++) {

        if (array[i] !== i) {

            return false;

        }

    }

    return true;

}


/* =========================================
   BO‘LAK TANLASH
========================================= */

function selectPiece(piece) {

    if (selectedPiece === null) {

        selectedPiece = piece;

        piece.classList.add("selected");

        return;

    }


    if (selectedPiece === piece) {

        piece.classList.remove("selected");

        selectedPiece = null;

        return;

    }


    swapPieces(selectedPiece, piece);


    selectedPiece.classList.remove("selected");

    selectedPiece = null;


    checkPuzzle();

}


/* =========================================
   BO‘LAKLARNI TO‘G‘RI ALMASHTIRISH
========================================= */

function swapPieces(a, b) {

    const parent =
        document.getElementById("puzzle");


    const aNext = a.nextSibling;

    const bNext = b.nextSibling;


    if (aNext === b) {

        parent.insertBefore(b, a);

        return;

    }


    if (bNext === a) {

        parent.insertBefore(a, b);

        return;

    }


    parent.insertBefore(a, bNext);

    parent.insertBefore(b, aNext);

}


/* =========================================
   PUZZLE TEKSHIRISH
========================================= */

function checkPuzzle() {

    const puzzle =
        document.getElementById("puzzle");


    const pieces =
        Array.from(puzzle.children);


    let correct = true;


    pieces.forEach(function(piece, index) {

        if (
            Number(piece.dataset.position)
            !== index
        ) {

            correct = false;

        }

    });


    if (correct) {

        puzzleComplete();

    }

}


/* =========================================
   PUZZLE TUGADI
========================================= */

function puzzleComplete() {

    stopTimer();


    const bonus = time * 2;

    const stageBonus =
        currentStage * 50;


    score +=
        100 +
        bonus +
        stageBonus;


    document.getElementById("finalScore").textContent =
        score;


    document.getElementById("score").textContent =
        score;


    saveRecord();


    showScreen(winScreen);

}


/* =========================================
   KEYINGI BOSQICH
========================================= */

nextBtn.addEventListener("click", function() {

    currentStage++;


    if (currentStage > 10) {

        currentStage = 1;

    }


    startStage();

});


function startStage() {

    stopTimer();

    lives = 3;


    time = Math.max(
        20,
        selectedLevel.time -
        ((currentStage - 1) * 2)
    );


    updateStats();


    document.getElementById("gameTitle").textContent =
        "🧩 " + currentStage + "-bosqich";


    document.getElementById("gameMessage").textContent =
        "Yangi puzzle! 🔥";


    showScreen(gameScreen);


    createPuzzle();

    startTimer();

}


/* =========================================
   TIMER
========================================= */

function startTimer() {

    stopTimer();


    timer = setInterval(function() {

        time--;

        updateStats();


        if (time <= 0) {

            time = 0;

            updateStats();

            stopTimer();

            showScreen(loseScreen);

        }

    }, 1000);

}


function stopTimer() {

    if (timer !== null) {

        clearInterval(timer);

        timer = null;

    }

}


/* =========================================
   RASM TANLASH
========================================= */

imageInput.addEventListener("change", function() {

    const file = this.files[0];


    if (!file) {

        return;

    }


    if (!file.type.startsWith("image/")) {

        alert("Iltimos, rasm tanlang!");

        return;

    }


    const reader = new FileReader();


    reader.onload = function(event) {

        const image = new Image();


        image.onload = function() {

            /*
             Rasmni kichraytirib,
             telefon xotirasini tejaymiz.
            */

            const canvas =
                document.createElement("canvas");


            const maxSize = 900;


            let width = image.width;

            let height = image.height;


            if (width > height) {

                if (width > maxSize) {

                    height =
                        height *
                        maxSize /
                        width;

                    width = maxSize;

                }

            } else {

                if (height > maxSize) {

                    width =
                        width *
                        maxSize /
                        height;

                    height = maxSize;

                }

            }


            canvas.width =
                Math.round(width);


            canvas.height =
                Math.round(height);


            const ctx =
                canvas.getContext("2d");


            ctx.drawImage(
                image,
                0,
                0,
                canvas.width,
                canvas.height
            );


            selectedImage =
                canvas.toDataURL(
                    "image/jpeg",
                    0.85
                );


            document.getElementById(
                "gameMessage"
            ).textContent =
                "📷 Rasm yuklandi! Puzzle'ni yig‘ing!";


            createPuzzle();

        };


        image.src = event.target.result;

    };


    reader.readAsDataURL(file);

});


/* =========================================
   ARALASHTIRISH
========================================= */

shuffleBtn.addEventListener("click", function() {

    createPuzzle();


    document.getElementById(
        "gameMessage"
    ).textContent =
        "🔀 Aralashtirildi!";

});


/* =========================================
   QAYTA URINISH
========================================= */

retryBtn.addEventListener("click", function() {

    currentStage = 1;

    startGame();

});


/* =========================================
   MENU
========================================= */

winMenuBtn.addEventListener("click", function() {

    stopTimer();

    showScreen(home);

});


loseMenuBtn.addEventListener("click", function() {

    stopTimer();

    showScreen(home);

});


/* =========================================
   DARAJALAR RO‘YXATI
========================================= */

function createLevelList() {

    const box =
        document.getElementById("levelsList");


    box.innerHTML = "";


    const list = [

        ["age4", "👶 4 yosh"],

        ["age5", "🧒 5 yosh"],

        ["age6", "🧒 6 yosh"],

        ["age7", "🎒 7 yosh"],

        ["grade1", "📗 1-sinf"],

        ["grade2", "📘 2-sinf"],

        ["grade3", "📙 3-sinf"],

        ["grade4", "📕 4-sinf"],

        ["grade5", "🎓 5-sinf"],

        ["grade6", "🎓 6-sinf"],

        ["grade7", "🧠 7-sinf"],

        ["grade8", "👑 8-sinf"]

    ];


    list.forEach(function(item) {

        const button =
            document.createElement("button");


        button.className = "level-btn";


        button.textContent = item[1];


        button.addEventListener(
            "click",
            function() {

                selectedLevel =
                    levels[item[0]];


                currentStage = 1;


                startGame();

            }
        );


        box.appendChild(button);

    });

}


/* =========================================
   ARRAY ARALASHTIRISH
========================================= */

function shuffleArray(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );


        const temp = array[i];

        array[i] = array[j];

        array[j] = temp;

    }


    return array;

}


/* =========================================
   REKORD SAQLASH
========================================= */

function saveRecord() {

    if (!selectedLevel) {

        return;

    }


    const key =
        "puzzle_record_" +
        selectedLevel.name;


    const oldRecord =
        Number(
            localStorage.getItem(key)
        ) || 0;


    if (score > oldRecord) {

        localStorage.setItem(
            key,
            score
        );

    }

}


/* =========================================
   BOSHLANG‘ICH EKRAN
========================================= */

showScreen(home);