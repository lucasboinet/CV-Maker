import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import styles from "./ColorPicker.module.scss";

const ColorPicker = (props) => {
    const [open, setOpen] = useState(false);
    const toggle = () => setOpen(!open);

    return (
        <div className={styles["color-picker"]}>
            <button onClick={toggle} style={{backgroundColor : props.color}}>&nbsp;</button>
            {open && <SketchPicker className={styles["sketch-picker"]} {...props}/> }
        </div>
    );
};

export default ColorPicker;