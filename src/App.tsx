import { BrowserRouter } from 'react-router-dom';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { ThemeProvider } from 'contexts/ThemeContext';
import { LanguageProvider } from 'contexts/LanguageContext';
import { indexedDbPersister, queryClient } from 'services/queryClient';
import AccessibilityStyleApplier from 'components/app/AccessibilityStyleApplier';
import AppRoutes from 'routes/AppRoutes';

export default function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: indexedDbPersister,
        dehydrateOptions: {
          // Hadith books are fetched whole (up to ~12MB) and persistClient
          // serializes the entire cache as one IndexedDB blob — excluding
          // them keeps that blob small. They still cache in memory for the
          // session via TanStack Query itself, just not across reloads.
          //
          // Must also keep the library default's success-only check: pending
          // queries dehydrate with a live `promise` field (for SSR streaming)
          // that IndexedDB's structured clone can't serialize.
          shouldDehydrateQuery: (query) =>
            query.state.status === 'success' && query.queryKey[0] !== 'hadith',
        },
      }}
    >
      <ThemeProvider>
        <LanguageProvider>
          <AccessibilityStyleApplier />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AppRoutes />
          </BrowserRouter>
        </LanguageProvider>
      </ThemeProvider>
    </PersistQueryClientProvider>
  );
}
