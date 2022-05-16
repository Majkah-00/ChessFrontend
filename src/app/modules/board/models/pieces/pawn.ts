import { PieceConstant } from '../../utils/unicode-constants';
import { Color } from './color';
import { Piece } from './piece';
import { Point } from './point';
import { Board } from "../board";

export class Pawn extends Piece {
  isMovedAlready = false;

  constructor(
    point: Point,
    color: Color,
    constant: PieceConstant,
    private board: Board
  ) {
    super(point, color, constant, 1);
  }

  getPossibleMoves(): Point[] {
    const possiblePoints = [];
    const row = this.point.row;
    const col = this.point.col;

    if (this.board.isFieldEmpty(row - 1, col) && this.color === Color.WHITE) {
      possiblePoints.push(new Point(row - 1, col));

      if (
        !this.isMovedAlready &&
        this.board.isFieldEmpty(row - 2, col)
      ) {
        possiblePoints.push(new Point(row - 2, col));
      }
    }

    if (
      this.board.isFieldEmpty(row + 1, col) && this.color === Color.BLACK
    ) {
      possiblePoints.push(new Point(row + 1, col));

      if (
        !this.isMovedAlready &&
        this.board.isFieldEmpty(row + 2, col)
      ) {
        possiblePoints.push(new Point(row + 2, col));
      }
    }

    return possiblePoints;
  }

  getPossibleCaptures(): Point[] {
    const possiblePoints = [];
    const row = this.point.row;
    const col = this.point.col;

    if (
      (!this.board.reverted && this.color === Color.WHITE) ||
      (this.board.reverted && this.color === Color.BLACK)
    ) {
      if (
        this.board.isFieldTakenByEnemy(
          row - 1,
          col - 1,
          this.color === Color.WHITE ? Color.BLACK : Color.WHITE
        )
      ) {
        possiblePoints.push(new Point(row - 1, col - 1));
      }
      if (
        this.board.isFieldTakenByEnemy(
          row - 1,
          col + 1,
          this.color === Color.WHITE ? Color.BLACK : Color.WHITE
        )
      ) {
        possiblePoints.push(new Point(row - 1, col + 1));
      }
    } else {
      if (
        this.board.isFieldTakenByEnemy(
          row + 1,
          col - 1,
          this.color === Color.WHITE ? Color.BLACK : Color.WHITE
        )
      ) {
        possiblePoints.push(new Point(row + 1, col - 1));
      }
      if (
        this.board.isFieldTakenByEnemy(
          row + 1,
          col + 1,
          this.color === Color.WHITE ? Color.BLACK : Color.WHITE
        )
      ) {
        possiblePoints.push(new Point(row + 1, col + 1));
      }
    }

    return possiblePoints;
  }

  getCoveredFields(): Point[] {
    const possiblePoints = [];
    const row = this.point.row;
    const col = this.point.col;

    if (
      (!this.board.reverted && this.color === Color.WHITE) ||
      (this.board.reverted && this.color === Color.BLACK)
    ) {
      possiblePoints.push(new Point(row - 1, col - 1));

      possiblePoints.push(new Point(row - 1, col + 1));
    } else {
      possiblePoints.push(new Point(row + 1, col - 1));

      possiblePoints.push(new Point(row + 1, col + 1));
    }

    return possiblePoints;
  }
}
