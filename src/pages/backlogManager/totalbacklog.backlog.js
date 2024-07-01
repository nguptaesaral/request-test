import React, { useEffect, useState } from "react";
import { getBacklogData, removeWords, trackEvent } from "../../services/backlog";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./backlog.header";
import { Alert, Tab, Tabs } from "react-bootstrap";
import VideoPlayer from "../../components/videoplayer.component";

const TotalBacklog = () => {
    const { state } = useLocation()
    const [data, setData] = useState([])
    const [status, setStatus] = useState()
    const navigate = useNavigate();

    const getData = () => {
        getBacklogData(state.userId, state.courseId, state.phaseId)
            .then(subjectData => {
                let status = {
                    Pending: [],
                    Completed: [],
                    Skipped: []
                }
                let data = {}
                let time = 0
                for (let obj of subjectData) {
                    if (obj.status != "DONE") {
                        time += obj.chapter_total_duration
                        if (data[obj.subject_id]) {
                            data[obj.subject_id]["duration"] += obj.chapter_total_duration;
                            ++data[obj.subject_id]["chapter_count"]
                        } else {
                            data[obj.subject_id] = {
                                subject_name: obj.subject_name,
                                subject_id: obj.subject_id,
                                duration: obj.chapter_total_duration,
                                chapter_count: 1
                            }
                        }

                        if (obj.is_skipped) {
                            status.Skipped = [...status.Skipped, obj]
                        } else {
                            status.Pending = [...status.Pending, obj]
                        }
                    } else {
                        status.Completed = [...status.Completed, obj]
                    }
                }
                setData(Object.values(data))
                setStatus(status)
            })
            .catch(console.error)
    }

    const convertDate = (seconds) => {
        const hrPerDay = 2;
        const totalHrs = seconds / 60 / 60;
        const totalDays = Math.round(totalHrs / hrPerDay);
        let months = parseInt(totalDays / 30);
        let days = totalDays % 30;

        // return{months, days}
        return `${months ? months + " months " : ""}${days} days`
    }

    const onBackPress = (event) => {
        !state.isAdmin && trackEvent("my-total-backlog", "back-btn", state.userId);
        navigate(-1);
    }

    const logVideoEvent = (event) => {
        !state.isAdmin && trackEvent("my-total-backlog", `video-${event}`, state.userId)
    }
    const onTabSelect = (key) => {
        !state.isAdmin && trackEvent("my-total-backlog", `${key.toLowerCase()}-tab`, state.userId)
    }

    useEffect(() => {
        !state.isAdmin && trackEvent("my-total-backlog", "page-view", state.userId)
        getData()
    }, [])

    let coverageTime = 0;

    return (

        <div className="flex-container">
            <header className="backlog-header">
                <Header title="My Total Backlog" onBackClick={onBackPress} />
            </header>

            <main className="backlog-main">
                <div style={{ marginBlock: 20, fontSize: "large", fontWeight: "600" }}>
                    {data.map((obj, i) => {
                        coverageTime += obj.duration
                        return <div key={i}>
                            {removeWords(obj.subject_name)} - {obj.chapter_count} chapters
                        </div>
                    })}
                </div>

                <Alert variant={"info"} style={{ textAlign: "center" }}>Coverage time - {convertDate(coverageTime)}</Alert>

                <p>
                    Follow eSaral's personalized Timetable for your Backlog and you'll cover all the chapters soon.
                    {/* 
                    If you follow your eSaral timetable,
                    you can cover this backlog in the
                    next {convertDate(coverageTime)}, along with your
                    current chapters. */}
                </p>

                {status &&
                    <Tabs
                        onSelect={onTabSelect}
                        className="mb-3 backlog-chapter-tab"
                        fill
                    >
                        {Object.keys(status).map(key => {
                            const chapters = status[key];
                            return <Tab style={{ textAlign: "left" }} eventKey={key} title={`${key}(${chapters.length})`}>
                                <ul>

                                    {chapters.map(ch => {
                                        return <li key={ch.chapter_id}>
                                            {ch.chapter_display_name}
                                        </li>
                                    })}
                                </ul>
                            </Tab>
                        })}
                    </Tabs>
                }
                <VideoPlayer videoUrl={"0f62a294075044ed88bd25b7aab6fafb"} phone={"1234"} autoPlay={false} onPause={() => logVideoEvent("pause")} onPlay={() => logVideoEvent("play")} />
            </main>
            <footer className="backlog-footer d-grid">
            </footer>


        </div>
    )
}

export default TotalBacklog;