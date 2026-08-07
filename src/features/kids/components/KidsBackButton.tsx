import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from 'components/ui/Button';
import useTranslation from 'hooks/useTranslation';

export interface KidsBackButtonProps {
  /** Route to navigate to. Defaults to browser back (navigate(-1)). */
  to?: string;
}

/** Consistent "back" affordance for kids hub pages. */
export default function KidsBackButton({ to }: KidsBackButtonProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <Button
      variant="icon"
      onClick={() => (to ? navigate(to) : navigate(-1))}
      aria-label={t('kids.gameGoHome')}
      leadingIcon={<ArrowLeft size={22} />}
    />
  );
}