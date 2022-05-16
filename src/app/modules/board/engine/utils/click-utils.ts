import { Point } from '../../models/pieces/point';

export class ClickUtils {

  static getClickPoint(
    event: any,
    top: number,
    height: number,
    left: number,
    width: number
  ) {
    return new Point(
      Math.floor((event.y - top) / (height / 8)),
      Math.floor((event.x - left) / (width / 8)
      )
    );
  }
}
