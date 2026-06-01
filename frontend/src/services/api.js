import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * Upload a PDF file to the backend.
 * @param {File} file 
 */
export const uploadPdf = async (file) => {
  const formData = new FormData();
  formData.append('pdf', file);

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * Send a chat question to the backend.
 * @param {string} question 
 */
export const askQuestion = async (question) => {
  const response = await api.post('/chat', { question });
  return response.data;
};

export default {
  uploadPdf,
  askQuestion,
};
