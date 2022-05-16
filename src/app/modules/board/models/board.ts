import { Piece } from './pieces/piece';
import { Injectable } from "@angular/core";
import { DefaultPiecesLoader } from "../engine/board-loader/default-pieces-loader";
import { Point } from "./pieces/point";
import { Color } from './pieces/color';
import { King } from './pieces/king';

@Injectable({
  providedIn: "root"
})
export class Board {
  board: number[][] = [];
  pieces: Piece[] = [];
  activePiece: Piece;
  currentWhitePlayer = true;
  possibleMoves: Point[] = [];
  possibleCaptures: any[] = [];
  reverted = false;

  whiteKingChecked: boolean;
  blackKingChecked: boolean;

  constructor() {
    // generacja szachownicy
    for (let i = 0; i < 8; ++i) {
      this.board[i] = [];
      for (let j = 0; j < 8; ++j) {
        this.board[i][j] = 0;
      }
    }
    // dodanie pionkow
    this.pieces = DefaultPiecesLoader.loadDefaultPieces(this);
  }

  public getPieceByPoint(row: number, col: number): Piece {
    row = Math.floor(row);
    col = Math.floor(col);
    return this.pieces.find(
      (piece) => piece.point.col === col && piece.point.row === row
    );
  }

  isFieldEmpty(row: number, col: number): boolean {
    if (row > 7 || row < 0 || col > 7 || col < 0) {
      return false;
    }
    return !this.pieces.some((piece) => piece.point.col === col && piece.point.row === row);
  }

  getPieceByField(row: number, col: number): Piece {
    if (this.isFieldEmpty(row, col)) {
      return undefined;
    }

    return this.pieces.find((piece) => piece.point.col === col && piece.point.row === row);
  }

  isPointInPossibleMoves(point: Point): boolean {
    return this.possibleMoves.some((move) => move.row === point.row && move.col === point.col);
  }

  isXYInActiveMove(i: number, j: number) {
    return this.activePiece && this.activePiece.point.row === i && this.activePiece.point.col === j;
  }

  isXYInPossibleMoves(row: number, col: number): boolean {
    return this.possibleMoves.some((move) => move.row === row && move.col === col);
  }

  isFieldTakenByEnemy(row: number, col: number, enemyColor: Color): boolean {
    if (row > 7 || row < 0 || col > 7 || col < 0) {
      return false;
    }
    return this.pieces.some(
      (piece) => piece.point.col === col && piece.point.row === row && piece.color === enemyColor
    );
  }

  isFieldUnderAttack(row: number, col: number, color: Color) {
    return this.pieces
      .filter((piece) => piece.color === color)
      .some((piece) => piece.getCoveredFields().some((field) => field.col === col && field.row === row));
  }

  isKingInCheck(color: Color, pieces: Piece[]): boolean {
    const king = pieces.find((piece) => piece.color === color && piece instanceof King);

    if (king) {
      return pieces.some(
        (piece) =>
          piece
            .getPossibleCaptures()
            .some((point) => point.col === king.point.col && point.row === king.point.row) &&
          piece.color !== color
      );
    }
    return false;
  }

  isXYInPossibleCaptures(row: number, col: number): boolean {
    return this.possibleCaptures.some((capture) => capture.row === row && capture.col === col);
  }

  isKingChecked(piece: Piece): any {
    if (piece instanceof King) {
      return piece.color === Color.WHITE
        ? this.whiteKingChecked
        : this.blackKingChecked;
    }
  }

  isPointInPossibleCaptures(point: Point): boolean {
    return this.possibleCaptures.some((capture) => capture.row === point.row && capture.col === point.col);
  }
}
