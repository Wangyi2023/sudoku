// Document Script.js
// *** Main JS-Code ***
let game_over = false;
let start_time = null;
let timer_interval = null;
let board = [];
let currentNumber = 0;
const DEFAULT_EMPTY_CELLS = 30;

// ======================
// === 游戏核心功能 ===
// ======================

// 初始化游戏
function start_game() {
    game_over = false;
    clearInterval(timer_interval); // 清除之前的计时器
    start_time = Date.now(); // 重置开始时间
    currentNumber = 0;

    // 移除重开按钮的光效
    // 移除所有按钮的光效
    document.querySelectorAll('.number-button').forEach(btn => {
        btn.classList.remove('game-over', 'completed-number');
    });


    // 启动计时器
    timer_interval = setInterval(update_timer, 100);

    document.querySelectorAll('.number-button').forEach(btn => {
        btn.classList.remove('selected');
    });

    board = Array(9).fill().map(() => Array(9).fill().map(() => ({
        value: 0,
        locked: false
    })));

    generate_sudoku();
    update_game_information();
    create_board();
    renderBoardColors();
    document.getElementById("status-info").textContent = "In Progress";
}

function update_timer() {
    if (start_time) {
        const elapsed = (Date.now() - start_time) / 1000;
        document.getElementById('time-info').textContent = `${elapsed.toFixed(1)} s`;
    }
}

function generate_sudoku() {
    // 先创建一个有效的完整数独解
    solve_sudoku(board);

    // 然后根据难度挖空
    let emptyCount = board.flat().filter(cell => cell.value === 0).length;
    const targetEmptyCells = parseInt(document.getElementById('empty-cells-input').value) || DEFAULT_EMPTY_CELLS;

    // 确保目标空格数在合理范围内
    const safeEmptyCells = Math.min(Math.max(targetEmptyCells, 17), 81); // 17是经典数独的最小空格数

    // 随机挖空，确保数独有唯一解
    while (emptyCount < safeEmptyCells) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);

        if (board[row][col].value !== 0) {
            const tempValue = board[row][col].value;
            board[row][col].value = 0;

            // 检查挖空后是否仍有唯一解
            const tempBoard = JSON.parse(JSON.stringify(board));
            if (count_solutions(tempBoard) !== 1) {
                // 如果不是唯一解，恢复这个数字
                board[row][col].value = tempValue;
            } else {
                emptyCount++;
                board[row][col].locked = false;
            }
        }
    }

    // 锁定所有非空单元格
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            board[i][j].locked = board[i][j].value !== 0;
        }
    }
}

// 解数独的辅助函数
function solve_sudoku(board) {
    // 清空棋盘
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            board[i][j].value = 0;
        }
    }

    // 填充对角线上的3x3方块
    fill_diagonal_boxes();

    // 解剩余的数独
    solve_remaining(0, 3);

    function fill_diagonal_boxes() {
        for (let box = 0; box < 9; box += 3) {
            fill_box(box, box);
        }
    }

    function fill_box(row, col) {
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        shuffle_array(nums);

        let index = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[row + i][col + j].value = nums[index++];
            }
        }
    }

    function solve_remaining(i, j) {
        if (j >= 9 && i < 8) {
            i++;
            j = 0;
        }
        if (i >= 9 && j >= 9) {
            return true;
        }
        if (i < 3) {
            if (j < 3) j = 3;
        } else if (i < 6) {
            if (j === Math.floor(i / 3) * 3) j += 3;
        } else {
            if (j === 6) {
                i++;
                j = 0;
                if (i >= 9) return true;
            }
        }

        for (let num = 1; num <= 9; num++) {
            if (is_safe(i, j, num)) {
                board[i][j].value = num;
                if (solve_remaining(i, j + 1)) {
                    return true;
                }
                board[i][j].value = 0;
            }
        }
        return false;
    }

    function is_safe(row, col, num) {
        return !used_in_row(row, num) &&
            !used_in_col(col, num) &&
            !used_in_box(row - row % 3, col - col % 3, num);
    }

    function used_in_row(row, num) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col].value === num) return true;
        }
        return false;
    }

    function used_in_col(col, num) {
        for (let row = 0; row < 9; row++) {
            if (board[row][col].value === num) return true;
        }
        return false;
    }

    function used_in_box(boxStartRow, boxStartCol, num) {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board[row + boxStartRow][col + boxStartCol].value === num) return true;
            }
        }
        return false;
    }
}

