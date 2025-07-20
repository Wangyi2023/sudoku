let game_over = false;
let start_time = null;
let timer_interval = null;

let board = [];
let currentNumber = 0;

const DEFAULT_EMPTY_CELLS = 45;

// Todo 1 - Start / Restart
function start_game() {
    game_over = false;
    clearInterval(timer_interval);
    start_time = Date.now();
    currentNumber = 0;

    const targetEmptyCells = parseInt(document.getElementById('empty-cells-input').value) || 45;
    const safeEmptyCells = Math.min(Math.max(targetEmptyCells, 0), 55);

    document.querySelectorAll('.number-button').forEach(btn => {
        btn.classList.remove('game-over', 'completed-number', 'selected');
    });
    document.querySelectorAll('.cell.solved-hint, .cell.conflict').forEach(cell => {
        cell.classList.remove('solved-hint', 'conflict');
    });

    board = Array(9).fill(null).map(() =>
        Array(9).fill(null).map(() => ({
            value: 0,
            locked: false
        }))
    );

    timer_interval = setInterval(update_timer, 100);
    create_game_field(safeEmptyCells);
    create_board();
    render_board_colors();
    update_number_completion();

    document.getElementById("status-info").textContent = "In Progress";
    update_game_information();
}

function update_timer() {
    if (start_time) {
        const elapsed = (Date.now() - start_time) / 1000;
        document.getElementById('time-info').textContent = `${elapsed.toFixed(1)} s`;
    }
}

function create_game_field(targetEmptyCells = DEFAULT_EMPTY_CELLS) {
    solve_sudoku(board);

    let counter = 0;
    const safe_empty_cells = Math.min(Math.max(targetEmptyCells, 0), 55);

    let attempts = 0;
    const MAX_ATTEMPTS = 1000;

    while (counter < safe_empty_cells && attempts++ < MAX_ATTEMPTS) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);

        if (board[row][col].value !== 0) {
            const temp = board[row][col].value;
            board[row][col].value = 0;

            const board_temp = JSON.parse(JSON.stringify(board));
            if (count_solutions(board_temp) === 1) {
                counter++;
            } else {
                board[row][col].value = temp;
            }
        }
    }

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            board[i][j].locked = (board[i][j].value !== 0);
        }
    }
}

function solve_sudoku(board) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            board[i][j].value = 0;
        }
    }

    fill_diagonal_boxes();
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
    for (let x = 0; x < 9; x++) {
        if (board[row][x].value === num) return false;
    }
    for (let x = 0; x < 9; x++) {
        if (board[x][col].value === num) return false;
    }
    const r = row - row % 3;
    const c = col - col % 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i + r][j + c].value === num) return false;
        }
    }

    return true;
}

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

    board_element.style.gridTemplateRows = "repeat(9, 36px)";
    board_element.style.gridTemplateColumns = "repeat(9, 36px)";

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

function render_board_colors() {
    const boardElement = document.getElementById("board");
    const cells = boardElement.querySelectorAll('.cell');

    const dark = 'rgba(1, 1, 1, 0.6)';
    const light = 'rgba(1, 1, 1, 0.75)';

    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const boxRow = Math.floor(row / 3);
        const boxCol = Math.floor(col / 3);
        cell.style.backgroundColor = (boxRow + boxCol) % 2 === 0 ? dark : light;
    });
}


// Todo 2 - Edit Game-Field
function select_cell(row, col) {
    if (game_over) return;

    const cell = board[row][col];

    if (cell.locked) {
        if (currentNumber === cell.value) {
            currentNumber = 0;
        } else {
            currentNumber = cell.value;
        }
        update_number_buttons_selection();
        update_highlight();
        update_number_completion();
        return;
    }

    if (cell.value !== 0) {
        if (currentNumber === cell.value) {
            cell.value = 0;
            currentNumber = 0;
        } else {
            currentNumber = cell.value;
        }
        update_number_buttons_selection();
        update_cell_display(row, col);
        update_highlight();
        update_number_completion();
        return;
    }

    if (currentNumber !== 0) {
        if (!is_valid(board, row, col, currentNumber)) {
            flash_conflicting_cells(row, col, currentNumber);
            return;
        }

        cell.value = currentNumber;
        update_cell_display(row, col);
        check_completion();
        update_highlight();
        update_number_completion();
    }
}

function create_input_box() {
    const container = document.getElementById('difficulty-input-container');
    const input = document.getElementById('empty-cells-input');

    container.style.display = container.style.display === 'flex' ? 'none' : 'flex';

    if (container.style.display === 'flex') {
        input.focus();
        input.value = ''; // Clear the input when showing
    }
}

