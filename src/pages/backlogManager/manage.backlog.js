import React, { useEffect, useState } from "react";
import LoadingIndicator from "../../components/LoadingIndicator";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import NewButton from "../../components/NewButton";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Header from "./backlog.header";
import { getBacklogData, removeWords, trackEvent, updateBacklogData } from "../../services/backlog";
import Indicator from "./indicator.backlog";
import { getSpayeeUserCourses } from "../../services/backlog";
import { Col, Row } from "react-bootstrap";


const BacklogInput = ({ chapter, onStatusChange, disabled = false }) => {
    const state = ["NOT-STARTED", "WEAK", "DONE"];
    const colors = ["#CC2C2C", "#FFB023", "#008444"]
    const [value, setValue] = useState(state.indexOf(chapter.status))

    const onChange = (e) => {
        setValue(e.target.value)
        onStatusChange(chapter.scmId, state[e.target.value])
    }


    return <Row key={chapter.chapter_id} className="align-items-center mb-2">
        <Col xs={6} lg={3}>
            <Form.Label style={{ fontSize: 16 }}>{chapter.chapter_name}</Form.Label>
        </Col>
        <Col xs={6} lg={9} >
            <input type="range" min={0} max={2}
                disabled={disabled}
                style={{
                    accentColor: colors[value]
                }}
                value={value} onChange={onChange} />
        </Col>
    </Row>

}

const BacklogSubjects = ({ subject, activeIndex, onBackClick, onNextClick, onStatusChange, isAdmin }) => {

    return (
        <>
            <main className="backlog-main">

                <h3 style={{ fontSize: 22, margin: "20px 0" }}>{removeWords(subject.subject_name)}</h3>
                <Indicator />

                {subject.chapters.map(chapter => <BacklogInput key={chapter.chapter_id} chapter={chapter} onStatusChange={onStatusChange} disabled={isAdmin} />)}
            </main>
            <footer className="backlog-footer">

                {activeIndex !== 0 && <NewButton className="new-btn-outline" onClick={onBackClick}>
                    <FiChevronLeft size={24} /> Back
                </NewButton>
                }

                <NewButton style={{ marginLeft: 10 }} className="new-btn-outline" onClick={onNextClick}>
                    Next <FiChevronRight size={24} />
                </NewButton>
            </footer>
        </>
    )
}


const UpdateBacklog = () => {
    const params = useParams()
    const userCRMId = params.crm_id
    // const [path] = useParams()["*"].split("/")

    const [searchParams, setSearchParams] = useSearchParams();
    const isAdmin = searchParams.get("admin")
    const forceEdit = searchParams.get("forceEdit")

    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState({})
    const [status, setStatus] = useState([])

    const [activeIndex, setActiveIndex] = useState(0)

    const getBacklogDataHandel = async (user, course, phase) => {

        return getBacklogData(user, course, phase)
            .then((res) => {
                let data = {}
                for (let i of res) {
                    console.log(i.status !== "NOT-STARTED" || i.is_skipped)
                    const chapter = { chapter_id: i.chapter_id, chapter_name: i.chapter_display_name, status: i.status, scmId: i.scm_id }
                    data[i.subject_id] = data[i.subject_id] ? { ...data[i.subject_id], chapters: [...data[i.subject_id]?.chapters, chapter] } : {
                        subject_id: i.subject_id,
                        subject_name: i.subject_name,
                        chapters: [chapter]
                    }
                }
                return Object.values(data)
            })
            .catch(err => console.error(err))
    }



    const navigateToManager = (data) => {
        navigate("/user/backlog-manager", {
            state: { userId: data.user_id, courseId: data.course_id, phaseId: data.phase_id, isAdmin, userCRMId },
            replace: true
        })
    }
    const getData = (userCRMId) => {
        getSpayeeUserCourses(userCRMId)
            .then(async (val) => {
                if (val.data?.success) {
                    const data = val.data.data[0]
                    if (data) {
                        !isAdmin && trackEvent("update-backlog", "page-view", data.user_id)
                        return getBacklogDataHandel(data.user_id, data.course_id, data.phase_id)
                            .then(subjectData => {
                                if (!(forceEdit || isAdmin) && subjectData.find(sub => sub.chapters.find(ch => ch.status !== "NOT-STARTED"))) {
                                    return navigateToManager(data)
                                }
                                return setData({ user: data, subjectData })
                            })
                    } else {
                        throw { message: "User not found." }
                    }
                } else throw val.data.errors.join(", ")
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }


    useEffect(() => {
        getData(userCRMId)
    }, [userCRMId])


    const onStatusChange = (scmId, ch_status) => {


        let isPrasent = false;
        let st = []
        for (let obj of status) {
            if (obj.scm_id == scmId) {
                isPrasent = true
                obj["status"] = ch_status
            }
            st = [...st, obj]
        }
        if (!isPrasent) {
            st = [...st, { scm_id: scmId, status: ch_status }]
        }
        setStatus(st);
    }

    const onBackClick = () => {
        if (activeIndex !== 0) {
            setActiveIndex(i => --i);
        }
    }
    const onNextClick = () => {
        if (activeIndex < data.subjectData.length - 1) {
            setActiveIndex(i => ++i);
        } else {
            updateBacklogData(data.user.user_id, status, "update-backlog")
                .then(res => navigateToManager(data.user))
                .catch(console.error)

        }
    }

    return (

        <div className="flex-container">
            <header className="backlog-header"><Header title="Update Your Backlog" /></header>

            {loading ?
                <LoadingIndicator />
                // <div style={{ marginTop: 300 }}>
                //     <button onClick={() => getData(userCRMId)}>get data</button>
                //     <button onClick={() => getData("5c9f431de4b0a8f92261ebbd")}>get const data</button>
                // </div>
                :
                !data.user ?
                    <main className="backlog-main">
                        user not found
                    </main>
                    :
                    data.subjectData.map((sub, index) => {
                        return (<div key={sub.subject_id} style={{ display: index === activeIndex ? "block" : "none" }}>
                            <BacklogSubjects isAdmin={isAdmin} subject={sub} activeIndex={activeIndex} onNextClick={onNextClick} onBackClick={onBackClick} onStatusChange={onStatusChange} />
                        </div>)
                    })
            }
        </div>
    )
}

export default UpdateBacklog;