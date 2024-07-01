import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "./backlog.header";
import { FiChevronRight } from "react-icons/fi";
import Tile from "./manager.backlog.tile";
import { Button } from "react-bootstrap";
import { getBacklogData, trackEvent } from "../../services/backlog.js";
import Lottie from "lottie-react";
import target from '../../utils/images/lottie/target.json';
import congratulations from '../../utils/images/lottie/congratulations.json';
import VideoPlayer from "../../components/videoplayer.component";
import celebrationArr from "../../utils/images/lottie/celebration.js";




const BacklogManager = () => {
    const { state } = useLocation()
    const [data, setData] = useState()

    const [isDone, setIsDone] = useState(false)

    const navigate = useNavigate();

    const days = 5;
    const hrPerDay = 2;
    const totalSecsToCover = days * hrPerDay * 60 * 60;

    const getData = (status) => {
        getBacklogData(state.userId, state.courseId, state.phaseId)
            .then(res => {
                let data = {}
                for (let i of res) {
                    if (i.status !== "DONE" && !i.is_skipped)
                        if (data[i.subject_id]) {
                            data[i.subject_id] = [...data[i.subject_id], i]
                        }
                        else {
                            data[i.subject_id] = [i]
                        }
                }
                const dataValue = Object.values(data);
                let maxChLength = Math.max(...dataValue.map(sub => sub.length));

                let chapterToDisplay = []
                let dur = 0
                for (let i = 0; i < maxChLength; i++) {
                    for (let sub of dataValue) {
                        let ch = sub[i]
                        if (ch) {
                            if (dur < totalSecsToCover) {
                                dur += ch.chapter_total_duration;
                                chapterToDisplay = [...chapterToDisplay, ch]
                            }
                        }
                    }
                }
                setData(chapterToDisplay)

                if (status == 'DONE') {
                    setIsDone(true)
                }

            })
            .catch(console.error)
    }

    const logVideoEvent = (event) => {
        !state.isAdmin && trackEvent("backlog-manager", `video-${event}`, state.userId)
    }

    const onEditClick = () => {
        !state.isAdmin && trackEvent("backlog-manager", "update-backlog-btn", state.userId);
        navigate(`/user/backlogs/${state.userCRMId}?forceEdit=1`);
    }

    const onMTBClick = () => {
        !state.isAdmin && trackEvent("backlog-manager", "mtb-btn", state.userId);
        navigate("/user/total-backlogs", { state: { userId: state.userId, courseId: state.courseId, phaseId: state.phaseId, isAdmin: state.isAdmin } })
    }

    useEffect(() => {
        !state.isAdmin && trackEvent("backlog-manager", "page-view", state.userId)
        getData()
    }, [])

    const handleLoop = () => {
        setIsDone(false)
    }


    return (
        <div className="flex-container">
            <header className="backlog-header">
                <Header title="My Backlog Guru" onEditClick={onEditClick} />
            </header>

            {data && (data.length ?
                <main className="backlog-main">
                    <Lottie style={{
                        width: "50%",
                        overflow: 'hidden',
                        maxWidth: 400
                    }} animationData={target} loop={false} />

                    <div>
                        <h3>Focus Chapters - Next 5 days</h3>
                        <p>Based on average 2 hrs/day for Backlog.</p>
                    </div>

                    {data.map((chapter, index) => <Tile disableInput={state.isAdmin} key={chapter.chapter_id} data={chapter} onStatusUpdate={getData} userId={state.userId} isVisible={true} isAdmin={state.isAdmin} />)}
                    <VideoPlayer videoUrl={"38451a9c0d8c40c28322e706be86a7d1"} phone={"1234"} autoPlay={false} onPlay={() => logVideoEvent("play")} onPause={() => logVideoEvent("pause")} />
                    {data && data.length > 0 && <Button variant="outline-primary" className="mt-4" style={{
                        borderWidth: 2, fontWeight: "bold", borderRadius: 20, width: "-webkit-fill-available"
                    }} onClick={onMTBClick}>My Total Backlog<FiChevronRight /></Button>}

                </main> :
                <main className="backlog-main">
                    <Lottie style={{
                        width: "100%",
                        maxWidth: 500,
                        overflow: 'hidden',
                        marginTop: "inherit"
                    }} animationData={congratulations} loop={false} />

                    <div>
                        <h3>Congratulations!</h3>
                        <p>You don't have any active backlogs.<br />Keep it up...</p>
                    </div>
                </main>
            )}


            {/* <footer className="backlog-footer d-grid">
            </footer> */}

            {
                isDone
                &&
                <div style={{
                    width: '100vw',
                    height: "100vh",
                    position: 'fixed',
                    zIndex: '10000',
                }}>
                    <Lottie
                        style={{
                            height: '100%',
                            overflow: 'hidden'
                        }}
                        animationData={celebrationArr[Math.floor(Math.random() * celebrationArr.length)]}
                        onLoopComplete={handleLoop}
                        onClick={handleLoop}
                    />
                </div>
            }

        </div>
    )
}

export default BacklogManager;