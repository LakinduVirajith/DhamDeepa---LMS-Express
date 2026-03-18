export const isAdmin = (req) => {
  const roles = req.auth?.sessionClaims?.publicMetadata?.roles || [];
  return roles.includes('ADMIN');
};
