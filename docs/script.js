// ======================
// === 游戏全局变量 ===
// ======================
let game_over = false;        // 游戏是否结束
let start_time = null;        // 游戏开始时间
let timer_interval = null;    // 计时器ID
let board = [];               // 数独棋盘数据
let currentNumber = 0;        // 当前选中的数字

const DEFAULT_EMPTY_CELLS = 45; // 默认空格数量

// ======================
// === 游戏核心功能 ===
// ======================

/**
 * 初始化游戏
 */
function start_game() {
    // 重置游戏状态
    game_over = false;
    clearInterval(timer_interval);
    start_time = Date.now();
    currentNumber = 0;

    // 获取难度设置
    const targetEmptyCells = parseInt(document.getElementById('empty-cells-input').value) || 45;
    const safeEmptyCells = Math.min(Math.max(targetEmptyCells, 0), 55);

    // 重置UI状态
    document.querySelectorAll('.number-button').forEach(btn => {
        btn.classList.remove('game-over', 'completed-number', 'selected');
    });

    // 移除所有闪光效果
    document.querySelectorAll('.cell.solved-hint, .cell.conflict').forEach(cell => {
        cell.classList.remove('solved-hint', 'conflict');
    });

    // 正确初始化棋盘
    board = Array(9).fill(null).map(() =>
        Array(9).fill(null).map(() => ({
            value: 0,
            locked: false
        }))
    );

    // 开始游戏
    timer_interval = setInterval(update_timer, 100);
    generate_sudoku(safeEmptyCells);
    create_board();
    renderBoardColors();
    updateNumberCompletion();

    // 更新游戏信息
    document.getElementById("status-info").textContent = "In Progress";
    update_game_information();
}

/**
 * 更新计时器显示
 */
function update_timer() {
    if (start_time) {
        const elapsed = (Date.now() - start_time) / 1000;
        document.getElementById('time-info').textContent = `${elapsed.toFixed(1)} s`;
    }
}

/**
 * 生成数独谜题
 * @param {number} targetEmptyCells - 目标空格数量
 */
function generate_sudoku(targetEmptyCells = DEFAULT_EMPTY_CELLS) {
    // 1. 生成完整解
    solve_sudoku(board);

    // 2. 挖空单元格
    let emptyCount = 0;
    const safeEmptyCells = Math.min(Math.max(targetEmptyCells, 0), 55);

    let attempts = 0;
    const MAX_ATTEMPTS = 1000;

    while (emptyCount < safeEmptyCells && attempts++ < MAX_ATTEMPTS) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);

        if (board[row][col].value !== 0) {
            const temp = board[row][col].value;
            board[row][col].value = 0;

            // 检查唯一解
            const tempBoard = JSON.parse(JSON.stringify(board));
            if (count_solutions(tempBoard) === 1) {
                emptyCount++;
            } else {
                board[row][col].value = temp; // 恢复
            }
        }
    }

    // 3. 锁定非空单元格
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            board[i][j].locked = (board[i][j].value !== 0);
        }
    }
}

/**
 * 解数独算法
 * @param {Array} board - 数独棋盘
 */
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

    // 辅助函数：填充对角线方块
    function fill_diagonal_boxes() {
        for (let box = 0; box < 9; box += 3) {
            fill_box(box, box);
        }
    }

    // 辅助函数：填充单个3x3方块
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

    // 辅助函数：解剩余部分
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

    // 辅助函数：检查数字是否安全
    function is_safe(row, col, num) {
        return !used_in_row(row, num) &&
            !used_in_col(col, num) &&
            !used_in_box(row - row % 3, col - col % 3, num);
    }

    // 辅助函数：检查行
    function used_in_row(row, num) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col].value === num) return true;
        }
        return false;
    }

    // 辅助函数：检查列
    function used_in_col(col, num) {
        for (let row = 0; row < 9; row++) {
            if (board[row][col].value === num) return true;
        }
        return false;
    }

    // 辅助函数：检查3x3宫格
    function used_in_box(boxStartRow, boxStartCol, num) {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board[row + boxStartRow][col + boxStartCol].value === num) return true;
            }
        }
        return false;
    }
}

/**
 *
 * @param {Array} board - 数独棋盘
 * @param {number} count - 当前解的数量
 * @returns {number} - 解的总数
 */
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

/**
 * 检查数字在指定位置是否有效
 */
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

/**
 * 打乱数组
 */
