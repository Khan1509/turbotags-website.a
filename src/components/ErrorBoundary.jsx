import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif', color: '#333' }}>
          <h1>Something went wrong.</h1>
          <p>We're sorry for the inconvenience. Please try refreshing the page or go back home.</p>
          <details style={{ whiteSpace: 'pre-wrap', background: '#f0f0f0', padding: '1rem', borderRadius: '8px', margin: '1rem 0' }}>
            <summary>Error Details</summary>
            {this.state.error && this.state.error.toString()}
          </details>
          <Link to="/" style={{ color: '#2563eb', textDecoration: 'underline' }}>
            Go to Homepage
          </Link>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
