import jwt from 'jsonwebtoken';

export const getTokenExpiration = (token: string): Date | undefined => {
  try {
    const decodedToken: any = jwt.decode(token);
    if (decodedToken && decodedToken.exp) {
      const expirationTime = new Date(decodedToken.exp * 1000);
      return expirationTime;
    }
    return undefined;
  } catch (error) {
    console.error('Error decoding token:', error);
    return undefined;
  }
};
