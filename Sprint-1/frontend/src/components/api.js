import axios from 'axios';

export const API_BASE_URL = 'http://127.0.0.1:8000/api';

axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';