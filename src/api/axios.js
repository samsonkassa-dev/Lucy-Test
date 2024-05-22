import axios from 'axios'

const instance = axios.create({
    baseURL: process.env.API_URL ?? 'https://api.lucycoding.com/api'
});

export default instance