// NOTE: Mock credentials only — replace with a real auth solution (e.g. Supabase Auth) before production.
const ADMIN_CREDENTIALS = {
  username: "almog",
  password: "0556660702",
};

export function validateCredentials(username, password) {
  return (
    username === ADMIN_CREDENTIALS.username &&
    password === ADMIN_CREDENTIALS.password
  );
}

export function setAuthCookie() {
  document.cookie =
    "auth-token=mock-authenticated-token; path=/; SameSite=Lax";
}

export function clearAuthCookie() {
  document.cookie =
    "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}
