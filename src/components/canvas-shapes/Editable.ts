import Viewport from "components/canvas/Viewprot"
import Point2D from "./Point2D"

export default interface Editable {
    pinSize(viewport: Viewport): number
    drawPin(viewport: Viewport): void
    isMouseOnPin(viewport: Viewport, event: MouseEvent): boolean
    edit(viewport: Viewport, event: MouseEvent): void
    addPoint(point: Point2D): boolean
}
