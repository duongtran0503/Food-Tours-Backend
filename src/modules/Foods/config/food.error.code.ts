import { HttpStatus } from '@nestjs/common';
import { IErrorCode } from '@/common/interfaces/error-code.interface';

export const FoodErrorCode = {
  // --- Quản lý Món ăn (Foods) ---
  FOOD_NOT_FOUND: { 
    code: 'FOOD_001', 
    message: 'Món ăn không tồn tại trong hệ thống', 
    httpStatus: HttpStatus.NOT_FOUND 
  },
  FOOD_EXISTED_IN_POI: { 
    code: 'FOOD_002', 
    message: 'Món ăn này đã tồn tại tại địa điểm (POI) được chọn', 
    httpStatus: HttpStatus.BAD_REQUEST 
  },
  INVALID_PRICE_RANGE: { 
    code: 'FOOD_003', 
    message: 'Giá thấp nhất không được lớn hơn giá cao nhất', 
    httpStatus: HttpStatus.BAD_REQUEST 
  },

  // --- Lỗi hệ thống thao tác Database (Thêm / Sửa / Xóa) ---
  FOOD_CREATE_FAILED: { 
    code: 'FOOD_101', 
    message: 'Tạo món ăn thất bại, vui lòng kiểm tra lại', 
    httpStatus: HttpStatus.BAD_REQUEST 
  },
  FOOD_UPDATE_FAILED: { 
    code: 'FOOD_102', 
    message: 'Cập nhật món ăn thất bại, vui lòng thử lại', 
    httpStatus: HttpStatus.BAD_REQUEST 
  },
  FOOD_DELETE_FAILED: { 
    code: 'FOOD_103', 
    message: 'Xóa món ăn thất bại', 
    httpStatus: HttpStatus.BAD_REQUEST 
  },
} as const satisfies Record<string, IErrorCode>;