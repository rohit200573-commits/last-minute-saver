'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class Safe3D extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('3D Component Error caught by Safe3D:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="w-full h-full min-h-[200px] flex items-center justify-center bg-gradient-to-br from-zinc-900 to-black rounded-3xl border border-white/5 p-6">
          <div className="text-zinc-500 text-sm font-medium text-center">
            3D visualization disabled
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
