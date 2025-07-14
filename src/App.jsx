import React from 'react'
import PredictionPanel from './components/PredictionPanel.jsx'

export default function App() {
  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>🧠 CryptoOracle Pulse</h1>
        <p style={styles.subtitle}>
          Predict tomorrow’s crypto. Today. Powered by sentiment & machine learning.
        </p>
      </header>
      <section style={styles.panelSection}>
        <PredictionPanel />
      </section>
    </main>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    padding: '2rem',
    backgroundColor: '#0d0d0d',
    color: '#f0f0f0',
    fontFamily: 'Segoe UI, sans-serif'
  },
  header: {
    marginBottom: '2rem',
    textAlign: 'center'
  },
  title: {
    fontSize: '2.5rem',
    color: '#00ffff'
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#cccccc'
  },
  panelSection: {
    display: 'flex',
    justifyContent: 'center'
  }
}

