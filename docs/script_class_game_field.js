// script_class_game_field.js - 02.08.2025

class Game_Field {
    static CONFIG = {
        4: {
            SIZE : 4,
            SUBGRID_SIZE: 2,
        },
        9: {
            SIZE : 9,
            SUBGRID_SIZE: 3,
        },
        16: {
            SIZE : 16,
            SUBGRID_SIZE: 4,
        }
    };

    constructor({Main_Board, Size, Position} = {}) {
        const config = Game_Field.CONFIG[Size] || Game_Field.CONFIG[9];

        this.size = config.SIZE;
        this.subgrid_size = config.SUBGRID_SIZE;

        this.board = Main_Board;
        this.start_r = Position[0];
        this.start_c = Position[1];
        this.end_r = this.start_r + this.size;
        this.end_c = this.start_c + this.size;

        this.final_numbers_array = Array.from({ length: this.size }, (_, i) => i + 1);
    }

    // Part 1 - Game Logic
    solve_sudoku() {
        this.recursive_solve_sudoku();
        this.lock_solution();
    }
    recursive_solve_sudoku() {
        for (let absR = this.start_r; absR < this.end_r; absR++) {
            for (let absC = this.start_c; absC < this.end_c; absC++) {
                if (this.board[absR][absC].locked || this.board[absR][absC].value !== 0) {
                    continue;
                }
                for (const num of this.create_shuffled_array(this.final_numbers_array)) {
                    if (this.is_safe(absR, absC, num)) {
                        this.board[absR][absC].value = num;
                        if (this.recursive_solve_sudoku()) {
                            return true;
                        }
                        this.board[absR][absC].value = 0;
                    }
                }
                return false;
            }
        }
        return true;
    }
    lock_solution() {
        for (let absR = this.start_r; absR < this.end_r; absR++) {
            for (let absC = this.start_c; absC < this.end_c; absC++) {
                this.board[absR][absC].locked = true;
            }
        }
    }
    // Absolute - Relative Position
    to_absolute(relative_r, relative_c) {
        return [relative_r + this.start_r, relative_c + this.start_c];
    }
    to_relative(absolute_r, absolute_c) {
        return [absolute_r - this.start_r, absolute_c - this.start_c];
    }
    contains(absolute_r, absolute_c) {
        return absolute_r >= this.start_r && absolute_r < this.end_r
            && absolute_c >= this.start_c && absolute_c < this.end_c;
    }
    // Function List A - Begin
    is_safe(absR, absC, num) {
        if (!this.contains(absR, absC)) {
            return true;
        }

        const [relR, relC] = this.to_relative(absR, absC);
        return !this.used_in_row(relR, num) &&
            !this.used_in_col(relC, num) &&
            !this.used_in_box(absR - absR % this.subgrid_size, absC - absC % this.subgrid_size, num);
    }
    used_in_row(relR, num) {
        for (let relC = 0; relC < this.size; relC++) {
            const [absR, absC] = this.to_absolute(relR, relC);
            if (this.board[absR][absC].value === num) return true;
        }
        return false;
    }
    used_in_col(relC, num) {
        for (let relR = 0; relR < this.size; relR++) {
            const [absR, absC] = this.to_absolute(relR, relC);
            if (this.board[absR][absC].value === num) return true;
        }
        return false;
    }
    used_in_box(absBoxStartRow, absBoxStartCol, num) {
        for (let row = 0; row < this.subgrid_size; row++) {
            for (let col = 0; col < this.subgrid_size; col++) {
                if (this.board[row + absBoxStartRow][col + absBoxStartCol].value === num) return true;
            }
        }
        return false;
    }
    create_shuffled_array(array) {
        const shuffled = [...array];
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    find_conflict_cells(absR, absC, num) {
        const conflicts = [];
        if (!this.contains(absR, absC)) {
            return conflicts;
        }
        for (let c = this.start_c; c < this.end_c; c++) {
            if (c !== absC && this.board[absR][c].value === num) {
                conflicts.push([absR, c]);
            }
        }
        for (let r = this.start_r; r < this.end_r; r++) {
            if (r !== absR && this.board[r][absC].value === num) {
                conflicts.push([r, absC]);
            }
        }
        const boxStartRow = absR - (absR % this.subgrid_size);
        const boxStartCol = absC - (absC % this.subgrid_size);
        for (let r = boxStartRow; r < boxStartRow + this.subgrid_size; r++) {
            for (let c = boxStartCol; c < boxStartCol + this.subgrid_size; c++) {
                if (r !== absR && c !== absC && this.board[r][c].value === num) {
                    conflicts.push([r, c]);
                }
            }
        }
        return conflicts;
    }
    // Function List A - End

    // Function List B - Begin
    count_solutions(board_temp, count = 0) {
        for (let absR = this.start_r; absR < this.end_r; absR++) {
            for (let absC = this.start_c; absC < this.end_c; absC++) {
                if (board_temp[absR][absC].value === 0) {
                    for (let num = 1; num <= this.size && count < 2; num++) {
                        if (this.is_valid(board_temp, absR, absC, num)) {
                            board_temp[absR][absC].value = num;
                            count = this.count_solutions(board_temp, count);
                            board_temp[absR][absC].value = 0;
                        }
                    }
                    return count;
                }
            }
        }
        return count + 1;
    }
    is_valid(board, absR, absC, num) {
        if (!this.contains(absR, absC)) {
            return true;
        }

        const [relR, relC] = this.to_relative(absR, absC);
        return this.valid_in_row(board, relR, num)
            && this.valid_in_col(board, relC, num)
            && this.valid_in_box(board, absR - absR % this.subgrid_size, absC - absC % this.subgrid_size, num);
    }
    valid_in_row(board, relR, num) {
        for (let relC = 0; relC < this.size; relC++) {
            const [absR, absC] = this.to_absolute(relR, relC);
            if (board[absR][absC].value === num) return false;
        }
        return true;
    }
    valid_in_col(board, relC, num) {
        for (let relR = 0; relR < this.size; relR++) {
            const [absR, absC] = this.to_absolute(relR, relC);
            if (board[absR][absC].value === num) return false;
        }
        return true;
    }
    valid_in_box(board, absBoxStartRow, absBoxStartCol, num) {
        for (let row = 0; row < this.subgrid_size; row++) {
            for (let col = 0; col < this.subgrid_size; col++) {
                if (board[row + absBoxStartRow][col + absBoxStartCol].value === num) return false;
            }
        }
        return true;
    }
    // Function List B - End
}