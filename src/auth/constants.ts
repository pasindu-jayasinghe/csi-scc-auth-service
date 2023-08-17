export const jwtConstants = {
  secret: process.env.JWT_KEY || 'secretKeydsn2020',
  JWT_System_expiresIn: process.env.JWT_System_expiresIn || '120s',
  JWT_expiresIn: process.env.JWT_expiresIn || '900s',
  refreshSecret: process.env.JWT_REFRESH_KEY || 'secretvckdfmldlmcvkdlmllKeydsn2020',
  JWT_refresh_expiresIn: process.env.JWT_refresh_expiresIn || '3200000s',
};