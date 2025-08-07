// script_main.js - 02.08.2025

// < Part 0 - Define Global-Variables >

const GAME_COLLECTION = {
    'standard_4x4': {
        REGION_INFORMATION_COLLECTION: [
            [4, [0, 0]]
        ],
        MAIN_BOARD_SIZE: 4,
        CELL_SIZE: 48,
        FONT_SIZE: 24,
        REGION: 4,
        SUBGRID_SIZE: 2,
        DEFAULT_EMPTY_CELLS: 8,
        MIN_EMPTY_CELLS: 1,
        MAX_EMPTY_CELLS: 10,
        NUMBER_LIMIT: 4,
        MAX_ATTEMPTS: 500,
        ICON: 'url("Icon/standard_4x4.png")',
    },
    'standard_9x9': {
        REGION_INFORMATION_COLLECTION: [
            [9, [0, 0]]
        ],
        MAIN_BOARD_SIZE: 9,
        CELL_SIZE: 40,
        FONT_SIZE: 20,
        REGION_SIZE: 9,
        SUBGRID_SIZE: 3,
        DEFAULT_EMPTY_CELLS: 45,
        MIN_EMPTY_CELLS: 1,
        MAX_EMPTY_CELLS: 55,
        NUMBER_LIMIT: 9,
        MAX_ATTEMPTS: 1000,
        ICON: 'url("Icon/standard_9x9.png")',
    },
    'standard_16x16': {
        REGION_INFORMATION_COLLECTION: [
            [16, [0, 0]]
        ],
        MAIN_BOARD_SIZE: 16,
        CELL_SIZE: 32,
        FONT_SIZE: 16,
        REGION_SIZE: 16,
        SUBGRID_SIZE: 4,
        DEFAULT_EMPTY_CELLS: 100,
        MIN_EMPTY_CELLS: 1,
        MAX_EMPTY_CELLS: 120,
        NUMBER_LIMIT: 16,
        MAX_ATTEMPTS: 1000,
        ICON: 'url("Icon/standard_16x16.png")',
    },
    'complex_class_A': {
        REGION_INFORMATION_COLLECTION: [
            [9, [0, 0]],
            [9, [6, 6]]
        ],
        MAIN_BOARD_SIZE: 15,
        CELL_SIZE: 36,
        FONT_SIZE: 18,
        REGION_SIZE: 9,
        SUBGRID_SIZE: 3,
        DEFAULT_EMPTY_CELLS: 75,
        MIN_EMPTY_CELLS: 1,
        MAX_EMPTY_CELLS: 90,
        NUMBER_LIMIT: 17,
        MAX_ATTEMPTS: 1000,
        ICON: 'url("Icon/complex_class_A.png")',
    },
    'complex_class_B': {
        REGION_INFORMATION_COLLECTION: [
            [9, [0, 0]],
            [9, [3, 6]]
        ],
        MAIN_BOARD_SIZE: 15,
        CELL_SIZE: 40,
        FONT_SIZE: 20,
        REGION_SIZE: 9,
        SUBGRID_SIZE: 3,
        DEFAULT_EMPTY_CELLS: 75,
        MIN_EMPTY_CELLS: 1,
        MAX_EMPTY_CELLS: 90,
        NUMBER_LIMIT: 16,
        MAX_ATTEMPTS: 1000,
        ICON: 'url("Icon/complex_class_B.png")',
    },
    'complex_class_C': {
        REGION_INFORMATION_COLLECTION: [
            [9, [0, 0]],
            [9, [3, 3]]
        ],
        MAIN_BOARD_SIZE: 12,
        CELL_SIZE: 40,
        FONT_SIZE: 20,
        REGION_SIZE: 9,
        SUBGRID_SIZE: 3,
        DEFAULT_EMPTY_CELLS: 60,
        MIN_EMPTY_CELLS: 1,
        MAX_EMPTY_CELLS: 80,
        NUMBER_LIMIT: 14,
        MAX_ATTEMPTS: 1000,
        ICON: 'url("Icon/complex_class_C.png")',
    },
    'complex_class_D': {
        REGION_INFORMATION_COLLECTION: [
            [9, [0, 0]],
            [9, [6, 6]],
            [9, [0, 12]],
            [9, [6, 18]]
        ],
        MAIN_BOARD_SIZE: 27,
        CELL_SIZE: 36,
        FONT_SIZE: 18,
        REGION_SIZE: 9,
        SUBGRID_SIZE: 3,
        DEFAULT_EMPTY_CELLS: 150,
        MIN_EMPTY_CELLS: 1,
        MAX_EMPTY_CELLS: 175,
        NUMBER_LIMIT: 33,
        MAX_ATTEMPTS: 1000,
        ICON: 'url("Icon/complex_class_D.png")',
    },
    'complex_class_E': {
        REGION_INFORMATION_COLLECTION: [
            [9, [0, 6]],
            [9, [3, 0]],
            [9, [6, 6]],
            [9, [3, 12]]
        ],
        MAIN_BOARD_SIZE: 21,
        CELL_SIZE: 36,
        FONT_SIZE: 18,
        REGION_SIZE: 9,
        SUBGRID_SIZE: 3,
        DEFAULT_EMPTY_CELLS: 125,
        MIN_EMPTY_CELLS: 1,
        MAX_EMPTY_CELLS: 150,
        NUMBER_LIMIT: 30,
        MAX_ATTEMPTS: 1000,
        ICON: 'url("Icon/complex_class_E.png")',
    },
    'complex_class_F': {
        REGION_INFORMATION_COLLECTION: [
            [9, [6, 6]],
            [9, [0, 6]],
            [9, [6, 0]],
            [9, [12, 6]],
            [9, [6, 12]]
        ],
        MAIN_BOARD_SIZE: 21,
        CELL_SIZE: 28,
        FONT_SIZE: 14,
        REGION_SIZE: 9,
        SUBGRID_SIZE: 3,
        DEFAULT_EMPTY_CELLS: 150,
        MIN_EMPTY_CELLS: 1,
        MAX_EMPTY_CELLS: 175,
        NUMBER_LIMIT: 33,
        MAX_ATTEMPTS: 1000,
        ICON: 'url("Icon/complex_class_F.png")',
    },
    'complex_class_X': {
        REGION_INFORMATION_COLLECTION: [
            [9, [6, 6]],
            [9, [0, 0]],
            [9, [0, 12]],
            [9, [12, 0]],
            [9, [12, 12]]
        ],
        MAIN_BOARD_SIZE: 21,
        CELL_SIZE: 28,
        FONT_SIZE: 14,
        REGION_SIZE: 9,
        SUBGRID_SIZE: 3,
        DEFAULT_EMPTY_CELLS: 180,
        MIN_EMPTY_CELLS: 1,
        MAX_EMPTY_CELLS: 240,
        NUMBER_LIMIT: 41,
        MAX_ATTEMPTS: 2000,
        ICON: 'url("Icon/complex_class_X.png")',
    },
}

