import { URLS } from '../config';
import { axiosClient } from '../helpers/axios-client';

export default {

    getVDOinfo: async function (video_id) {
        try {
            const response = await axiosClient.get("https://dev.vdocipher.com/api/meta/" + video_id)

            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getVideoOTP: async function (video_id, phone = "") {
        const res = await axiosClient.post(URLS.VIDEO_OTP, {
            "video_id": video_id,
            "phone": phone,
            "video_download": false
        })
        if (res.data.success) {
            return res.data.data;
        } else {
            throw res.data.errors.join(", ")
        }
    },    getAllSubjectChapters: async function (subcourse_id=0) {
        return axiosClient.post(URLS.GET_ALL_SUBJECTS_CHAPTER, { subcourse_id })
            .then(res => {
                if (res.data.success) {
                    return res.data.data
                }else{
                    throw new Error(res.data.errors.join(", "))
                }
            })
    }


};