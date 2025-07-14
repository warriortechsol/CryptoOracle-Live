import axios from 'axios'

const BASE_URL = 'https://cryptooracle.onrender.com'

export const getPrediction = async (payload) => {
  const res = await axios.post(`${BASE_URL}/predict`, payload)
  return res.data
}

export const getRecommendations = async () => {
  const res = await axios.get(`${BASE_URL}/recommender`)
  return res.data
}

export const getHealthStatus = async () => {
  const res = await axios.get(`${BASE_URL}/health`)
  return res.data
}
