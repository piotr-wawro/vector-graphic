import { CirclePicker, ColorResult } from 'react-color';

import { useAppSelector, useAppDispatch } from 'app/hooks';
import {
    selectColor,
    setColor,
    selectBrushSize,
    setBrushSzie,
    selectTool,
    setTool,
    Tool,
} from './toolboxSlice';

import Header from './Header/Header'
import styles from './Toolbox.module.css'

import line from 'icons/line.png'
import hand from 'icons/hand.png'

const Toolbox = () => {
    const dispatch = useAppDispatch();

    const color = useAppSelector(selectColor);
    const brushSize = useAppSelector(selectBrushSize);
    const tool = useAppSelector(selectTool);

    const toolsIcons = {
        [Tool.line]: line,
        [Tool.hand]: hand,
    }

    const handleOnChangeComplete = (newColor: ColorResult) => {
        dispatch(setColor(newColor.hex))
    }

    const handleOnBrushSizeChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
        dispatch(setBrushSzie(parseInt(event.target.value)))
    }

    const handleOnToolButtonClick = (newTool: Tool) => {
        dispatch(setTool(newTool))
    }

    return (
        <div className={styles.toolbox}>
            <Header text='Colors' />
            <CirclePicker
                color={color}
                onChangeComplete={handleOnChangeComplete}
            />

            <Header text='Brush size' />
            <input
                type={'range'}
                value={brushSize}
                min='1'
                max='100'
                onChange={handleOnBrushSizeChange}
            />

            <Header text="Tools" />
            <div className={styles.tools}>
                {Object.entries(toolsIcons).map(([key, value]) => (
                    <button
                        key={key}
                        className={`${styles.button} ${parseInt(key) === tool ? styles.buttonSelected : ''}`}
                        onClick={() => handleOnToolButtonClick(parseInt(key))}
                    >
                        <img src={value} className={styles.buttonImage} />
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Toolbox
