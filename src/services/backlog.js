import { axiosClient } from "../helpers/axios-client"


export async function getSpayeeUserCourses(userCRMId) {
    return axiosClient.get("/v1/mentorship/get-spayee-user-courses?spayee_id=" + userCRMId)
}


export async function getBacklogData(userId, coursesId, phaseId, source) {
    return axiosClient.post("/v1/mentorship/get-user-backlog-data", {
        user_id: userId,
        course_id: coursesId,
        phase_id: phaseId,
        source
    }).then(res => {
        if (res.data.success) {
            return res.data.data
        } else {
            throw res.data.errors.join(", ")
        }
    })
}

export async function updateBacklogData(user_id, status, source) {
    return axiosClient.post("/v1/mentorship/update-backlog-status", {
        user_id,
        status,
        source
    }).then(res => {
        if (res.data.success) {
            return res.data.data
        } else {
            throw res.data.errors.join(", ")
        }
    })
}

export async function trackEvent(screen, event, user_id) {
    return axiosClient.post("/v1/mentorship/backlog-logging", {
        screen, event, user_id
    })
        .then(res => res.data.success)
}


export async function updateSubjectChapter(node_link_id, spayee_course_phase_id, is_deleted, order) {
    console.log({ node_link_id, spayee_course_phase_id, is_deleted, order })
    return axiosClient.post("/v1/mentorship/update-subject-chapter-meta", { node_link_id, spayee_course_phase_id, is_deleted, order }).then(res => {
        if (res.data.success) {
            return res.data.data
        } else {
            throw res.data.errors.join(", ")
        }
    })
}



export async function get_spayee_course_phases() {
    return axiosClient.get("/v1/mentorship/get-spayee-course-phases")
        .then(response => {
            if (response.data.success) {
                console.log(response.data)
                return response.data.data;
            } else {
                throw new Error(response.data.errors.join(", "))
            }
        })
}


export async function getAllSubcourses() {
    return axiosClient.get("/v2/courses/get-all-subcourses")
        .then(response => {
            if (response.data.success) {
                console.log(response.data)
                return response.data.data;
            } else {
                throw new Error(response.data.errors.join(", "))
            }
        })
}


export async function get_subject_chapter(spayee_course_phase) {

    return axiosClient.get(`/v1/mentorship/get-subject-chapter-meta?spayee_course_phase=${spayee_course_phase}`)
        .then(response => {
            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.errors.join(", "))
            }
        })
}

export async function updateSpayeeCoursePhaseSubcourse(subcourse_id, spayee_course_id) {
    return axiosClient.put("/v1/mentorship/update-spayee-course-phase", {
        subcourse_id,
        spayee_course_id
    }).then(res => {
        if (res.data.success) {
            return res.data.data
        } else {
            throw res.data.errors.join(", ")
        }
    }).catch(err => { throw err.message })
}

export function removeWords(inputString) {
    const wordsToRemove = ['JEE ', 'NEET ', 'Class 10 - ', 'Class 9 - '];

    // Join the words with | to create the regex pattern
    const pattern = new RegExp(`\\b(${wordsToRemove.join('|')})\\b`, 'gi');

    // Replace the words in the input string
    return inputString.replace(pattern, '').replace(/\s{2,}/g, ' ').trim();
}