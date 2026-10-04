// GreenFarm Supabase integration helper.
// Use only a publishable/anon key in the browser. Never expose service_role secrets.
window.GREENFARM_SUPABASE_URL='https://xsibfnyngjmdvspbtnfm.supabase.co';
window.GREENFARM_SUPABASE_KEY=window.GREENFARM_SUPABASE_KEY||'';
window.greenFarmClient=window.supabase&&window.GREENFARM_SUPABASE_KEY?window.supabase.createClient(window.GREENFARM_SUPABASE_URL,window.GREENFARM_SUPABASE_KEY):null;
