import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://ak6ymkhnh0.execute-api.us-east-1.amazonaws.com/dev/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
