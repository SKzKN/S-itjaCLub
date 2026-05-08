(function () {
  const DC = (window.DC = window.DC || {});

  const meta = document.querySelector('meta[name="dc-api-base"]');
  DC.API_BASE = (meta && meta.content && meta.content.trim()) || 'http://localhost:3001';

  DC.api = async function (path, opts = {}) {
    const res = await fetch(DC.API_BASE + path, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
      ...opts,
    });
    let data = null;
    try { data = await res.json(); } catch {}
    if (!res.ok) {
      const err = new Error((data && data.error) || ('Viga (' + res.status + ')'));
      err.status = res.status;
      throw err;
    }
    return data;
  };

  // ── Auth ───────────────────────────────────────────────
  DC.me = async function () {
    try { return (await DC.api('/api/auth/me')).user; }
    catch { return null; }
  };

  DC.logout = async function () {
    try { await DC.api('/api/auth/logout', { method: 'POST' }); } catch {}
  };

  DC.login = (email, password) =>
    DC.api('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

  DC.register = (payload) =>
    DC.api('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) });

  // ── Cruises (public) ───────────────────────────────────
  DC.cruises = ({ period = 'upcoming' } = {}) => {
    const qs = period && period !== 'upcoming' ? '?period=' + encodeURIComponent(period) : '';
    return DC.api('/api/cruises' + qs);
  };
  DC.cruise = (id) => DC.api('/api/cruises/' + encodeURIComponent(id));

  // ── Cruise registrations (logged-in) ───────────────────
  DC.isRegistered = async function (cruiseId) {
    try {
      const r = await DC.api('/api/cruises/' + encodeURIComponent(cruiseId) + '/registration');
      return !!r.registered;
    } catch (e) {
      if (e.status === 401) return false;
      throw e;
    }
  };
  DC.registerForCruise = (cruiseId) =>
    DC.api('/api/cruises/' + encodeURIComponent(cruiseId) + '/register', { method: 'POST' });
  DC.cancelRegistration = (cruiseId) =>
    DC.api('/api/cruises/' + encodeURIComponent(cruiseId) + '/register', { method: 'DELETE' });
  DC.myCruises = () => DC.api('/api/cruises/registrations/mine');

  // ── Admin ──────────────────────────────────────────────
  DC.admin = {
    cruises:      ()         => DC.api('/api/admin/cruises'),
    create:       (cruise)   => DC.api('/api/admin/cruises', { method: 'POST', body: JSON.stringify(cruise) }),
    update: (id, cruise)     => DC.api('/api/admin/cruises/' + encodeURIComponent(id), { method: 'PUT', body: JSON.stringify(cruise) }),
    remove: (id)             => DC.api('/api/admin/cruises/' + encodeURIComponent(id), { method: 'DELETE' }),
    participants: (id)       => DC.api('/api/admin/cruises/' + encodeURIComponent(id) + '/participants'),
    users:        ()         => DC.api('/api/admin/users'),
  };

  // ── Page guards ────────────────────────────────────────
  DC.requireAuth = async function () {
    const user = await DC.me();
    if (!user) { window.location.replace('logi-sisse.html'); return null; }
    return user;
  };
  DC.requireAdmin = async function () {
    const user = await DC.me();
    if (!user) { window.location.replace('logi-sisse.html'); return null; }
    if (!user.isAdmin) { window.location.replace('minu-konto.html'); return null; }
    return user;
  };

  // Auth-aware nav: "Logi sisse" / "Minu konto", plus admin link for admins.
  DC.applyAuthToNav = async function () {
    const link = document.getElementById('nav-auth-link');
    const adminLink = document.getElementById('nav-admin-link');
    const user = await DC.me();
    if (link) {
      if (user) {
        link.textContent = 'Minu konto';
        link.setAttribute('href', 'minu-konto.html');
      } else {
        link.textContent = 'Logi sisse';
        link.setAttribute('href', 'logi-sisse.html');
      }
    }
    if (adminLink) adminLink.hidden = !(user && user.isAdmin);
  };

  document.addEventListener('DOMContentLoaded', () => {
    DC.applyAuthToNav().catch(() => {});
  });
})();
