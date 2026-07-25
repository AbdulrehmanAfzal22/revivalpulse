import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import { ROUTES } from 'constants/routes';

export interface ProtectedRouteProps {
  children: ReactNode;
  /** Guests pass through by default — set false for routes that need a real account. */
  allowGuest?: boolean;
}

export default function ProtectedRoute({ children, allowGuest = true }: ProtectedRouteProps) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') return null;

  const isAllowed = status === 'authenticated' || (allowGuest && status === 'guest');

  if (!isAllowed) {
    return <Navigate to={ROUTES.HOME} replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
