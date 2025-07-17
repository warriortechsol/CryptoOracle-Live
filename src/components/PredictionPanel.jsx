import React, { useState } from 'react';
import { getPrediction, getRecommendations } from '../hooks/useCryptoAPI';

const PredictionPanel = () => {
  const [symbol, setSymbol] = useState('BTC');
  const [currentPrice, setCurrentPrice] = useState(118120);
  const [predicted, setPredicted] = useState(null);
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForecast = async () => {
    setLoading(true);
    try {
      const prediction = await getPrediction({ symbol, current_price: currentPrice });
      setPredicted(prediction.predicted_price);

      const recommendation = await getRecommendations({
        predicted_price: prediction.predicted_price,
        current_price: currentPrice
      });
      setAdvice(recommendation.recommendation);
    } catch (error) {
      console.error('Prediction failed:', error);
      setPredicted(null);
      setAdvice('Unable to generate forecast.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.panel}>
      <h2>Symbol: {symbol}</h2>
      <p>Current Price: ${currentPrice}</p>
      <button style={styles.button} onClick={handleForecast} disabled={loading}>
        {loading ? 'Forecasting...' : 'Forecast Price'}
      </button>

      {predicted !== null && (
        <div style={styles.resultBox}>
          <h3>🧠 Predicted Price: ${predicted}</h3>
          <p>🧭 Recommendation: {advice}</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  panel: {
    backgroundColor: '#1a1a1a',
    padding: '2rem',
    borderRadius: '0.5rem',
    boxShadow: '0 0 20px rgba(0,255,255,0.2)',
    width: '100%',
    maxWidth: '500px',
    textAlign: 'center'
  },
  button: {
    padding: '0.75rem 1.25rem',
    fontSize: '1rem',
    backgroundColor: '#00ffff',
    color: '#000',
    border: 'none',
    borderRadius: '0.3rem',
    cursor: 'pointer',
    marginTop: '1rem'
  },
  resultBox: {
    marginTop: '2rem',
    backgroundColor: '#262626',
    padding: '1rem',
    borderRadius: '0.3rem',
    color: '#f0f0f0'
  }
};

export default PredictionPanel;

