import { AuthenticationError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'your_secret';

const authMiddleware = ({ req }) => {
  const token = req.headers.authorization || '';

  if (token) {
    try {
      const { data } = jwt.verify(token.split(' ')[1], secret);
      return { user: data };
    } catch (err) {
      console.error(err);
      throw new AuthenticationError('Invalid token');
    }
  }
};

export default authMiddleware;
