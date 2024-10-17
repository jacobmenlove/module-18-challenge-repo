import { jwtDecode } from 'jwt-decode';
import { AuthenticationError } from 'apollo-server-express';

interface UserToken {
  username: string; // Ensure this matches the token's structure
  exp: number;
}

// Middleware to authenticate user based on token
export const authMiddleware = (context: any) => {
  const token = context.req.headers.authorization || '';

  if (token) {
    // Remove 'Bearer ' prefix if present
    const tokenValue = token.split(' ').pop();
    try {
      const decoded = jwtDecode<UserToken>(tokenValue);
      
      // Check if the token is expired
      if (decoded.exp < Date.now() / 1000) {
        throw new AuthenticationError('Token expired');
      }

      return { username: decoded.username }; // or other user info
    } catch (err) {
      throw new AuthenticationError('Invalid token');
    }
  }

  // If no token, return null user
  return null;
};

// Create a new class to instantiate for a user
class AuthService {
  // Get user data from token
  getProfile() {
    return jwtDecode(this.getToken() || '');
  }

  // Check if user's logged in
  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // Check if token is expired
  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode<UserToken>(token);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      return false;
    }
  }

  getToken() {
    return localStorage.getItem('id_token');
  }

  login(idToken: string) {
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  logout() {
    localStorage.removeItem('id_token');
    window.location.assign('/');
  }
}

export default new AuthService();
