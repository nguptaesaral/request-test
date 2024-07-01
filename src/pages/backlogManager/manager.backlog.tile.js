import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { FiMoreVertical } from "react-icons/fi";
import { updateBacklogData, trackEvent } from "../../services/backlog";
import CustomSlider from "../../components/customSlider";
import AutoHide from "./auto-hide.manager.tile";

const bgc = (opa = 1) => {

    return [
        `rgba(254, 100, 29, ${opa})`,
        `rgba(254, 128, 34, ${opa})`,
        `rgba(254, 156, 41, ${opa})`,
        `rgba(254, 184, 47, ${opa})`,
        `rgba(255, 212, 54, ${opa})`,
        `rgba(205, 237, 65, ${opa})`,
        `rgba(155, 234, 77, ${opa})`,
        `rgba(107, 230, 95, ${opa})`,
        `rgba(61, 228, 116, ${opa})`,
        `rgba(31, 225, 140, ${opa})`,
        `rgba(31, 225, 140, ${opa})`,
    ]
}


const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <div onClick={onClick}>
        <FiMoreVertical size={24} />
    </div>
));


const Tile = ({ userId, data, onStatusUpdate, disableInput }) => {
    const [isSliding, setIsSliding] = useState(false);
    const [isSlidingUp, setIsSlidingUp] = useState(false);
    const [progress, setProgress] = useState(data.current_progress);
    const [showFeedback, setShowFeedback] = useState(false);
    const [switchFeedback, setSwitchFeedback] = useState(false);

    const durationHr = Math.ceil(data.chapter_total_duration / 3600)

    const updateStatus = (status, is_skipped, new_progress = data.current_progress) => {
        updateBacklogData(userId, [{ status, is_skipped, scm_id: data.scm_id, current_progress: new_progress }], "backlog-manager")
            .then((res) => {
                if (status == "DONE" || is_skipped) {
                    setIsSliding(true);
                    onStatusUpdate(status);
                }
                setProgress(new_progress)

                console.log("initial value..>", { new_progress, progress, switchFeedback })
                if (new_progress > progress) {
                    setShowFeedback(true)
                    setSwitchFeedback(s => !s)
                }
            })
            .catch(console.error)
    }

    const handleIsDone = () => {
        setIsSliding(true)
        updateStatus("DONE", false, 10)
    }

    const onSkip = () => {
        const conf = window.confirm("Do you really want to skip!")
        conf && updateStatus(data.status, true)
    }

    const updateProgress = (value) => {
        !disableInput && trackEvent("backlog-manager", "slider-moved", userId)
        updateStatus(data.status, false, value)
    }


    const leftDuration = (percentage, totalDuration) => {
        const left = totalDuration - (percentage * totalDuration / 100);
        return Math.ceil(left)
    }

    const leftDur = leftDuration(progress, durationHr)



    useEffect(() => {
        setIsSlidingUp(true)
        setTimeout(() => {
            setIsSlidingUp(false)
        }, 1000)
    }, [data])


    return (
        <div className={`backlog-card ${isSliding ? "slide-out" : ''}  ${isSlidingUp ? "slide-up" : ''}`}
            // onAnimationEnd={() => isSliding && onStatusUpdate()}

            style={{ backgroundColor: bgc("0.075")[Math.floor(progress / 10)] }}
        >
            <div className="backlog-card-inner">

                <div style={{ textAlign: "left" }}>
                    <h6>
                        {data.chapter_display_name}
                    </h6>
                    {leftDur < durationHr ?
                        <>Time to cover - <span style={{ textDecoration: "line-through" }}>{durationHr} hrs</span> <span>{leftDur} hrs</span></>

                        :
                        <>Time to cover - <span>{durationHr} hrs</span></>
                    }
                </div>
                {!disableInput && <Dropdown>
                    <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components" />
                    <Dropdown.Menu align={{ lg: 'start' }}>
                        <Dropdown.Item as="button" onClick={handleIsDone} >Mark as Done</Dropdown.Item>
                        <Dropdown.Item as="button" onClick={onSkip} >Skip</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>}
            </div>

            <div className="mt-2">
                <CustomSlider disabled={disableInput} title={"Completed"} defaultValue={data.current_progress} handelChange={updateProgress} />
            </div>
            <div style={{ marginTop: 10, height: "1rem" }}>
                {showFeedback && <AutoHide value={progress} toggel={switchFeedback} />}
            </div>

        </div>

    )
}

export default Tile;