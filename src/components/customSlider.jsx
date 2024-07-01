import React, { useEffect, useRef, useState } from 'react';

// Import images (if they are in the src directory)
// Alternatively, if they are in the public directory, you can use the URL directly in the component.
import thumb0 from '../utils/images/smilies/1.png';
import thumb1 from '../utils/images/smilies/2.png';
import thumb2 from '../utils/images/smilies/3.png';
import thumb3 from '../utils/images/smilies/4.png';
import thumb4 from '../utils/images/smilies/5.png';
import thumb5 from '../utils/images/smilies/6.png';
import thumb6 from '../utils/images/smilies/7.png';
import thumb7 from '../utils/images/smilies/8.png';
import thumb8 from '../utils/images/smilies/9.png';
import thumb9 from '../utils/images/smilies/10.png';

const thumbs = [thumb0, thumb1, thumb2, thumb3, thumb4, thumb5, thumb6, thumb7, thumb8, thumb9];

const CustomSlider = ({ title, defaultValue = 0, handelChange, disabled=false }) => {
    const [value, setValue] = useState(defaultValue);



    const onChange = (e) => {
        setValue(e.target.value);
    };


    // Determine the index based on the value
    const thumbIndex = Math.floor((value / 100) * (thumbs.length - 1));

    return (
        <div className='slider-container'>
            <span >{title}: </span>
            <input
                type="range"
                min="0"
                max="100"
                defaultValue={value}
                disabled={disabled}
                className="slider"
                onChange={onChange}
                onMouseUp={e => !disabled && handelChange(parseInt(e.target.value))}
                onTouchEnd={e => !disabled && handelChange(parseInt(e.target.value))}
                style={{
                    '--thumb-image': `url(${thumbs[thumbIndex]})`
                }}
            />
            <div className="thumb-value">
                {value}%
            </div>
        </div>
    );
};

export default CustomSlider;
