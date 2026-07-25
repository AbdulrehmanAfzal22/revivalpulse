import { Outlet } from 'react-router-dom';

/**
 * Extension point for Phase 3 (auth) — sign-in/sign-up chrome
 * replaces this passthrough.
 */
export default function AuthLayout() {
  return <Outlet />;
}
