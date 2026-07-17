"use client";

import { Component, ReactNode } from "react";

type Props = {
  fallback?: ReactNode;
  children: ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("[ErrorBoundary] Component crash:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback !== undefined) {
        return this.props.fallback;
      }

      return (
        <div className="relative min-h-[40vh] flex items-center justify-center px-4">
          <div className="max-w-md text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-white/60 mb-6 text-sm">
              The engine encountered an unexpected error. This has been logged
              and we&apos;ll fix it.
            </p>
            <button
              onClick={this.handleReset}
              className="rounded-full bg-white px-6 py-2.5 text-sm font-medium text-ink-950 hover:bg-white/90 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
