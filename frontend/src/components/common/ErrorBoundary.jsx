import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
          <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-xl border border-gray-100 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-2xl">
              !
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-500 mb-6">
              An unexpected error occurred. Please refresh the page to continue using HomeServe.
            </p>
            <button
              onClick={this.handleReload}
              className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition shadow-md"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
