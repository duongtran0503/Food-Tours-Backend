export class TourResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  images: string[];
  restaurants: any[];
  createdAt: Date;
  updatedAt: Date;

  constructor(tour: any, lang: string = 'vi') {
    this.id = tour._id?.toString() || tour.id;
    
    // Xử lý đa ngôn ngữ: Lấy ngôn ngữ được yêu cầu, nếu không có thì lấy tiếng Việt, nếu không có nữa thì rỗng
    this.name = tour.name?.[lang] || tour.name?.vi || '';
    this.description = tour.description?.[lang] || tour.description?.vi || '';
    
    this.price = tour.price;
    this.duration = tour.duration;
    this.images = tour.images || [];

    // Xử lý đa ngôn ngữ cho danh sách quán ăn (nếu có populate)
    // Xử lý đa ngôn ngữ cho danh sách quán ăn (nếu có populate)
this.restaurants = tour.restaurants?.map((res: any) => { // Thêm ': any' để fix lỗi gạch đỏ của TypeScript
  if (res && res._id) {
    return {
      id: res._id.toString(), // Sửa chữ 's' thành viết hoa: toString()
      name: res.name?.[lang] || res.name?.vi || '',
      address: res.address?.[lang] || res.address?.vi || '',
      images: res.images || []
    };
  }
  return res; // Trả về ID nếu chưa populate
}) || [];

    this.createdAt = tour.createdAt;
    this.updatedAt = tour.updatedAt;
  }
}