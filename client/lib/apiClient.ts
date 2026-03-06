import axios from "axios";

const apiClient = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}`,
    timeout: 20000,
    headers: { 'Content-Type': 'application/json' }
});

apiClient.interceptors.request.use(function (config) {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;

}, function (error) {
    return Promise.reject(error);
});

apiClient.interceptors.response.use(function onFulfilled(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function onRejected(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // window.location.href = '/login';
        }
    }
    return Promise.reject(error);
});



export default apiClient;