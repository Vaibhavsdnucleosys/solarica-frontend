export const getUserRole = () => {
  const user = localStorage.getItem("user");
  if (!user) return null;

  try {
    const parsed = JSON.parse(user);
    return parsed.role || null;
  } catch {
    return null;
  }
};