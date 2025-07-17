import axios from 'axios';

const BASE_URL = 'https://cryptooracle.onrender.com';

export const getPrediction = async (payload) => {
  try {
    const res = await axios.post(`${BASE_URL}/predict`, payload);
    return res.data;
  } catch (err) {
    console.error('Prediction API error:', err.response?.data || err.message);
    throw err;
  }
};

export const getRecommendations = async (payload) => {
  try {
    const res = await axios.post(`${BASE_URL}/recommend`, payload);
    return res.data;
  } catch (err) {
    console.error('Recommendation API error:', err.response?.data || err.message);
    throw err;
  }
};

export const getHealthStatus = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/`);
    return res.data;
  } catch (err) {
    console.error('Health API error:', err.response?.data || err.message);
    throw err;
  }
};

