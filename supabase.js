const SUPABASE_URL = 'https://yizaaecolgikdnywzxho.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpemFhZWNvbGdpa2RueXd6eGhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5OTA3MDIsImV4cCI6MjEwNTU2NjcwMn0.AxgubLz7iAwWMG70O2DCafCRYGvh1H1CrgMjfU6a9yM';

// The CDN library lives at window.supabase. Keep a separate reference to it so
// the client below can safely reuse the name "supabase" without clashing.
var supabaseLib = window.supabaseLib || window.supabase;
window.supabaseLib = supabaseLib;
var supabase = supabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkAuth(requiresAuth = true) {
  const { data: { session } } = await supabase.auth.getSession();
  if (requiresAuth && !session) {
    window.location.href = 'login.html';
  } else if (!requiresAuth && session) {
    window.location.href = 'dashboard.html';
  }
  return session;
}

function showMessage(elementId, text, isError = true) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = text;
  el.className = `msg ${isError ? 'msg-error' : 'msg-success'}`;
  el.style.display = 'block';
}