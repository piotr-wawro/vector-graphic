import Viewport from "components/canvas/Viewprot";
import Drawable from "./Drawable";
import Editable from "./Editable";
import Point2D from "./Point2D";

export default class Line implements Drawable, Editable {
    start: Point2D;
    end: Point2D;
    color: string;
    lineWidth: number;

    pointRef: Point2D | null = null;

    constructor(start: Point2D, end: Point2D, color: string, lineWidth: number) {
        this.start = start
        this.end = end
        this.color = color
        this.lineWidth = lineWidth
    }

    pinSize(viewport: Viewport): number {
        return (5 + this.lineWidth/2) / viewport.zoom
    }

    isMouseOnPin(viewport: Viewport, event: MouseEvent): boolean {
        const mousePosition = viewport.getMousePosition(event)

        if(Math.pow(mousePosition.x! - this.start.x!, 2) + Math.pow(mousePosition.y! - this.start.y!, 2) < Math.pow(this.pinSize(viewport), 2)) {
            this.pointRef = this.start
            return true
        }
        if(Math.pow(mousePosition.x! - this.end.x!, 2) + Math.pow(mousePosition.y! - this.end.y!, 2) < Math.pow(this.pinSize(viewport), 2)) {
            this.pointRef = this.end
            return true
        }

        return false
    }

    edit(viewport: Viewport, event: MouseEvent): void {
        const contextTransform = viewport.canvas.getContext("2d")!.getTransform();

        this.pointRef!.x! += event.movementX / contextTransform.a
        this.pointRef!.y! += event.movementY / contextTransform.d
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
            this.start.x! + viewport.x,
            this.start.y! + viewport.y
        );
        context.lineTo(
            this.end.x! + viewport.x,
            this.end.y! + viewport.y
        );
        context.stroke();
    }

    drawPin(viewport: Viewport) {
        const context = viewport.canvas.getContext("2d")!

        context.save()
        context!.lineWidth = 1/viewport.zoom;

        context.beginPath();
        context.arc(
            this.start.x! + viewport.x,
            this.start.y! + viewport.y,
            this.pinSize(viewport),
            0,
            2*Math.PI*5
        )
        context.stroke();
        
        context.beginPath();
        context.arc(
            this.end.x! + viewport.x,
            this.end.y! + viewport.y,
            this.pinSize(viewport),
            0,
            2*Math.PI*5
        )
        context.stroke();

        context.restore()
    }
}
