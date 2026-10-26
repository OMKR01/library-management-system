import { Router } from 'express';

const router = Router();

const VALID_ADMIN_IDS = ['admin', 'admin-01', 'admin@libraflow.com', 'superadmin'];
const VALID_PASSWORDS = ['admin', 'admin123', 'admin@123', 'password123'];

router.post('/login', (req, res) => {
  const { adminId, password } = req.body;

  if (!adminId || !password) {
    return res.status(400).json({ error: 'Admin ID and password are required' });
  }

  const normalizedId = String(adminId).trim().toLowerCase();
  const trimmedPassword = String(password).trim();

  const idMatches = VALID_ADMIN_IDS.includes(normalizedId) || normalizedId === (process.env.ADMIN_ID || 'admin').toLowerCase();
  const passwordMatches = VALID_PASSWORDS.includes(trimmedPassword) || trimmedPassword === (process.env.ADMIN_PASSWORD || 'admin123');

  if (!idMatches || !passwordMatches) {
    return res.status(401).json({ error: 'Invalid Administrator ID or password' });
  }

  return res.json({
    success: true,
    token: `lms-admin-session-${Date.now()}`,
    admin: {
      id: adminId,
      name: 'System Administrator',
      role: 'ADMIN',
      loginTime: new Date().toISOString(),
    },
  });
});

router.get('/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer lms-admin-session-')) {
    return res.json({ valid: true, role: 'ADMIN' });
  }
  return res.status(401).json({ valid: false, error: 'Unauthorized' });
});

export default router;
