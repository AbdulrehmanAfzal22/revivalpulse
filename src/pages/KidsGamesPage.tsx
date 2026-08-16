import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from 'constants/routes';

/**
 * Legacy games hub — redirects to the default tier (Easy).
 * The new tier-based flow lives at /kids/games/:tier (easy|medium|hard).
 */
export default function KidsGamesPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(ROUTES.KIDS_GAMES_TIER.replace(':tier', 'easy'), { replace: true });
  }, [navigate]);

  return null;
}