function apply_difficulty() {
    let empty_cells_input = document.getElementById('empty-cells-input');
    let empty_cells = parseInt(empty_cells_input.value);

    if (isNaN(empty_cells)) {
        empty_cells_input.placeholder = "Please enter a number";
        empty_cells_input.value = '';
        empty_cells_input.focus();
        return;
    }

    empty_cells = Math.max(1, Math.min(55, empty_cells));
    empty_cells_input.value = empty_cells;

    document.getElementById('difficulty-input-container').style.display = 'none';

    start_game();
}

function flash_conflicting_cells(row, col, num) {
    document.querySelectorAll('.cell.conflict').forEach(cell => {
        cell.classList.remove('conflict');
    });

    const highlightedCells = document.querySelectorAll('.cell.highlighted');
    highlightedCells.forEach(cell => {
        cell.style.opacity = '0.5';
    });

    const conflicts = [];

    for (let c = 0; c < 9; c++) {
        if (board[row][c].value === num) {
            conflicts.push([row, c]);
        }
    }
    for (let r = 0; r < 9; r++) {
        if (board[r][col].value === num) {
            conflicts.push([r, col]);
        }
    }
    const boxStartRow = row - row % 3;
    const boxStartCol = col - col % 3;
    for (let r = boxStartRow; r < boxStartRow + 3; r++) {
        for (let c = boxStartCol; c < boxStartCol + 3; c++) {
            if (board[r][c].value === num) {
                conflicts.push([r, c]);
            }
        }
    }

    conflicts.forEach(([r, c]) => {
        const cellElement = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
        cellElement.classList.add('conflict');
        cellElement.style.animation = 'none';
        setTimeout(() => {
            cellElement.style.animation = '';
        }, 10);
    });

    setTimeout(() => {
        document.querySelectorAll('.cell.conflict').forEach(cell => {
            cell.classList.remove('conflict');
        });
        highlightedCells.forEach(cell => {
            cell.style.opacity = '';
        });
    }, 600);
}

function update_cell_display(row, col) {
    const cell_element = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    if (!cell_element) return;

    const cell = board[row][col];
    cell_element.textContent = cell.value === 0 ? "" : cell.value;

    cell_element.className = "cell";

    if (cell.value !== 0) {
        cell_element.classList.add('filled');
        if (cell.locked) {
            cell_element.classList.add('locked');
        }
    }

    if (cell.value !== 0 && cell.value === currentNumber) {
        cell_element.classList.add('selected');
    } else {
        cell_element.classList.remove('selected');
    }
}

function update_highlight() {
    document.querySelectorAll('.cell.highlighted').forEach(cell => {
        cell.classList.remove('highlighted');
    });

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

// Todo 3 - Init / Update Information
function init_number_buttons() {
    document.querySelectorAll('.number-button:not(.restart-button)').forEach(button => {
        button.addEventListener('click', function() {
            const num = parseInt(this.dataset.number);

            if (currentNumber === num) {
                currentNumber = 0;
                this.classList.remove('selected');
            } else {
                currentNumber = num;
                update_number_buttons_selection();
            }

            update_highlight();
        });
    });

    const restartBtn = document.getElementById('restart-btn');
    restartBtn.addEventListener('click', function() {
        start_game();
    });
}

function update_number_buttons_selection() {
    document.querySelectorAll('.number-button').forEach(btn => {
        btn.classList.remove('selected');
        if (parseInt(btn.dataset.number) === currentNumber) {
            btn.classList.add('selected');
        }
    });
}

function check_completion() {
    const is_complete = board.every(row => row.every(cell => cell.value !== 0));
    if (is_complete) {
        game_over = true;
        clearInterval(timer_interval);
        document.getElementById("status-info").textContent = "Completed";

        currentNumber = 0;
        update_number_buttons_selection();
        update_highlight();

        const restart_button = document.getElementById('restart-btn');
        restart_button.classList.add('game-over');
    }
}

function update_game_information() {
    const emptyCells = board.flat().filter(cell => cell.value === 0).length;
    document.getElementById('difficulty-info').textContent = emptyCells.toString();
}

function select_background(filename) {
    document.documentElement.style.setProperty('--background-url', `url("Background_Collection/${filename}")`);
    localStorage.setItem('background', filename);
    document.getElementById('background-menu').style.display = 'none';
}

function update_number_completion() {
    const numberCounts = Array(10).fill(0);
    board.forEach(row => {
        row.forEach(cell => {
            if (cell.value > 0) {
                numberCounts[cell.value]++;
            }
        });
    });

    document.querySelectorAll('.number-button:not(.restart-button)').forEach(button => {
        const num = parseInt(button.dataset.number);
        if (numberCounts[num] >= 9) {
            button.classList.add('completed-number');
        } else {
            button.classList.remove('completed-number');
        }
    });
}


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