function shuffle_array(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// ======================
// === 棋盘渲染 ===
// ======================

/**
 * 创建棋盘DOM元素
 */
function create_board() {
    const board_element = document.getElementById("board");
    board_element.innerHTML = "";

    board_element.style.gridTemplateRows = "repeat(9, 40px)";
    board_element.style.gridTemplateColumns = "repeat(9, 40px)";

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const div = document.createElement("div");
            div.className = "cell";
            div.dataset.row = i.toString();
            div.dataset.col = j.toString();
            div.addEventListener("click", () => select_cell(i, j));
            board_element.appendChild(div);
            update_cell_display(i, j);
        }
    }
}

/**
 * 渲染棋盘颜色
 */
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

/**
 * 选择单元格
 */
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

/**
 * 应用难度设置
 */
/**
 * Shows the difficulty input field
 */
function showDifficultyInput() {
    const container = document.getElementById('difficulty-input-container');
    const input = document.getElementById('empty-cells-input');

    container.style.display = container.style.display === 'flex' ? 'none' : 'flex';

    if (container.style.display === 'flex') {
        input.focus();
        input.value = ''; // Clear the input when showing
    }
}

/**
 * Applies difficulty settings
 */
function apply_difficulty() {
    let emptyCellsInput = document.getElementById('empty-cells-input');
    let emptyCells = parseInt(emptyCellsInput.value);

    // Check if input is valid
    if (isNaN(emptyCells)) {
        emptyCellsInput.placeholder = "Please enter a number";
        emptyCellsInput.value = '';
        emptyCellsInput.focus();
        return;
    }

    // Clamp value between 1 and 55
    emptyCells = Math.max(1, Math.min(55, emptyCells));
    emptyCellsInput.value = emptyCells;

    // Hide the input container
    document.getElementById('difficulty-input-container').style.display = 'none';

    start_game();
}

/**
 * 闪烁冲突单元格
 */
function flashConflictingCells(row, col, num) {
    // 移除所有现有的冲突标记
    document.querySelectorAll('.cell.conflict').forEach(cell => {
        cell.classList.remove('conflict');
    });

    // 临时降低其他单元格可见度
    const highlightedCells = document.querySelectorAll('.cell.highlighted');
    highlightedCells.forEach(cell => {
        cell.style.opacity = '0.5';
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
    }, 600);
}

/**
 * 更新单元格显示
 */
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

/**
 * 更新高亮显示
 */
function updateHighlight() {
    // 移除所有高亮
    document.querySelectorAll('.cell.highlighted').forEach(cell => {
        cell.classList.remove('highlighted');
    });

    // 高亮当前选中数字的所有单元格
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

/**
 * 初始化数字按钮
 */
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

/**
 * 更新数字按钮选中状态
 */
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

/**
 * 检查游戏是否完成
 */
function check_completion() {
    const isComplete = board.every(row => row.every(cell => cell.value !== 0));
    if (isComplete) {
        game_over = true;
        clearInterval(timer_interval);
        document.getElementById("status-info").textContent = "Completed";

        // 添加重开按钮的光效
        const restartBtn = document.getElementById('restart-btn');
        restartBtn.classList.add('game-over');
    }
}

// ======================
// === 信息面板更新 ===
// ======================

/**
 * 更新游戏信息
 */
function update_game_information() {
    const emptyCells = board.flat().filter(cell => cell.value === 0).length;
    document.getElementById('difficulty-info').textContent = emptyCells.toString();
    // 或者使用模板字符串：
    // document.getElementById('difficulty-info').textContent = `${emptyCells}`;
}

// ======================
// === 侧边栏功能 ===
// ======================


/**
 * 选择背景
 */
function select_background(filename) {
    document.documentElement.style.setProperty('--background-url', `url("Background_Collection/${filename}")`);
    localStorage.setItem('background', filename);
    document.getElementById('background-menu').style.display = 'none';
}

/**
 * 更新数字完成状态
 */
function updateNumberCompletion() {
    // 统计每个数字出现的次数
    const numberCounts = Array(10).fill(0);
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
    // 恢复侧边栏状态
    const savedCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (savedCollapsed) document.body.classList.add('sidebar-collapsed');

    // 恢复背景设置
    const savedBg = localStorage.getItem('background');
    if (savedBg) {
        document.documentElement.style.setProperty('--background-url', `url("Background_Collection/${savedBg}")`);
    }

    // 初始化游戏
    init_number_buttons();
    start_game();
});