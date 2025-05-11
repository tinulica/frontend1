import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  componentDidCatch(error, info) {
    // Log to console
    console.error('ErrorBoundary caught an error:', error, info);
    // Save to state so we can render it
    this.setState({ error, info });
  }

  render() {
    if (this.state.error) {
      // Display both the error message and component stack
      return (
        <div style={{ padding: 20, color: 'white', background: 'crimson' }}>
          <h2>Something went wrong:</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error.toString()}
            {'\n'}
            {this.state.info.componentStack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
