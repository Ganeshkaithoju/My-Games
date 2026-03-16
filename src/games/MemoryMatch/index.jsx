/**
 * MemoryMatch Game Template
 *
 * This is a template showing how to structure a new game for the My_Games platform.
 *
 * Template Interface:
 * - Receives 'onBack' prop to return to game launcher
 * - Manages its own internal state
 * - Self-contained component
 */

function MemoryMatch({ onBack }) {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🧠 Memory Match Game</h2>
        <p style={styles.description}>
          This is a template for future game development.
          Replace this content with your game logic!
        </p>

        <div style={styles.features}>
          <h3>Template Guide:</h3>
          <ul style={styles.list}>
            <li>Use React hooks (useState, useEffect) for state management</li>
            <li>Create a components/ folder for game components</li>
            <li>Create a styles/ folder for game-specific CSS</li>
            <li>Follow the same prop interface: receive 'onBack' to return to launcher</li>
            <li>Keep game logic isolated from other games</li>
          </ul>
        </div>

        <div style={styles.example}>
          <h3>Example Game Structure:</h3>
          <pre style={styles.code}>{`games/
├── MemoryMatch/
│   ├── index.jsx          (main game component)
│   ├── components/
│   │   ├── Card.jsx
│   │   └── GameBoard.jsx
│   └── styles/
│       └── MemoryMatch.css`}</pre>
        </div>

        <button
          style={styles.button}
          onClick={onBack}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#9333ea'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#a855f7'}
        >
          ← Back to Launcher
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
    padding: '2rem',
  },
  card: {
    background: 'white',
    borderRadius: '1rem',
    padding: '2rem',
    maxWidth: '600px',
    boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1rem',
    color: '#1f2937',
  },
  description: {
    fontSize: '1rem',
    color: '#6b7280',
    marginBottom: '2rem',
    lineHeight: '1.6',
  },
  features: {
    textAlign: 'left',
    backgroundColor: '#f3f4f6',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    marginBottom: '2rem',
  },
  list: {
    listStyle: 'disc',
    paddingLeft: '1.5rem',
    color: '#374151',
  },
  example: {
    textAlign: 'left',
    backgroundColor: '#f9fafb',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    marginBottom: '2rem',
    border: '1px solid #e5e7eb',
  },
  code: {
    backgroundColor: '#1f2937',
    color: '#10b981',
    padding: '1rem',
    borderRadius: '0.5rem',
    overflow: 'auto',
    fontFamily: 'monospace',
    fontSize: '0.85rem',
    margin: '0.5rem 0 0 0',
  },
  button: {
    backgroundColor: '#a855f7',
    color: 'white',
    border: 'none',
    padding: '0.75rem 2rem',
    fontSize: '1rem',
    fontWeight: '600',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
}

export default MemoryMatch
