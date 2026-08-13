// ========================================
// ИГРА "ЗАБЕЙ 3 ГОЛА"
// ========================================

const game = {
    goals: 0,
    attempts: 0,
    maxAttempts: 5,
    maxGoals: 3,
    isPlaying: false,
    isGameOver: false
};

const goalZones = ['left', 'center', 'right'];

// DOM-элементы
const keeper = document.getElementById('keeper');
const keeperImg = keeper ? keeper.querySelector('img') : null;
const ball = document.getElementById('ball');
const passer = document.getElementById('passer');
const passerImg = passer ? passer.querySelector('img') : null;
const goalsDisplay = document.getElementById('goalD');
const attemptsDisplay = document.getElementById('Poputka');
const overlay = document.getElementById('gameOverlay');
const gameField = document.getElementById('gameField');

// ========================================
// ДВИЖЕНИЕ ТОЛМАСОВОЙ
// ========================================

let currentPasserX = 50;

function updatePasserPosition(e) {
    if (!gameField || !passer) return;
    
    const rect = gameField.getBoundingClientRect();
    const fieldWidth = rect.width;
    
    let x = ((e.clientX - rect.left) / fieldWidth) * 100;
    x = Math.max(15, Math.min(85, x));
    currentPasserX = x;
    
    passer.style.left = (x - 19) + '%';
    passer.style.bottom = '5%';
    
    updateBallPosition();
}

function updateBallPosition() {
    if (!ball || !passer) return;
    ball.style.left = (currentPasserX + 5) + '%';
    ball.style.bottom = '1%';
    ball.style.transform = 'translateX(-50%)';
    ball.style.width = '14%';
    ball.style.height = '14%';
    ball.style.opacity = '1';
}

if (gameField) {
    gameField.addEventListener('mousemove', function(e) {
        updatePasserPosition(e);
    });
}

// ========================================
// ВРАТАРЬ — НЕ ПОВТОРЯЕТ СТОРОНЫ
// ========================================

let lastKeeperDir = null;

function getRandomKeeperDir() {
    const available = goalZones.filter(dir => dir !== lastKeeperDir);
    const randomDir = available[Math.floor(Math.random() * available.length)];
    lastKeeperDir = randomDir;
    return randomDir;
}

// ========================================
// СМЕНА КАРТИНОК
// ========================================

function setPasserImage(action) {
    if (!passerImg) return;
    const basePath = '../game/';
    passerImg.src = action === 'kick' 
        ? basePath + 'Tomafoot_kick.png' 
        : basePath + 'Tomafoot.png';
}

function setKeeperImage(action) {
    if (!keeperImg) return;
    const basePath = '../game/';
    keeperImg.src = action === 'catch' 
        ? basePath + 'vratar_catch.png' 
        : basePath + 'vratar.png';
}

// ===== СТАРТ ИГРЫ =====
function startGame() {
    game.goals = 0;
    game.attempts = 0;
    game.isPlaying = true;
    game.isGameOver = false;
    lastKeeperDir = null;
    
    if (overlay) {
        overlay.classList.remove('show', 'win', 'lose');
        overlay.style.display = 'none';
    }
    
    setPasserImage('idle');
    setKeeperImage('idle');
    resetPositions();
    updateUI();
}

// ===== СБРОС ПОЗИЦИЙ =====
function resetPositions() {
    if (keeper) {
        keeper.className = 'keeper center';
        setKeeperImage('idle');
    }
    if (passer) {
        passer.className = 'passer';
        passer.style.bottom = '5%';
        setPasserImage('idle');
    }
    if (ball) {
        ball.className = 'ball';
        ball.style.opacity = '1';
        ball.style.transform = 'translateX(-50%)';
        ball.style.width = '14%';
        ball.style.height = '14%';
        ball.style.transition = 'all 0.3s ease';
        updateBallPosition();
    }
}

// ===== УДАР =====
function shoot(direction) {
    if (!game.isPlaying || game.isGameOver) return;
    
    game.attempts++;
    
    // ===== 60% ШАНС НА ГОЛ =====
    const randomChance = Math.random();
    const isGoal = randomChance < 0.50; // 60% гол, 40% сейв
    
    // Вратарь двигается для анимации
    let keeperDir;
    if (isGoal) {
        // Если гол — вратарь в другую сторону
        const opposite = { left: 'right', center: 'left', right: 'left' };
        keeperDir = opposite[direction] || 'center';
    } else {
        // Если сейв — вратарь в сторону удара
        keeperDir = direction;
    }
    
    animateShot(direction, keeperDir, isGoal);
    
    if (isGoal) {
        game.goals++;
    }
    
    updateUI();
    
    if (game.goals >= game.maxGoals) {
        game.isGameOver = true;
        setTimeout(() => showResult('win'), 700);
    } else if (game.attempts >= game.maxAttempts) {
        game.isGameOver = true;
        setTimeout(() => showResult('lose'), 700);
    }
}

