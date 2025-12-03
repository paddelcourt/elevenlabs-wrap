import express from 'express';
import { authService } from '../modules/auth/authService.js';

const router = express.Router();

/**
 * Initiate Spotify OAuth login
 * GET /auth/login
 */
router.get('/login', (req, res) => {
  const authUrl = authService.getAuthorizationUrl();
  res.redirect(authUrl);
});

/**
 * OAuth callback endpoint
 * GET /auth/callback
 */
router.get('/callback', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.redirect(`${authService.frontendUrl}/?error=no_code`);
  }

  try {
    await authService.authenticateUser(req.session, code);

    // Save session and redirect to frontend
    req.session.save((err) => {
      if (err) {
        console.error('Error saving session:', err);
        return res.redirect(`${authService.frontendUrl}/?error=session_save_failed`);
      }
      res.redirect(`${authService.frontendUrl}/?success=true`);
    });
  } catch (error) {
    console.error('Error during authentication:', error.response?.data || error.message);
    res.redirect(`${authService.frontendUrl}/?error=auth_failed`);
  }
});

/**
 * Logout endpoint
 * POST /auth/logout
 */
router.post('/logout', async (req, res) => {
  try {
    await authService.logoutUser(req.session);
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to logout' });
  }
});

/**
 * Check authentication status
 * GET /auth/status
 */
router.get('/status', (req, res) => {
  res.json({
    authenticated: authService.isAuthenticated(req.session)
  });
});

export default router;
