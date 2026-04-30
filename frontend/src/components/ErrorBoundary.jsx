import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '3rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h2>Oops! Something went wrong in the UI.</h2>
          <p style={{ color: '#d32f2f', background: '#fdd', padding: '1rem', borderRadius: '4px', display: 'inline-block' }}>
            {this.state.error?.toString()}
          </p>
          <br />
          <button 
            onClick={() => window.location.reload()} 
            style={{ padding: '0.75rem 1.5rem', marginTop: '1.5rem', cursor: 'pointer', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
