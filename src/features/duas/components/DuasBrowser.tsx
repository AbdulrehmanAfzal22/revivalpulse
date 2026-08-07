import { useMemo, useState } from 'react';
import PillGroup from 'components/ui/PillGroup';
import EmptyState from 'components/feedback/EmptyState';
import { DUA_CATEGORIES } from 'data/duas';
import DuaCard from './DuaCard';
import type { DuaItem } from 'types/duas.types';
import type { DuaCategoryId } from 'types/duas.types';
import useTranslation from 'hooks/useTranslation';
import styles from './DuasBrowser.module.css';

export interface DuasBrowserProps {
  duas: DuaItem[];
}

export default function DuasBrowser({ duas }: DuasBrowserProps) {
  // DUA_CATEGORIES is a fixed non-empty literal array (data/duas/index.ts), so index 0 always exists.
  const [categoryId, setCategoryId] = useState<DuaCategoryId>((DUA_CATEGORIES[0] as (typeof DUA_CATEGORIES)[number]).id);
  const { t } = useTranslation();

  const items = useMemo(() => duas.filter((dua) => dua.categoryId === categoryId), [duas, categoryId]);

  return (
    <div className={styles.wrapper}>
      <PillGroup
        options={DUA_CATEGORIES.map((category) => ({ id: category.id, label: t(category.labelKey) }))}
        value={categoryId}
        onChange={(id) => setCategoryId(id as DuaCategoryId)}
      />

      {items.length === 0 ? (
        <EmptyState title={t('emptyState.duas.categoryEmpty')} />
      ) : (
        <div className="grid-auto" role="list">
          {items.map((dua) => (
            <DuaCard key={dua.id} dua={dua} />
          ))}
        </div>
      )}
    </div>
  );
}
