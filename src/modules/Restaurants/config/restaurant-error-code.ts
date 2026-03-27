import { HttpStatus } from '@nestjs/common';
import { IErrorCode } from '@/common/interfaces/error-code.interface';

export const RestaurantErrorCode = {
  // --- Quản lý Quán ăn (Restaurants) ---
  RESTAURANT_NOT_FOUND: { 
    code: 'RES_001', 
    message: 'Quán ăn không tồn tại trong hệ thống', 
    httpStatus: HttpStatus.NOT_FOUND 
  },
  RESTAURANT_EXISTED: { 
    code: 'RES_002', 
    message: 'Quán ăn này đã tồn tại tại địa chỉ được cung cấp', 
    httpStatus: HttpStatus.BAD_REQUEST 
  },
  INVALID_LOCATION_COORDINATES: { 
    code: 'RES_003', 
    message: 'Tọa độ GPS (Vĩ độ/Kinh độ) không hợp lệ', 
    httpStatus: HttpStatus.BAD_REQUEST 
  },
  PHONE_RESTAURANT_EXISTED:{
     code: 'RES_004', 
    message: 'Số điên thoại đã được sử dụng', 
    httpStatus: HttpStatus.BAD_REQUEST 
  },

  // --- Lỗi hệ thống thao tác Database (Thêm / Sửa / Xóa) ---
  RESTAURANT_CREATE_FAILED: { 
    code: 'RES_101', 
    message: 'Tạo quán ăn mới thất bại, vui lòng kiểm tra lại', 
    httpStatus: HttpStatus.BAD_REQUEST 
  },
  RESTAURANT_UPDATE_FAILED: { 
    code: 'RES_102', 
    message: 'Cập nhật quán ăn thất bại, vui lòng thử lại', 
    httpStatus: HttpStatus.BAD_REQUEST 
  },
  RESTAURANT_DELETE_FAILED: { 
    code: 'RES_103', 
    message: 'Xóa quán ăn thất bại', 
    httpStatus: HttpStatus.BAD_REQUEST 
  },
} as const satisfies Record<string, IErrorCode>;