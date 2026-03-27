import { HttpStatus } from '@nestjs/common';
import { IErrorCode } from '@/common/interfaces/error-code.interface';

export const CategoryErrorCode = {
  CATEGORY_NOT_FOUND: { 
    code: 'CAT_001', 
    message: 'Danh mục không tồn tại trong hệ thống', 
    httpStatus: HttpStatus.NOT_FOUND 
  },
  CATEGORY_EXISTED: { 
    code: 'CAT_002', 
    message: 'Tên danh mục này đã được sử dụng', 
    httpStatus: HttpStatus.BAD_REQUEST 
  },
  CATEGORY_HAS_ITEMS: { 
    code: 'CAT_003', 
    message: 'Không thể xóa danh mục đang chứa sản phẩm/món ăn', 
    httpStatus: HttpStatus.CONFLICT 
  },

  CATEGORY_CREATE_FAILED: { 
    code: 'CAT_101', 
    message: 'Tạo danh mục thất bại, vui lòng kiểm tra lại', 
    httpStatus: HttpStatus.BAD_REQUEST 
  },
  CATEGORY_UPDATE_FAILED: { 
    code: 'CAT_102', 
    message: 'Cập nhật danh mục thất bại, vui lòng thử lại', 
    httpStatus: HttpStatus.BAD_REQUEST 
  },
  CATEGORY_DELETE_FAILED: { 
    code: 'CAT_103', 
    message: 'Xóa danh mục thất bại', 
    httpStatus: HttpStatus.BAD_REQUEST 
  },
} as const satisfies Record<string, IErrorCode>; 