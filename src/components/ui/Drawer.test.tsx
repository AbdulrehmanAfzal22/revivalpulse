import { render, screen } from '@testing-library/react';
import Drawer from './Drawer';

describe('Drawer', () => {
  it('sets aria-labelledby on the dialog when titleId is provided', () => {
    render(
      <Drawer isOpen onClose={() => undefined} titleId="my-title">
        <h2 id="my-title">Panel title</h2>
      </Drawer>
    );
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby', 'my-title');
  });

  it('omits aria-labelledby when no titleId is given, preserving existing callers', () => {
    render(
      <Drawer isOpen onClose={() => undefined}>
        <p>content</p>
      </Drawer>
    );
    expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-labelledby');
  });
});
