import { useEffect, useRef, useState } from 'react';

import { useAppSelector } from 'app/hooks';
import { selectBrushSize, selectColor, selectTool, Tool } from 'components/toolbox/toolboxSlice';

import styles from './Canvas.module.css';
import Viewport from './Viewprot';
import Editable from 'components/canvas-shapes/Editable';
import Drawable from 'components/canvas-shapes/Drawable';
import Line from 'components/canvas-shapes/Line';
import Rectangle from 'components/canvas-shapes/Rectangle';
import Ellipse from 'components/canvas-shapes/Ellipse';
import Path from 'components/canvas-shapes/Path';
import Polygon from 'components/canvas-shapes/Polygon';

interface CanvasData {
    newObject: Drawable & Editable | null;
    viewport: Viewport | null;
    drawableElements: Array<Editable & Drawable>;
}

const Canvas = () => {
    const canvas = useRef<HTMLCanvasElement | null>(null)
    const requestRef = useRef<number>();

    const color = useAppSelector(selectColor);
    const brushSize = useAppSelector(selectBrushSize);
    const tool = useAppSelector(selectTool);

    const [canvasData, setCanvasData] = useState<CanvasData>({
        newObject: null,
        viewport: null,
        drawableElements: [],
    })

    let mainLoop = () => {
        updateCanvas();
        requestRef.current = requestAnimationFrame(mainLoop);
    }

    let isDrawable = (object: Drawable | Editable): object is Drawable => {
        if((object as Drawable).draw === undefined) return false

        return true
    }

    let isEditable = (object: Drawable | Editable): object is Editable => {
        if((object as Editable).drawPin      === undefined) return false
        if((object as Editable).edit         === undefined) return false
        if((object as Editable).isMouseOnPin === undefined) return false
        if((object as Editable).pinSize      === undefined) return false

        return true
    }

    let updateCanvas = () => {
        const context = canvas.current!.getContext("2d");
        const contextTransform = context!.getTransform();

        context!.clearRect(0, 0, canvas.current!.width / contextTransform.a, canvas.current!.height / contextTransform.d);

        canvasData.drawableElements.forEach((e) => {
            if(isDrawable(e)) {
                e.draw(canvasData.viewport!)
            }
        });
        canvasData.newObject?.draw(canvasData.viewport!)
    }

    useEffect(() => {
        const handleMouseWheel = (event: WheelEvent) => {
            canvasData.viewport!.zoomViewport(event);
        }

        canvas.current!.addEventListener('wheel', handleMouseWheel)
        return () => {canvas.current!.removeEventListener('wheel', handleMouseWheel)}
    }, [])

    useEffect(() => {
        const handleMouseDown = (event: MouseEvent) => {
            let mousePositionStart = canvasData.viewport!.getMousePosition(event)
            let mousePositionEnd = canvasData.viewport!.getMousePosition(event)

            if(event.button === 0) {
                if(canvasData.newObject !== null) {
                    const continueDrawing = canvasData.newObject.addPoint(mousePositionStart)
                    if(continueDrawing === false) {
                        canvasData.drawableElements.push(canvasData.newObject)
                        canvasData.newObject = null
                    }
                }
                else if(tool === Tool.hand) {
                    for(let e of canvasData.drawableElements) {
                        if(e.isMouseOnPin(canvasData.viewport!, event)) {
                            canvasData.newObject = e
                            break
                        }
                    };
                }
                else if(tool === Tool.line) {
                    canvasData.newObject = new Line(mousePositionStart, mousePositionEnd, color, brushSize)
                }
                else if(tool === Tool.rectangle) {
                    canvasData.newObject = new Rectangle(mousePositionStart, mousePositionEnd, color, brushSize)
                }
                else if(tool === Tool.ellipse) {
                    canvasData.newObject = new Ellipse(mousePositionStart, mousePositionEnd, color, brushSize)
                }
                else if(tool === Tool.path) {
                    canvasData.newObject = new Path(mousePositionStart, mousePositionEnd, color, brushSize)
                }
                else if(tool === Tool.plygon) {
                    canvasData.newObject = new Polygon(mousePositionStart, mousePositionEnd, color, brushSize)
                }
            }
            if(event.buttons === 2) {
                canvasData.newObject = null
            }
        }

        canvas.current!.addEventListener('mousedown', handleMouseDown)
        return () => {canvas.current!.removeEventListener('mousedown', handleMouseDown)}
    }, [tool, color, brushSize])

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if(tool === Tool.hand) {
                if(event.buttons === 1) {
                    canvasData.newObject?.edit(canvasData.viewport!, event)
                }
            }
            else {
                canvasData.newObject?.edit(canvasData.viewport!, event)
            }
            if(event.buttons === 4) {
                canvasData.viewport!.dragViewport(event)
            }
        }

        canvas.current!.addEventListener('mousemove', handleMouseMove)
        return () => {canvas.current!.removeEventListener('mousemove', handleMouseMove)}
    }, [tool, color, brushSize])

    useEffect(() => {
        const handleMouseUp = (event: MouseEvent) => {
            if(tool === Tool.hand) {
                if(event.button === 0) {
                    canvasData.newObject = null
                }
            }
        }

        canvas.current!.addEventListener('mouseup', handleMouseUp)
        return () => {canvas.current!.removeEventListener('mouseup', handleMouseUp)}
    }, [tool])

    useEffect(() => {
        const handleResize = () => {
            canvas.current!.width = canvas.current!.clientWidth;
            canvas.current!.height = canvas.current!.clientHeight;

            const context = canvas.current!.getContext('2d')
            context!.scale(canvasData.viewport!.zoom, canvasData.viewport!.zoom);
        }

        window.addEventListener('resize', handleResize)
        return () => {window.removeEventListener('resize', handleResize)}
    }, [])

    useEffect(() => {
        const handleContextmenu = (event: MouseEvent) => {
            event.preventDefault()
        }

        canvas.current!.addEventListener('contextmenu', handleContextmenu)
        return () => {canvas.current!.removeEventListener('contextmenu', handleContextmenu)}
    }, [])

    useEffect(() => {
        canvas.current!.width = canvas.current!.clientWidth;
        canvas.current!.height = canvas.current!.clientHeight;

        const context = canvas.current!.getContext('2d');
        context!.lineCap = 'round';
        canvasData.viewport = new Viewport(canvas.current!);
    }, [])

    useEffect(() => {
        requestRef.current = requestAnimationFrame(mainLoop);
        return () => cancelAnimationFrame(requestRef.current!);
    }, [])

    return (
        <canvas id={styles.canvas} ref={canvas}/>
    )
}

export default Canvas