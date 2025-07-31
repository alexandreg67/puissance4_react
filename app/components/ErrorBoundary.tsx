'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { GameError } from '../types/game';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error 
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Game Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: logErrorToService(error, errorInfo);
    }
  }

  private handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined 
    });
  };

  private getErrorMessage = (): string => {
    const { error } = this.state;
    
    if (!error) return 'Une erreur inattendue s\'est produite.';
    
    // Handle specific game errors
    if (error.message.includes('AI')) {
      return 'Erreur dans le système d\'IA. Veuillez réessayer.';
    }
    
    if (error.message.includes('invalid move')) {
      return 'Mouvement invalide détecté.';
    }
    
    if (error.message.includes('network')) {
      return 'Problème de connexion réseau.';
    }
    
    return error.message || 'Une erreur inattendue s\'est produite.';
  };

  public render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-red-50 border-2 border-red-200 rounded-xl p-8 m-4 shadow-lg">
          <div className="text-red-600 text-2xl font-bold mb-4 text-center">
            🚨 Oups ! Quelque chose s&apos;est mal passé
          </div>
          
          <div className="text-red-700 mb-6 text-center max-w-md leading-relaxed">
            {this.getErrorMessage()}
          </div>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mb-6 max-w-2xl">
              <summary className="text-red-600 font-semibold cursor-pointer mb-2">
                Détails techniques (développement)
              </summary>
              <pre className="text-xs bg-red-100 p-4 rounded border overflow-auto max-h-40">
                {this.state.error.stack}
              </pre>
            </details>
          )}
          
          <div className="flex gap-4">
            <button
              onClick={this.handleReset}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-md"
            >
              Réessayer
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors shadow-md"
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for error handling in functional components
export const useErrorHandler = () => {
  const handleError = (error: unknown) => {
    if (error instanceof Error) {
      console.error('Game Error:', error);
      throw error; // Re-throw to trigger Error Boundary
    } else {
      console.error('Unknown Error:', error);
      throw new Error(typeof error === 'string' ? error : 'Unknown error occurred');
    }
  };

  return { handleError };
};