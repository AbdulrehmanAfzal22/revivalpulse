import { CircleAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import EmptyState from 'components/feedback/EmptyState';
import Button from 'components/ui/Button';
import { ROUTES } from 'constants/routes';
import useTranslation from 'hooks/useTranslation';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <EmptyState
        icon={<CircleAlert size={24} />}
        title={t('emptyState.notFound.title')}
        description={t('emptyState.notFound.description')}
        action={
          <Link to={ROUTES.HOME}>
            <Button variant="primary">{t('common.backToHome')}</Button>
          </Link>
        }
      />
    </div>
  );
}
