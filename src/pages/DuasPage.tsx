import { RotateCw } from 'lucide-react';
import Typography from 'components/ui/Typography';
import Skeleton from 'components/ui/Skeleton';
import Button from 'components/ui/Button';
import EmptyState from 'components/feedback/EmptyState';
import useDuas from 'features/duas/hooks/useDuas';
import DuasBrowser from 'features/duas/components/DuasBrowser';
import useTranslation from 'hooks/useTranslation';
import styles from './DuasPage.module.css';

export default function DuasPage() {
  const { data, isPending, isError, error, refetch, isFetching } = useDuas();
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <Typography variant="h2">{t('duas.title')}</Typography>

      {isPending && (
        <div aria-busy="true" aria-label={t('duas.loadingAriaLabel')}>
          <Skeleton variant="rect" height="10rem" count={3} />
        </div>
      )}

      {isError && (
        <EmptyState
          title={t('emptyState.duas.loadFailed')}
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

      {data && <DuasBrowser duas={data} />}
    </div>
  );
}
