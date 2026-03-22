import { HttpStatus } from '@nestjs/common';
import { IErrorCode } from '@/common/interfaces/error-code.interface';

export const AuthErrorCode = {
  // --- Đăng ký (Registration) ---
  ACCOUNT_EXISTED: { code: 'AUTH_001', message: 'Người dùng đã tồn tại', httpStatus: HttpStatus.BAD_REQUEST },
  EMAIL_EXISTED: { code: 'AUTH_002', message: 'Email đã được sử dụng bởi một tài khoản khác', httpStatus: HttpStatus.BAD_REQUEST },
  PHONE_EXISTED: { code: 'AUTH_003', message: 'Số điện thoại đã được sử dụng bởi một tài khoản khác', httpStatus: HttpStatus.BAD_REQUEST },
  INVALID_PASSWORD: { code: 'AUTH_004', message: 'Mật khẩu không đúng định dạng (tối thiểu 8 ký tự)', httpStatus: HttpStatus.BAD_REQUEST },

  // --- Đăng nhập (Login) ---
  ACCOUNT_NOT_FOUND: { code: 'AUTH_101', message: 'Không tìm thấy người dùng', httpStatus: HttpStatus.NOT_FOUND },
  WRONG_PASSWORD: { code: 'AUTH_102', message: 'Mật khẩu không chính xác', httpStatus: HttpStatus.UNAUTHORIZED },
  WRONG_OLD_PASSWORD: { code: 'AUTH_102', message: 'Mật khẩu hiện tại không chính xác', httpStatus: HttpStatus.UNAUTHORIZED },
  ACCOUNT_LOCKED: { code: 'AUTH_103', message: 'Tài khoản đã bị khóa', httpStatus: HttpStatus.FORBIDDEN },
  ACCOUNT_NOT_VERIFIED: { code: 'AUTH_104', message: 'Tài khoản chưa được xác thực', httpStatus: HttpStatus.FORBIDDEN },
  ACCOUNT_NOT_PASSWORD: { code: 'AUTH_101', message: 'Tài khoản chưa thiết lập mật khẩu vui lòng thử lại bằng otp hoặc phương thức khác', httpStatus: HttpStatus.BAD_REQUEST },
  ACCOUNT_HAD_PASSWORD: { code: 'AUTH_101', message: 'Tài khoản đã có mật khẩu', httpStatus: HttpStatus.BAD_REQUEST },

  // --- Xác thực & Token (Authentication) ---
  UNAUTHENTICATED: { code: 'AUTH_201', message: 'Phiên làm việc hết hạn hoặc không hợp lệ', httpStatus: HttpStatus.UNAUTHORIZED },
  INVALID_TOKEN: { code: 'AUTH_203', message: 'Token không hợp lệ hoặc đã bị thay đổi', httpStatus: HttpStatus.UNAUTHORIZED },
  TOKEN_EXPIRED: { code: 'AUTH_204', message: 'Token đã hết hạn', httpStatus: HttpStatus.UNAUTHORIZED },
  REFRESH_TOKEN_EXPIRED: { code: 'AUTH_205', message: 'Refresh token đã hết hạn, vui lòng đăng nhập lại', httpStatus: HttpStatus.UNAUTHORIZED },
  MISSING_TOKEN: { code: 'AUTH_206', message: 'Thiếu Access Token trong Header', httpStatus: HttpStatus.UNAUTHORIZED },

  // --- Phân quyền & Truy cập (Authorization) ---
  UNAUTHORIZED: { code: 'AUTH_301', message: 'Bạn không có quyền thực hiện hành động này', httpStatus: HttpStatus.FORBIDDEN },
  ROLE_RESTRICTED: { code: 'AUTH_302', message: 'Tài khoản của bạn không đủ cấp bậc để truy cập', httpStatus: HttpStatus.FORBIDDEN },
  ACCESS_DENIED: { code: 'AUTH_303', message: 'Truy cập bị từ chối bởi chính sách bảo mật', httpStatus: HttpStatus.FORBIDDEN },
  OWNERSHIP_REQUIRED: { code: 'AUTH_304', message: 'Bạn chỉ có thể thao tác trên dữ liệu của chính mình', httpStatus: HttpStatus.FORBIDDEN },
  ROLE_NOT_FOUND: { code: 'AUTH_305', message: 'Vai trò/Quyền không tồn tại', httpStatus: HttpStatus.BAD_REQUEST },

  // --- Lỗi hệ thống chung cho Auth ---
  INTERNAL_AUTH_ERROR: { code: 'AUTH_500', message: 'Lỗi xử lý xác thực hệ thống', httpStatus: HttpStatus.INTERNAL_SERVER_ERROR },
  ACCOUNT_HAS_NO_ROLE: { code: 'AUTH_400', message: 'Tài khoản chưa được cấp quyền nào', httpStatus: HttpStatus.BAD_REQUEST },
  UNAUTHORIZED_ROLE_ACCESS: { code: 'AUTH_401', message: 'Tài khoản không có quyền truy cập', httpStatus: HttpStatus.UNAUTHORIZED },

  // --- OTP ---
  OTP_INVALID: { code: 'AUTH_301', message: 'Mã OTP không chính xác', httpStatus: HttpStatus.BAD_REQUEST },
  OTP_EXPIRED: { code: 'AUTH_302', message: 'Mã OTP đã hết hạn', httpStatus: HttpStatus.GONE },
  OTP_ALREADY_USED: { code: 'AUTH_303', message: 'Mã OTP này đã được sử dụng', httpStatus: HttpStatus.CONFLICT },
  OTP_NOT_FOUND: { code: 'AUTH_304', message: 'Không tìm thấy mã OTP cho thông tin này', httpStatus: HttpStatus.NOT_FOUND },
  OTP_SEND_FAILED: { code: 'AUTH_305', message: 'Gửi email OTP thất bại, vui lòng thử lại sau', httpStatus: HttpStatus.INTERNAL_SERVER_ERROR },
  OTP_LIMIT_EXCEEDED: { code: 'AUTH_306', message: 'Bạn đã yêu cầu quá nhiều mã OTP, vui lòng đợi', httpStatus: HttpStatus.TOO_MANY_REQUESTS },
} as const satisfies Record<string, IErrorCode>; // TypeScript 5.7+ kiểm tra bắt buộc phải đủ 3 field