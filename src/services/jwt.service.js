import jwt from 'jsonwebtoken';

if (!process.env.JWT_KEY) {
  throw new Error('JWT_KEY is not defined in environment variables');
}

if (!process.env.JWT_REFRESH_KEY) {
  throw new Error('JWT_REFRESH_KEY is not defined in environment variables');
}

const extractPayload = (user) => {
  if (!user || typeof user !== 'object') {
    return {};
  }

  return { id: user.id, email: user.email };
};

const sign = (user) => {
  const payload = extractPayload(user);

  return jwt.sign(payload, process.env.JWT_KEY, {
    expiresIn: '5m',
  });
};

const verify = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_KEY);
  } catch (error) {
    return null;
  }
};

const signRefresh = (user) => {
  const payload = extractPayload(user);

  return jwt.sign(payload, process.env.JWT_REFRESH_KEY, {
    expiresIn: '30d',
  });
};

const verifyRefresh = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_KEY);
  } catch (error) {
    return null;
  }
};

export const jwtService = {
  sign,
  verify,
  signRefresh,
  verifyRefresh,
};
