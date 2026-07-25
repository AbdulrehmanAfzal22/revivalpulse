import { useEffect } from 'react';
import { useAccessibilityPreferencesStore } from 'stores/accessibilityPreferencesStore';
import { useDevModeStore } from 'stores/devModeStore';
import useInterfaceLanguage from 'hooks/useInterfaceLanguage';

const BASE_FONT_SIZE_PX = 16;

/**
 * Applies accessibility (and Developer Mode RTL-testing) preferences as
 * root-level DOM attributes/styles — mounted once at the very top of the
 * app (App.tsx), above both MainLayout and KidsLayout, so they apply
 * everywhere, not just the main shell.
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
    document.documentElement.style.fontSize = `${BASE_FONT_SIZE_PX * textScale}px`;
  }, [textScale]);

  useEffect(() => {
    document.documentElement.dir = forceRtl ? 'rtl' : interfaceLanguage.dir;
  }, [forceRtl, interfaceLanguage.dir]);

  return null;
}
