import React from 'react';

function TestComponent() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: '#2563eb', fontSize: '3rem', marginBottom: '1rem' }}>
        🚀 React is Working!
      </h1>
      <p style={{ color: '#64748b', fontSize: '1.2rem' }}>
        TurboTags website is now loading properly.
      </p>
      <div style={{ 
        background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 50%, #f59e0b 100%)',
        padding: '1rem 2rem',
        borderRadius: '0.5rem',
        color: 'white',
        display: 'inline-block',
        marginTop: '2rem',
        fontWeight: 'bold'
      }}>
        AI Title & Tag Generation Button Test
      </div>
    </div>
  );
}

export default TestComponent;