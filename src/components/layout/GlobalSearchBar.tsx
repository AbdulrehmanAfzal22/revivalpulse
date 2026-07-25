import { useState } from 'react';
import { Search } from 'lucide-react';
import Button from 'components/ui/Button';
import Dialog from 'components/ui/Dialog';
import SearchPanel from 'features/quranReader/components/SearchPanel';
import useTranslation from 'hooks/useTranslation';

export default function GlobalSearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <Button
        variant="icon"
        onClick={() => setIsOpen(true)}
        aria-label={t('nav.search')}
        leadingIcon={<Search size={18} />}
      />

      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} title={t('nav.search')}>
        <SearchPanel onNavigate={() => setIsOpen(false)} />
      </Dialog>
    </>
  );
}
