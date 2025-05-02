export function saveAuth({ token, user }) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

export function getAuth() {
  const token = localStorage.getItem('token');
  const user  = localStorage.getItem('user');
  return token && user ? { token, user: JSON.parse(user) } : null;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