// 计算数独的解的数量
function count_solutions(board, count = 0) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j].value === 0) {
                for (let num = 1; num <= 9 && count < 2; num++) {
                    if (is_valid(board, i, j, num)) {
                        board[i][j].value = num;
                        count = count_solutions(board, count);
                        board[i][j].value = 0;
                    }
                }
                return count;
            }
        }
    }
    return count + 1;
}

function is_valid(board, row, col, num) {
    // 检查行
    for (let x = 0; x < 9; x++) {
        if (board[row][x].value === num) return false;
    }

    // 检查列
    for (let x = 0; x < 9; x++) {
        if (board[x][col].value === num) return false;
    }

    // 检查3x3宫格
    const startRow = row - row % 3;
    const startCol = col - col % 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i + startRow][j + startCol].value === num) return false;
        }
    }

    return true;
}

// 辅助函数：打乱数组
function shuffle_array(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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

// ======================
// === 单元格操作 ===
// ======================
function select_cell(row, col) {
    if (game_over) return;

    const cell = board[row][col];

    // 处理锁定的单元格
    if (cell.locked) {
        if (currentNumber === cell.value) {
            currentNumber = 0;
        } else {
            currentNumber = cell.value;
        }
        updateNumberButtonsSelection();
        updateHighlight();
        updateNumberCompletion();
        return;
    }

    // 处理已填写的单元格
    if (cell.value !== 0) {
        if (currentNumber === cell.value) {
            cell.value = 0;
            currentNumber = 0;
        } else {
            currentNumber = cell.value;
        }
        updateNumberButtonsSelection();
        update_cell_display(row, col);
        updateHighlight();
        updateNumberCompletion();
        return;
    }

    // 处理空白单元格
    if (currentNumber !== 0) {
        // 检查数字是否有效
        if (!is_valid(board, row, col, currentNumber)) {
            // 找到冲突的单元格并闪烁
            flashConflictingCells(row, col, currentNumber);
            return;
        }

        cell.value = currentNumber;
        update_cell_display(row, col);
        check_completion();
        updateHighlight();
        updateNumberCompletion();
    }
}

function flashConflictingCells(row, col, num) {
    // 移除所有现有的冲突标记
    document.querySelectorAll('.cell.conflict').forEach(cell => {
        cell.classList.remove('conflict');
    });

    // 临时移除高亮效果（避免黄光干扰）
    const highlightedCells = document.querySelectorAll('.cell.highlighted');
    highlightedCells.forEach(cell => {
        cell.style.opacity = '0.5'; // 降低其他单元格可见度
    });

    // 检查行、列、宫格冲突
    const conflicts = [];

    // 检查行
    for (let c = 0; c < 9; c++) {
        if (board[row][c].value === num) {
            conflicts.push([row, c]);
        }
    }

    // 检查列
    for (let r = 0; r < 9; r++) {
        if (board[r][col].value === num) {
            conflicts.push([r, col]);
        }
    }

    // 检查3x3宫格
    const boxStartRow = row - row % 3;
    const boxStartCol = col - col % 3;
    for (let r = boxStartRow; r < boxStartRow + 3; r++) {
        for (let c = boxStartCol; c < boxStartCol + 3; c++) {
            if (board[r][c].value === num) {
                conflicts.push([r, c]);
            }
        }
    }

    // 应用冲突效果
    conflicts.forEach(([r, c]) => {
        const cellElement = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
        cellElement.classList.add('conflict');

        // 强制数字也闪烁（通过父元素缩放）
        cellElement.style.animation = 'none';
        setTimeout(() => {
            cellElement.style.animation = '';
        }, 10);
    });

    // 1秒后恢复
    setTimeout(() => {
        document.querySelectorAll('.cell.conflict').forEach(cell => {
            cell.classList.remove('conflict');
        });
        highlightedCells.forEach(cell => {
            cell.style.opacity = '';
        });
    }, 600); // 比动画总时长稍长
}

function update_cell_display(row, col) {
    const cellElement = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    if (!cellElement) return;

    const cell = board[row][col];
    cellElement.textContent = cell.value === 0 ? "" : cell.value;

    cellElement.className = "cell";

    if (cell.value !== 0) {
        cellElement.classList.add('filled');
        if (cell.locked) {
            cellElement.classList.add('locked');
        }
    }

    if (cell.value !== 0 && cell.value === currentNumber) {
        cellElement.classList.add('selected');
    } else {
        cellElement.classList.remove('selected');
    }
}

// ======================
// === 数字高亮功能 ===
// ======================
function updateHighlight() {
    // 移除所有高亮
    document.querySelectorAll('.cell.highlighted').forEach(cell => {
        cell.classList.remove('highlighted');
    });

    // 高亮当前选中数字的所有单元格（包括锁定的）
    if (currentNumber !== 0) {
        document.querySelectorAll('.cell.filled').forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            if (board[row][col].value === currentNumber) {
                cell.classList.add('highlighted');
            }
        });
    }
}

