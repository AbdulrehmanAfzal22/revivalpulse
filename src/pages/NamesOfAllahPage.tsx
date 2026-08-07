import { RotateCw, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Typography from 'components/ui/Typography';
import Skeleton from 'components/ui/Skeleton';
import Button from 'components/ui/Button';
import EmptyState from 'components/feedback/EmptyState';
import useDivineNames from 'features/namesOfAllah/hooks/useDivineNames';
import NamesOfAllahGrid from 'features/namesOfAllah/components/NamesOfAllahGrid';
import useTranslation from 'hooks/useTranslation';
import { ROUTES } from 'constants/routes';
import styles from './NamesOfAllahPage.module.css';

export default function NamesOfAllahPage() {
  const { data, isPending, isError, error, refetch, isFetching } = useDivineNames();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className={styles.page}>
        <div className={styles.header}>
          <Typography variant="h2">{t('namesOfAllah.title')}</Typography>
          <Button
            variant="primary"
            onClick={() => navigate(ROUTES.NAMES_OF_ALLAH_IMMERSIVE)}
            leadingIcon={<Sparkles size={16} />}
          >
            {t('namesOfAllah.immersiveExperience')}
          </Button>
        </div>

        {isPending && (
          <div className="grid-auto" aria-busy="true" aria-label={t('namesOfAllah.loadingNames')}>
            <Skeleton variant="rect" height="6.5rem" count={12} />
          </div>
        )}

        {isError && (
          <EmptyState
            title={t('emptyState.namesOfAllah.loadFailed')}
            description={error.message}
            action={
              <Button
                variant="secondary"
                onClick={() => refetch()}
                disabled={isFetching}
                leadingIcon={<RotateCw size={16} />}
              >
                {t('common.retry')}
              </Button>
            }
          />
        )}

        {data && <NamesOfAllahGrid names={data} />}
      </div>
    </div>
  );
}