let current_game_type = 'standard_9x9';
let region_information_collection = [];
let region_collection = [];
let main_board = [];
let main_board_solution = [];
let count_array =[];

let start_time = null;
let timer_interval = null;

let main_board_size
let cell_size
let font_size
let region_size
let subgrid_size
let default_empty_cells
let min_empty_cells
let max_empty_cells
let number_limit
let max_attempts

let current_number = 0;
let game_over = false;
let mark_enabled = false;
let is_solving = false;
let shortcuts_enabled = true;



// < Part 1 - Game Logic >

// Todo 1.1 - Init
function start() {
    const config = GAME_COLLECTION[current_game_type];

    region_information_collection = config.REGION_INFORMATION_COLLECTION;
    cell_size = config.CELL_SIZE;
    font_size = config.FONT_SIZE;
    region_size = config.REGION_SIZE;
    main_board_size = config.MAIN_BOARD_SIZE;
    subgrid_size = config.SUBGRID_SIZE;
    default_empty_cells = config.DEFAULT_EMPTY_CELLS;
    min_empty_cells = config.MIN_EMPTY_CELLS;
    max_empty_cells = config.MAX_EMPTY_CELLS;
    max_attempts = config.MAX_ATTEMPTS;
    number_limit = config.NUMBER_LIMIT;

    region_collection = [];

    current_number = 0;
    game_over = false;
    mark_enabled = false;
    is_solving = false;
    shortcuts_enabled = true;

    const input_element = document.getElementById('empty-cells-input');
    let target_empty_cells = parseInt(document.getElementById('empty-cells-input').value) || default_empty_cells;
    if (isNaN(target_empty_cells) || target_empty_cells < min_empty_cells || target_empty_cells > max_empty_cells) {
        target_empty_cells = default_empty_cells;
        input_element.value = default_empty_cells;
    }

    init_main_board(target_empty_cells);
    create_board();
    render_board_colors();
    render_borders();

    generate_number_buttons();
    update_number_completion();
    update_mark_button_selection();

    start_time = Date.now();
    timer_interval = setInterval(update_timer, 100);
    update_game_information();
    setup_difficulty_input();
    document.getElementById("status-info").textContent = "In Progress";
    document.getElementById('restart-btn').classList.remove('game-over');
}
function init_main_board(target_empty_cells) {
    main_board = Array(main_board_size).fill(null).map(() =>
        Array(main_board_size).fill(null).map(() => ({
            value: 0,
            locked: false,
            marked: false,
            visible: false,
        }))
    );
    main_board_solution = Array(main_board_size).fill(null).map(() =>
        Array(main_board_size).fill(0));
    count_array = Array(region_size + 1).fill(0);

    for (const region_information of region_information_collection) {
        const region = new Region({
            Main_Board: main_board,
            Size: region_information[0],
            Position: region_information[1],
        });
        region_collection.push(region);
    }

    for (let i = 0; i < region_collection.length; i++) {
        region_collection[i].solve_region();
    }

    for (let i = 0; i < main_board_size; i++) {
        for (let j = 0; j < main_board_size; j++) {
            let v = main_board[i][j].value;
            if (v !== 0) {
                main_board_solution[i][j] = v;
                main_board[i][j].visible = true;
            }
        }
    }
    let counter = 0;
    let attempts = 0;
    while (counter < target_empty_cells && attempts++ < max_attempts) {
        const row = Math.floor(Math.random() * main_board_size);
        const col = Math.floor(Math.random() * main_board_size);
        if (main_board[row][col].value === 0) {
            continue;
        }
        const temp = main_board[row][col].value;
        main_board[row][col].value = 0;
        if (count_solutions() === 1) {
            counter++;
        } else {
            main_board[row][col].value = temp;
        }
    }

    for (let i = 0; i < main_board_size; i++) {
        for (let j = 0; j < main_board_size; j++) {
            let v = main_board[i][j].value;
            if (v !== 0) {
                main_board[i][j].locked = true;
                count_array[v]++;
            }
        }
    }
}
function count_solutions() {
    let counters = [];
    for (const region of region_collection) {
        const board_temp = JSON.parse(JSON.stringify(main_board));
        counters.push(region.count_solutions(board_temp));
    }
    for (const counter of counters) {
        if (counter === 0) {
            console.log('Error - Count_Solutions');
            return 0;
        }
    }
    for (const counter of counters) {
        if (counter > 1) {
            return 2;
        }
    }
    return 1;
}
// Todo 1.2 - Edit Main Field
function is_valid(row, col, num) {
    for (const region of region_collection) {
        if (!region.is_valid(main_board, row, col, num)) {
            return false;
        }
    }
    return true;
}
function select_cell(row, col) {
    const cell = main_board[row][col];
    if (!cell.visible) {
        return;
    }

    if (cell.locked) {
        current_number = cell.value;
        update_number_buttons_selection();
        update_highlight();
        update_number_completion();
        return;
    }

    if (cell.value !== 0) {
        if (current_number === cell.value) {
            if (game_over) {
                return;
            }
            count_array[current_number]--;
            cell.value = 0;
            cell.marked = false;
        } else {
            current_number = cell.value;
        }
        update_number_buttons_selection();
        update_cell_display(row, col);
        update_highlight();
        update_number_completion();
        return;
    }

    if (game_over) {
        return;
    }

    if (current_number !== 0) {
        if (!is_valid(row, col, current_number)) {
            flash_conflicting_cells(row, col, current_number);
            return;
        }

        count_array[current_number]++;
        cell.value = current_number;
        if (mark_enabled) {
            cell.marked = true;
        }

        if (count_array[current_number] >= number_limit) {
            current_number = find_next_uncompleted_number();
            update_number_buttons_selection();
        }

        update_cell_display(row, col);
        check_completion();
        update_highlight();
        update_number_completion();
    }
}
// Todo 1.3 - Algorithm for UI
function find_next_uncompleted_number() {
    for (let next = current_number + 1; next <= region_size; next++) {
        if (count_array[next] < number_limit) return next;
    }
    for (let next = 1; next < current_number; next++) {
        if (count_array[next] < number_limit) return next;
    }
    return 0;
}
function find_next_number() {
    if (current_number === 0) {
        return 0;
    }
    return current_number < region_size ? current_number + 1 : 1;
}
function find_previous_number() {
    if (current_number === 0) {
        return 0;
    }
    return current_number > 1 ? current_number - 1 : region_size;
}
function flash_conflicting_cells(row, col, num) {
    document.querySelectorAll('.cell.conflict').forEach(cell => {
        cell.classList.remove('conflict');
    });

    let conflicts = [];
    for (const region of region_collection) {
        conflicts = [...conflicts, ...region.find_conflict_cells(row, col, num)];
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
    }, 600);
}
function check_completion() {
    const is_complete = count_array.slice(1).every(count => count >= number_limit);
    if (is_complete) {
        game_over = true;
        clearInterval(timer_interval);
        document.getElementById("status-info").textContent = "Completed";

        current_number = 0;
        update_number_buttons_selection();
        update_highlight();
        show_end_message(true);

        const restart_button = document.getElementById('restart-btn');
        restart_button.classList.add('game-over');
    }
}
function clear_all() {
    is_solving = false;
    if (game_over) {
        return;
    }

    for (let i = 0; i < main_board_size; i++) {
        for (let j = 0; j < main_board_size; j++) {
            if (!main_board[i][j].locked) {
                let v = main_board[i][j].value;
                if (v !== 0) {
                    count_array[v]--;
                    main_board[i][j].value = 0;
                    main_board[i][j].marked = false;
                    update_cell_display(i, j);
                }
            }
        }
    }
    current_number = 0;
    game_over = false;
    update_highlight();
    update_number_completion();
    update_number_buttons_selection();
    update_mark_button_selection();

}
function clear_all_marked_cells() {
    is_solving = false;
    if (!game_over) {
        for (let i = 0; i < main_board_size; i++) {
            for (let j = 0; j < main_board_size; j++) {
                if (!main_board[i][j].locked && main_board[i][j].marked) {
                    let v = main_board[i][j].value;
                    if (v !== 0) {
                        count_array[v]--;
                        main_board[i][j].value = 0;
                        main_board[i][j].marked = false;
                        update_cell_display(i, j);
                    }
                }
            }
        }
    }
    current_number = 0;
    mark_enabled = false;
    update_highlight();
    update_number_completion();
    update_number_buttons_selection();
    update_mark_button_selection();
}
function solve() {
    is_solving = false;
    let solutions = [];
    for (let i = 0; i < main_board_size; i++) {
        for (let j = 0; j < main_board_size; j++) {
            if (!main_board[i][j].visible) {
                continue;
            }
            if (main_board[i][j].value === 0) {
                solutions.push([i, j]);
            } else if (main_board[i][j].value !== main_board_solution[i][j]) {
                show_end_message(false);
                return false;
            }
        }
    }
    if (solutions.length === 0) {
        console.log("--- * Error * ---");
        return false;
    }

    let random_index = Math.floor(Math.random() * solutions.length);
    const [r, c] = solutions[random_index];
    const temp = current_number;
    current_number = main_board_solution[r][c];
    select_cell(r, c);
    current_number = temp;
    update_number_buttons_selection();
    update_highlight();

    const solved_cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
    if (solved_cell) {
        solved_cell.classList.add('solved');
        setTimeout(() => {
            solved_cell.classList.remove('solved');
        }, 200);
    }
    return true;
}
async function solve_all() {
    if (is_solving) {
        is_solving = false;
        return;
    }
    is_solving = true;
    while (!game_over && is_solving) {
        is_solving = solve();
        await new Promise(resolve => setTimeout(resolve, 50));
    }
}



