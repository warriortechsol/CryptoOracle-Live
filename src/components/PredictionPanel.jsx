import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function PredictionPanel() {
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSymbol, setSelectedSymbol] = useState("BTC")
  const [priceInput, setPriceInput] = useState(62140.00)
  const [isAutoMode, setIsAutoMode] = useState(true)
  const [history, setHistory] = useState([])
  const [refreshKey, setRefreshKey] = useState(0)

  const coinGeckoMap = {
    BTC: "bitcoin",
    ETH: "ethereum",
    SOL: "solana",
    DOGE: "dogecoin",
    ADA: "cardano"
  }

  // 🔄 Fetch live price when symbol or mode changes
  useEffect(() => {
    if (!isAutoMode) return
    async function fetchPrice() {
      try {
        const res = await axios.get("https://api.coingecko.com/api/v3/simple/price", {
          params: {
            ids: coinGeckoMap[selectedSymbol],
            vs_currencies: "usd"
          }
        })
        const price = res.data[coinGeckoMap[selectedSymbol]].usd
        setPriceInput(price)
      } catch (error) {
        console.error("Failed to fetch live price:", error)
      }
    }
    fetchPrice()
  }, [selectedSymbol, isAutoMode])

  // 🔮 Trigger prediction
  useEffect(() => {
    setLoading(true)
    axios.post("https://cryptooracle.onrender.com/predict", {
      symbol: selectedSymbol,
      current_price: priceInput
    })
      .then((res) => {
        setPrediction(res.data)
        setLoading(false)
        const timestamp = new Date().toLocaleTimeString()
        setHistory(prev => [
          { time: timestamp, symbol: selectedSymbol, ...res.data },
          ...prev.slice(0, 4)
        ])
      })
      .catch((err) => {
        console.error("API error:", err)
        setLoading(false)
      })
  }, [selectedSymbol, priceInput, refreshKey])

  // 🔁 Auto-refresh every 60s
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(k => k + 1)
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={styles.panel}>
      <h2 style={styles.title}>🔮 Prediction Panel</h2>

      {/* Mode Toggle */}
      <label style={styles.toggleLabel}>
        <input
          type="checkbox"
          checked={isAutoMode}
          onChange={() => setIsAutoMode(!isAutoMode)}
        />
        Auto Price Mode
      </label>

      {/* Manual Price Input */}
      {!isAutoMode && (
        <input
          type="number"
          style={styles.input}
          value={priceInput}
          onChange={(e) => setPriceInput(parseFloat(e.target.value))}
          placeholder="Enter current price"
        />
      )}

      {/* Asset Dropdown */}
      <select
        style={styles.dropdown}
        value={selectedSymbol}
        onChange={(e) => setSelectedSymbol(e.target.value)}
      >
        <option value="BTC">BTC</option>
        <option value="ETH">ETH</option>
        <option value="SOL">SOL</option>
        <option value="DOGE">DOGE</option>
        <option value="ADA">ADA</option>
      </select>

      {/* Manual Refresh */}
      <button
        onClick={() => setRefreshKey(k => k + 1)}
        style={styles.refreshButton}
      >
        🔁 Refresh Prediction
      </button>

      {/* Output Block */}
      {loading ? (
        <p style={styles.text}>Loading prediction...</p>
      ) : prediction ? (
        <>
          <div style={styles.grid}>
            <div style={styles.card}>
              <p><strong>Asset:</strong> {selectedSymbol}</p>
              <p><strong>Live Price:</strong> ${priceInput}</p>
            </div>

            <div style={styles.card}>
              <p><strong>Prediction:</strong> ${prediction.predicted_price}</p>
              <div style={styles.gaugeOuter}>
                <div style={{
                  ...styles.gaugeInner,
                  width: `${Math.min(prediction.predicted_price / 1000 * 100, 100)}%`
                }}>
                  ${prediction.predicted_price}
                </div>
              </div>
            </div>

            <div style={styles.card}>
              <p><strong>Sentiment Score:</strong> {prediction.sentiment_score}</p>
              <p><strong>Mood:</strong>{" "}
                {prediction.sentiment_score > 0.2 ? "😀 Positive" :
                 prediction.sentiment_score < -0.2 ? "😡 Negative" :
                 "😐 Neutral"}
              </p>
            </div>

            <div style={styles.card}>
              <p><strong>Recommendation:</strong></p>
              <p style={styles.recommendation}>{prediction.recommendation}</p>
            </div>
          </div>

          {/* History Feed */}
          <div style={styles.history}>
            <h3 style={styles.historyTitle}>📦 Recent Forecasts</h3>
            {history.map((entry, i) => (
              <div key={i} style={styles.historyItem}>
                <strong>{entry.time}</strong> — {entry.symbol} → {entry.predicted_price} ({entry.recommendation}, {entry.sentiment_score})
              </div>
            ))}
          </div>
        </>
      ) : (
        <p style={styles.text}>No prediction available.</p>
      )}
    </div>
  )
}

const styles = {
  panel: {
    padding: '2rem',
    backgroundColor: '#111',
    borderRadius: '12px',
    color: '#0ff',
    maxWidth: '900px',
    margin: '2rem auto'
  },
  title: {
    fontSize: '1.8rem',
    marginBottom: '1rem'
  },
  text: {
    fontSize: '1rem',
    marginBottom: '0.5rem'
  },
  input: {
    marginBottom: '1rem',
    padding: '0.6rem',
    fontSize: '1rem',
    backgroundColor: '#222',
    color: '#0ff',
    border: '1px solid #0ff',
    borderRadius: '6px',
    width: '100%'
  },
  dropdown: {
    marginBottom: '1rem',
    padding: '0.6rem',
    fontSize: '1rem',
    backgroundColor: '#222',
    color: '#0ff',
    border: '1px solid #0ff',
    borderRadius: '6px',
    width: '100%'
  },
  toggleLabel: {
    display: 'block',
    marginBottom: '0.75rem',
    fontSize: '1rem',
    color: '#0ff'
  },
  refreshButton: {
    backgroundColor: '#0ff',
    color: '#000',
    padding: '0.5rem 1rem',
    fontWeight: 'bold',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    marginBottom: '1rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem',
    marginTop: '1rem'
  },
  card: {
    backgroundColor: '#222',
    borderRadius: '8px',
    padding: '1rem',
    color: '#0ff',
    boxShadow: '0 0 6px rgba(0,255,255,0.2)'
  },
  gaugeOuter: {
    height: '30px',
    width: '100%',
    backgroundColor: '#333',
    borderRadius: '8px',
    overflow: 'hidden',
    marginTop: '0.5rem',
    boxShadow: 'inset 0 0 6px rgba(0,255,255,0.2)'
  },
  gaugeInner: {
    height: '100%',
    backgroundColor: '#0ff',
    textAlign: 'right',
    padding: '0 0.5rem',
    color: '#000',
    fontWeight: 'bold',
    lineHeight: '30px',
    transition: 'width 0.6s ease-out'
  },
  recommendation: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    backgroundColor: '#0ff',
    color: '#000',
    padding: '0.3rem 0.6rem',
    borderRadius: '6px',
    textAlign: 'center',
    display: 'inline-block',
    marginTop: '0.5rem'
  },
    history: {
    marginTop: '2rem',
    backgroundColor: '#222',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 0 4px rgba(0,255,255,0.1)'
  },
    historyTitle: {
    fontSize: '1.2rem',
    color: '#0ff',
    marginBottom: '0.5rem'
  },
  historyItem: {
    fontSize: '0.95rem',
    color: '#ccc',
    marginBottom: '0.25rem',
    lineHeight: '1.4'
  }
}

