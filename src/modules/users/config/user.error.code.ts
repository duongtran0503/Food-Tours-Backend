import { HttpStatus } from '@nestjs/common';
import { IErrorCode } from '@/common/interfaces/error-code.interface';

export const UserErrorCode = {
  // --- Tìm kiếm & Truy vấn (Querying) ---
  USER_NOT_FOUND: { code: 'USER_101', message: 'Không tìm thấy người dùng trong hệ thống', httpStatus: HttpStatus.NOT_FOUND },
  USER_LIST_FETCH_FAILED: { code: 'USER_102', message: 'Lấy danh sách người dùng thất bại', httpStatus: HttpStatus.INTERNAL_SERVER_ERROR },
  USER_IS_NOT_ADMIN:{code:"USER_103",message:"Người dùng này không phải là nhân viên",httpStatus:HttpStatus.BAD_REQUEST},

  // --- Tạo mới tài khoản (Creation) ---
  USER_EMAIL_DUPLICATED: { code: 'USER_201', message: 'Email này đã được đăng ký bởi người dùng khác', httpStatus: HttpStatus.BAD_REQUEST },
  EMAIL_ALREADY_EXISTS: {code: "USER_102", message: "Email này đã được đăng ký", httpStatus: HttpStatus.BAD_REQUEST},
  USER_PHONE_DUPLICATED: { code: 'USER_202', message: 'Số điện thoại này đã được đăng ký bởi người dùng khác', httpStatus: HttpStatus.BAD_REQUEST },

  // --- Cập nhật thông tin (Profile Updates) ---
  USER_UPDATE_FAILED: { code: 'USER_301', message: 'Cập nhật thông tin người dùng thất bại', httpStatus: HttpStatus.INTERNAL_SERVER_ERROR },
  USER_INVALID_DATA: { code: 'USER_302', message: 'Dữ liệu cập nhật người dùng không hợp lệ', httpStatus: HttpStatus.BAD_REQUEST },
  USER_AVATAR_UPLOAD_FAILED: { code: 'USER_303', message: 'Tải lên ảnh đại diện thất bại', httpStatus: HttpStatus.INTERNAL_SERVER_ERROR },

  // --- Kiểm soát trạng thái & Kỷ luật (Banning & Status) ---
  USER_ALREADY_ACTIVE: { code: 'USER_401', message: 'Người dùng hiện đã ở trạng thái hoạt động', httpStatus: HttpStatus.BAD_REQUEST },
  USER_ALREADY_BANNED: { code: 'USER_402', message: 'Người dùng này vốn đã bị chặn truy cập', httpStatus: HttpStatus.BAD_REQUEST },
  USER_BAN_TIME_INVALID: { code: 'USER_403', message: 'Thời gian chặn tài khoản không hợp lệ (phải ở tương lai)', httpStatus: HttpStatus.BAD_REQUEST },
  USER_BAN_FAILED: { code: 'USER_404', message: 'Thao tác chặn người dùng thất bại', httpStatus: HttpStatus.INTERNAL_SERVER_ERROR },
  USER_UNBAN_FAILED: { code: 'USER_405', message: 'Thao tác mở chặn người dùng thất bại', httpStatus: HttpStatus.INTERNAL_SERVER_ERROR },

  // --- Hành động nhạy cảm & Bảo mật (Password & Sensitive Actions) ---
  USER_PASSWORD_SAME_AS_OLD: { code: 'USER_501', message: 'Mật khẩu mới không được trùng với mật khẩu cũ', httpStatus: HttpStatus.BAD_REQUEST },
  USER_CHANGE_PASSWORD_FAILED: { code: 'USER_502', message: 'Đổi mật khẩu người dùng thất bại', httpStatus: HttpStatus.INTERNAL_SERVER_ERROR },
  USER_RESET_PASSWORD_FAILED: { code: 'USER_503', message: 'Đặt lại mật khẩu cho nhân viên thất bại', httpStatus: HttpStatus.INTERNAL_SERVER_ERROR },

  // --- Xóa tài khoản (Deletion) ---
  USER_DELETE_FAILED: { code: 'USER_601', message: 'Xóa tài khoản người dùng thất bại', httpStatus: HttpStatus.INTERNAL_SERVER_ERROR },
  USER_CANNOT_DELETE_SELF: { code: 'USER_602', message: 'Hệ thống không cho phép bạn tự xóa tài khoản của chính mình', httpStatus: HttpStatus.FORBIDDEN },
} as const satisfies Record<string, IErrorCode>;