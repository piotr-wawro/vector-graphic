import Point2D from './Point2D';
import Viewport from './Viewprot';

export interface Drawable {
    draw(viewport: Viewport): void
}

export class Line implements Drawable {
    start: Point2D;
    end: Point2D;

    constructor(start: Point2D, end: Point2D) {
        this.start = start
        this.end = end
    }

    draw(viewport: Viewport ) {
        const context = viewport.canvas.getContext("2d")!

        context.beginPath();
        context.moveTo(
            this.start.x! + viewport.x,
            this.start.y! + viewport.y
        );
        context.lineTo(
            this.end.x! + viewport.x,
            this.end.y! + viewport.y
        );
        context.stroke();
    }
}