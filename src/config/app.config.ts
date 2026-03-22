export class AppConfig {
  // 1. Cấu hình API hệ thống
  static readonly API = {
    PREFIX: 'api/v1',
    PORT: process.env.PORT || 3000,
  };

  // 2. Cấu hình phân trang (Pagination Defaults) cho MongoDB Atlas
  static readonly PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  };

  // 3. Phân quyền người dùng (Roles)
  static readonly ROLES = {
    ADMIN: 'ADMIN',
    CUSTOMER: 'CUSTOMER',
  } as const; 


  static readonly CODES = {
    SUCCESS: 'SUCCESS',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
    BAD_REQUEST: 'BAD_REQUEST',
  } as const;


  // 5. Bảo mật & JWT
  static readonly SECURITY = {
    SALT_ROUNDS: 10,
    JWT_EXPIRES_IN: '1d', // 1 ngày
    REFRESH_TOKEN_EXPIRES_IN: '7d',
  };
}