const carGrid = document.querySelector('.car-grid');
const resultCount = document.querySelector('.result-count');
const sideFilters = document.querySelectorAll('.side-filter');
const energyFilters = document.querySelectorAll('.sidebar-group input');
const favoriteButton = document.querySelector('.favorite-link');
const favoriteCount = favoriteButton.querySelector('small');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const modal = document.querySelector('.details-modal');
const modalTitle = modal.querySelector('h2');
const testDriveForm = document.querySelector('.test-drive-form');
const testDriveDate = testDriveForm.querySelector('input[type="date"]');
const formStatus = testDriveForm.querySelector('.form-status');
let favorites = 0;
const supabase = window.SUPABASE_CONFIG?.url && window.SUPABASE_CONFIG?.anonKey ? window.SUPABASE_CONFIG : null;

testDriveDate.min = new Date().toISOString().split('T')[0];

const brands = [['BMW', ['i5', 'iX', 'X5', '3系', '7系', 'X3', 'M4', 'i4', 'X7', '5系']], ['PORSCHE', ['Macan', 'Cayenne', '911 Carrera', 'Taycan', 'Panamera', '718 Cayman', '718 Boxster', 'Macan GTS', '911 Targa', 'Cayenne Coupe']], ['TOYOTA', ['凯美瑞', '汉兰达', '赛那', 'RAV4荣放', '皇冠陆放', '亚洲龙', '雷凌', 'bZ4X', '普拉多', '格瑞维亚']], ['TESLA', ['Model 3', 'Model Y', 'Model S', 'Model X', 'Model 3 Performance', 'Model Y 长续航', 'Model S Plaid', 'Cybertruck', 'Roadster', 'Model Y Performance']], ['AUDI', ['A4L', 'A6L', 'Q5L', 'Q3', 'Q7', 'e-tron GT', 'Q4 e-tron', 'A7L', 'RS 5', 'A8L']], ['MERCEDES', ['C级', 'E级', 'S级', 'GLC', 'GLE', 'EQE', 'EQS', 'A级', 'GLB', 'AMG GT']], ['VOLVO', ['S90', 'XC60', 'XC90', 'EX30', 'EX90', 'EM90', 'S60', 'C40', 'XC40', 'V90']], ['LEXUS', ['ES', 'RX', 'NX', 'LM', 'LS', 'RZ', 'UX', 'LX', 'LC', 'IS']], ['BYD', ['汉', '海豹', '宋PLUS', '唐', '方程豹5', '腾势N7', '腾势D9', '仰望U8', '秦PLUS', '元PLUS']], ['VOLKSWAGEN', ['迈腾', '帕萨特', '途观L', 'ID.4', 'ID.6', '揽巡', '途昂', '高尔夫', '凌渡', '威然']]];
const bodyTypes = ['sedan', 'suv', 'sedan', 'sedan', 'suv', 'mpv', 'coupe', 'sedan', 'suv', 'sedan'];
const energyTypes = ['fuel', 'electric', 'hybrid', 'electric', 'fuel', 'hybrid', 'electric', 'fuel', 'electric', 'hybrid'];
const visualClasses = ['ioniq', 'defender', 'bmw', 'macan'];
const cars = brands.flatMap(([brand, models], brandIndex) => models.map((model, modelIndex) => ({ brand, name: `${brand} ${model}`, type: bodyTypes[modelIndex], energy: energyTypes[modelIndex], price: (18 + brandIndex * 5 + modelIndex * 2.38).toFixed(2), visual: visualClasses[(brandIndex + modelIndex) % visualClasses.length] })));
carGrid.innerHTML = cars.map((car, index) => `<article class="car-card" data-type="${car.type}" data-energy="${car.energy}" data-brand="${car.brand}" data-name="${car.name}"><div class="car-visual ${car.visual}"><span class="card-index">${String(index + 1).padStart(2, '0')} / 100</span><button class="heart" type="button" aria-label="收藏 ${car.name}">♡</button><div class="car-image"></div></div><div class="car-info"><div><p class="car-type">${car.energy === 'electric' ? '纯电动' : car.energy === 'hybrid' ? '混合动力' : '燃油'} · 2024</p><h3>${car.name}</h3></div><strong>¥ ${car.price}<span>万起</span></strong></div><button class="text-link details-button" type="button">查看详情 <span>↗</span></button></article>`).join('');
const cards = document.querySelectorAll('.car-card');
cards.forEach((card, index) => card.style.setProperty('--delay', index));
let activeFlippedCard = null;

const animatedSections = document.querySelectorAll('.hero-content, .section-heading, .visit-intro, .test-drive-form, .manifesto-copy, .catalog-layout');
animatedSections.forEach((section, index) => {
  section.classList.add('reveal');
  section.style.setProperty('--delay', index);
});
window.addEventListener('scroll', () => {
  const header = document.querySelector('.site-header');
  if (header) header.classList.toggle('scrolled', window.scrollY > 12);
});

