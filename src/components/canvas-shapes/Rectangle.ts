import Viewport from "components/canvas/Viewprot";
import Drawable from "./Drawable";
import Editable from "./Editable";
import Point2D from "./Point2D";

export default class Rectangle implements Drawable, Editable {
    leftUp: Point2D;
    rightDown: Point2D;
    color: string;
    lineWidth: number;

    pointRef: Point2D | null = null;

    constructor(leftUp: Point2D, rightEnd: Point2D, color: string, lineWidth: number) {
        this.leftUp = leftUp
        this.rightDown = rightEnd
        this.color = color
        this.lineWidth = lineWidth
        this.pointRef = rightEnd
    }

    pinSize(viewport: Viewport): number {
        return (5 + this.lineWidth/2) / viewport.zoom
    }

    isMouseOnPin(viewport: Viewport, event: MouseEvent): boolean {
        const mousePosition = viewport.getMousePosition(event)

        if(Math.pow(mousePosition.x! - this.leftUp.x!, 2) + Math.pow(mousePosition.y! - this.leftUp.y!, 2) < Math.pow(this.pinSize(viewport), 2)) {
            this.pointRef = this.leftUp
            return true
        }
        if(Math.pow(mousePosition.x! - this.rightDown.x!, 2) + Math.pow(mousePosition.y! - this.rightDown.y!, 2) < Math.pow(this.pinSize(viewport), 2)) {
            this.pointRef = this.rightDown
            return true
        }

        return false
    }

    edit(viewport: Viewport, event: MouseEvent): void {
        const contextTransform = viewport.canvas.getContext("2d")!.getTransform();

        this.pointRef!.x! += event.movementX / contextTransform.a
        this.pointRef!.y! += event.movementY / contextTransform.d
    }

    addPoint(point: Point2D) {
        return false
    }

    draw(viewport: Viewport) {
        const context = viewport.canvas.getContext("2d")!

        context.save()
        context!.strokeStyle = this.color;
        context!.lineWidth = this.lineWidth/viewport.zoom;

        this.drawRect(viewport)
        this.drawPin(viewport)

        context.restore()
    }

    drawRect(viewport: Viewport) {
        const context = viewport.canvas.getContext("2d")!

        context.beginPath();
        context.rect(
            this.leftUp.x! + viewport.x,
            this.leftUp.y! + viewport.y,
            this.rightDown.x! - this.leftUp.x!,
            this.rightDown.y! - this.leftUp.y!
        );
        context.stroke();
    }

    drawPin(viewport: Viewport) {
        const context = viewport.canvas.getContext("2d")!

        context.save()
        context!.lineWidth = 1/viewport.zoom;

        context.beginPath();
        context.arc(
            this.leftUp.x! + viewport.x,
            this.leftUp.y! + viewport.y,
            this.pinSize(viewport),
            0,
            2*Math.PI*5
        )
        context.stroke();
        
        context.beginPath();
        context.arc(
            this.rightDown.x! + viewport.x,
            this.rightDown.y! + viewport.y,
            this.pinSize(viewport),
            0,
            2*Math.PI*5
        )
        context.stroke();

        context.restore()
    }
}
