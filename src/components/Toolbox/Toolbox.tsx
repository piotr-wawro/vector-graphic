import { CirclePicker, ColorResult } from 'react-color';

import { useAppSelector, useAppDispatch } from 'app/hooks';
import { selectColor, setColor, selectBrushSize, setBrushSzie } from './toolboxSlice';

import Header from './Header/Header'
import styles from './Toolbox.module.css'

const Toolbox = () => {
    const dispatch = useAppDispatch();

    const color = useAppSelector(selectColor);
    const brushSize = useAppSelector(selectBrushSize);

    const handleOnChangeComplete = (newColor: ColorResult) => {
        dispatch(setColor(newColor.hex))
    }

    const handleOnBrushSizeChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
        dispatch(setBrushSzie(parseInt(event.target.value)))
    }

    return (
        <div className={styles.toolbox}>
            <Header text="Colors" />
            <CirclePicker 
                color={color}
                onChangeComplete={handleOnChangeComplete}
            />
            <Header text="Brush size" />
            <input type={'range'} value={brushSize} min='1' max='100' onChange={handleOnBrushSizeChange} />
        </div>
    )
}

export default Toolbox