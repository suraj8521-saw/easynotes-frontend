import axios from 'axios';

const API = axios.create({
  // Pehle yahan http://localhost:8000 tha, ab ise badal do
  baseURL: "https://easynotes-backend-rgo1.onrender.com" 
});

export default API;