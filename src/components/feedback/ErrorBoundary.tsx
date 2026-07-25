import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import EmptyState from './EmptyState';
import Button from 'components/ui/Button';
import useTranslation from 'hooks/useTranslation';
import { useDevModeStore } from 'stores/devModeStore';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

/** Function component so it can call the translation hook — ErrorBoundary itself must stay a class component. */
function DefaultErrorFallback({ error, onReset }: { error: Error; onReset: () => void }) {
  const { t } = useTranslation();

  return (
    <EmptyState
      title={t('common.somethingWentWrong')}
      description={error.message}
      action={
        <Button variant="secondary" onClick={onReset}>
          {t('common.retry')}
        </Button>
      }
    />
  );
}

interface ErrorBoundaryState {
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught an error', error, errorInfo);
    useDevModeStore.getState().logError({ message: error.message, stack: error.stack, source: 'ErrorBoundary' });
  }

  reset = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    const { error } = this.state;
    const { children, fallback } = this.props;

    if (error) {
      if (fallback) return fallback(error, this.reset);

      return <DefaultErrorFallback error={error} onReset={this.reset} />;
    }

    return children;
  }
}