// < Part 2 - UI >

// Todo 2.1 - Init
function create_board() {
    const board_element = document.getElementById("board");
    board_element.innerHTML = "";

    board_element.style.gridTemplateRows = `repeat(${main_board_size}, ${cell_size}px)`;
    board_element.style.gridTemplateColumns = `repeat(${main_board_size}, ${cell_size}px)`;

    for (let i = 0; i < main_board_size; i++) {
        for (let j = 0; j < main_board_size; j++) {
            const div = document.createElement("div");
            div.className = "cell";
            if (!main_board[i][j].visible) { div.classList.add('invisible'); }

            div.dataset.row = i.toString();
            div.dataset.col = j.toString();
            div.style.fontSize = `${font_size}px`;
            div.addEventListener("click", () => select_cell(i, j));
            board_element.appendChild(div);
            update_cell_display(i, j);
        }
    }
}
function formatNumber(n) {
    if (n === 0) {
        return "";
    }
    if (n >= 1 && n <= 9) {
        return n.toString();
    }
    if (n >= 10 && n <= 35) {
        return String.fromCharCode(65 + (n - 10));
    }
    return '?';
}
function create_input_box() {
    const container = document.getElementById('difficulty-input-container');
    const isOpening = container.style.display !== 'flex';

    container.style.display = isOpening ? 'flex' : 'none';
    shortcuts_enabled = !isOpening;

    if (isOpening) {
        const input = document.getElementById('empty-cells-input');
        input.focus();
        input.value = '';
    }
}
function render_board_colors() {
    const boardElement = document.getElementById("board");
    const cells = boardElement.querySelectorAll('.cell');

    const dark = 'rgba(0, 0, 0, 0.8)';
    const light = 'rgba(0, 0, 0, 0.6)';

    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const boxRow = Math.floor(row / subgrid_size);
        const boxCol = Math.floor(col / subgrid_size);
        cell.style.backgroundColor = (boxRow + boxCol) % 2 === 0 ? dark : light;
    });
}
function render_borders() {
    const boardWrapper = document.querySelector('.board-wrapper');
    document.querySelectorAll('.game-field-border, .game-field-border-outline').forEach(e => e.remove());

    for (const region of region_collection) {
        const [startR, startC] = [region.start_r, region.start_c];
        const BORDER_OFFSET = 1;
        const BORDER_OFFSET_OUTLINE = 3;

        const border = document.createElement('div');
        border.classList.add('game-field-border');

        border.style.width = `${cell_size * region_size + 2 * BORDER_OFFSET}px`;
        border.style.height = `${cell_size * region_size + 2 * BORDER_OFFSET}px`;
        border.style.left = `${startC * cell_size - BORDER_OFFSET}px`;
        border.style.top = `${startR * cell_size - BORDER_OFFSET}px`;

        const border_outline = document.createElement('div');
        border_outline.classList.add('game-field-border-outline');
        border_outline.style.width = `${cell_size * region_size + 2 * BORDER_OFFSET_OUTLINE}px`;
        border_outline.style.height = `${cell_size * region_size + 2 * BORDER_OFFSET_OUTLINE}px`;
        border_outline.style.left = `${startC * cell_size - BORDER_OFFSET_OUTLINE}px`;
        border_outline.style.top = `${startR * cell_size - BORDER_OFFSET_OUTLINE}px`;

        boardWrapper.appendChild(border);
        boardWrapper.appendChild(border_outline)
    }
}
function init_control_buttons() {
    const restartBtn = document.getElementById('restart-btn');
    restartBtn.addEventListener('click', function() {
        start();
    });

    const markBtn = document.getElementById('mark-btn');
    markBtn.addEventListener('click', change_mark_status);

    const clearMarkBtn = document.getElementById('clear-mark-btn');
    clearMarkBtn.addEventListener('click', clear_all_marked_cells)
}
function generate_number_buttons() {
    const row_first = document.getElementById('number-row-first');
    const row_second = document.getElementById('number-row-second');

    row_first.innerHTML = '';
    row_second.innerHTML = '';

    const total = region_size;
    const half = Math.ceil(total / 2);

    for (let i = 1; i <= total; i++) {
        const button = document.createElement('button');
        button.className = 'number-button';
        button.dataset.number = i.toString();
        button.textContent = formatNumber(i);

        button.addEventListener('click', function () {
            const num = parseInt(this.dataset.number);
            if (current_number === num) {
                current_number = 0;
                this.classList.remove('selected');
            } else {
                current_number = num;
                update_number_buttons_selection();
            }
            update_highlight();
        });

        if (i <= half) {
            row_first.appendChild(button);
        } else {
            row_second.appendChild(button);
        }
    }
}
function setup_difficulty_input() {
    const input = document.getElementById("empty-cells-input");
    input.min = min_empty_cells;
    input.max = max_attempts;
    input.placeholder = `Enter ${min_empty_cells} - ${max_empty_cells}`;
}
// Todo 2.2 - Edit Game Status
function apply_difficulty() {
    let empty_cells_input = document.getElementById('empty-cells-input');
    let empty_cells = parseInt(empty_cells_input.value.toString());
    if (isNaN(empty_cells) || empty_cells < min_empty_cells || empty_cells > max_empty_cells) {
        empty_cells_input.value = default_empty_cells;
    }
    close_all_sidebar_menus();
    start();
}
function select_background(filename) {
    document.documentElement.style.setProperty('--background-url', `url("Background_Collection/${filename}")`);
    localStorage.setItem('background', filename);
    document.getElementById('background-menu').style.display = 'none';
}
function change_mark_status() {
    is_solving = false;
    mark_enabled = !mark_enabled;
    update_mark_button_selection();
}
// Todo 2.3 - Update Game Information
function update_cell_display(row, col) {
    const cell_element = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    if (!cell_element) return;

    const cell = main_board[row][col];
    cell_element.textContent = formatNumber(cell.value);

    cell_element.className = "cell";

    if (cell.value !== 0) {
        cell_element.classList.add('filled');
        if (cell.locked) {
            cell_element.classList.add('locked');
        }
    }

    if (cell.marked) {
        cell_element.classList.add('marked');
    } else {
        cell_element.classList.remove('marked');
    }

    if (cell.value !== 0 && cell.value === current_number) {
        cell_element.classList.add('selected');
    } else {
        cell_element.classList.remove('selected');
    }

    if (cell.visible) {
        cell_element.classList.remove('invisible')
    } else {
        cell_element.classList.add('invisible');
    }
}
function update_number_completion() {
    document.querySelectorAll('.number-button:not(.restart-button)').forEach(button => {
        const num = parseInt(button.dataset.number);
        if (count_array[num] >= number_limit) {
            button.classList.add('completed-number');
        } else {
            button.classList.remove('completed-number');
        }
    });
}
function update_highlight() {
    document.querySelectorAll('.cell.highlighted').forEach(cell => {
        cell.classList.remove('highlighted');
    });

    if (current_number !== 0) {
        document.querySelectorAll('.cell.filled').forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            if (main_board[row][col].value === current_number) {
                cell.classList.add('highlighted');
            }
        });
    }
}
function update_number_buttons_selection() {
    document.querySelectorAll('.number-button:not(.mark-button)').forEach(btn => {
        btn.classList.remove('selected');
        if (parseInt(btn.dataset.number) === current_number) {
            btn.classList.add('selected');
        }
    });
}
function update_mark_button_selection() {
    if (mark_enabled) {
        document.getElementById('mark-btn').classList.add('selected');
        const flagIcon = document.getElementById('mark-flag');
        flagIcon.src = "Image/flag_black.png";
    } else {
        document.getElementById('mark-btn').classList.remove('selected');
        const flagIcon = document.getElementById('mark-flag');
        flagIcon.src = "Image/flag_white.png";
    }
}
function update_game_information() {
    const emptyCells = main_board.flat().filter(cell => cell.visible && cell.value === 0).length;
    document.getElementById('difficulty-info').textContent = emptyCells.toString();
}
function update_timer() {
    if (start_time) {
        const elapsed = (Date.now() - start_time) / 1000;
        document.getElementById('time-info').textContent = `${elapsed.toFixed(1)} s`;
    }
}
// Todo 2.4 - Message / Shortcuts
function show_end_message(solved) {
    const content = document.getElementById('end-message-content');

    content.innerHTML = '';

    const title = document.createElement('h2');
    title.style.textAlign = 'center';
    title.style.marginBottom = '-5px';
    title.textContent = solved ? 'Congratulations' : 'Error';

    const message = document.createElement('p');
    message.style.textAlign = 'center';
    message.style.fontSize = '16px';
    message.innerHTML = solved
        ? "You've successfully solved the Sudoku puzzle.<br> Click anywhere to close this message."
        : "You made a mistake in the puzzle, so that it can’t be solved anymore.<br> Click anywhere to close this message.";

    content.appendChild(title);
    content.appendChild(message);

    document.getElementById('end-message-modal').style.display = 'block';
}
function hide_end_message() {
    document.getElementById('end-message-modal').style.display = 'none';
}
function handle_keypress(event) {
    hide_end_message();

    const key = event.key.toLowerCase();
    if (key === 'escape') {
        hide_guide();
        close_all_sidebar_menus();
        document.getElementById('difficulty-input-container').style.display = 'none';
        document.getElementById('background-menu').style.display = 'none';
        shortcuts_enabled = true;
        return;
    }

    if (key === 'c') {
        toggle_sidebar();
        return;
    }

    if (!shortcuts_enabled) return;

    if (current_number !== 0) {
        switch (key) {
            case 'arrowleft':
                current_number = find_previous_number();
                break;
            case 'arrowright':
                current_number = find_next_number();
                break;
        }
        update_number_buttons_selection();
        update_highlight();
    }

    switch(key) {
        case 'r': start(); break;
        case 'm': change_mark_status(); break;
        case 's': solve(); break;
    }
}
// Todo 2.5 - Sidebar
function toggle_sidebar() {
    document.body.classList.toggle('sidebar-collapsed');
    localStorage.setItem('sidebarCollapsed', document.body.classList.contains('sidebar-collapsed').toString());

    close_all_sidebar_menus();
}
function toggle_background_dropdown() {
    const menu = document.getElementById('background-menu');
    menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
}
function toggle_guide() {
    document.getElementById('guide-modal').style.display = 'block';
}
function toggle_game_mode() {
    const modal = document.getElementById('game-modes-modal');
    modal.style.display = 'block';
    populate_game_mode();
    shortcuts_enabled = false;
}
function hide_modes_list() {
    document.getElementById('game-modes-modal').style.display = 'none';
    shortcuts_enabled = true;
}
function close_modes_list() {
    const modal = document.getElementById('game-modes-modal');
    if (event.target === modal) {
        hide_modes_list();
    }
}
function populate_game_mode() {
    const container = document.getElementById('game-modes-grid');
    container.innerHTML = '';

    const gameModes = Object.keys(GAME_COLLECTION);

    gameModes.forEach(mode => {
        const button = document.createElement('div');
        button.className = 'game-mode-button';
        if (mode === current_game_type) {
            button.classList.add('selected');
        }

        button.style.backgroundImage = GAME_COLLECTION[mode].ICON;
        button.style.backgroundSize = 'cover';

        button.textContent = mode.toString();
        button.onclick = function() {
            current_game_type = mode;
            document.getElementById('empty-cells-input').value = GAME_COLLECTION[mode].DEFAULT_EMPTY_CELLS;
            hide_modes_list();
            start();
        };
        container.appendChild(button);
    });
}
function hide_guide() {
    document.getElementById('guide-modal').style.display = 'none';
}
function close_guide(event) {
    const modal = document.getElementById('guide-modal');
    const content = modal.querySelector('.modal-content');
    if (!content.contains(event.target)) {
        hide_guide();
    }
}
function close_all_sidebar_menus() {
    document.getElementById('difficulty-input-container').style.display = 'none';
    document.getElementById('background-menu').style.display = 'none';
    shortcuts_enabled = true;
}



// < Part 3 - Init / Load >

// Todo 3.1 - Init Game / Load Monitor
document.addEventListener('DOMContentLoaded', function() {
    const savedCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (savedCollapsed) document.body.classList.add('sidebar-collapsed');

    const savedBg = localStorage.getItem('background');
    if (savedBg) { document.documentElement.style.setProperty('--background-url', `url("Background_Collection/${savedBg}")`); }
});
document.addEventListener('keydown', handle_keypress);
init_control_buttons();
start();