import Point2D from "../canvas-shapes/Point2D";

class Viewport {
    private _x: number = 0;
    private _y: number = 0;
    private _zoom: number = 1;
    private _canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this._x = 0;
        this._y = 0;
        this._zoom = 1;
        this._canvas = canvas
    }

    public get x(): number {
        return this._x
    }

    public get y(): number {
        return this._y
    }

    public get zoom(): number {
        return this._zoom
    }

    public get canvas(): HTMLCanvasElement {
        return this._canvas
    }

    public getMousePosition(event: MouseEvent): Point2D {
        const contextTransform = this._canvas.getContext("2d")!.getTransform();
        return {
            x: event.offsetX / contextTransform.a - this._x,
            y: event.offsetY / contextTransform.d - this._y,
        };
    }

    public dragViewport(event: MouseEvent): void {
        const contextTransform = this._canvas.getContext("2d")!.getTransform();
        this._x += event.movementX / contextTransform.a;
        this._y += event.movementY / contextTransform.d;
    }

    public zoomViewport(event: WheelEvent): void {
        const context = this._canvas.getContext("2d");

        const mouseStart = this.getMousePosition(event);

        if (event.deltaY > 0) {
            context!.scale(0.5, 0.5);
            this._zoom *= 0.5;
        } else {
            context!.scale(2, 2);
            this._zoom *= 2;
        }

        const mouseEnd = this.getMousePosition(event);

        this._x += mouseEnd.x! - mouseStart.x!;
        this._y += mouseEnd.y! - mouseStart.y!;
    }
}

export default Viewport
