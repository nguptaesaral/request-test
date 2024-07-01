import React, { useEffect, useState } from "react";


const progressFeedback = [
    "Well done! ",
    "Great going!",
    "Keep rocking!",
    "Excellent!",
    "You’re on fire!"
]



const AutoHide = ({ value, toggel }) => {
    const [visible, setVisible] = useState(false);
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        const timerIn = setTimeout(() => {
            const fb = progressFeedback[value % progressFeedback.length]
            setFeedback(fb)
            setVisible(true);
        }, 0); // Start immediately

        const timerOut = setTimeout(() => {
            setVisible(false);
        }, 2000); // Fade out after 2 seconds

        return () => {
            clearTimeout(timerIn);
            clearTimeout(timerOut);
        };
    }, [toggel]);
    
    return (
        <div className={`fade-div ${visible ? 'fade-in' : 'fade-out'}`}>
            <strong><em>{feedback}</em></strong>
        </div>
    )
}

export default AutoHide;