(function () {
  const host = document.getElementById('navbar');
  if (!host) return;
  const active = host.dataset.active || '';

  const links = [
    ['dashboard', 'Dashboard', 'dashboard.html'],
    ['history', 'Run History', 'history.html'],
    ['statistics', 'Statistics', 'statistics.html']
  ];

  host.innerHTML = `
    <nav aria-label="Main">
      <a class="nav-brand" href="dashboard.html">⚡ SpeedRun Timer Log</a>
      <ul class="nav-links">
        ${links.map(([key, label, href]) =>
          `<li><a href="${href}" class="${key === active ? 'active' : ''}"${key === active ? ' aria-current="page"' : ''}>${label}</a></li>`
        ).join('')}
      </ul>
      <div class="nav-user">
        <button type="button" class="nav-avatar" id="navAvatar" aria-haspopup="menu" aria-expanded="false" aria-label="Account menu">?</button>
        <div class="nav-menu" id="navMenu" role="menu">
          <div class="who"><strong id="navName">Account</strong><span id="navEmail"></span></div>
          <a href="profile.html" role="menuitem"${active === 'profile' ? ' aria-current="page"' : ''}>Profile</a>
          <a href="#" id="navLogout" role="menuitem" class="danger">Log out</a>
        </div>
      </div>
    </nav>`;

  const avatar = document.getElementById('navAvatar');
  const menu = document.getElementById('navMenu');

  function setOpen(open) {
    menu.classList.toggle('open', open);
    avatar.setAttribute('aria-expanded', String(open));
  }
  avatar.addEventListener('click', (e) => { e.stopPropagation(); setOpen(!menu.classList.contains('open')); });
  document.addEventListener('click', (e) => { if (!menu.contains(e.target)) setOpen(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) { setOpen(false); avatar.focus(); }
  });
  document.getElementById('navLogout').addEventListener('click', (e) => handleLogout(e));

  function setProfile(name, url) {
    document.getElementById('navName').textContent = name;
    avatar.textContent = '';
    if (url) {
      const img = document.createElement('img');
      img.src = url; img.alt = '';
      img.style.cssText = 'width:100%;height:100%;border-radius:50%;object-fit:cover;display:block';
      avatar.appendChild(img);
    } else {
      avatar.textContent = name.trim().charAt(0).toUpperCase() || '?';
    }
  }
  window.setNavProfile = setProfile;

  supabase.auth.getSession().then(({ data: { session } }) => {
    if (!session) return;
    const user = session.user;
    const meta = user.user_metadata || {};
    const name = meta.full_name || meta.username || (user.email || '').split('@')[0] || 'Account';
    document.getElementById('navEmail').textContent = user.email || '';
    setProfile(name, meta.avatar_url);
  });
})();