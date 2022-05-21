import { Injectable } from "@angular/core";
import { Point } from "../models/pieces/point";

import { Board } from "../models/board";
import { Piece } from "../models/pieces/piece";
import { Color } from "../models/pieces/color";
import { AvailableMoveDecorator } from "./piece-decorator/available-move-decorator";
import { Pawn } from '../models/pieces/pawn';
import { Bot } from './ai/bot';
import { MoveUtils } from './utils/move-utils';
import { HistoryMove } from './utils/history-move';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../services/game.service';
import { StateService } from '../services/state.service';

// TODO logika ruchow, zapis do plików etc...
@Injectable({
  providedIn: 'root'
})
export class EngineFacade {
  readonly defaultXCoords: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  readonly defaultYCoords: number[] = [8, 7, 6, 5, 4, 3, 2, 1];

  moveDone: boolean;
  disabling = false;
  selected = false;
  lightDisabled: boolean;
  darkDisabled: boolean;
  gameId: string;

  constructor(
    private board: Board,
    private availableMoveDecorator: AvailableMoveDecorator,
    private bot: Bot,
    private activatedRoute: ActivatedRoute,
    private gameService: GameService,
    private stateService: StateService,
  ) {
  }

  onMouseDown(event: MouseEvent, pointClicked: Point) {
    this.moveDone = false;
    const pieceClicked = this.board.getPieceByPoint(
      pointClicked.row,
      pointClicked.col
    );

    if (!this.stateService.gameId.value) {
      if (this.selected) { //czy kliknelismy w jakas figure
        this.handleClickEvent(pointClicked); //wykonanie ruchu
      } else {
        if (pieceClicked) {
          this.onPieceClicked(pieceClicked, pointClicked); //wyznaczanie ruchow i bic
        }
      }
    } else {
      if (this.stateService.isYourTurn.value) {
        if (this.selected) {
          this.handleClickEvent(pointClicked);
        } else {
          if (pieceClicked) {
            this.onPieceClicked(pieceClicked, pointClicked);
          }
        }
      }
    }
  }

  onPieceClicked(pieceClicked, pointClicked) {
    if (
      (this.board.currentWhitePlayer && pieceClicked.color === Color.BLACK) ||
      (!this.board.currentWhitePlayer && pieceClicked.color === Color.WHITE)
    ) {
      return;
    }

    this.prepareActivePiece(pieceClicked, pointClicked);
  }

  prepareActivePiece(pieceClicked: Piece, pointClicked: Point) {
    this.board.activePiece = pieceClicked;
    this.selected = true;
    this.board.possibleCaptures = this.availableMoveDecorator.getPossibleCaptures(
      pieceClicked,
      this.board.currentWhitePlayer ? Color.WHITE : Color.BLACK,
      pointClicked,
      this.board
    );
    this.board.possibleMoves = this.availableMoveDecorator.getPossibleMoves(
      pieceClicked,
      this.board.currentWhitePlayer ? Color.WHITE : Color.BLACK,
      pointClicked,
      this.board
    )
  }

  handleClickEvent(pointClicked: Point) {
    let moving = false;
    if ((
      this.board.isPointInPossibleMoves(pointClicked) ||
      this.board.isPointInPossibleCaptures(pointClicked)
    ) && pointClicked.isInRange()) {
      this.movePiece(this.board.activePiece, pointClicked);
    }

    this.disableSelection();
    const pieceClicked = this.board.getPieceByPoint(
      pointClicked.row,
      pointClicked.col
    );
    if (pieceClicked && !moving) {
      this.onPieceClicked(pieceClicked, pointClicked);
    }
  }

  disableSelection() {
    this.selected = false;
    this.board.activePiece = null;
    this.board.possibleMoves = [];
  }

  async movePiece(toMovePiece: Piece, newPoint: Point) {
    const destPiece = this.board.pieces.find(
      (piece) =>
        piece.point.col === newPoint.col &&
        piece.point.row === newPoint.row
    );

    if (destPiece && toMovePiece.color !== destPiece.color) {
      this.board.pieces = this.board.pieces.filter(
        (piece) => piece !== destPiece
      );
    } else {
      if (destPiece && toMovePiece.color === destPiece.color) {
        return;
      }
    }

    const move = new HistoryMove(
      MoveUtils.format(toMovePiece.point, newPoint, this.board.reverted),
      toMovePiece.constant.name,
      toMovePiece.color === Color.WHITE ? 'white' : 'black',
      !!destPiece
    );

    console.log(move)
    this.stateService.history.next([...this.stateService.history.value, move])

    if (this.stateService.gameId.value) { //sprawdzamy czy jest to gra przez siec
      this.gameService.move(move.move).subscribe() //request na be z ruchem
    }


    console.log(this.bot.playerlastmove)
    if (this.bot.gameId != null && this.bot.playerlastmove === false) { //ruch bota
      this.bot.playerlastmove = true;
      this.bot.makeMoove(move.move, this);
    }

    toMovePiece.point = newPoint;
    this.board.currentWhitePlayer = !this.board.currentWhitePlayer; //zmiana zawodnika

    if (!this.checkForPawnPromote(toMovePiece)) {
      this.afterMoveActions();
    }
  }

  afterMoveActions() { //czy szach
    this.board.blackKingChecked = this.board.isKingInCheck(
      Color.BLACK,
      this.board.pieces
    );
    this.board.whiteKingChecked = this.board.isKingInCheck(
      Color.WHITE,
      this.board.pieces
    );

    this.disabling = false;
    this.moveDone = true;
  }

  checkForPawnPromote(toPromotePiece: Piece): any { //co by za plansze nie wylazlo
    if (!(toPromotePiece instanceof Pawn)) {
      return;
    }

    if (toPromotePiece.point.row === 0 || toPromotePiece.point.row === 7) {
      this.board.pieces = this.board.pieces.filter(
        (piece) => piece !== toPromotePiece
      );

      this.afterMoveActions();
      return true;
    }
  }

  public move(coords: string) {
    console.log(coords)
    if (coords) {
      const sourceIndexes = MoveUtils.translateCoordsToIndex(
        coords.substring(0, 2),
        this.board.reverted
      );

      const destIndexes = MoveUtils.translateCoordsToIndex(
        coords.substring(2, 4),
        this.board.reverted
      );
      console.log(sourceIndexes)
      const srcPiece = this.board.getPieceByPoint(
        sourceIndexes.yAxis,
        sourceIndexes.xAxis
      );

      console.log(srcPiece)

      if (srcPiece) {
        if (
          (this.board.currentWhitePlayer &&
            srcPiece.color === Color.BLACK) ||
          (!this.board.currentWhitePlayer &&
            srcPiece.color === Color.WHITE)
        ) {
          return;
        }

        this.prepareActivePiece(srcPiece, srcPiece.point);

        if (
          this.board.isPointInPossibleMoves(
            new Point(destIndexes.yAxis, destIndexes.xAxis)
          ) ||
          this.board.isPointInPossibleCaptures(
            new Point(destIndexes.yAxis, destIndexes.xAxis)
          )
        ) {
          // this.saveClone();
          this.movePiece(
            srcPiece,
            new Point(destIndexes.yAxis, destIndexes.xAxis)
          );

          console.log(coords)

          // this.board.lastMoveSrc = new Point(
          //   sourceIndexes.yAxis,
          //   sourceIndexes.xAxis
          // );
          // this.board.lastMoveDest = new Point(
          //   destIndexes.yAxis,
          //   destIndexes.xAxis
          // );

          this.disableSelection();
        } else {
          this.disableSelection();
        }
      }
    }
  }
}
