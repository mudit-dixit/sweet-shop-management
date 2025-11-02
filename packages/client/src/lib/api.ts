import axios from 'axios';

// Our backend server is running on port 3001
const API_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
});

export default api;