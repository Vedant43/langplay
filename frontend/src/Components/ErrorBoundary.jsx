import React, { Component } from 'react';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { toast } from 'react-hot-toast';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('Uncaught Error:', error);
    console.error('Error Info:', errorInfo);

    // Log to toast for immediate user feedback
    toast.error('An unexpected error occurred');

    // Optional: Send error to your error tracking service
    this.setState({ 
      error, 
      errorInfo 
    });
  }

  handleRetry = () => {
    // Optional: Implement specific retry logic
    this.setState({ hasError: false, error: null, errorInfo: null });
    
    // Optionally reload the page or reset to a safe state
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error-boundary flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
          <ErrorOutlineIcon className="text-red-500 text-6xl mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Something Went Wrong
          </h2>
          <p className="text-gray-600 text-center mb-4">
            An unexpected error occurred in the application.
          </p>
          
          {/* Detailed error information for development */}
          {process.env.NODE_ENV === 'development' && (
            <details className="text-sm text-gray-700 mb-4">
              <summary>Error Details</summary>
              <pre className="bg-gray-200 p-2 rounded">
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}

          <div className="flex space-x-4">
            <button 
              onClick={this.handleRetry}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

// HOC for easier error boundary wrapping
export const withErrorBoundary = (WrappedComponent) => {
  return (props) => (
    <ErrorBoundary>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );
}

export default ErrorBoundary;