import { useEffect } from 'react';
import { useAccessibilityPreferencesStore } from 'stores/accessibilityPreferencesStore';
import { useDevModeStore } from 'stores/devModeStore';
import useInterfaceLanguage from 'hooks/useInterfaceLanguage';

/**
 * Applies accessibility (and Developer Mode RTL-testing) preferences as
 * root-level DOM attributes/styles — mounted once at the very top of the
 * app (App.tsx), above both MainLayout and KidsLayout, so they apply
 * everywhere, not just the main shell.
 *
 * Text scale is written to the `--app-font-scale` custom property on <html>
 * (NOT an inline font-size): inline pixel styles would stomp the kids-scope
 * scale in styles/kidsTheme.css (`html.kids-active`). The scale is consumed
 * by `html { font-size: calc(16px * var(--app-font-scale, 1)) }` (theme.css)
 * and doubled-down for kids mode in kidsTheme.css.
 */
export default function AccessibilityStyleApplier() {
  const highContrast = useAccessibilityPreferencesStore((state) => state.highContrast);
  const textScale = useAccessibilityPreferencesStore((state) => state.textScale);
  const forceRtl = useDevModeStore((state) => state.flags.forceRtl);
  const { interfaceLanguage } = useInterfaceLanguage();

  useEffect(() => {
    document.documentElement.dataset.contrast = highContrast ? 'high' : '';
  }, [highContrast]);

  useEffect(() => {
    document.documentElement.style.setProperty('--app-font-scale', String(textScale));
  }, [textScale]);

  useEffect(() => {
    document.documentElement.dir = forceRtl ? 'rtl' : interfaceLanguage.dir;
  }, [forceRtl, interfaceLanguage.dir]);

  return null;
}