// ===== АНИМАЦИЯ УДАРА =====
function animateShot(direction, keeperDir, isGoal) {
    // Пасующий бьёт
    if (passer) {
        passer.className = 'passer kick';
        setPasserImage('kick');
        setTimeout(() => {
            passer.className = 'passer';
            setPasserImage('idle');
        }, 300);
    }
    
    // Мяч летит
    if (ball) {
        ball.className = 'ball';
        ball.style.opacity = '1';
        ball.style.width = '14%';
        ball.style.height = '14%';
        setTimeout(() => {
            ball.className = `ball shoot-${direction}`;
        }, 100);
    }
    
    // Вратарь двигается
    if (keeper) {
        keeper.className = `keeper ${keeperDir}`;
    }
    
    // Если гол — мяч в воротах
    if (isGoal) {
        setTimeout(() => {
            if (ball) {
                ball.className = 'ball';
                ball.style.transform = `translate(${getGoalPosition(direction)}, -180%) scale(0.4)`;
                ball.style.opacity = '0.9';
                ball.style.width = '12%';
                ball.style.height = '12%';
            }
        }, 400);
    } else {
        // Вратарь ловит мяч
        setTimeout(() => {
            if (keeper) setKeeperImage('catch');
            if (ball) {
                ball.className = 'ball';
                ball.style.transform = `translate(${getKeeperCatchPosition(keeperDir)}, -120%) scale(0.25)`;
                ball.style.opacity = '0.8';
                ball.style.width = '8%';
                ball.style.height = '8%';
            }
        }, 350);
        
        setTimeout(() => {
            if (ball) {
                ball.style.transition = 'all 0.4s ease';

                let returnX = '-50%'; // стандартный возврат (по центру)
            if (direction === 'right') {
                returnX = '-80%'; // ← смещаем влево при возврате
                }
                
                ball.style.transform = `translate(${returnX}, -10%) scale(0.9)`;
                ball.style.opacity = '0.5';
                ball.style.width = '14%';
                ball.style.height = '14%';
            }
            if (keeper) setKeeperImage('idle');
        }, 650);
        
        setTimeout(() => {
            if (ball) {
                ball.style.transition = 'all 0.3s ease';
                ball.style.opacity = '1';
                updateBallPosition();
            }
        }, 950);
    }
    
    setTimeout(() => {
        if (isGoal) {
            resetPositions();
            if (ball) {
                ball.style.transform = '';
                ball.style.opacity = '1';
            }
        }
    }, 800);
}

// ===== ПОЗИЦИЯ ГОЛА =====
function getGoalPosition(direction) {
    switch(direction) {
        case 'left': return '-100%';
        case 'right': return '50%';
        default: return '-25%';
    }
}

function getKeeperCatchPosition(direction) {
    switch(direction) {
        case 'left': return '-70%';
        case 'right': return '70%';
        default: return '0%';
    }
}

// ===== ОБНОВЛЕНИЕ UI =====
function updateUI() {
    if (!goalsDisplay || !attemptsDisplay) return;
    const filled = '●'.repeat(game.goals);
    const empty = '○'.repeat(game.maxGoals - game.goals);
    goalsDisplay.textContent = filled + empty;
    attemptsDisplay.textContent = `${game.attempts}/${game.maxAttempts}`;
}

// ===== РЕЗУЛЬТАТ =====
function showResult(type) {
    if (!overlay) return;
    
    overlay.style.display = 'flex';
    overlay.className = `game-overlay show ${type}`;
    
    const icon = document.getElementById('overlayIcon');
    const title = document.getElementById('overlayTitle');
    const text = document.getElementById('overlayText');
    const stats = document.getElementById('overlayStatus');
    
    if (stats) {
        stats.textContent = `Голов: ${game.goals} | Попыток: ${game.attempts}`;
    }
    
    if (type === 'win') {
        if (icon) icon.textContent = '🏆';
        if (title) title.textContent = 'ТОЛМАСОВА ПОБЕДИЛА!';
        if (text) text.textContent = 'Как всегда, всех победила! 🔥';
    } else {
        if (icon) icon.textContent = '💪';
        if (title) title.textContent = 'НЕ СДАВАЙСЯ!';
        if (text) text.textContent = 'Толмасова, ты сильнее! Попробуй ещё раз!';
    }
}

// ===== ЗАПУСК =====
window.addEventListener('DOMContentLoaded', startGame);
