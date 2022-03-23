import { useEffect, useRef, useState } from 'react';

import { useAppSelector } from 'app/hooks';
import { selectBrushSize, selectColor, selectTool, Tool } from 'components/Toolbox/toolboxSlice';

import styles from './Canvas.module.css';
import Viewport from './Viewprot';
import Point2D from './Point2D';
import { Drawable, Line } from './Drawable';

interface CanvasData {
    mousePointStart: Point2D;
    mousePointEnd: Point2D;
    newObject: Drawable | null;
    viewport: Viewport | null;
    drawableElements: Array<Drawable>;
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
        viewport: null,
        drawableElements: [],
    })

    let mainLoop = () => {
        updateCanvas();
        requestRef.current = requestAnimationFrame(mainLoop);
    }

    let updateCanvas = () => {
        const context = canvas.current!.getContext("2d");
        const contextTransform = context!.getTransform();

        context!.clearRect(0, 0, canvas.current!.width / contextTransform.a, canvas.current!.height / contextTransform.d);

        canvasData.drawableElements.forEach((e) => {
            e.draw(canvasData.viewport!)
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
                canvasData.mousePointStart = canvasData.viewport!.getMousePosition(event)
                canvasData.mousePointEnd = canvasData.viewport!.getMousePosition(event)

                if(tool == Tool.line) {
                    canvasData.newObject = new Line(canvasData.mousePointStart, canvasData.mousePointEnd)
                }
            }
        }

        canvas.current!.addEventListener('mousedown', handleMouseDown)
        return () => {canvas.current!.removeEventListener('mousedown', handleMouseDown)}
    }, [tool])

    useEffect(() => {
        const handleMouseUp = (event: MouseEvent) => {
            if(event.button == 0) {
                canvasData.mousePointStart = {x: null, y: null}
                canvasData.mousePointEnd = {x: null, y: null}

                canvasData.drawableElements.push(canvasData.newObject!)
            }
        }

        canvas.current!.addEventListener('mouseup', handleMouseUp)
        return () => {canvas.current!.removeEventListener('mouseup', handleMouseUp)}
    }, [])

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if(event.buttons == 1) {
                canvasData.mousePointEnd = canvasData.viewport!.getMousePosition(event)

                if(tool == Tool.line) {
                    canvasData.newObject = new Line(canvasData.mousePointStart, canvasData.mousePointEnd)
                }
            }
            if(event.buttons == 2) {
                canvasData.viewport!.dragViewport(event)
            }
        }

        canvas.current!.addEventListener('mousemove', handleMouseMove)
        return () => {canvas.current!.removeEventListener('mousemove', handleMouseMove)}
    }, [])

    useEffect(() => {
        const handleResize = () => {
            canvas.current!.width = canvas.current!.clientWidth;
            canvas.current!.height = canvas.current!.clientHeight;

            canvas.current!.getContext('2d')!.scale(canvasData.viewport!.zoom, canvasData.viewport!.zoom);
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

    useEffect(() => {
        const context = canvas.current!.getContext('2d')
        context!.strokeStyle = color
    }, [color])

    useEffect(() => {
        const context = canvas.current!.getContext('2d')
        context!.lineWidth = brushSize
    }, [brushSize])

    return (
        <canvas id={styles.canvas} ref={canvas}/>
    )
}

export default Canvas