import { render, screen } from '@testing-library/react';
import NameOverlay from './NameOverlay';
import { useImmersiveRecitationStore } from 'stores/immersiveRecitationStore';
import type { AllahName } from 'types/immersiveRecitation.types';

const NAMES: AllahName[] = [
  { id: '01', arabic: 'الرَّحْمَٰن', transliteration: 'Ar-Rahman', meaning: 'The All-Compassionate', timestampSeconds: 0 },
  { id: '02', arabic: 'الرَّحِيم', transliteration: 'Ar-Raheem', meaning: 'The All-Merciful', timestampSeconds: 10 },
];

function renderWithIndex(index: number) {
  useImmersiveRecitationStore.getState().setCurrentNameIndex(index);
  render(<NameOverlay names={NAMES} />);
}

describe('NameOverlay', () => {
  it('renders the active name from the store index', () => {
    renderWithIndex(1);
    expect(screen.getByText('Ar-Raheem')).toBeInTheDocument();
    expect(screen.getByText('The All-Merciful')).toBeInTheDocument();
  });

  it('renders the Bismillah idle state while index is -1 (melodic intro)', () => {
    renderWithIndex(-1);
    expect(screen.getByText(/بِسْمِ اللَّهِ/)).toBeInTheDocument();
    expect(screen.getByText('Beginning')).toBeInTheDocument();
    expect(screen.queryByText('Ar-Rahman')).not.toBeInTheDocument();
  });

  it('renders nothing when the index points past the list (defensive)', () => {
    useImmersiveRecitationStore.getState().setCurrentNameIndex(0);
    const { container } = render(<NameOverlay names={[]} />);
    expect(container.textContent ?? '').toBe('');
  });
});