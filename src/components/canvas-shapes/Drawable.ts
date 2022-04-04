import Viewport from '../canvas/Viewprot';

export default interface Drawable {
    draw(viewport: Viewport): void
}
