const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

// ──────────────── Copies ────────────────
export async function fetchCopies() {
  const res = await fetch(`${API_BASE}/copies`);
  if (!res.ok) throw new Error('Failed to fetch copies');
  return res.json();
}

// ──────────────── Members (public) ────────────────
export async function fetchMembers() {
  const res = await fetch(`${API_BASE}/members`);
  if (!res.ok) throw new Error('Failed to fetch members');
  return res.json();
}

// ──────────────── Borrows ────────────────
export async function fetchActiveBorrows() {
  const res = await fetch(`${API_BASE}/borrows/active`);
  if (!res.ok) throw new Error('Failed to fetch active borrows');
  return res.json();
}

// ──────────────── Circulation ────────────────
export async function issueBook({ barcode, membershipNumber, loanDays }) {
  const res = await fetch(`${API_BASE}/circulation/issue`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ barcode, membershipNumber, loanDays: parseInt(loanDays, 10) }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Issue failed');
  return data;
}

export async function returnBook({ barcode }) {
  const res = await fetch(`${API_BASE}/circulation/return`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ barcode }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Return failed');
  return data;
}

// ──────────────── Books (Admin) ────────────────
export async function fetchBooks() {
  const res = await fetch(`${API_BASE}/books`);
  if (!res.ok) throw new Error('Failed to fetch books');
  return res.json();
}

export async function createBook(data) {
  const res = await fetch(`${API_BASE}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to create book');
  return json;
}

export async function updateBook(id, data) {
  const res = await fetch(`${API_BASE}/books/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update book');
  return json;
}

export async function deleteBook(id) {
  const res = await fetch(`${API_BASE}/books/${id}`, { method: 'DELETE' });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to delete book');
  return json;
}

// ──────────────── Authors (Admin) ────────────────
export async function fetchAuthors() {
  const res = await fetch(`${API_BASE}/authors`);
  if (!res.ok) throw new Error('Failed to fetch authors');
  return res.json();
}

export async function createAuthor(data) {
  const res = await fetch(`${API_BASE}/authors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to create author');
  return json;
}

export async function deleteAuthor(id) {
  const res = await fetch(`${API_BASE}/authors/${id}`, { method: 'DELETE' });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to delete author');
  return json;
}

// ──────────────── Categories (Admin) ────────────────
export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function createCategory(data) {
  const res = await fetch(`${API_BASE}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to create category');
  return json;
}

export async function deleteCategory(id) {
  const res = await fetch(`${API_BASE}/categories/${id}`, { method: 'DELETE' });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to delete category');
  return json;
}

// ──────────────── Members (Admin) ────────────────
export async function fetchAllMembers() {
  const res = await fetch(`${API_BASE}/admin/members/all`);
  if (!res.ok) throw new Error('Failed to fetch members');
  return res.json();
}

export async function createMember(data) {
  const res = await fetch(`${API_BASE}/admin/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to create member');
  return json;
}

export async function updateMember(id, data) {
  const res = await fetch(`${API_BASE}/admin/members/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update member');
  return json;
}

export async function deleteMember(id) {
  const res = await fetch(`${API_BASE}/admin/members/${id}`, { method: 'DELETE' });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to delete member');
  return json;
}

// ──────────────── Book Copies (Admin) ────────────────
export async function createCopy(data) {
  const res = await fetch(`${API_BASE}/admin/copies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to create copy');
  return json;
}

export async function deleteCopy(id) {
  const res = await fetch(`${API_BASE}/admin/copies/${id}`, { method: 'DELETE' });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to delete copy');
  return json;
}

// ──────────────── Auth ────────────────
export async function adminLogin({ adminId, password }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ adminId, password }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Login failed');
  return json;
}

export function getAdminSession() {
  try {
    const raw = localStorage.getItem('lms-admin-session');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (_) {
    return null;
  }
}

export function saveAdminSession(session) {
  localStorage.setItem('lms-admin-session', JSON.stringify(session));
}

export function clearAdminSession() {
  localStorage.removeItem('lms-admin-session');
}

