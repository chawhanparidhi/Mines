const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

class Minesweeper {
    constructor(rows, cols, mines) {
        this.rows = rows;
        this.cols = cols;
        this.mines = mines;
        this.grid = this.initializeGrid();
        this.revealed = Array.from({ length: rows }, () => Array(cols).fill(false));
        this.marked = Array.from({ length: rows }, () => Array(cols).fill(false));
    }

    initializeGrid() {
        const grid = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
        let mineCount = 0;

        while (mineCount < this.mines) {
            const r = Math.floor(Math.random() * this.rows);
            const c = Math.floor(Math.random() * this.cols);
            if (grid[r][c] === 'M') continue;
            grid[r][c] = 'M';
            mineCount++;

            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const nr = r + dr, nc = c + dc;
                    if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols && grid[nr][nc] !== 'M') {
                        grid[nr][nc]++;
                    }
                }
            }
        }
        return grid;
    }

    revealCell(row, col) {
        if (this.grid[row][col] === 'M') return 'Game Over';
        this.floodFill(row, col);
        if (this.checkWin()) return 'You Win';
        return 'Continue';
    }

    floodFill(row, col) {
        if (this.revealed[row][col]) return;
        this.revealed[row][col] = true;
        if (this.grid[row][col] === 0) {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const nr = row + dr, nc = col + dc;
                    if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
                        this.floodFill(nr, nc);
                    }
                }
            }
        }
    }

    markMine(row, col) {
        this.marked[row][col] = !this.marked[row][col];
    }

    checkWin() {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.grid[r][c] !== 'M' && !this.revealed[r][c]) {
                    return false;
                }
            }
        }
        return true;
    }
}

const game = new Minesweeper(10, 10, 10);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/reveal', (req, res) => {
    const { row, col } = req.body;
    const result = game.revealCell(row, col);
    res.json({ result, grid: game.grid, revealed: game.revealed, marked: game.marked });
});

app.post('/mark', (req, res) => {
    const { row, col } = req.body;
    game.markMine(row, col);
    res.json({ marked: game.marked });
});

app.listen(port, () => {
    console.log(`Minesweeper app listening at http://localhost:${port}`);
});
