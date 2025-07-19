// Document Script.js
// *** Main JS-Code ***
let game_over = false;
let start_time = null;
let timer_interval = null;
let board = [];
let currentNumber = 0; // 0表示未选择任何数字
const DEFAULT_EMPTY_CELLS = 30; // 默认30个空格

// 初始化游戏
function start_game() {
    game_over = false;
    clearInterval(timer_interval);
    start_time = null;
    currentNumber = 0; // 重置为未选择状态

    // 重置按钮样式
    document.querySelectorAll('.number-button').forEach(btn => {
        btn.classList.remove('selected');
    });

    // 初始化9x9数独棋盘
    board = Array(9).fill().map(() => Array(9).fill(0));
    generate_sudoku();

    update_game_information();
    create_board();
    document.getElementById("status-info").textContent = "In Progress";
}

// 简单的数独生成函数
function generate_sudoku() {
    // 随机填充一些数字作为起点
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (Math.random() > 0.3) { // 约70%的格子有数字
                board[i][j] = Math.floor(Math.random() * 9) + 1;
            }
        }
    }

    // 确保有正好DEFAULT_EMPTY_CELLS个空格
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

// 创建数独棋盘
function create_board() {
    const board_element = document.getElementById("board");
    board_element.innerHTML = ""; // 清空现有棋盘

    board_element.style.gridTemplateRows = "repeat(9, 40px)";
    board_element.style.gridTemplateColumns = "repeat(9, 40px)";
    board_element.style.border = "2px solid #000";

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const div = document.createElement("div");
            div.className = "cell";

            // 添加3x3宫格的粗边框
            if (i % 3 === 0) div.style.borderTop = "2px solid #000";
            if (j % 3 === 0) div.style.borderLeft = "2px solid #000";
            if (i === 8) div.style.borderBottom = "2px solid #000";
            if (j === 8) div.style.borderRight = "2px solid #000";

            div.dataset.row = i;
            div.dataset.col = j;

            div.addEventListener("click", () => select_cell(i, j));
            board_element.appendChild(div);

            update_cell_display(i, j);
        }
    }
}

// 更新单元格显示
function update_cell_display(row, col) {
    const cellElement = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    if (!cellElement) return;

    const value = board[row][col];
    cellElement.textContent = value === 0 ? "" : value;
    cellElement.className = value === 0 ? "cell" : "cell filled";
    cellElement.style.color = value === 0 ? "white" : "#FFD700";
}

// 选择单元格
function select_cell(row, col) {
    if (game_over || currentNumber === 0) return;

    // 只允许修改原本为空的格子
    if (board[row][col] === 0) {
        board[row][col] = currentNumber;
        update_cell_display(row, col);
        check_completion();
    }
}

// 检查游戏是否完成
function check_completion() {
    // 检查所有格子是否都已填满
    const isComplete = board.every(row => row.every(cell => cell !== 0));

    if (isComplete) {
        game_over = true;
        clearInterval(timer_interval);
        document.getElementById("status-info").textContent = "Completed";
    }
}

// 初始化数字按钮事件
function init_number_buttons() {
    document.querySelectorAll('.number-button').forEach(button => {
        button.addEventListener('click', function() {
            const num = parseInt(this.textContent);

            // 如果点击已选中的按钮，则取消选择
            if (currentNumber === num) {
                currentNumber = 0;
                this.classList.remove('selected');
            } else {
                // 选择新数字
                currentNumber = num;
                document.querySelectorAll('.number-button').forEach(btn => {
                    btn.classList.remove('selected');
                });
                this.classList.add('selected');
            }
        });
    });
}

// 更新游戏信息
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

// 解决提示功能（暂未实现）
function solve() {
    console.log("Solve function will be implemented for Sudoku hints");
}

// 应用难度设置（当前简化版）
function apply_difficulty() {
    start_game();
}

// 选择背景
function select_background(filename) {
    document.documentElement.style.setProperty('--background-url', `url("Background_Collection/${filename}")`);
    localStorage.setItem('background', filename);
    document.getElementById('background-menu').style.display = 'none';
}

// 启动计时器
function start_timer() {
    start_time = Date.now();
    if (timer_interval) clearInterval(timer_interval);
    timer_interval = setInterval(() => { update_game_information(); }, 100);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 恢复侧边栏状态
    const savedCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (savedCollapsed) document.body.classList.add('sidebar-collapsed');

    // 恢复背景设置
    const savedBg = localStorage.getItem('background');
    if (savedBg) {
        document.documentElement.style.setProperty('--background-url', `url("Background_Collection/${savedBg}")`);
    }

    // 初始化数字按钮
    init_number_buttons();

    // 开始游戏
    start_game();
});