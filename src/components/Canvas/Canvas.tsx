import { useEffect, useRef } from 'react';
import './Canvas.css';

type Point2D = {
    x: number|null;
    y: number|null;
}

const Canvas = () => {
    let canvas = useRef<HTMLCanvasElement|null>(null)

    let mousePointStart: Point2D = {x: null, y: null}
    let mousePointEnd: Point2D = {x: null, y: null}
    let canvasSize: Point2D = {x: null, y: null}

    useEffect(() => {
        canvas.current!.width = canvas.current!.clientWidth
        canvas.current!.height = canvas.current!.clientHeight
        canvasSize = {
            x: canvas.current!.clientWidth,
            y: canvas.current!.clientHeight,
        }

        let context = canvas.current?.getContext('2d')
        context?.save();

        const handleMouseDown = (event: MouseEvent) => {
            if(event.buttons == 1) {
                mousePointEnd = {
                    x: event.offsetX,
                    y: event.offsetY,
                }
            }
        }

        const handleMouseUp = (event: MouseEvent) => {
            if(event.buttons == 1) {
                mousePointStart = {x: null, y: null}
                mousePointEnd = {x: null, y: null}
            }
        }

        const handleMouseMove = (event: MouseEvent) => {
            if(event.buttons == 1) {
                mousePointStart = mousePointEnd
                mousePointEnd = {
                    x: event.offsetX,
                    y: event.offsetY,
                }

                context?.beginPath();
                context?.moveTo(mousePointStart.x!, mousePointStart.y!);
                context?.lineTo(mousePointEnd.x!, mousePointEnd.y!);
                context?.stroke();
            }
        }

        const handleResize = () => {
            let oldCanvasSize = canvasSize
            canvasSize = {
                x: canvas.current!.clientWidth,
                y: canvas.current!.clientHeight,
            }

            context?.scale(
                oldCanvasSize.x!/canvasSize.x!,
                oldCanvasSize.y!/canvasSize.y!,
            )
        }

        canvas.current?.addEventListener('mousedown', handleMouseDown)
        canvas.current?.addEventListener('mouseup', handleMouseUp)
        canvas.current?.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('resize', handleResize)

        return () => {
            canvas.current?.removeEventListener('mousedown', handleMouseDown)
            canvas.current?.removeEventListener('mouseup', handleMouseUp)
            canvas.current?.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <canvas id='canvas' ref={canvas}/>
    )
}

export default Canvas