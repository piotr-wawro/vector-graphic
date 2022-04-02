import { useEffect, useRef, useState } from 'react';

import { useAppSelector } from 'app/hooks';
import { selectBrushSize, selectColor, selectTool, Tool } from 'components/Toolbox/toolboxSlice';

import styles from './Canvas.module.css';
import Viewport from './Viewprot';
import Point2D from './Point2D';
import { Drawable, Editable, Line } from './Drawable';

interface CanvasData {
    mousePointStart: Point2D;
    mousePointEnd: Point2D;
    newObject: Drawable | null;
    refToEditedObject: Editable | null;
    viewport: Viewport | null;
    drawableElements: Array<Editable | Drawable>;
}

const Canvas = () => {
    const canvas = useRef<HTMLCanvasElement | null>(null)
    const requestRef = useRef<number>();

    const color = useAppSelector(selectColor);
    const brushSize = useAppSelector(selectBrushSize);
    const tool = useAppSelector(selectTool);

    const [canvasData, setCanvasData] = useState<CanvasData>({
        mousePointStart: {x: null, y: null},
        mousePointEnd: {x: null, y: null},
        newObject: null,
        refToEditedObject: null,
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
            if(event.button == 0) {
                if(tool == Tool.line) {
                    canvasData.mousePointStart = canvasData.viewport!.getMousePosition(event)
                    canvasData.mousePointEnd = canvasData.viewport!.getMousePosition(event)
                    canvasData.newObject = new Line(canvasData.mousePointStart, canvasData.mousePointEnd, color, brushSize)
                }
                else if(tool == Tool.hand) {
                    for(let e of canvasData.drawableElements) {
                        if(isEditable(e)) {
                            if(e.isMouseOnPin(canvasData.viewport!, event)) {
                                canvasData.refToEditedObject = e
                                break
                            }
                        }
                    };
                }
            }
        }

        canvas.current!.addEventListener('mousedown', handleMouseDown)
        return () => {canvas.current!.removeEventListener('mousedown', handleMouseDown)}
    }, [tool, color, brushSize])

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if(event.buttons == 1) {
                canvasData.mousePointEnd = canvasData.viewport!.getMousePosition(event)

                if(tool == Tool.line) {
                    canvasData.newObject = new Line(canvasData.mousePointStart, canvasData.mousePointEnd, color, brushSize)
                }
                if(tool == Tool.hand) {
                    canvasData.refToEditedObject?.edit(canvasData.viewport!, event)
                }
            }
            if(event.buttons == 2) {
                canvasData.viewport!.dragViewport(event)
            }
        }

        canvas.current!.addEventListener('mousemove', handleMouseMove)
        return () => {canvas.current!.removeEventListener('mousemove', handleMouseMove)}
    }, [tool, color, brushSize])

    useEffect(() => {
        const handleMouseUp = (event: MouseEvent) => {
            if(event.button == 0) {
                canvasData.mousePointStart = {x: null, y: null}
                canvasData.mousePointEnd = {x: null, y: null}

                if(tool == Tool.line) {
                    canvasData.drawableElements.push(canvasData.newObject!)
                }
                if(tool == Tool.hand) {
                    canvasData.refToEditedObject = null
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