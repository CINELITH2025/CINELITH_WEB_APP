import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // In production, send to Sentry or monitoring service here:
    // Sentry.captureException(error, { extra: errorInfo });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#08060d] text-white flex items-center justify-center p-6 select-none">
          <div className="max-w-md w-full bg-[#121018] border border-white/10 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#F5BF26]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="w-16 h-16 rounded-2xl bg-[#F5BF26]/10 border border-[#F5BF26]/20 flex items-center justify-center mx-auto mb-6 text-[#F5BF26]">
              <AlertTriangle className="w-8 h-8 stroke-[2.5]" />
            </div>

            <h1 className="text-2xl font-black tracking-tight mb-2 text-white">
              Something went wrong
            </h1>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              An unexpected error occurred while rendering this frame. Our projectionists have been notified.
            </p>

            {this.state.error && import.meta.env.DEV && (
              <div className="mb-6 p-3 rounded-xl bg-black/40 border border-white/5 text-left overflow-x-auto max-h-32 text-xs font-mono text-red-300">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex items-center gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F5BF26] text-black font-black text-xs hover:bg-[#e0af22] transition-all cursor-pointer shadow-lg hover:scale-105"
              >
                <RefreshCw className="w-3.5 h-3.5 stroke-[2.5]" />
                Reload Page
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-white font-bold text-xs hover:bg-white/5 transition-all cursor-pointer hover:scale-105"
              >
                <Home className="w-3.5 h-3.5" />
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