// ======================
// === 按钮控制 ===
// ======================

function init_number_buttons() {
    // 数字按钮事件
    document.querySelectorAll('.number-button:not(.restart-button)').forEach(button => {
        button.addEventListener('click', function() {
            const num = parseInt(this.dataset.number);

            if (currentNumber === num) {
                currentNumber = 0;
                this.classList.remove('selected');
            } else {
                currentNumber = num;
                updateNumberButtonsSelection();
            }

            updateHighlight();
        });
    });

    // 重开按钮事件
    const restartBtn = document.getElementById('restart-btn');
    restartBtn.addEventListener('click', function() {
        start_game();
    });
}

function updateNumberButtonsSelection() {
    document.querySelectorAll('.number-button').forEach(btn => {
        btn.classList.remove('selected');
        if (parseInt(btn.dataset.number) === currentNumber) {
            btn.classList.add('selected');
        }
    });
}

// ======================
// === 游戏状态检查 ===
// ======================

function check_completion() {
    const isComplete = board.every(row => row.every(cell => cell.value !== 0));
    if (isComplete) {
        game_over = true;
        clearInterval(timer_interval); // 停止计时
        document.getElementById("status-info").textContent = "Completed";

        // 添加重开按钮的光效
        const restartBtn = document.getElementById('restart-btn');
        restartBtn.classList.add('game-over');
    }
}

// ======================
// === 信息面板更新 ===
// ======================

function update_game_information() {
    // 时间现在由update_timer()专门更新
    const emptyCells = board.flat().filter(cell => cell.value === 0).length;
    document.getElementById('board-info').textContent = `9 × 9 / Empty ${emptyCells}`;
    document.getElementById('density-info').textContent = "N/A";
}

function update_solvability_information() {
    document.getElementById('solvability-info').textContent = "N/A";
}

// ======================
// === 侧边栏功能 ===
// ======================

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

function updateNumberCompletion() {
    // 统计每个数字出现的次数
    const numberCounts = Array(10).fill(0); // 0-9，0不使用
    board.forEach(row => {
        row.forEach(cell => {
            if (cell.value > 0) {
                numberCounts[cell.value]++;
            }
        });
    });

    // 更新按钮状态
    document.querySelectorAll('.number-button:not(.restart-button)').forEach(button => {
        const num = parseInt(button.dataset.number);
        if (numberCounts[num] >= 9) {
            button.classList.add('completed-number');
        } else {
            button.classList.remove('completed-number');
        }
    });
}

// ======================
// === 初始化 ===
// ======================

document.addEventListener('DOMContentLoaded', function() {
    const savedCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (savedCollapsed) document.body.classList.add('sidebar-collapsed');

    const savedBg = localStorage.getItem('background');
    if (savedBg) {
        document.documentElement.style.setProperty('--background-url', `url("Background_Collection/${savedBg}")`);
    }

    init_number_buttons();
    start_game();
});