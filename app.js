function createBalls() {
    const ballImages = [
        '../im15/football.png',
        '../im15/basketball.png',
        '../im15/tennis.png'
    ];
    
    const cols = 5;
    const rows = 8;
    const numberOfBalls = cols * rows;
    
    let index = 0;
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const ball = document.createElement('div');
            ball.className = 'ball';
            
            const randomImage = ballImages[Math.floor(Math.random() * ballImages.length)];
            
            // Размер: от 30px до 60px
            const size = 30 + Math.random() * 30;
            
            // Равномерное распределение по сетке
            const left = (col / cols) * 100 + (100 / cols / 2) + (Math.random() * 6 - 3);
            const startY = -50 - (row / rows) * 200 - Math.random() * 50;
            
            // Скорость: разная для каждого ряда
            const duration = 8 + (row / rows) * 8 + Math.random() * 3;
            
            // Задержка: по порядку
            const delay = (index / numberOfBalls) * 15 + Math.random() * 2;
            
            // Прозрачность
            const opacity = 0.3 + Math.random() * 0.5;
            
            // Покачивание
            const swing = (Math.random() - 0.5) * 120;
            
            // Применяем стили
            ball.style.backgroundImage = `url('${randomImage}')`;
            ball.style.width = size + 'px';
            ball.style.height = size + 'px';
            ball.style.left = left + '%';
            ball.style.top = startY + 'px';
            ball.style.animationDuration = duration + 's';
            ball.style.animationDelay = delay + 's';
            ball.style.opacity = opacity;
            ball.style.setProperty('--swing', swing + 'px');
            
            document.body.appendChild(ball);
            index++;
        }
    }
}

// ===== ЗАПУСК ПРИ ЗАГРУЗКЕ СТРАНИЦЫ =====
window.addEventListener('DOMContentLoaded', createBalls);
