import { supabase } from '@/lib/supabaseClient';

export default async function TestPage() {
  const { data, error } = await supabase.from('profiles').select('*');

  return (
    <main>
      <h1>Profiles Table Test</h1>
      {error && <div>Error: {error.message}</div>}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}