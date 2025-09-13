import { ApiError } from '../exeptions/api.error.js';
import { jwtService } from '../services/jwt.service.js';

export const authMiddleware = (req, res, next) => {
  const authorization = req.headers['authorization'] || '';
  const [, token] = authorization.split(' ');

  if (!authorization || !token) {
    return next(ApiError.unauthorized());
  }

  const userData = jwtService.verify(token);

  if (!userData) {
    return next(ApiError.unauthorized());
  }

  req.user = userData;

  next();
};
