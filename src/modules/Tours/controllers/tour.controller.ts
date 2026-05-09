import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards, Headers, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TourService } from '../services/tour.service';
import { CreateTourRequest, UpdateTourRequest } from '../dto/tour.dto';
import { Roles } from '@/common/decorator/roles.decorator';
import { UserRoles } from '@/schemas/user.schema';
import { Public } from '@/common/decorator/is.public';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';

@ApiTags('Tours')
@Controller('tours')
@UseGuards(JwtAuthGuard, RolesGuard) // Bật khiên bảo vệ
export class TourController {
  constructor(private readonly tourService: TourService) { }

  @Post()
  @Roles(UserRoles.ADMIN, 'STAFF') // Hoặc dùng UserRoles.STAFF nếu bạn đã định nghĩa STAFF trong enum UserRoles
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo Tour mới (Admin/Staff)' })
  create(@Body() data: CreateTourRequest, @Headers('lang') lang: string) {
    return this.tourService.createTour(data, lang); // Truyền lang xuống service
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Xem danh sách Tour (Phân trang, Search)' })
  findAll(@Query() query: any, @Headers('lang') lang: string = 'vi') {
    return this.tourService.findAllTours(query, lang); // Truyền lang xuống
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết 1 Tour' })
  findOne(@Param('id') id: string, @Headers('lang') lang: string = 'vi') {
    return this.tourService.findTourById(id, lang);
  }

  @Patch(':id')
  @Roles(UserRoles.ADMIN, 'STAFF')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sửa thông tin Tour (Admin/Staff)' })
  update(@Param('id') id: string, @Body() data: UpdateTourRequest, @Headers('lang') lang: string = 'vi') {
    return this.tourService.updateTour(id, data, lang);
  }

  @Delete(':id')
  @Roles(UserRoles.ADMIN, 'STAFF')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa Tour (Admin/Staff)' })
  remove(@Param('id') id: string) {
    return this.tourService.deleteTour(id);
  }

  @Public()
  @Get('/details/:id')
  @ApiOperation({ summary: 'Lấy chi tiết Tour (Đa ngôn ngữ)' })
  async getTourDetail(
    @Param('id') id: string,
    @Headers('lang') lang: string = 'vi' // Mặc định là tiếng Việt
  ) {
    return this.tourService.getTourDetail(id, lang);
  }
}