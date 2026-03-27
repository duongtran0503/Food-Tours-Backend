import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags, ApiProperty } from "@nestjs/swagger";
import { Public } from "@/common/decorator/is.public";

class HelloResponse {
  @ApiProperty({ example: 'Welcome to Food Tourism API Platform! 🚀' })
  message: string;

  @ApiProperty({ example: '1.0.0' })
  version: string;

  @ApiProperty({ example: 'api/v1' })
  apiPrefix: string;

  @ApiProperty({ example: 'OK' })
  status: string;

  @ApiProperty({ example: '27/03/2026, 20:52:00' })
  serverTime: string;

  @ApiProperty({ 
    example: { team: 'SERMINAL 19', project: 'Food Tourism Platform' } 
  })
  metadata: {
    team: string;
    project: string;
  };
}

@ApiTags('Health Check & Introduction')
@Controller("hello")
export class HelloController {
  
  @Public() 
  @Get()
  @ApiOperation({ summary: 'API Chào mừng và Kiểm tra kết nối Máy chủ (Ping test)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Kết nối máy chủ Backend thành công', 
    type: HelloResponse 
  })
  hello(): HelloResponse {
    return {
      message: "Welcome to Food Tourism API Platform! 🚀",
      version: "1.0.0",
      apiPrefix: "api/v1",
      status: "OK",
      serverTime: new Date().toLocaleString('vi-VN'), 
      metadata: {
        team: "SERMINAL 19",
        project: "Food Tourism Platform Seminar",
      }
    };
  }
}