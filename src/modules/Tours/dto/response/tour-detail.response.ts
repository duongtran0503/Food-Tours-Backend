import { ApiProperty } from '@nestjs/swagger';

class StopResponse {
    @ApiProperty()
    id: string;
    @ApiProperty()
    place: string;
    @ApiProperty()
    dish: string; // Lấy tên món đầu tiên hoặc món tiêu biểu
    @ApiProperty()
    image: string;
    @ApiProperty()
    desc: string;
    @ApiProperty()
    route: string;
    @ApiProperty()
    location: { latitude: number; longitude: number };
}

export class TourDetailResponse {
    @ApiProperty()
    id: string;
    @ApiProperty()
    title: string;
    @ApiProperty()
    price: string;
    @ApiProperty()
    image: string;
    @ApiProperty()
    rating: string;
    @ApiProperty()
    description: string;
    @ApiProperty({ type: [StopResponse] })
    stops: StopResponse[];

    constructor(tour: any, lang: string = 'vi') {
        this.id = tour._id.toString();
        this.title = tour.name?.[lang] || '';
        this.price = `${tour.price?.toLocaleString('vi-VN')}đ`; // Format tiền tệ
        this.image = tour.images?.[0] || '';
        this.rating = "4.9"; // Giả lập hoặc tính toán từ DB
        this.description = tour.description?.[lang] || '';

        // Map danh sách nhà hàng sang định dạng "Stops"
        this.stops = (tour.restaurants || []).map((res: any, index: number) => ({
            id: res._id?.toString() || index.toString(),
            place: res.name?.[lang] || '',
            dish: "Món đặc sản", // Có thể populate thêm food để lấy tên món
            image: res.images?.[0] || '',
            desc: res.description?.[lang] || '',
            route: `/restaurant/${res._id}`,
            location: {
                latitude: res.location?.lat,
                longitude: res.location?.lng
            }
        }));
    }
}