const recordsBody = document.querySelector('#records-body');
const emptyState = document.querySelector('#empty-state');
const recordState = document.querySelector('#record-state');
const searchInput = document.querySelector('#search-input');
const dateFilter = document.querySelector('#date-filter');
const refreshButton = document.querySelector('.refresh-button');
const clearFilterButton = document.querySelector('#clear-filter');
const totalCount = document.querySelector('#total-count');
const todayCount = document.querySelector('#today-count');
const upcomingCount = document.querySelector('#upcoming-count');
const popularModel = document.querySelector('#popular-model');
const lastUpdated = document.querySelector('#last-updated');
const signOutButton = document.querySelector('.sign-out-button');
const supabase = window.SUPABASE_CONFIG?.url && window.SUPABASE_CONFIG?.anonKey ? window.SUPABASE_CONFIG : null;
const session = JSON.parse(sessionStorage.getItem('aura_admin_session') || 'null');
const accessToken = session?.accessToken || '';
let records = [];

if (!session?.accessToken) window.location.replace('./admin.html');

function formatDateTime(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}

function updateStats() {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = records.filter((record) => record.date >= today).length;
  const modelCounts = records.reduce((counts, record) => {
    counts[record.model] = (counts[record.model] || 0) + 1;
    return counts;
  }, {});
  const mostPopular = Object.entries(modelCounts).sort((first, second) => second[1] - first[1])[0];
  totalCount.textContent = records.length;
  todayCount.textContent = records.filter((record) => record.createdAt?.slice(0, 10) === today).length;
  upcomingCount.textContent = upcoming;
  popularModel.textContent = mostPopular ? mostPopular[0] : '—';
}

function renderRecords() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedDate = dateFilter.value;
  const filteredRecords = records.filter((record) => {
    const searchable = `${record.name} ${record.model} ${record.phone} ${record.store}`.toLowerCase();
    return (!query || searchable.includes(query)) && (!selectedDate || record.date === selectedDate);
  }).sort((first, second) => `${first.date} ${first.time}`.localeCompare(`${second.date} ${second.time}`));

  recordsBody.innerHTML = filteredRecords.map((record) => `<tr><td><strong>${escapeHtml(record.name)}</strong><small>${escapeHtml(record.phone)}</small></td><td><strong>${escapeHtml(record.model)}</strong></td><td>${escapeHtml(record.store)}</td><td><strong>${escapeHtml(record.date)}</strong><small>${escapeHtml(record.time)}</small></td><td>${formatDateTime(record.createdAt)}</td></tr>`).join('');
  emptyState.hidden = filteredRecords.length > 0;
  recordState.textContent = `${filteredRecords.length} / ${records.length} 条记录`;
}

async function loadRecords() {
  recordState.textContent = '正在加载';
  try {
    const response = await fetch(supabase ? `${supabase.url}/rest/v1/test_drive_history?select=*&order=date.asc,time.asc` : '/api/history', {
      cache: 'no-store',
      headers: supabase ? { apikey: supabase.anonKey, Authorization: `Bearer ${accessToken}` } : {}
    });
    if (!response.ok) throw new Error('history request failed');
    records = (await response.json()).map((record) => ({ ...record, createdAt: record.createdAt || record.created_at }));
    updateStats();
    renderRecords();
    lastUpdated.textContent = `最近同步 ${new Intl.DateTimeFormat('zh-CN', { hour: '2-digit', minute: '2-digit' }).format(new Date())}`;
  } catch (error) {
    records = [];
    updateStats();
    recordsBody.innerHTML = '';
    emptyState.hidden = false;
    emptyState.innerHTML = `<strong>无法读取预约记录</strong><span>${supabase ? '登录状态已失效，请重新登录管理员账号。' : '请先运行 node server.js，再打开管理员页面。'}</span>`;
    recordState.textContent = '连接失败';
  }
}

searchInput.addEventListener('input', renderRecords);
dateFilter.addEventListener('change', renderRecords);
refreshButton.addEventListener('click', loadRecords);
clearFilterButton.addEventListener('click', () => {
  searchInput.value = '';
  dateFilter.value = '';
  renderRecords();
});
signOutButton.addEventListener('click', () => {
  sessionStorage.removeItem('aura_admin_session');
  window.location.replace('./admin.html');
});
loadRecords();
