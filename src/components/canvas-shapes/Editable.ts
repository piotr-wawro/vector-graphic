import Viewport from "components/canvas/Viewprot"

export default interface Editable {
    pinSize(viewport: Viewport): number
    drawPin(viewport: Viewport): void
    isMouseOnPin(viewport: Viewport, event: MouseEvent): boolean
    edit(viewport: Viewport, event: MouseEvent): void
}
