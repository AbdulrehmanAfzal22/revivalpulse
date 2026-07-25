import { isSupabaseConfigured, supabase } from 'services/supabaseClient';

export interface ApiDiagnosticResult {
  name: string;
  url: string;
  status: 'ok' | 'error';
  latencyMs: number | null;
  message: string;
}

interface EndpointCheck {
  name: string;
  url: string;
  method?: 'GET' | 'HEAD';
}

const ENDPOINTS: EndpointCheck[] = [
  { name: 'Quran.com API', url: 'https://api.quran.com/api/v4/chapters/1' },
  { name: 'AlQuran Cloud API', url: 'https://api.alquran.cloud/v1/ayah/1' },
  { name: 'AlAdhan API', url: 'https://api.aladhan.com/v1/timingsByCity?city=Mecca&country=SaudiArabia' },
  { name: 'Hadith dataset (jsDelivr)', url: 'https://cdn.jsdelivr.net/gh/AhmedBaset/hadith-json@v1.2.0/db/by_book/forties/nawawi40.json', method: 'HEAD' },
  { name: 'Dua audio (hisnmuslim.com)', url: 'https://www.hisnmuslim.com/audio/ar/1.mp3', method: 'HEAD' },
];

async function checkEndpoint(endpoint: EndpointCheck): Promise<ApiDiagnosticResult> {
  const start = performance.now();
  try {
    const response = await fetch(endpoint.url, { method: endpoint.method ?? 'GET' });
    const latencyMs = Math.round(performance.now() - start);
    return {
      name: endpoint.name,
      url: endpoint.url,
      status: response.ok ? 'ok' : 'error',
      latencyMs,
      message: `HTTP ${response.status}`,
    };
  } catch (error) {
    return {
      name: endpoint.name,
      url: endpoint.url,
      status: 'error',
      latencyMs: null,
      message: error instanceof Error ? error.message : 'Network error',
    };
  }
}

async function checkSupabase(): Promise<ApiDiagnosticResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { name: 'Supabase', url: '—', status: 'error', latencyMs: null, message: 'Not configured (guest mode only)' };
  }
  const start = performance.now();
  try {
    const { error } = await supabase.from('dhikr_counters').select('dhikr_key', { count: 'exact', head: true });
    const latencyMs = Math.round(performance.now() - start);
    return { name: 'Supabase', url: '—', status: error ? 'error' : 'ok', latencyMs, message: error ? error.message : 'OK' };
  } catch (error) {
    return { name: 'Supabase', url: '—', status: 'error', latencyMs: null, message: error instanceof Error ? error.message : 'Network error' };
  }
}

export async function runApiDiagnostics(): Promise<ApiDiagnosticResult[]> {
  const results = await Promise.all([...ENDPOINTS.map(checkEndpoint), checkSupabase()]);
  return results;
}
