import axios, { AxiosResponse } from 'axios';
import { IActivity, IActivitiesEnvelope } from '../models/activity';
import { history } from '../..';
import { toast } from 'react-toastify';
import { IUser, IUserFormValues } from '../models/user';
import { IProfile, IPhoto, IUserActivity } from '../models/profile';
import Axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use((config) => {
    // send token with every request
    const token = window.localStorage.getItem('jwt');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

axios.interceptors.response.use(undefined, error => {
    
    // catch some server errors
    if (error.message === 'Network Error' && !error.response) {
        toast.error('Network error - make sure API works');
    }

    const { status, data, config, headers } = error.response;

    if (status === 404) {
        history.push('/notfound');
    }

    if (status === 401 && headers['www-authenticate'].includes('Bearer error="invalid_token", error_description="The token expired')) {
        window.localStorage.removeItem('jwt');
        history.push('/');
        toast.info('Your session has expired, please login again');
    }

    if (status === 400 && config.method === 'get' && data.errors.hasOwnProperty('id')) {
        history.push('/notfound');
    }

    if (status === 500) {
        toast.error('Server error - check the terminal for more info!');
    }

    throw error.response;
});

const responseBody = (response: AxiosResponse) => response.data;

const sleep = (ms: number) => (response: AxiosResponse) => new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms));

const requests = {
    get: (url: string) => axios.get(url).then(sleep(1000)).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(sleep(1000)).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(sleep(1000)).then(responseBody),
    del: (url: string) => axios.delete(url).then(sleep(1000)).then(responseBody),
    postForm: (url: string, file: Blob) => {
        let formData = new FormData();
        formData.append('File', file);
        return Axios.post(url, formData, { headers: {'Content-type': 'multipart/form-data'} }).then(responseBody);
    }
}

const Activities = {
    list: (params: URLSearchParams): Promise<IActivitiesEnvelope> => axios.get('/activities', {params: params}).then(sleep(1000)).then(responseBody),
    details: (id: string) => requests.get(`/activities/${id}`),
    create: (activity: IActivity) => requests.post(`/activities`, activity),
    update: (activity: IActivity) => requests.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del(`/activities/${id}`),
    attend: (id: string) => requests.post(`/activities/${id}/attend`, {}),
    unattend: (id: string) => requests.del(`activities/${id}/attend`)
}

const User = {
    current: (): Promise<IUser> => requests.get('/user'),
    login: (user: IUserFormValues): Promise<IUser> => requests.post('/user/login', user),
    register: (user: IUserFormValues): Promise<IUser> => requests.post('/user/register', user)
}

const Profiles = {
    get: (username: string): Promise<IProfile> => requests.get(`/profiles/${username}`),
    uploadPhoto: (photo: Blob): Promise<IPhoto> =>  requests.postForm(`/photos`, photo),
    setMainPhoto: (id: string) => requests.post(`/photos/${id}/setmain`, {}),
    deletePhoto: (id: string) => requests.del(`/photos/${id}`),
    update: (profile: Partial<IProfile>) => requests.put("/profiles", profile), // Partial<Type> constructs a type with all properties of Type set to optional
    follow: (username: string) => requests.post(`/profiles/${username}/follow`, {}),
    unfollow: (username: string) => requests.del(`/profiles/${username}/follow`),
    listFollowings: (username: string, predicate: string): Promise<IProfile[]> => requests.get(`/profiles/${username}/follow?predicate=${predicate}`),
    listUserActivities: (username: string, predicate: string): Promise<IUserActivity[]> => requests.get(`/profiles/${username}/activities?predicate=${predicate}`),
}


export default {
    Activities, 
    User,
    Profiles
}