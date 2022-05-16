import { PieceConstant } from '../../utils/unicode-constants';
import { Color } from './color';
import { Point } from './point';

export abstract class Piece {
    point: Point;
    color: Color;
    constant: PieceConstant;
    checkPoints: Point[] = [];
    relValue: number;

    constructor(
        point: Point,
        color: Color,
        constant: PieceConstant,
        relValue: number,
    ) {
        this.color = color;
        this.constant = constant;
        this.point = point;
        this.relValue = relValue;
    }

    abstract getPossibleMoves(): Point[];

    abstract getPossibleCaptures(): Point[];

    abstract getCoveredFields(): Point[];
}
