import React from 'react';
import { RefreshCw, Film } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("CINELITH Runtime Boundary Error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#090909] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-[#121018] border border-[#FACC15]/30 rounded-3xl p-8 max-w-md w-full space-y-6 shadow-2xl relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-[#FACC15]/10 text-[#FACC15] flex items-center justify-center mx-auto border border-[#FACC15]/20">
              <Film className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black tracking-tight text-white">Temporary Signal Interruption</h2>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">
                CINELITH hit a minor rendering glitch. Don't worry, your founding pass progress is safe.
              </p>
            </div>

            <button
              onClick={this.handleReload}
              className="w-full bg-[#FACC15] hover:bg-yellow-400 text-black font-extrabold text-sm py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 animate-spin-slow" /> Refresh CINELITH Pre-Launch
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
