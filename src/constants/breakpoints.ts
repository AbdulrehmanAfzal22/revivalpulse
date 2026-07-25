export const BREAKPOINTS = {
  MOBILE_MAX: 768,
} as const;

export const MOBILE_NAV_QUERY = `(max-width: ${BREAKPOINTS.MOBILE_MAX}px)`;
