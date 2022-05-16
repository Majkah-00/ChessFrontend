import { Piece } from "../../models/pieces/piece";
import { Injectable } from "@angular/core";
import { Point } from '../../models/pieces/point';
import { Color } from '../../models/pieces/color';
import { MoveUtils } from '../utils/move-utils';

@Injectable({providedIn: 'root'})
export class AvailableMoveDecorator {
  getPossibleMoves(piece: Piece, color: Color, pointClicked, board): Point[] {
    return piece
      .getPossibleMoves()
      .filter(
        (point) =>
          !MoveUtils.willMoveCauseCheck(
            color,
            pointClicked.row,
            pointClicked.col,
            point.row,
            point.col,
            board
          )
      );
  }

  getPossibleCaptures(piece: Piece, color: Color, pointClicked: Point, board): Point[] {
    return piece
      .getPossibleCaptures()
      .filter(
        (point) =>
          !MoveUtils.willMoveCauseCheck(
            color,
            pointClicked.row,
            pointClicked.col,
            point.row,
            point.col,
            board
          )
      );
  }
}
