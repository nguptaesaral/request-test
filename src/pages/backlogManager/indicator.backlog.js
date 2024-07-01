import React from "react";

const Indicator = () => {

    return (
        <div className="backlog-indicator">
            <div style={{ width: "70%", backgroundColor: "#CDCFD3", borderRadius: 20, height: 8, position: "relative" }}>
                <div className="indicator-points" style={{ backgroundColor: "#CC2C2C" }}>
                    <p className="point-text">Not Started</p>
                </div>
                <div className="indicator-points" style={{ left: "50%", backgroundColor: "#FFB023" }}>
                    <p className="point-text">Weak</p>
                </div>
                <div className="indicator-points" style={{ left: "100%", backgroundColor: "#008444" }}>
                    <p className="point-text">Done</p>
                </div>
            </div>
        </div>
    )
}

export default Indicator;