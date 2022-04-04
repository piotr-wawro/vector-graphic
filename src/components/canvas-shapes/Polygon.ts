import Viewport from "components/canvas/Viewprot";
import Drawable from "./Drawable";
import Editable from "./Editable";
import Point2D from "./Point2D";

export default class Polygon implements Drawable, Editable {
    points: Array<Point2D>;
    color: string;
    lineWidth: number;

    pointRef: Point2D | null = null;

    constructor(start: Point2D, end: Point2D, color: string, lineWidth: number) {
        this.points = [start, end]
        this.color = color
        this.lineWidth = lineWidth
        this.pointRef = end;
    }

    pinSize(viewport: Viewport): number {
        return (5 + this.lineWidth/2) / viewport.zoom
    }

    isMouseOnPin(viewport: Viewport, event: MouseEvent): boolean {
        const mousePosition = viewport.getMousePosition(event)

        for(let point of this.points) {
            if(Math.pow(mousePosition.x! - point.x!, 2) + Math.pow(mousePosition.y! - point.y!, 2) < Math.pow(this.pinSize(viewport), 2)) {
                this.pointRef = point
                return true
            }
        }

        return false
    }

    edit(viewport: Viewport, event: MouseEvent): void {
        const contextTransform = viewport.canvas.getContext("2d")!.getTransform();

        this.pointRef!.x! += event.movementX / contextTransform.a
        this.pointRef!.y! += event.movementY / contextTransform.d
    }

    addPoint(point: Point2D): boolean {
        if(this.points[this.points.length - 2].x === point.x && this.points[this.points.length - 2].y === point.y) {
            this.points.pop()
            return false
        }
        else {
            this.points.push(point)
            this.pointRef = point

            return true
        }
    }

    draw(viewport: Viewport) {
        const context = viewport.canvas.getContext("2d")!

        context.save()
        context!.strokeStyle = this.color;
        context!.lineWidth = this.lineWidth/viewport.zoom;

        this.drawLine(viewport)
        this.drawPin(viewport)

        context.restore()
    }

    drawLine(viewport: Viewport) {
        const context = viewport.canvas.getContext("2d")!

        context.beginPath();
        context.moveTo(
            this.points[0].x! + viewport.x,
            this.points[0].y! + viewport.y
        );
        for(let point of this.points.slice(1)) {
            context.lineTo(
                point.x! + viewport.x,
                point.y! + viewport.y
            );
        }
        context.closePath()
        context.stroke();
    }

    drawPin(viewport: Viewport) {
        const context = viewport.canvas.getContext("2d")!

        context.save()
        context!.lineWidth = 1/viewport.zoom;

        for(let point of this.points) {
            context.beginPath();
            context.arc(
                point.x! + viewport.x,
                point.y! + viewport.y,
                this.pinSize(viewport),
                0,
                2*Math.PI*5
            )
            context.stroke();
        }

        context.restore()
    }
}
