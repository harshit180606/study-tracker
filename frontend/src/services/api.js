import axios from 'axios';

const API = axios.create({
    baseURL : 'http://localhost:8000/api'
})

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

const signUp = (data) => API.post('/auth/signup', data)
const login = (data) => API.post('/auth/login', data)
const logStudy = (data) => API.post('/study/log', data)
const getHistory = () => API.get('/study/history')
const deleteLog = (id) => API.delete(`/study/${id}`)

export { signUp, login, logStudy, getHistory, deleteLog }