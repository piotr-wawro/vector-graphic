import { useState } from 'react';
import styles from './RGBtoHSV.module.css';

const RGBtoHSV = () => {
    const [red, setRed] = useState(0)
    const [green, setGreen] = useState(0)
    const [blue, setBlue] = useState(0)

    const [hue, setHue] = useState(0)
    const [saturation, setSaturation] = useState(0)
    const [value, setValue] = useState(0)

    const onConvertButtonClick = () => {
        const r = red/255
        const g = green/255
        const b = blue/255

        const cmax = Math.max(r,g,b)
        const cmin = Math.min(r,g,b)
        const delta = cmax - cmin

        if(delta === 0) {
            setHue(0)
        }
        else if(cmax === r) {
            setHue(60*((g-b)%6/delta))
        }
        else if(cmax === g) {
            setHue(60*((b-r)/delta)+2)
        }
        else if(cmax === b) {
            setHue(60*((r-g)/delta)+4)
        }

        if(cmax === 0) {
            setSaturation(0)
        }
        else {
            setSaturation(delta/cmax)
        }

        setValue(cmax)
    }

    return (
        <div className={styles.container}>
            <div className={styles.inputContainer}>
                <label className={styles.label} htmlFor='red'>R:</label>
                <input
                    className={styles.input}
                    type='number'
                    name='red'
                    min={0}
                    max={255}
                    onChange={(event => setRed(parseInt(event.target.value)))}
                    value={red}
                />

                <label className={styles.label} htmlFor='green'>G:</label>
                <input
                    className={styles.input}
                    type='number'
                    name='green'
                    min={0}
                    max={255}
                    onChange={(event => setGreen(parseInt(event.target.value)))}
                    value={green}
                />

                <label className={styles.label} htmlFor='blue'>B:</label>
                <input
                    className={styles.input}
                    type='number'
                    name='blue'
                    min={0}
                    max={255}
                    onChange={(event => setBlue(parseInt(event.target.value)))}
                    value={blue}
                />
            </div>

            <div className={styles.convertButton}>
                <input type='button' value='convert' onClick={onConvertButtonClick} />
            </div>

            <div className={styles.inputContainer}>
                <label className={styles.label} htmlFor='hue'>H:</label>
                <input
                    className={styles.input}
                    type='number'
                    name='hue'
                    min={0}
                    max={360}
                    value={hue}
                    disabled={true}
                />

                <label className={styles.label} htmlFor='saturation'>S:</label>
                <input
                    className={styles.input}
                    type='number'
                    name='saturation'
                    min={0}
                    max={100}
                    value={saturation}
                    disabled={true}
                />

                <label className={styles.label} htmlFor='value'>V:</label>
                <input
                    className={styles.input}
                    type='number'
                    name='value'
                    min={0}
                    max={100}
                    value={value}
                    disabled={true}
                />
            </div>
        </div>
    )
}

export default RGBtoHSV