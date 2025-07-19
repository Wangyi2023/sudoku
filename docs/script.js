// Document Script.js
// *** Main JS-Code ***
let game_over = false;
let start_time = null;
let timer_interval = null;
let board = [];
let currentNumber = 0;
const DEFAULT_EMPTY_CELLS = 30;

// 初始化游戏
function start_game() {
    game_over = false;
    clearInterval(timer_interval);
    start_time = null;
    currentNumber = 0;

    // 重置数字按钮选择状态
    document.querySelectorAll('.number-button').forEach(btn => {
        btn.classList.remove('selected');
    });

    board = Array(9).fill().map(() => Array(9).fill(0));
    generate_sudoku();

    update_game_information();
    create_board();
    renderBoardColors();
    document.getElementById("status-info").textContent = "In Progress";
}

function generate_sudoku() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (Math.random() > 0.3) {
                board[i][j] = Math.floor(Math.random() * 9) + 1;
            }
        }
    }

    let emptyCount = board.flat().filter(cell => cell === 0).length;
    while (emptyCount !== DEFAULT_EMPTY_CELLS) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        if (emptyCount < DEFAULT_EMPTY_CELLS && board[row][col] !== 0) {
            board[row][col] = 0;
            emptyCount++;
        } else if (emptyCount > DEFAULT_EMPTY_CELLS && board[row][col] === 0) {
            board[row][col] = Math.floor(Math.random() * 9) + 1;
            emptyCount--;
        }
    }
}

function create_board() {
    const board_element = document.getElementById("board");
    board_element.innerHTML = "";

    board_element.style.gridTemplateRows = "repeat(9, 40px)";
    board_element.style.gridTemplateColumns = "repeat(9, 40px)";

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const div = document.createElement("div");
            div.className = "cell";
            div.dataset.row = i;
            div.dataset.col = j;
            div.addEventListener("click", () => select_cell(i, j));
            board_element.appendChild(div);
            update_cell_display(i, j);
        }
    }
}

function renderBoardColors() {
    const boardElement = document.getElementById("board");
    const cells = boardElement.querySelectorAll('.cell');

    const darkColor = 'rgba(1, 1, 1, 0.6)';
    const lightColor = 'rgba(1, 1, 1, 0.75)';

    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const boxRow = Math.floor(row / 3);
        const boxCol = Math.floor(col / 3);
        cell.style.backgroundColor = (boxRow + boxCol) % 2 === 0 ? darkColor : lightColor;
    });
}

// 初始化数字按钮事件
function init_number_buttons() {
    // 数字按钮事件
    document.querySelectorAll('.number-button:not(.restart-button)').forEach(button => {
        button.addEventListener('click', function() {
            const num = parseInt(this.dataset.number);
            console.log(`Number ${num} clicked`);

            if (currentNumber === num) {
                currentNumber = 0;
                this.classList.remove('selected');
            } else {
                currentNumber = num;
                // 移除其他按钮的选中状态
                document.querySelectorAll('.number-button').forEach(btn => {
                    btn.classList.remove('selected');
                });
                this.classList.add('selected');
            }
        });
    });

    // 重开按钮事件
    const restartBtn = document.getElementById('restart-btn');
    restartBtn.addEventListener('click', function() {
        console.log("Restart button clicked");
        start_game();
    });
}

function update_cell_display(row, col) {
    const cellElement = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    if (!cellElement) return;

    const value = board[row][col];
    cellElement.textContent = value === 0 ? "" : value;
    cellElement.className = value === 0 ? "cell" : "cell filled";
    cellElement.style.color = "white";
}

function select_cell(row, col) {
    if (game_over || currentNumber === 0 || board[row][col] !== 0) return;

    board[row][col] = currentNumber;
    update_cell_display(row, col);
    check_completion();
}

function check_completion() {
    const isComplete = board.every(row => row.every(cell => cell !== 0));
    if (isComplete) {
        game_over = true;
        clearInterval(timer_interval);
        document.getElementById("status-info").textContent = "Completed";
    }
}

function update_game_information() {
    const time = start_time ? ((Date.now() - start_time) / 1000).toFixed(1) : "0.0";
    document.getElementById('time-info').textContent = `${time} s`;

    const emptyCells = board.flat().filter(cell => cell === 0).length;
    document.getElementById('board-info').textContent = `9 × 9 / Empty ${emptyCells}`;
    document.getElementById('density-info').textContent = "N/A";
}

function update_solvability_information() {
    document.getElementById('solvability-info').textContent = "N/A";
}

function solve() {
    console.log("Solve function will be implemented for Sudoku hints");
}

function apply_difficulty() {
    start_game();
}

function select_background(filename) {
    document.documentElement.style.setProperty('--background-url', `url("Background_Collection/${filename}")`);
    localStorage.setItem('background', filename);
    document.getElementById('background-menu').style.display = 'none';
}

function start_timer() {
    start_time = Date.now();
    if (timer_interval) clearInterval(timer_interval);
    timer_interval = setInterval(update_game_information, 100);
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    const savedCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (savedCollapsed) document.body.classList.add('sidebar-collapsed');

    const savedBg = localStorage.getItem('background');
    if (savedBg) {
        document.documentElement.style.setProperty('--background-url', `url("Background_Collection/${savedBg}")`);
    }

    init_number_buttons(); // 初始化按钮事件
    start_game(); // 开始游戏
});