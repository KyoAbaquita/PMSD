import axios from 'axios';

export const API_BASE_URL = 'https://b782-149-30-138-136.ngrok-free.app/api';

axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';