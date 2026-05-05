import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards } from '@nestjs/common';
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
  constructor(private readonly tourService: TourService) {}

  @Post()
  @Roles(UserRoles.ADMIN, 'merchant') // Phân quyền
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo Tour mới (Admin/Merchant)' })
  create(@Body() data: CreateTourRequest) {
    return this.tourService.createTour(data);
  }

  @Public() // Mở cửa tự do
  @Get()
  @ApiOperation({ summary: 'Xem danh sách Tour (Công khai)' })
  findAll() {
    return this.tourService.findAllTours();
  }

  @Public() // Mở cửa tự do
  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết 1 Tour' })
  findOne(@Param('id') id: string) {
    return this.tourService.findTourById(id);
  }

  @Patch(':id')
  @Roles(UserRoles.ADMIN, 'merchant')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sửa thông tin Tour (Admin/Merchant)' })
 update(@Param('id') id: string, @Body() data: UpdateTourRequest) { // <--- Đổi chữ ở đây
    return this.tourService.updateTour(id, data);
  }

  @Delete(':id')
  @Roles(UserRoles.ADMIN, 'merchant')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa Tour (Admin/Merchant)' })
  remove(@Param('id') id: string) {
    return this.tourService.deleteTour(id);
  }
}