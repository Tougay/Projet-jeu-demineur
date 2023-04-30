import { Component } from '@angular/core';

enum CellState {
  UNOPENED,
  OPENED,
  FLAGGED
}

enum CellContent {
  EMPTY,
  BOMB
}

interface Cell {
  state: CellState;
  content: CellContent;
  i: number;
  j: number;
}

const BOARD_SIZE = 30;
const NUM_BOMBS = 30;

@Component({
  selector: 'app-jeu-demineur',
templateUrl: './jeu-demineur.page.html',
styleUrls: ['./jeu-demineur.page.scss'],
})
export class JeuDemineurPage{
  board: Cell[][] = [];

  constructor() {
    this.resetBoard();
  }

  resetBoard(): void {
    this.board = [];

    for (let i = 0; i < BOARD_SIZE; i++) {
      const row = [];

      for (let j = 0; j < BOARD_SIZE; j++) {
        row.push({
          state: CellState.UNOPENED,
          content: CellContent.EMPTY,
          i: i,
          j: j
        });
      }

      this.board.push(row);
    }

    let bombsPlaced = 0;

    while (bombsPlaced < NUM_BOMBS) {
      const i = Math.floor(Math.random() * BOARD_SIZE);
      const j = Math.floor(Math.random() * BOARD_SIZE);

      if (this.board[i][j].content !== CellContent.BOMB) {
        this.board[i][j].content = CellContent.BOMB;
        bombsPlaced++;
      }
    }
  }

  getCellClass(cell: Cell): string {
    switch (cell.state) {
      case CellState.UNOPENED:
        return 'unopened';
      case CellState.OPENED:
        if (cell.content === CellContent.BOMB) {
          return 'bomb';
        } else {
          return 'opened';
        }
      case CellState.FLAGGED:
        return 'flagged';
    }
  }

  getCellContent(cell: Cell): string {
    switch (cell.state) {
      case CellState.UNOPENED:
        return '';
      case CellState.OPENED:
        if (cell.content === CellContent.BOMB) {
          return '💣';
        } else {
          const count = this.getAdjacentBombCount(cell);
          return count > 0 ? count.toString() : '';
        }
      case CellState.FLAGGED:
        return '🚩';
    }
  }

  handleCellClick(i: number, j: number): void {
    const cell = this.board[i][j];

    if (cell.state === CellState.UNOPENED) {
      if (cell.content === CellContent.BOMB) {
        this.gameOver();
      } else {
        this.openCell(cell);

        if (this.checkForWin()) {
          this.gameWon();
        }
      }
    }
  }

  gameOver(): void {
    alert('Game Over!');
    this.resetBoard();
  }

  gameWon(): void {
    alert('You Win!');
    this.resetBoard();
  }

  openCell(cell: Cell): void {
    cell.state = CellState.OPENED;


  }

  openAdjacentCells(cell: Cell): void {
    const adjacentCells = this.getAdjacentCells(cell);

    for (const adjacentCell of adjacentCells) {
      if (adjacentCell.state === CellState.UNOPENED) {
        this.openCell(adjacentCell);
      }
    }
  }
  getAdjacentCells(cell: Cell): Cell[] {
    const adjacentCells: Cell[] = [];
    const row = this.board[cell.i];

    for (let i = Math.max(cell.i - 1, 0); i <= Math.min(cell.i + 1, BOARD_SIZE - 1); i++) {
      for (let j = Math.max(cell.j - 1, 0); j <= Math.min(cell.j + 1, BOARD_SIZE - 1); j++) {
        if (i === cell.i && j === cell.j) {
          continue;
        }

        adjacentCells.push(this.board[i][j]);
      }
    }

    return adjacentCells;
  }

  getAdjacentBombCount(cell: Cell): number {
    return this.getAdjacentCells(cell).filter(adjacentCell => adjacentCell.content === CellContent.BOMB).length;
  }

  checkForWin(): boolean {
    let numUnopenedCells = 0 ;

    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        const cell = this.board[i][j];

        if (cell.state === CellState.UNOPENED || (cell.state === CellState.FLAGGED && cell.content !== CellContent.BOMB)) {
          numUnopenedCells++;
        }
      }
    }

    return numUnopenedCells === NUM_BOMBS;
  }

  handleRightClick(event: MouseEvent, cell: Cell): void {
    event.preventDefault();

    if (cell.state === CellState.UNOPENED) {
      cell.state = CellState.FLAGGED;
    } else if (cell.state === CellState.FLAGGED) {
      cell.state = CellState.UNOPENED;
    }
  }
}

