import axios from "axios";
import {BASE_URL} from '../config';
// import authToken from "./authToken";

const axiosClient = axios.create({baseURL : BASE_URL});

axiosClient.interceptors.request.use(function(config){
    // let tokens = JSON.parse(authToken.load(TOKEN_KEY))
    // if (tokens && tokens.access) {
    //     config.headers.Authorization = "Bearer " + tokens.access;
    // }
    return config;
});


export { axiosClient };
