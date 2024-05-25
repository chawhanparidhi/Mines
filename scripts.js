document.addEventListener('DOMContentLoaded', () => {
    let currentScore = 0;
    let overallScore = localStorage.getItem('overallScore') ? parseInt(localStorage.getItem('overallScore')) : 0;
    let gameActive = false;

    // Display the overall score when the page loads
    document.getElementById('overall-score').innerText = overallScore;

    // Function to start the game
    window.startGame = function() {
        const bombCount = parseInt(document.getElementById('bombCount').value);
        createGrid(bombCount);
        centerGrid();
        resetCurrentScore();
        gameActive = true;
        document.getElementById('end-game-button').disabled = false;
    };

    // Function to create the game grid
    function createGrid(bombCount) {
        const grid = document.getElementById('grid');
        grid.innerHTML = ''; // Clear previous grid

        for (let i = 0; i < 25; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            cell.addEventListener('click', revealCell);
            grid.appendChild(cell);
        }

        // Generate bombs randomly
        const cells = document.querySelectorAll('.cell');
        const bombIndices = generateBombIndices(bombCount, cells.length);
        cells.forEach((cell, index) => {
            if (bombIndices.includes(index)) {
                cell.dataset.hasBomb = 'true';
            }
        });
    }

    // Function to generate random bomb indices
    function generateBombIndices(bombCount, maxIndex) {
        const bombIndices = [];
        while (bombIndices.length < bombCount) {
            const index = Math.floor(Math.random() * maxIndex);
            if (!bombIndices.includes(index)) {
                bombIndices.push(index);
            }
        }
        return bombIndices;
    }

    // Function to handle cell click event
    function revealCell(event) {
        const cell = event.target;
        if (cell.dataset.hasBomb === 'true') {
            cell.innerHTML = '<img src="bomb.png" alt="Bomb">';
            gameOver();
        } else {
            cell.innerHTML = '<img src="gem.png" alt="Gem">';
            incrementCurrentScore();
        }
    }

    // Function to handle game over
    function gameOver() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.removeEventListener('click', revealCell);
        });
        alert('Game Over!');
        gameActive = false;
        document.getElementById('end-game-button').disabled = true;
    }

    // Function to center the grid
    function centerGrid() {
        const gameContainer = document.getElementById('game-container');
        gameContainer.style.display = 'flex';
        gameContainer.style.justifyContent = 'center';
        gameContainer.style.alignItems = 'center';
        gameContainer.style.height = '100%';
    }

    // Function to reset the current game score
    function resetCurrentScore() {
        currentScore = 0;
        document.getElementById('current-score').innerText = currentScore;
    }

    // Function to increment the current game score
    function incrementCurrentScore() {
        currentScore += 10; // Add 10 points for each gem found
        document.getElementById('current-score').innerText = currentScore;
    }

    // Function to update the overall score
    function updateOverallScore() {
        overallScore += currentScore;
        localStorage.setItem('overallScore', overallScore);
        document.getElementById('overall-score').innerText = overallScore;
    }

    // Function to safely end the game and update the overall score
    window.endGame = function() {
        if (gameActive) {
            updateOverallScore();
            alert(`Game Ended! Your score of ${currentScore} has been added to your overall score.`);
            gameActive = false;
            document.getElementById('end-game-button').disabled = true;
            const cells = document.querySelectorAll('.cell');
            cells.forEach(cell => {
                cell.removeEventListener('click', revealCell);
            });
        }
    };
});

