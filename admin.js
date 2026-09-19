const loginPanel = document.querySelector('.login-panel');
const loginStatus = document.querySelector('.login-status');
const supabase = window.SUPABASE_CONFIG?.url && window.SUPABASE_CONFIG?.anonKey ? window.SUPABASE_CONFIG : null;

async function login(event) {
  event.preventDefault();
  if (!supabase) {
    loginStatus.textContent = '尚未配置 Supabase 管理员登录。';
    return;
  }
  loginStatus.textContent = '正在登录...';
  const formData = new FormData(loginPanel);
  try {
    const response = await fetch(`${supabase.url}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: supabase.anonKey },
      body: JSON.stringify({ email: formData.get('email'), password: formData.get('password') })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error_description || '登录失败');
    sessionStorage.setItem('aura_admin_session', JSON.stringify({ accessToken: result.access_token, refreshToken: result.refresh_token || '' }));
    window.location.replace('./dashboard.html');
  } catch (error) {
    loginStatus.textContent = error.message;
  }
}

if (sessionStorage.getItem('aura_admin_session')) window.location.replace('./dashboard.html');
loginPanel.addEventListener('submit', login);
