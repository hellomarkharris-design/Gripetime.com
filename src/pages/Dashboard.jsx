const CURRENT_USER_KEY = "gt_user_v1";

function getCurrentUser() {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function goToSignIn() {
  const base = import.meta.env.BASE_URL || "/";
  window.location.href = `${base}auth`;
}

export default function Dashboard() {
  return <h1>Dashboard</h1>;
}