function openDetails(card) {
  modalTitle.textContent = card.dataset.name;
  activeFlippedCard = card;
  modal.showModal();
}

function resetCardFlip() {
  if (!activeFlippedCard) return;
  activeFlippedCard.classList.remove('flip-1', 'flip-2', 'flip-3');
  activeFlippedCard.dataset.flips = '0';
  activeFlippedCard.dataset.revealing = 'false';
  activeFlippedCard = null;
}

sideFilters.forEach((filter) => {
  filter.addEventListener('click', () => {
    sideFilters.forEach((item) => item.classList.remove('active'));
    filter.classList.add('active');
    updateCatalog();
  });
});

energyFilters.forEach((filter) => filter.addEventListener('change', updateCatalog));
document.querySelector('.reset-filters').addEventListener('click', () => { sideFilters.forEach((filter) => filter.classList.toggle('active', filter.dataset.filter === 'all')); energyFilters.forEach((filter) => { filter.checked = false; }); updateCatalog(); });
function updateCatalog() { const bodyType = document.querySelector('.side-filter.active').dataset.filter; const selectedEnergy = [...energyFilters].filter((filter) => filter.checked).map((filter) => filter.value); let visible = 0; cards.forEach((card) => { const matchesBody = bodyType === 'all' || card.dataset.type === bodyType; const matchesEnergy = !selectedEnergy.length || selectedEnergy.includes(card.dataset.energy) || selectedEnergy.includes(card.dataset.brand); const isVisible = matchesBody && matchesEnergy; card.classList.toggle('hidden', !isVisible); if (isVisible) visible += 1; }); resultCount.textContent = `${visible} 款车型`; }

document.querySelectorAll('.heart').forEach((heart) => {
  heart.addEventListener('click', () => {
    heart.classList.toggle('saved');
    heart.textContent = heart.classList.contains('saved') ? '♥' : '♡';
    favorites += heart.classList.contains('saved') ? 1 : -1;
    favoriteCount.textContent = favorites;
    favoriteCount.style.display = favorites ? 'flex' : 'none';
  });
});

cards.forEach((card) => {
  card.addEventListener('click', (event) => {
    if (event.target.closest('button')) return;
    if (card.dataset.revealing === 'true') return;

    const flips = Number(card.dataset.flips || 0) + 1;
    card.dataset.flips = String(flips);
    card.classList.add(`flip-${flips}`);

    if (flips === 3) {
      card.dataset.revealing = 'true';
      window.setTimeout(() => openDetails(card), 600);
    }
  });
});

document.querySelectorAll('.details-button').forEach((button) => {
  button.addEventListener('click', () => {
    openDetails(button.closest('.car-card'));
  });
});

modal.querySelector('.modal-close').addEventListener('click', () => modal.close());
modal.addEventListener('click', (event) => {
  if (event.target === modal) modal.close();
});
modal.addEventListener('close', resetCardFlip);

testDriveForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const booking = Object.fromEntries(new FormData(testDriveForm).entries());

  try {
    const response = await fetch(supabase ? `${supabase.url}/rest/v1/test_drive_history` : '/api/history', {
      method: 'POST',
      headers: supabase ? { 'Content-Type': 'application/json', apikey: supabase.anonKey, Authorization: `Bearer ${supabase.anonKey}`, Prefer: 'return=minimal' } : { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking)
    });
    if (!response.ok) throw new Error('history request failed');
    const subject = encodeURIComponent(`AURA MOTORS 试驾预约：${booking.model}`);
    const body = encodeURIComponent(`车型：${booking.model}\n门店：${booking.store}\n日期：${booking.date}\n时段：${booking.time}\n姓名：${booking.name}\n电话：${booking.phone}`);
    formStatus.innerHTML = `预约已提交，顾问会尽快联系你确认 ${booking.model} 的试驾安排。<a class="reservation-mail-link" href="mailto:${supabase.reservationEmail}?subject=${subject}&body=${body}">发送预约邮件</a>`;
  } catch (error) {
    const localHistory = JSON.parse(localStorage.getItem('testDriveHistory') || '[]');
    localHistory.push({ ...booking, createdAt: new Date().toISOString() });
    localStorage.setItem('testDriveHistory', JSON.stringify(localHistory));
    formStatus.textContent = `预约已提交，顾问会尽快联系你确认 ${booking.model} 的试驾安排（当前为本地保存）。`;
  }
  formStatus.classList.add('visible');
  testDriveForm.reset();
  testDriveDate.min = new Date().toISOString().split('T')[0];
});

menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen);
});

nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));
